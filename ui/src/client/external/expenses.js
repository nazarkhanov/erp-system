import axios from "./axios";
import * as query from "react-query";
import * as errors from "./errors";

export const useGroups = ({ id }) =>
	query.useQuery({
		queryKey: [`project-${id}-groups`],

		async queryFn() {
			let response, error;

			try {
				response = await axios.get(`/projects/${id}/expenses_groups/`);
			} catch (e) {
				response = e.response;
				error = e;
			}

			if (response.status !== 200) throw new errors.Unknown(error);

			return response.data;
		},
	});

export const useList = ({ project_id, group_id }) =>
	query.useQuery({
		queryKey: [`project-${project_id}-expenses-${group_id}`],

		async queryFn() {
			let response, error;

			try {
				response = await axios.get(
					`/projects/${project_id}/expenses/${group_id}`
				);
			} catch (e) {
				response = e.response;
				error = e;
			}

			if (response.status !== 200) throw new errors.Unknown(error);

			return response.data;
		},
	});

export const useCreate = ({ project_id, group_id }) => {
	const client = query.useQueryClient();

	return query.useMutation({
		async mutationFn({ data }) {
			let response, error;

			try {
				response = await axios.post(`/projects/${project_id}/expenses/`, data);
			} catch (e) {
				response = e.response;
				error = e;
			}

			if (response.status !== 201) throw new errors.Unknown(error);

			return response.data;
		},

		async onSuccess() {
			client.invalidateQueries({
				queryKey: [`project-${project_id}-expenses-${group_id}`],
			});
		},
	});
};

export const useDelete = ({ project_id, group_id }) => {
	const client = query.useQueryClient();

	return query.useMutation({
		async mutationFn({ product_id }) {
			let response, error;

			try {
				response = await axios.delete(
					`/projects/${project_id}/expenses/${product_id}/`
				);
			} catch (e) {
				response = e.response;
				error = e;
			}

			if (response.status !== 204) throw new errors.Unknown(error);

			return response.data;
		},

		async onSuccess() {
			client.invalidateQueries({
				queryKey: [`project-${project_id}-expenses-${group_id}`],
			});
		},
	});
};

export const useUpdate = ({ project_id, group_id }) => {
	const client = query.useQueryClient();

	return query.useMutation({
		async mutationFn({ product_id, data }) {
			let response, error;

			try {
				response = await axios.patch(
					`/projects/${project_id}/expenses/${product_id}/`,
					data
				);
			} catch (e) {
				response = e.response;
				error = e;
			}

			if (response.status !== 200) throw new errors.Unknown(error);

			return response.data;
		},

		async onSuccess() {
			client.invalidateQueries({
				queryKey: [`project-${project_id}-expenses-${group_id}`],
			});
		},
	});
};
