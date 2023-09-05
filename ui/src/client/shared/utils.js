import { useMediaQuery as useMediaBase } from "react-responsive";

export const useMediaQuery = () => {
	const useMinMedia = (value) =>
		useMediaBase({ query: `(min-width: ${value}px)` });

	return {
		isDesktop: useMinMedia(1280),
		isTablet: useMinMedia(960),
		isSmart: useMinMedia(720),
		isPhone: useMinMedia(320),
	};
};

// -------------------------------------------------------------

import { withNaming } from "@bem-react/classname";

const withBemNaming = withNaming({ e: "-", m: "_", v: "_" });

export function useClassName(...args) {
	return withBemNaming(...args);
}
