import api from './api';

export const profileService = {
    // Get user profile
    getProfile: async () => {
        try {
            const response = await api.get('/profile');
            return { success: true, data: response.data.data };
        } catch (error) {
            if (error.response?.status === 404) {
                // Profile not found is not an error for us, it just means
                // the user hasn't created one yet
                return { success: true, data: null };
            }
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch profile'
            };
        }
    },

    // Create new profile
    createProfile: async (profileData) => {
        try {
            // Need to use FormData if we have a file
            const formData = new FormData();

            // Add all text fields
            Object.keys(profileData).forEach(key => {
                if (key !== 'photo' || !profileData[key]) {
                    formData.append(key, profileData[key]);
                }
            });

            // Add photo if exists
            if (profileData.photo && profileData.photo instanceof File) {
                formData.append('photo', profileData.photo);
            }

            const response = await api.post('/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return { success: true, data: response.data.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to create profile',
                errors: error.response?.data?.errors
            };
        }
    },

    // Update profile
    // Fungsi untuk update profile
    updateProfile: async (profileData) => {
        try {
            const formData = new FormData();

            // Tambahkan method untuk Laravel mengenali sebagai PUT request
            formData.append('_method', 'PUT');

            // Tambahkan semua field teks
            Object.keys(profileData).forEach(key => {
                if (key !== 'photo' && profileData[key] !== undefined && profileData[key] !== null) {
                    formData.append(key, profileData[key]);
                }
            });

            // Tambahkan foto jika ada
            if (profileData.photo instanceof File) {
                formData.append('photo', profileData.photo);
            }

            // Log formData untuk debug
            console.log('Form data being sent:', Object.fromEntries(formData));

            const response = await api.post('/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            return { success: true, data: response.data.data };
        } catch (error) {
            console.error('Error updating profile:', error.response?.data || error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update profile',
                errors: error.response?.data?.errors
            };
        }
    },

    // Delete profile
    deleteProfile: async () => {
        try {
            const response = await api.delete('/profile');
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete profile'
            };
        }
    },

    // Check profile status
    checkProfileStatus: async () => {
        try {
            const response = await api.get('/profile/status');
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to check profile status'
            };
        }
    },

    // Upload verification document
    uploadVerificationDocument: async (file) => {
        try {
            const formData = new FormData();
            formData.append('document', file);

            const response = await api.post('/verification', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to upload verification document',
                errors: error.response?.data?.errors
            };
        }
    },

    // Check verification status
    checkVerificationStatus: async () => {
        try {
            const response = await api.get('/verification');
            return { success: true, data: response.data };
        } catch (error) {
            if (error.response?.status === 404) {
                // Not found means no verification submitted yet
                return {
                    success: true,
                    data: { status: null, message: 'Verification not submitted yet' }
                };
            }

            return {
                success: false,
                message: error.response?.data?.message || 'Failed to check verification status'
            };
        }
    }
};

export default profileService;