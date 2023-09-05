import * as React from "react";
import * as ReactRouter from "react-router-dom";
import * as AuthExtenal from "@/external/auth";

export function Middleware({ children }) {
	const navigate = ReactRouter.useNavigate();
	const location = ReactRouter.useLocation();
	const verify = AuthExtenal.useVerify();

	const [isVerified, setIsVerified] = React.useState(false);

	React.useEffect(() => {
		if (verify.isLoading) return;
		setIsVerified(true);

		const isNotAuthenticated = verify.isError && location.pathname !== "/";

		if (isNotAuthenticated) {
			return navigate("/");
		}

		const isAuthenticated = !verify.isError && location.pathname === "/";

		if (isAuthenticated) {
			return navigate("/cabinet");
		}
	}, [verify.isLoading, location.pathname]);

	return isVerified ? children : <></>;
}
