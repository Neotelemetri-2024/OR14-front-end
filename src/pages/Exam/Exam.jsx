import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import examService from '../../services/ExamService';
import { toast } from 'react-toastify';

const Exam = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [remainingTime, setRemainingTime] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [examData, setExamData] = useState(null);

    // Use a ref to track the interval
    const timerIntervalRef = useRef(null);

    const navigate = useNavigate();

    // Fetch exam questions on component mount
    useEffect(() => {
        const fetchExamQuestions = async () => {
            try {
                setLoading(true);
                const response = await examService.getExamQuestions();

                if (response.success) {
                    const data = response.data.data;
                    setExamData(data);

                    // Set questions data
                    if (data.questions && data.questions.length > 0) {
                        setQuestions(data.questions);

                        // Initialize answers from any existing user answers
                        const initialAnswers = {};
                        data.questions.forEach(question => {
                            if (question.user_answer) {
                                initialAnswers[question.id] = question.user_answer;
                            }
                        });
                        setAnswers(initialAnswers);
                    } else {
                        toast.error('Tidak ada soal ditemukan untuk ujian ini');
                    }

                    // Set timer explicitly
                    if (data.remaining_seconds && data.remaining_seconds > 0) {
                        setRemainingTime(data.remaining_seconds);
                    }
                } else {
                    toast.error(response.message || 'Gagal memuat soal ujian');
                    navigate('/exam-preparation');
                }
            } catch (error) {
                console.error("Error fetching exam data:", error);
                toast.error('Terjadi kesalahan saat memuat soal ujian');
                navigate('/exam-preparation');
            } finally {
                setLoading(false);
            }
        };

        fetchExamQuestions();

        // Clean up on unmount
        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
    }, [navigate]);

    // Setup timer when remainingTime changes
    useEffect(() => {
        // Clear any existing intervals
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }

        // Only set up interval if we have a positive time remaining
        if (remainingTime > 0) {
            timerIntervalRef.current = setInterval(() => {
                setRemainingTime(prevTime => {
                    const newTime = prevTime - 1;

                    if (newTime <= 0) {
                        clearInterval(timerIntervalRef.current);
                        timerIntervalRef.current = null;

                        // Handle time up in the next tick to avoid state update during render
                        setTimeout(() => handleTimeUp(), 0);
                        return 0;
                    }
                    return newTime;
                });
            }, 1000);
        }

        // Cleanup function
        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
        };
    }, [remainingTime]);

    // Handle when time is up
    const handleTimeUp = async () => {
        if (submitting) return; // Prevent duplicate submissions

        toast.warn("Waktu ujian telah habis!");
        setSubmitting(true);

        try {
            const response = await examService.finishExam();
            if (response.success) {
                toast.info('Ujian telah diselesaikan karena waktu habis.');
                navigate('/exam-result');
            } else {
                toast.error(response.message || 'Gagal menyelesaikan ujian');
            }
        } catch (error) {
            console.error("Error finishing exam:", error);
            toast.error('Terjadi kesalahan saat menyelesaikan ujian');
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        if (!seconds || seconds < 0) return "00:00";

        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);

        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    // Navigation functions
    const goToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const goToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const goToQuestion = (index) => {
        setCurrentQuestionIndex(index);
    };

    // Handle answer selection
    const handleAnswerChange = async (questionId, optionId) => {
        // Update local state first for immediate UI feedback
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionId
        }));

        // Submit answer to backend
        setSubmitting(true);
        try {
            const response = await examService.submitAnswer(questionId, optionId);
            if (!response.success) {
                toast.error(response.message || 'Gagal menyimpan jawaban');
                // Revert local state if submission failed
                setAnswers(prev => {
                    const newAnswers = { ...prev };
                    delete newAnswers[questionId];
                    return newAnswers;
                });
            }
        } catch (error) {
            console.error("Error submitting answer:", error);
            toast.error('Terjadi kesalahan saat menyimpan jawaban');
            // Revert local state
            setAnswers(prev => {
                const newAnswers = { ...prev };
                delete newAnswers[questionId];
                return newAnswers;
            });
        } finally {
            setSubmitting(false);
        }
    };

    // Handle finish exam
    const handleFinishExam = async () => {
        // Check if all questions have been answered
        const answeredCount = Object.keys(answers).length;

        if (answeredCount < questions.length) {
            const confirm = window.confirm(`Anda baru menjawab ${answeredCount} dari ${questions.length} soal. Apakah Anda yakin ingin menyelesaikan ujian?`);
            if (!confirm) return;
        }

        setSubmitting(true);
        try {
            const response = await examService.finishExam();
            if (response.success) {
                toast.success('Ujian berhasil diselesaikan!');
                navigate('/exam-result');
            } else {
                toast.error(response.message || 'Gagal menyelesaikan ujian');
            }
        } catch (error) {
            console.error("Error finishing exam:", error);
            toast.error('Terjadi kesalahan saat menyelesaikan ujian');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2E1461]"></div>
                <p className="ml-3">Loading...</p>
            </div>
        );
    }

    if (!questions.length) {
        return (
            <div className="flex flex-col items-center justify-center h-screen p-4">
                <h1 className="text-xl font-bold mb-4">Tidak ada soal ditemukan</h1>
                <button
                    onClick={() => navigate('/exam-preparation')}
                    className="py-2 px-4 bg-[#2E1461] text-white rounded-lg"
                >
                    Kembali
                </button>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="flex flex-col p-4 md:p-8 w-full">
            {/* Header Section - Responsive */}
            <div className="flex flex-col md:flex-row justify-between w-full gap-4 md:gap-0">
                <div className="flex justify-center py-3 md:py-4 px-4 md:px-16 bg-[#2E1461] rounded-2xl md:rounded-3xl items-center">
                    <h1 className="text-white text-sm md:text-xl font-semibold">Ujian {examData?.division}</h1>
                </div>

                {/* Cleaner Timer Display */}
                <div className="flex justify-center py-3 md:py-4 px-8 md:px-16 bg-[#2E1461] rounded-2xl md:rounded-3xl items-center">
                    <span className="text-white text-base md:text-xl font-mono font-semibold">
                        {formatTime(remainingTime)}
                    </span>
                </div>
            </div>

            {/* Question Numbering Navigation - Responsive */}
            <div className="flex flex-row flex-wrap justify-center md:justify-start w-full mt-4 md:mt-8 gap-2 md:gap-6 mx-0 md:mx-2">
                {questions.map((question, index) => (
                    <button
                        key={question.id}
                        onClick={() => goToQuestion(index)}
                        className={`flex justify-center py-2 md:py-4 px-3 md:px-6 rounded-lg items-center hover:cursor-pointer ${currentQuestionIndex === index
                            ? 'bg-[#2E1461] text-white'
                            : answers[question.id] !== undefined
                                ? 'bg-green-700 text-white'
                                : 'bg-[#E8D9FF] text-gray-800'
                            }`}
                    >
                        <h3 className="text-base md:text-xl font-semibold">
                            {index + 1}
                        </h3>
                    </button>
                ))}
            </div>

            {/* Question - Responsive */}
            <div className="flex flex-col mt-6 md:mt-16 p-4 md:p-12 border-2 rounded-lg">
                <h4 className="text-lg md:text-xl font-bold mb-2">Pertanyaan {currentQuestionIndex + 1}:</h4>
                <h5 className="text-base md:text-lg mb-4 md:mb-6">
                    {currentQuestion.question_text}
                </h5>
                <ul className="flex flex-col gap-2 md:gap-3">
                    {currentQuestion.options.map((option) => (
                        <li
                            key={option.id}
                            className={`p-3 md:p-4 rounded-lg cursor-pointer flex items-center gap-2 md:gap-3 
                            ${answers[currentQuestion.id] === option.id ? 'bg-[#2E1461] text-white' : 'bg-[#E8D9FF] text-gray-800'}
                            ${submitting ? 'opacity-75 pointer-events-none' : ''}`}
                            onClick={() => !submitting && handleAnswerChange(currentQuestion.id, option.id)}
                        >
                            <span className={`w-5 md:w-6 h-5 md:h-6 border-4 rounded-full flex items-center justify-center 
                            ${answers[currentQuestion.id] === option.id ? 'bg-[#2E1461] border-[#B2BCE5]' : 'border-[#2E1461] bg-[#B2BCE5]'}
                            `}>
                                {answers[currentQuestion.id] === option.id && <span className="w-2 md:w-3 h-2 md:h-3 bg-white rounded-full"></span>}
                            </span>
                            <label className="cursor-pointer w-full text-sm md:text-base">
                                {option.option_text}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Navigation Buttons - Responsive */}
            <div className="flex flex-row justify-between mt-6 md:mt-16">
                <button
                    onClick={goToPreviousQuestion}
                    disabled={currentQuestionIndex === 0 || submitting}
                    className={`py-2 md:py-4 px-4 md:px-24 rounded-lg font-medium text-sm md:text-base ${(currentQuestionIndex === 0 || submitting)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:cursor-not-allowed'
                        : 'bg-[#1E0771] text-white hover:bg-[#150554] hover:cursor-pointer'
                        }`}
                >
                    Sebelumnya
                </button>

                {currentQuestionIndex === questions.length - 1 ? (
                    <button
                        onClick={handleFinishExam}
                        disabled={submitting}
                        className={`py-2 md:py-4 px-4 md:px-24 rounded-lg font-medium text-sm md:text-base 
                        ${submitting ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-700 text-white hover:bg-green-800'}`}
                    >
                        {submitting ? 'Menyelesaikan...' : 'Selesai Ujian'}
                    </button>
                ) : (
                    <button
                        onClick={goToNextQuestion}
                        disabled={submitting}
                        className={`py-2 md:py-4 px-4 md:px-24 rounded-lg font-medium text-sm md:text-base 
                        ${submitting ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#1E0771] text-white hover:bg-[#150554]'}`}
                    >
                        Selanjutnya
                    </button>
                )}
            </div>
        </div>
    );
};

export default Exam;