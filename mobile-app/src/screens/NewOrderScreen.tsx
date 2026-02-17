import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Send } from "lucide-react-native";
import axios from "axios";
import { API_BASE_URL } from "../constants/Config";
import { useAuth } from "../context/AuthContext";

export const NewOrderScreen = ({ navigation }: any) => {
    const { user } = useAuth();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        patientName: "",
        patientPhone: "",
        patientCity: "",
        homeAddress: "",
    });

    const handleSubmit = async () => {
        if (!formData.patientName || !formData.patientPhone) {
            Alert.alert("Error", "Please fill patient name and phone");
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/api/orders`, {
                ...formData,
                kamId: user?.id,
            });
            Alert.alert("Success", "Order placed successfully");
            navigation.goBack();
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    const Field = ({ label, value, onChangeText, placeholder, multiline }: any) => (
        <View className="mb-6">
            <Text className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                multiline={multiline}
                className={`bg-white dark:bg-zinc-900 p-4 rounded-2xl text-lg border border-zinc-100 dark:border-zinc-800 ${multiline ? 'h-32 pt-4' : ''}`}
            />
        </View>
    );

    return (
        <ScrollView className="flex-1 bg-zinc-50 dark:bg-black" contentContainerStyle={{ paddingTop: insets.top + 20 }}>
            <View className="px-6 flex-row items-center mb-8">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                    <ArrowLeft color="black" size={24} />
                </TouchableOpacity>
                <Text className="text-2xl font-bold ml-2">New Order</Text>
            </View>

            <View className="px-6">
                <Field label="Patient Name" value={formData.patientName} onChangeText={(t: string) => setFormData({ ...formData, patientName: t })} placeholder="Enter full name" />
                <Field label="Patient Phone" value={formData.patientPhone} onChangeText={(t: string) => setFormData({ ...formData, patientPhone: t })} placeholder="03xx-xxxxxxx" keyboardType="phone-pad" />
                <Field label="City" value={formData.patientCity} onChangeText={(t: string) => setFormData({ ...formData, patientCity: t })} placeholder="e.g. Karachi" />
                <Field label="Home Address" value={formData.homeAddress} onChangeText={(t: string) => setFormData({ ...formData, homeAddress: t })} placeholder="Complete address" multiline={true} />

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    className="mt-8 bg-pharmevo-dark p-5 rounded-3xl items-center flex-row justify-center gap-2 shadow-premium"
                    style={{ backgroundColor: '#075985' }}
                >
                    <Send color="white" size={20} />
                    <Text className="text-white text-lg font-bold">{loading ? "Sending..." : "Place Order"}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};
