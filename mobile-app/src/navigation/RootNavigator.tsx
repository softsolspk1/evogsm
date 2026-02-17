import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../context/AuthContext";
import { LoginScreen } from "../components/LoginScreen";
import { SignupScreen } from "../components/SignupScreen";
import { VerificationScreen } from "../components/VerificationScreen";
import { TabNavigator } from "./TabNavigator";
import { View, ActivityIndicator } from "react-native";

import { KAMDashboard } from "../screens/KAMDashboard";
import { DistributorDashboard } from "../screens/DistributorDashboard";
import { OrderDetails } from "../screens/OrderDetails";
import { NewOrderScreen } from "../screens/NewOrderScreen";
import { InstallationForm } from "../screens/InstallationForm";

const Stack = createStackNavigator();

export const RootNavigator = () => {
  const { user, pendingUser, isLoading } = useAuth();
  const [authView, setAuthView] = React.useState<"login" | "signup">("login");

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-black">
        <ActivityIndicator size="small" color="#075985" />
      </View>
    );
  }

  // Simplified logic: Show Verify if we have a user (logged in or pending) who is NOT verified
  const u = user as any;
  const isVerified = u?.is_verified || u?.email_verified || u?.emailVerified;
  const needsVerification = (user && !isVerified) || !!pendingUser;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {needsVerification ? (
        <Stack.Screen name="Verify" component={VerificationScreen} />
      ) : user ? (
        <>
          {u.role === "DISTRIBUTOR" ? (
            <Stack.Screen name="Home" component={DistributorDashboard} />
          ) : (
            <Stack.Screen name="Home" component={KAMDashboard} />
          )}
          <Stack.Screen name="OrderDetails" component={OrderDetails} />
          <Stack.Screen name="NewOrder" component={NewOrderScreen} />
          <Stack.Screen name="InstallationForm" component={InstallationForm} />
        </>
      ) : (
        <Stack.Screen name="Auth">
          {() =>
            authView === "login" ? (
              <LoginScreen onSwitch={() => setAuthView("signup")} />
            ) : (
              <SignupScreen onSwitch={() => setAuthView("login")} />
            )
          }
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

