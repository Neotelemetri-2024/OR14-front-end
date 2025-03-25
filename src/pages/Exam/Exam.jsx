import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import examService from '../../services/ExamService';
import { toast } from 'react-toastify'; // You may need to install this library

const Exam = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [timer, setTimer] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [examData, setExamData] = useState(null);

    const navigate = useNavigate();

    // Fetch exam questions on component mount
    useEffect(() => {
        const fetchExamQuestions = async () => {
            setLoading(true);
            const response = await examService.getExamQuestions();

            if (response.success) {
                const examData = response.data.data;
                setExamData(examData);

                if (examData.questions && examData.questions.length > 0) {
                    setQuestions(examData.questions);

                    // Initialize answers from any existing user answers
                    const initialAnswers = {};
                    examData.questions.forEach(question => {
                        if (question.user_answer) {
                            initialAnswers[question.id] = question.user_answer;
                        }
                    });
                    setAnswers(initialAnswers);
                } else {
                    toast.error('Tidak ada soal ditemukan untuk ujian ini');
                }
            } else {
                toast.error(response.message);
                // If there's no active exam, redirect to preparation page
                navigate('/exam-preparation');
            }

            setLoading(false);
        };

        fetchExamQuestions();
    }, [navigate]);

    // Timer functionality
    // Pada useEffect untuk timer
    useEffect(() => {
        if (examData && examData.remaining_seconds) {
            // Gunakan remaining_seconds dari server
            setTimer(examData.remaining_seconds);

            const interval = setInterval(() => {
                setTimer(prevTimer => {
                    // Jika timer habis
                    if (prevTimer <= 1) {
                        clearInterval(interval);
                        // Auto submit exam
                        handleTimeUp();
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [examData]);



    // Tambahkan function ketika waktu habis
    const handleTimeUp = async () => {
        toast.warn("Waktu ujian telah habis!");
        setSubmitting(true);

        const response = await examService.finishExam();
        if (response.success) {
            toast.info('Ujian telah diselesaikan karena waktu habis.');
            navigate('/exam-result');
        } else {
            toast.error(response.message);
        }
        setSubmitting(false);
    };

    // Format timer as HH:MM:SS
    const formatTime = (seconds) => {
        if (seconds < 0) seconds = 0;
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };
    // Handle navigation
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
        const response = await examService.submitAnswer(questionId, optionId);

        if (!response.success) {
            toast.error(response.message);
            // Revert local state if submission failed
            setAnswers(prev => {
                const newAnswers = { ...prev };
                delete newAnswers[questionId];
                return newAnswers;
            });
        }
        setSubmitting(false);
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
        const response = await examService.finishExam();

        if (response.success) {
            toast.success('Ujian berhasil diselesaikan!');
            navigate('/exam-result');
        } else {
            toast.error(response.message);
        }
        setSubmitting(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading...</p>
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
                <div className="flex justify-center py-3 md:py-6 px-4 md:px-20 bg-[#2E1461] rounded-2xl md:rounded-3xl items-center">
                    <h2 className="text-white text-sm md:text-xl font-semibold">
                        {formatTime(timer)}
                    </h2>
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
                                ? 'bg-green-900 text-white'
                                : 'bg-[#E8D9FF] text-white'
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
                            ${answers[currentQuestion.id] === option.id ? 'bg-secondary text-white' : 'bg-[#E8D9FF]'}
                            ${submitting ? 'opacity-75 pointer-events-none' : ''}`}
                            onClick={() => !submitting && handleAnswerChange(currentQuestion.id, option.id)}
                        >
                            <span className={`w-5 md:w-6 h-5 md:h-6 border-4 rounded-full flex items-center justify-center 
                            ${answers[currentQuestion.id] === option.id ? ' bg-[#2E1461] border-[#B2BCE5]' : ' border-[#2E1461] bg-[#B2BCE5]'}
                        `}>
                                {answers[currentQuestion.id] === option.id && <span className="w-2 md:w-3 h-2 md:h-3 bg-[#301D54] rounded-full"></span>}
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