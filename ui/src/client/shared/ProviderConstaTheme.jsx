import { ThemeKit } from "@/shared/uikit";

export function Provider({ children }) {
	return (
		<ThemeKit.Theme preset={ThemeKit.presetGpnDefault}>
			{children}
		</ThemeKit.Theme>
	);
}
