import axios from "axios";

const api = axios.create({
	baseURL: "/api",
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use(
	function (config) {
		const token = localStorage.getItem("access");
		if (token) config.headers["Authorization"] = "Bearer " + token;
		return config;
	},

	function (error) {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	function (response) {
		return response;
	},

	function (error) {
		if (
			error.response.status === 401 &&
			error.config.headers["Authorization"] &&
			window.location.pathname !== "/"
		) {
			localStorage.removeItem("access");
			localStorage.removeItem("refresh");
			window.location = "/";
		}

		return Promise.reject(error);
	}
);

export default api;
