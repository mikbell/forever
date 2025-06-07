// src/api/axios.js
import axios from "axios";

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL,
	withCredentials: true,
});

apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			localStorage.removeItem("token");
			window.location = '/auth?mode=login';
		}
		return Promise.reject(error);
	}
);

export default apiClient;
