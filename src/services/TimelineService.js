import api from "./api";

export const timelineService = {
    getTimelines: async () => {
        try {
            const response = await api.get('/admin/timeline');
            return { success: true, data: response.data.data };
        } catch (error) {
            console.error("Error fetching timelines:", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Gagal mendapatkan data timeline'
            };
        }
    },

    // Create a new timeline
    createTimeline: async (timelineData) => {
        try {
            const response = await api.post('/admin/timeline', timelineData);
            return { success: true, data: response.data.data };
        } catch (error) {
            console.error("Error creating timeline:", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Gagal membuat timeline baru'
            };
        }
    },

    // Update a timeline
    updateTimeline: async (id, timelineData) => {
        try {
            const response = await api.put(`/admin/timeline/${id}`, timelineData);
            return { success: true, data: response.data.data };
        } catch (error) {
            console.error("Error updating timeline:", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Gagal memperbarui timeline'
            };
        }
    },

    // Delete a timeline
    deleteTimeline: async (id) => {
        try {
            await api.delete(`/admin/timeline/${id}`);
            return { success: true };
        } catch (error) {
            console.error("Error deleting timeline:", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Gagal menghapus timeline'
            };
        }
    },

    // Reorder timelines
    reorderTimelines: async (timelineOrder) => {
        try {
            const response = await api.post('/admin/timeline/reorder', { timelines: timelineOrder });
            return { success: true, data: response.data.data };
        } catch (error) {
            console.error("Error reordering timelines:", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Gagal mengubah urutan timeline'
            };
        }
    },
};

// Get public timelines for user dashboard
export const getPublicTimelines = async () => {
    try {
        const response = await api.get('/timelines');
        return { success: true, data: response.data.data };
    } catch (error) {
        console.error("Error fetching public timelines:", error);
        return {
            success: false,
            message: error.response?.data?.message || 'Gagal mendapatkan data timeline'
        };
    }
};