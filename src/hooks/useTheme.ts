import { useColorScheme } from "nativewind";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config.js";

const fullConfig = resolveConfig(tailwindConfig);

/**
 * Custom hook to get theme colors based on the current color scheme (light/dark)
 */
export const useTheme = () => {
  const { colorScheme } = useColorScheme();
  const themeColors = fullConfig.theme.colors as any;
  const isDarkMode = colorScheme === "dark";

  const colors = {
    primary: themeColors.primary,
    background: isDarkMode
      ? themeColors.dark.background
      : themeColors.background,
    card: isDarkMode ? themeColors.dark.card : themeColors.card,
    text: isDarkMode ? themeColors.dark.text : themeColors.text,
    subtext: isDarkMode ? themeColors.dark.subtext : themeColors.subtext,
    border: isDarkMode ? themeColors.dark.border : themeColors.border,
    error: isDarkMode ? themeColors.dark.error : themeColors.error,
    success: isDarkMode ? themeColors.dark.success : themeColors.success,
  };

  return { colors, colorScheme };
};
