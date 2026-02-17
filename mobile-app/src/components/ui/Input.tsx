import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, ...props }: InputProps) => {
  return (
    <View className="w-full mb-6">
      {label && (
        <Text className="text-zinc-500 dark:text-zinc-400 font-medium mb-2 text-xs uppercase tracking-tight ml-4">
          {label}
        </Text>
      )}
      <View
        className={`bg-zinc-100 dark:bg-zinc-900 rounded-2xl px-4 py-1.5 ${
          error ? "border border-red-500" : ""
        }`}
      >
        <TextInput
          className="text-black dark:text-white text-[17px] py-3.5"
          placeholderTextColor="#999"
          {...props}
        />
      </View>
      {error && (
        <Text className="text-red-500 text-xs mt-2 ml-4 font-medium">
          {error}
        </Text>
      )}
    </View>
  );
};
