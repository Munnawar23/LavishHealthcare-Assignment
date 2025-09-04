import React from "react";
import { Text, PressableProps, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

// Button props
interface ButtonProps extends Omit<PressableProps, "children"> {
  title: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
}

// Base styles
const baseButtonStyles = "rounded-lg items-center justify-center";
const baseTextStyles = "font-poppins-semibold text-center";

// Size styles
const sizeStyles = {
  small: "py-2 px-3",
  medium: "py-3 px-5",
  large: "py-4 px-6",
};
const sizeTextStyles = {
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
};

// Variant styles
const variantStyles = {
  primary: "bg-primary",
  secondary:
    "bg-input dark:bg-dark-input border border-border dark:border-dark-border",
  outline: "bg-transparent border border-primary",
};
const variantTextStyles = {
  primary: "text-white",
  secondary: "text-text dark:text-dark-text",
  outline: "text-primary",
};

/**
 * Reusable, theme-aware button with variants, sizes, and press animation.
 */
const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "medium",
  disabled = false,
  className,
  ...props
}) => {
  // Animation state
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  // Combine styles
  const buttonClasses = [
    baseButtonStyles,
    sizeStyles[size],
    variantStyles[variant],
    disabled ? "opacity-50" : "",
    className,
  ].join(" ");
  const textClasses = [
    baseTextStyles,
    sizeTextStyles[size],
    variantTextStyles[variant],
  ].join(" ");

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className={buttonClasses}
        disabled={disabled}
        {...props}
      >
        <Text className={textClasses}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
};

export default Button;
