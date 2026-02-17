import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { SignupSchema, SignupFormData } from "../schemas/AuthSchemas";
import axios from "axios";
import { NEON_AUTH_URL, NEON_ORIGIN } from "../constants/Config";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const SignupScreen = ({ onSwitch }: { onSwitch: () => void }) => {
  const { setPendingUser } = useAuth();
  const insets = useSafeAreaInsets();
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await axios.post(
        `${NEON_AUTH_URL}/sign-up/email`,
        {
          email: data.email,
          password: data.password,
          name: data.name,
        },
        {
          headers: {
            Origin: NEON_ORIGIN,
          },
        },
      );

      // If signup is successful, transition to verification
      if (response.data.user) {
        setPendingUser({
          id: response.data.user.id,
          email: response.data.user.email,
        });
      } else {
        setError(
          "Signup successful, but user data missing. Please try logging in.",
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View
      className="flex-1 bg-white dark:bg-black"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-6"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center max-w-[400px] w-full self-center pb-12">
            <View className="mb-14">
              <Text className="text-[34px] font-bold text-black dark:text-white tracking-tight">
                Sign Up
              </Text>
              <Text className="text-zinc-500 dark:text-zinc-400 text-lg mt-2 font-medium">
                Unlock your potential with Neon.
              </Text>
            </View>

            {error && (
              <Text className="text-red-500 font-semibold mb-6 text-center text-[15px]">
                {error}
              </Text>
            )}

            <View>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Display Name"
                    placeholder="Required"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.name?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email"
                    placeholder="email@example.com"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Password"
                    placeholder="At least 8 characters"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                    error={errors.password?.message}
                  />
                )}
              />
            </View>

            <Button
              title="Sign Up"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              className="mt-4"
            />

            <TouchableOpacity
              onPress={onSwitch}
              className="mt-8 self-center"
              activeOpacity={0.6}
            >
              <Text className="text-blue-500 text-[17px] font-semibold">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
