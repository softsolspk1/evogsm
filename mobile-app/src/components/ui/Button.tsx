import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: "primary" | "secondary" | "plain" | "danger";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Button = ({
  onPress,
  title,
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
}: ButtonProps) => {
  const baseStyles = "flex-row items-center justify-center rounded-xl py-4";

  const variants = {
    primary: "bg-black dark:bg-white",
    secondary: "bg-zinc-100 dark:bg-zinc-800",
    plain: "bg-transparent",
    danger: "bg-red-500",
  };

  const textVariants = {
    primary: "text-white dark:text-black font-semibold text-[17px]",
    secondary: "text-black dark:text-white font-semibold text-[17px]",
    plain: "text-blue-500 font-semibold text-[17px]",
    danger: "text-white font-semibold text-[17px]",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${
        disabled || loading ? "opacity-30" : "active:opacity-70"
      } ${className}`}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#000" : "#999"} />
      ) : (
        <Text className={`${textVariants[variant]}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
