import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useColorScheme } from "nativewind";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Compass, Settings as SettingsIcon } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-white dark:bg-black px-6"
      style={{ paddingTop: insets.top + 20 }}
    >
      <View className="mb-10">
        <Text className="text-[34px] font-bold text-black dark:text-white tracking-tight">
          Home
        </Text>
        <Text className="text-zinc-500 dark:text-zinc-400 text-[17px] font-medium mt-1">
          Welcome back, {user?.name || user?.email?.split("@")[0]}.
        </Text>
      </View>

      <View className="bg-zinc-100 dark:bg-zinc-900 p-8 rounded-[28px]">
        <View className="w-14 h-14 bg-white dark:bg-black rounded-2xl items-center justify-center mb-6 shadow-sm">
          <Home size={28} color="#999" />
        </View>

        <Text className="text-zinc-500 dark:text-zinc-400 text-[15px] leading-relaxed mb-10 font-medium">
          You are successfully authenticated. Explore your dashboard or manage
          your account settings below.
        </Text>

        <Button title="Sign Out" variant="secondary" onPress={logout} />
      </View>
    </View>
  );
};

const ExploreScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-1 bg-white dark:bg-black px-6"
      style={{ paddingTop: insets.top + 20 }}
    >
      <Text className="text-[34px] font-bold text-black dark:text-white tracking-tight mb-8">
        Explore
      </Text>
      <View className="bg-zinc-100 dark:bg-zinc-900 p-10 rounded-[28px] items-center">
        <Compass size={40} color="#999" />
        <Text className="text-zinc-400 dark:text-zinc-500 text-[15px] mt-6 font-medium text-center">
          New features are on the way. Check back soon for updates.
        </Text>
      </View>
    </View>
  );
};

const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-1 bg-white dark:bg-black px-6"
      style={{ paddingTop: insets.top + 20 }}
    >
      <Text className="text-[34px] font-bold text-black dark:text-white tracking-tight mb-8">
        Settings
      </Text>

      <View className="bg-zinc-100 dark:bg-zinc-900 rounded-[24px] overflow-hidden">
        {["Account Info", "Privacy", "Notifications", "Appearance"].map(
          (item, index, arr) => (
            <TouchableOpacity
              key={item}
              className={`flex-row items-center justify-between p-4 px-5 ${
                index !== arr.length - 1
                  ? "border-b border-zinc-200 dark:border-zinc-800"
                  : ""
              }`}
              activeOpacity={0.6}
            >
              <Text className="text-black dark:text-white text-[17px] font-medium">
                {item}
              </Text>
              <Text className="text-zinc-300 dark:text-zinc-600 text-[20px]">
                ›
              </Text>
            </TouchableOpacity>
          ),
        )}
      </View>
    </View>
  );
};

export const TabNavigator = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#000" : "#fff",
          borderTopWidth: 0.5,
          borderTopColor: isDark ? "#333" : "#ddd",
          height: 85,
          paddingTop: 10,
        },
        tabBarActiveTintColor: isDark ? "#fff" : "#000",
        tabBarInactiveTintColor: isDark ? "#666" : "#999",
        tabBarLabelStyle: {
          fontWeight: "600",
          fontSize: 11,
          marginTop: -5,
          marginBottom: 5,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ color }) => <Compass size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => <SettingsIcon size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
