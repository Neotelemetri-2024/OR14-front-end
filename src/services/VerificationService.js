import api from './api'; // Import your api instance

export const verificationService = {
    // Upload verification documents
    uploadVerificationDocuments: async (krsFile, paymentFile, neoIgFile, neoMarketingIgFile) => {
        try {
            // Create FormData object to send files
            const formData = new FormData();
            formData.append('krs_file', krsFile);
            formData.append('payment_proof_file', paymentFile);
            formData.append('neo_ig_file', neoIgFile);
            formData.append('marketing_ig_file', neoMarketingIgFile);

            const response = await api.post('/verification', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Terjadi kesalahan saat mengunggah dokumen verifikasi'
            };
        }
    },

    // Check verification status
    checkVerificationStatus: async () => {
        try {
            const response = await api.get('/verification');
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Gagal mendapatkan status verifikasi'
            };
        }
    }
};

export default verificationService;