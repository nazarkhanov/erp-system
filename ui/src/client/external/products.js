import axios from "./axios";
import * as query from "react-query";
import * as errors from "./errors";

export const useList = ({ id }) =>
	query.useQuery({
		queryKey: [`project-${id}-products`],

		async queryFn() {
			let response, error;

			try {
				response = await axios.get(`/projects/${id}/products/`);
			} catch (e) {
				response = e.response;
				error = e;
			}

			if (response.status !== 200) throw new errors.Unknown(error);

			return response.data;
		},
	});
