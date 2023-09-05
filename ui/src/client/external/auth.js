import axios from "./axios";
import * as query from "react-query";
import * as errors from "./errors";

export const useLogin = () =>
	query.useMutation({
		async mutationFn({ email, password }) {
			let response, error;

			try {
				response = await axios.post("/auth/jwt/create/", {
					email,
					password,
				});
			} catch (e) {
				response = e.response;
				error = e;
			}

			if (response.status === 401) throw new errors.WrongCredentials(error);
			else if (response.status !== 200) throw new errors.Unknown(error);

			const { access, refresh } = response.data;

			localStorage.setItem("access", access);
			localStorage.setItem("refresh", refresh);
		},
	});

export const useLogout = () =>
	query.useMutation({
		async mutationFn() {
			localStorage.removeItem("access");
			localStorage.removeItem("refresh");
		},
	});

export const useVerify = () =>
	query.useQuery({
		retry: 0,
		async queryFn() {
			let response, error, token;

			// access

			token = localStorage.getItem("access");
			if (!token) throw new errors.TokensNotFound(error);

			try {
				response = await axios.post("/auth/jwt/verify/", { token });
			} catch (e) {
				response = e.response;
				error = e;

				localStorage.removeItem("access");
			}

			if (response.status === 200) return response.data;
			else if (response.status !== 401) throw new errors.Unknown(error);

			token = localStorage.getItem("refresh");
			if (!token) throw new errors.TokensNotFound(error);

			try {
				response = await axios.post("/auth/jwt/verify/", { token });
			} catch (e) {
				response = e.response;
				error = e;

				localStorage.removeItem("refresh");
			}

			if (response.status === 401) throw new errors.ExpiredTokens(error);
			if (response.status !== 200) throw new errors.Unknown(error);

			// refresh

			let refresh = localStorage.getItem("refresh");
			if (!refresh) throw new errors.TokensNotFound(error);

			try {
				response = await axios.post("/auth/jwt/refresh/", { refresh });
			} catch (e) {
				response = e.response;
				error = e;
			}

			if (response.status === 200)
				localStorage.setItem("access", response.data.access);
			else throw new errors.Unknown(error);

			return response.data;
		},
	});

export const useProfile = () =>
	query.useQuery({
		queryKey: ["profile"],
		async queryFn() {
			let response, error;

			try {
				response = await axios.get("/auth/users/me/");
			} catch (e) {
				response = e.response;
				error = e;
			}

			if (response.status !== 200) throw new errors.Unknown(error);

			return response.data;
		},
	});
