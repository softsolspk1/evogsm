import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  SESSION_TOKEN_KEY,
  NEON_AUTH_URL,
  NEON_ORIGIN,
} from "../constants/Config";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";

export const VerificationScreen = () => {
  const { user, pendingUser, login, logout, setPendingUser } = useAuth();
  const insets = useSafeAreaInsets();
  const [code, setCode] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);

  const activeEmail = user?.email || pendingUser?.email;
  const activeUserId = user?.id || pendingUser?.id;

  React.useEffect(() => {}, []);

  const handleSendCode = async () => {
    setIsResending(true);
    try {
      const token = await SecureStore.getItemAsync(SESSION_TOKEN_KEY);
      // Call Neon's native send-verification-email endpoint
      await axios.post(
        `${NEON_AUTH_URL}/email-otp/send-verification-otp`,
        {
          email: activeEmail,
          type: "email-verification",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Origin: NEON_ORIGIN,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );
      Alert.alert("Success", "Verification code sent to your email.");
    } catch (err: any) {
      Alert.alert("Error", "Could not send verification code.");
    } finally {
      setIsResending(false);
    }
  };

  const onVerify = async () => {
    if (code.length < 6) {
      Alert.alert("Error", "Please enter the 6-digit code.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await SecureStore.getItemAsync(SESSION_TOKEN_KEY);
      // Call Neon's native verify-email endpoint
      const response = await axios.post(
        `${NEON_AUTH_URL}/email-otp/verify-email`,
        {
          email: activeEmail,
          otp: code,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Origin: NEON_ORIGIN,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      if (response.data.success || response.status === 200) {
        Alert.alert("Success", "Email verified! Please sign in.");
        setPendingUser(null);
      }
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Invalid or expired code.",
      );
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
                Verify Email
              </Text>
              <Text className="text-zinc-500 dark:text-zinc-400 text-lg mt-2 font-medium">
                We've sent a code to your email.
              </Text>
            </View>

            <Input
              label="Verification Code"
              placeholder="123456"
              onChangeText={setCode}
              value={code}
              keyboardType="number-pad"
              maxLength={6}
            />

            <Button
              title="Verify"
              onPress={onVerify}
              loading={isSubmitting}
              className="mt-4"
            />

            <TouchableOpacity
              onPress={handleSendCode}
              disabled={isResending}
              className="mt-8 self-center"
              activeOpacity={0.6}
            >
              <Text className="text-blue-500 text-[17px] font-semibold">
                {isResending ? "Sending..." : "Resend Code"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={logout}
              className="mt-6 self-center"
              activeOpacity={0.6}
            >
              <Text className="text-zinc-500 text-[15px] font-medium">
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
