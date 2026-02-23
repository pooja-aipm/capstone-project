import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const uploadBatch = async (jdText, files) => {
    const formData = new FormData();
    formData.append('jdText', jdText);
    Array.from(files).forEach((file) => {
        formData.append('resumes', file);
    });

    const response = await api.post('/upload-batch', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const fetchCandidates = async () => {
    const response = await api.get('/candidates');
    return response.data;
};

export const fetchCandidateDetails = async (id) => {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
};

export const scheduleInterview = async (candidateId, timeSlot, draftContent) => {
    const response = await api.post('/schedule', {
        candidateId,
        timeSlot,
        draftContent,
    });
    return response.data;
};
