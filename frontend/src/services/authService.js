import axios from 'axios';

// Use Vite env variable VITE_API_URL in production; fall back to localhost for local dev
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_URL = `${API_BASE}/api/v1/auth/`;

const resgister = async(userData) => {
    const response = await axios.post(`${API_URL}register`, userData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
}

const login = async(userData) => {
    const response = await axios.post(`${API_URL}login`, userData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
}

const logout = () => {
    localStorage.removeItem('user');
}

export { resgister, login, logout };