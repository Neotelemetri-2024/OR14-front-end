import api from './api';

// Exam service functions
const examService = {
    // Get all divisions
    getDivisions: async () => {
        try {
            const response = await api.get('/exam/divisions');
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Gagal memuat data divisi'
            };
        }
    },

    // Start a new exam
    startExam: async (divisionId, duration = 60) => {
        try {
            const response = await api.post('/exam/start', {
                division_id: divisionId,
                duration: duration
            });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Gagal memulai ujian'
            };
        }
    },

    // Get exam questions
    getExamQuestions: async () => {
        try {
            const response = await api.get('/exam/questions');
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Gagal memuat soal ujian'
            };
        }
    },

    // Submit an answer to a question
    submitAnswer: async (questionId, optionId) => {
        try {
            const response = await api.post('/exam/answer', {
                question_id: questionId,
                option_id: optionId
            });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Gagal menyimpan jawaban'
            };
        }
    },

    // Finish an exam
    finishExam: async () => {
        try {
            const response = await api.post('/exam/finish');
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Gagal menyelesaikan ujian'
            };
        }
    },

    // Get exam result
    getExamResult: async (examId = null) => {
        try {
            const url = examId ? `/exam/result/${examId}` : '/exam/result';
            const response = await api.get(url);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Gagal memuat hasil ujian'
            };
        }
    },

    // Get exam history
    getExamHistory: async () => {
        try {
            const response = await api.get('/exam/history');
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Gagal memuat riwayat ujian'
            };
        }
    }
};

export default examService;