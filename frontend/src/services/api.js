import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with better debugging
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    console.log('📦 Request data:', config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response logging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} success:`, response.data);
    return response;
  },
  (error) => {
    console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} failed:`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API service functions
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
};

export const doctorAPI = {
  getAll: () => api.get('/doctors'),
  getById: (id) => api.get(`/doctors/${id}`),
  create: (doctorData) => api.post('/doctors', doctorData),
  update: (id, doctorData) => api.put(`/doctors/${id}`, doctorData),
  delete: (id) => api.delete(`/doctors/${id}`),
};

export const patientAPI = {
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  update: (id, patientData) => api.put(`/patients/${id}`, patientData),
};

export const appointmentAPI = {
  getAll: (params) => api.get('/appointments', { params }),
  create: (appointmentData) => api.post('/appointments', appointmentData),
  complete: (id) => api.put(`/appointments/${id}/complete`),
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
  getAvailability: (doctorId, date) => 
    api.get('/appointments/availability', { params: { doctorId, date } }),
};

export const departmentAPI = {
  getAll: () => api.get('/departments'),
  getStats: (id) => api.get(`/departments/${id}/stats`),
  create: (departmentData) => api.post('/departments', departmentData),
  update: (id, departmentData) => api.put(`/departments/${id}`, departmentData),
  delete: (id) => api.delete(`/departments/${id}`),
};

export const prescriptionAPI = {
  create: (prescriptionData) => api.post('/prescriptions', prescriptionData),
  getByAppointment: (appointmentId) => api.get(`/prescriptions/appointment/${appointmentId}`),
};

export const billAPI = {
  getAll: (params) => api.get('/bills', { params }),
  pay: (id) => api.put(`/bills/${id}/pay`),
  getPatientSummary: (patientId) => api.get(`/bills/patient/${patientId}/summary`),
};

export default api;