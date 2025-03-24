// ProfileContext.js
import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(null);

    // Fetch profile on mount
    useEffect(() => {
        refreshProfileData();
    }, []);

    // Comprehensive function to refresh all profile-related data
    const refreshProfileData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/profile');
            if (response.data.status === 'success') {
                console.log('Refreshed profile data:', response.data.data);

                // Store profile data
                setProfile(response.data.data);

                // Check if profile is complete
                const profileData = response.data.data;
                const complete = checkProfileCompleteness(profileData);
                setIsProfileComplete(complete);

                // Get verification status
                if (complete) {
                    await checkVerificationStatus();
                }
            }
        } catch (error) {
            console.error('Error refreshing profile data:', error);
            if (error.response?.status === 404) {
                // Profile not found is expected for new users
                setProfile(null);
                setIsProfileComplete(false);
            }
        } finally {
            setLoading(false);
        }
    };

    // Check if profile has all required fields
    const checkProfileCompleteness = (profileData) => {
        if (!profileData) return false;

        const requiredFields = [
            'nama_lengkap',
            'panggilan',
            'nim',
            'whatsapp',
            'program_studi',
            'divisi',
            'sub_divisi'
        ];

        return requiredFields.every(field =>
            profileData[field] !== null &&
            profileData[field] !== undefined &&
            profileData[field] !== ''
        );
    };

    // Check verification status
    const checkVerificationStatus = async () => {
        try {
            const response = await api.get('/profile/status');
            if (response.data.status === 'success') {
                const status = response.data.is_complete ? 'verified' : null;
                setVerificationStatus(status);
            }
        } catch (error) {
            console.error('Error checking verification status:', error);
            setVerificationStatus(null);
        }
    };

    // Fetch user profile
    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await api.get('/profile');
            if (response.data.status === 'success') {
                console.log('Profile data:', response.data.data);
                setProfile(response.data.data);

                // Check profile completeness
                setIsProfileComplete(checkProfileCompleteness(response.data.data));
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            if (error.response?.status === 404) {
                setProfile(null);
                setIsProfileComplete(false);
            }
        } finally {
            setLoading(false);
        }
    };

    // Di ProfileContext.js, fungsi saveProfile
    const saveProfile = async (profileData) => {
        try {
            const formData = new FormData();

            // Add all text fields
            Object.keys(profileData).forEach(key => {
                if (key !== 'photo' && profileData[key] !== null && profileData[key] !== undefined) {
                    formData.append(key, profileData[key]);
                    console.log(`Added field ${key}:`, profileData[key]);
                }
            });

            // Add photo if it's a File object
            if (profileData.photo instanceof File) {
                formData.append('photo', profileData.photo);
                console.log('Added photo:', profileData.photo.name, profileData.photo.size);
            }

            console.log('Sending profile data to server...');

            const response = await api.post('/profile', formData, {
                headers: {
                    // Don't set Content-Type here, let the browser set it with the boundary
                }
            });

            console.log('Server response:', response.data);

            if (response.data.status === 'success') {
                return { success: true, ...response.data };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Unknown error',
                    errors: response.data.errors
                };
            }
        } catch (error) {
            console.error('Error in saveProfile:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to save profile',
                errors: error.response?.data?.errors
            };
        }
    };

    return (
        <ProfileContext.Provider
            value={{
                profile,
                loading,
                isProfileComplete,
                verificationStatus,
                fetchProfile,
                saveProfile,
                refreshProfileData,
                checkVerificationStatus
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => useContext(ProfileContext);