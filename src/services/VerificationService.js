import api from './api';

export const verificationService = {
    // Upload verification documents
    uploadVerificationDocuments: async (krsFile, paymentFile, neoIgFile, marketingIgFile) => {
        try {
            const formData = new FormData();
            formData.append('krs', krsFile);
            formData.append('payment_proof', paymentFile);
            formData.append('neo_ig', neoIgFile);
            formData.append('marketing_ig', marketingIgFile);

            const response = await api.post('/verification', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            console.error("Upload verification documents error:", error.response || error);
            return {
                success: false,
                message: error.response?.data?.message || 'Gagal mengunggah dokumen verifikasi'
            };
        }
    },

    // Check verification status
    checkVerificationStatus: async () => {
        try {
            const response = await api.get('/verification');
            console.log("Verification status response:", response.data);

            // Map backend status values to frontend status values if needed
            // This ensures consistency in the application
            let status = response.data.data?.status;

            // Make sure we have a standardized status regardless of case
            if (status) {
                status = status.toLowerCase();

                // Standardize the status values (optional)
                // if (status === 'diproses') status = 'pending';
                // if (status === 'disetujui') status = 'approved';
                // if (status === 'ditolak') status = 'rejected';
            }

            return {
                success: true,
                data: {
                    ...response.data.data,
                    status: status
                }
            };
        } catch (error) {
            console.error("Check verification status error:", error.response || error);
            return {
                success: false,
                message: error.response?.data?.message || 'Gagal memeriksa status verifikasi'
            };
        }
    }
};

export default verificationService;