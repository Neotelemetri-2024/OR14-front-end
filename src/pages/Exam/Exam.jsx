import { useState, useEffect } from 'react';

const questions = [
    {
        id: 1,
        question: "Apa yang dimaksud dengan Pemrograman?",
        options: [
            { text: "Mengumpulkan data dan menyimpan dalam bentuk data struktur", value: false },
            { text: "Melakukan perubahan data secara real-time", value: false },
            { text: "Melatih algoritma dan struktur data", value: true },
            { text: "Mengembangkan program yang dapat berinteraksi dengan pengguna", value: false }
        ]
    },
    {
        id: 2,
        question: "Apakah JavaScript adalah bahasa pemrograman yang diturunkan?",
        options: [
            { text: "No", value: false },
            { text: "Yes", value: true }
        ]
    },
    {
        id: 3,
        question: "Mana berikut yang bukan bahasa Pemrograman?",
        options: [
            { text: "Java", value: false },
            { text: "Python", value: false },
            { text: "C++", value: false },
            { text: "HTML", value: true }
        ]
    }
];

const Exam = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState(Array(questions.length).fill(null));
    const [timer, setTimer] = useState(0);

    // Timer functionality
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prevTimer => prevTimer + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Format timer as HH:MM:SS
    const formatTime = (seconds) => {
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
    const handleAnswerChange = (optionIndex) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setAnswers(newAnswers);
    };

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="flex flex-col p-8 w-full">
            <div className="flex flex-row justify-between w-full">
                <div className="flex justify-center py-4 px-16 bg-[#1E0771] rounded-3xl items-center">
                    <h1 className="text-white text-xl font-semibold">Ujian Multimedia & Desain</h1>
                </div>
                <div className="flex justify-center py-6 px-20 bg-[#1E0771] rounded-3xl items-center">
                    <h2 className="text-white text-xl font-semibold">
                        {formatTime(timer)}
                    </h2>
                </div>
            </div>

            {/* Question Numbering Navigation */}
            <div className="flex flex-row justify-start w-full mt-8 gap-6 mx-2">
                {questions.map((question, index) => (
                    <button
                        key={index}
                        onClick={() => goToQuestion(index)}
                        className={`flex justify-center py-4 px-6 rounded-lg items-center hover:cursor-pointer ${currentQuestionIndex === index
                            ? 'bg-[#1E0771] text-white'
                            : answers[index] !== null
                                ? 'bg-green-500 text-white'
                                : 'bg-[#B2BCE5] text-white'
                            }`}
                    >
                        <h3 className="text-xl font-semibold">
                            {index + 1}
                        </h3>
                    </button>
                ))}
            </div>

            {/* Question */}
            <div className="flex flex-col mt-16 p-12 border-2 rounded-lg">
                <h4 className="text-xl font-bold mb-2">Pertanyaan {currentQuestionIndex + 1}:</h4>
                <h5 className="text-lg mb-6">
                    {currentQuestion.question}
                </h5>
                <ul className="flex flex-col gap-3">
                    {currentQuestion.options.map((option, index) => (
                        <li
                            key={index}
                            className={`p-4 rounded-lg cursor-pointer flex items-center gap-3 
                            ${answers[currentQuestionIndex] === index ? 'bg-secondary text-white' : 'bg-[#B2BCE5]'}
                        `}
                            onClick={() => handleAnswerChange(index)}
                        >
                            <span className={`w-6 h-6 border-4  rounded-full flex items-center justify-center 
                            ${answers[currentQuestionIndex] === index ? ' bg-[#1E0771] border-[#B2BCE5]' : ' border-[#1E0771] bg-[#B2BCE5]'}
                        `}>
                                {answers[currentQuestionIndex] === index && <span className="w-3 h-3 bg-[#301D54] rounded-full"></span>}
                            </span>
                            <label className="cursor-pointer w-full">
                                {option.text}
                            </label>
                        </li>

                    ))}
                </ul>
            </div>
            <div className="flex flex-row justify-between mt-16">
                <button
                    onClick={goToPreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className={`py-4 px-24 rounded-lg font-medium  ${currentQuestionIndex === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:cursor-not-allowed'
                        : 'bg-[#1E0771] text-white hover:bg-[#150554] hover:cursor-pointer'
                        }`}
                >
                    Sebelumnya
                </button>
                <button
                    onClick={goToNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className={`py-4 px-24 rounded-lg font-medium  ${currentQuestionIndex === questions.length - 1
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:cursor-not-allowed'
                        : 'bg-[#1E0771] text-white hover:bg-[#150554] hover:cursor-pointer'
                        }`}
                >
                    Selanjutnya
                </button>
            </div>
        </div>
    );
};

export default Exam;