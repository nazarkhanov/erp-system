import { QueryClient, QueryClientProvider } from "react-query";

const client = new QueryClient();

export function Provider({ children }) {
	return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
