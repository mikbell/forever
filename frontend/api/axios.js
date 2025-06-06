// src/api.js
import axios from "axios";

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Aggiungi un intercettore di richiesta
apiClient.interceptors.request.use(
	(config) => {
		// Recupera il token dal localStorage ad ogni richiesta
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

export default apiClient;
