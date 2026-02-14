import axiosInstance from '@core/api/axios';

export const deliveryApi = {
    getStats: () => axiosInstance.get('/delivery/stats'),
    getAssignments: () => axiosInstance.get('/delivery/tasks'),
    updateTaskStatus: (id, status) => axiosInstance.put(`/delivery/tasks/${id}`, { status }),
};
