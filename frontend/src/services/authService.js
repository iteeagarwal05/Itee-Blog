import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1/auth/';

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