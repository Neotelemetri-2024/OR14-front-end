// VerificationService.js
import api from './api'; // Import your api instance

export const verificationService = {
    /**
     * Upload verification documents to the server
     * 
     * @param {File} krsFile - KRS file
     * @param {File} paymentFile - Payment proof file
     * @param {File} neoIgFile - Neo Instagram follow proof
     * @param {File} neoMarketingIgFile - Marketing Instagram follow proof
     * @returns {Promise} API response
     */
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

            // Return the API response which is already in the format {success: true, message: '...', data: {...}}
            return response.data;
        } catch (error) {
            // Handle different error scenarios
            return {
                success: false,
                message: error.response?.data?.message || 'Terjadi kesalahan saat mengunggah dokumen verifikasi'
            };
        }
    },

    /**
     * Check verification status for the current user
     * 
     * @returns {Promise} API response
     */
    checkVerificationStatus: async () => {
        try {
            const response = await api.get('/verification');

            // Return the API response which is already in the format {success: true, message: '...', data: {...}}
            return response.data;
        } catch (error) {
            console.error('Error checking verification status:', error);

            // Return standardized error response
            return {
                success: false,
                message: error.response?.data?.message || 'Gagal mendapatkan status verifikasi',
                data: null
            };
        }
    }
};

export default verificationService;