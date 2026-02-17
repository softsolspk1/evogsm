import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Save } from "lucide-react-native";
import axios from "axios";
import { API_BASE_URL } from "../constants/Config";
import { useAuth } from "../context/AuthContext";

export const InstallationForm = ({ route, navigation }: any) => {
    const { order } = route.params;
    const { user } = useAuth();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        region: "",
        city: order.patientCity || "",
        area: "",
        referredBy: "",
        referralEmployeeCode: "",
        referralTeam: "",
        doctorName: "",
        doctorCode: "",
        distributorName: "",
        patientArea: "",
        sensorInstalledBy: user?.name || "",
        visitDate: new Date().toLocaleDateString(),
        visitTime: new Date().toLocaleTimeString(),
        numDevices: "1",
        patientEmail: "",
        patientWhatsApp: order.patientPhone || "",
        activationDate: "",
        comments: "",
        serialNumber: "",
        kamReminder: false,
    });

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/api/installations`, {
                ...formData,
                orderId: order.id,
                kamName: user?.name,
                kamEmployeeCode: (user as any)?.employeeCode || "KAM-001",
                patientName: order.patientName,
            });
            Alert.alert("Success", "Installation form submitted successfully");
            navigation.navigate("Home");
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "Failed to submit form");
        } finally {
            setLoading(false);
        }
    };

    const Field = ({ label, value, onChangeText, placeholder, keyboardType }: any) => (
        <View className="mb-6">
            <Text className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                keyboardType={keyboardType}
                className="bg-white dark:bg-zinc-900 p-4 rounded-2xl text-lg border border-zinc-100 dark:border-zinc-800"
            />
        </View>
    );

    return (
        <ScrollView className="flex-1 bg-zinc-50 dark:bg-black" contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 100 }}>
            <View className="px-6 flex-row items-center mb-8">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                    <ArrowLeft color="black" size={24} />
                </TouchableOpacity>
                <Text className="text-2xl font-bold ml-2">Installation Form</Text>
            </View>

            <View className="px-6">
                <View className="bg-pharmevo-blue/10 p-4 rounded-2xl mb-8">
                    <Text className="text-pharmevo-dark font-medium">Patient: {order.patientName}</Text>
                    <Text className="text-pharmevo-dark font-medium">Order ID: {order.id}</Text>
                </View>

                <Field label="Region" value={formData.region} onChangeText={(t: string) => setFormData({ ...formData, region: t })} />
                <Field label="City" value={formData.city} onChangeText={(t: string) => setFormData({ ...formData, city: t })} />
                <Field label="Area" value={formData.area} onChangeText={(t: string) => setFormData({ ...formData, area: t })} />

                <Text className="text-xl font-bold mt-4 mb-6 border-b border-zinc-200 pb-2">Referral Information</Text>
                <Field label="Referred By" value={formData.referredBy} onChangeText={(t: string) => setFormData({ ...formData, referredBy: t })} />
                <Field label="Referral Code" value={formData.referralEmployeeCode} onChangeText={(t: string) => setFormData({ ...formData, referralEmployeeCode: t })} />
                <Field label="Referral Team" value={formData.referralTeam} onChangeText={(t: string) => setFormData({ ...formData, referralTeam: t })} />

                <Text className="text-xl font-bold mt-4 mb-6 border-b border-zinc-200 pb-2">Doctor & Distributor</Text>
                <Field label="Doctor Name" value={formData.doctorName} onChangeText={(t: string) => setFormData({ ...formData, doctorName: t })} />
                <Field label="Doctor Code" value={formData.doctorCode} onChangeText={(t: string) => setFormData({ ...formData, doctorCode: t })} placeholder="000000 if not in list" />
                <Field label="Distributor" value={formData.distributorName} onChangeText={(t: string) => setFormData({ ...formData, distributorName: t })} />

                <Text className="text-xl font-bold mt-4 mb-6 border-b border-zinc-200 pb-2">Installation Details</Text>
                <Field label="Sensor Serial Number" value={formData.serialNumber} onChangeText={(t: string) => setFormData({ ...formData, serialNumber: t })} />
                <Field label="Number of Devices" value={formData.numDevices} onChangeText={(t: string) => setFormData({ ...formData, numDevices: t })} keyboardType="numeric" />
                <Field label="Activation Date" value={formData.activationDate} onChangeText={(t: string) => setFormData({ ...formData, activationDate: t })} placeholder="YYYY-MM-DD" />
                <Field label="Visit Date" value={formData.visitDate} onChangeText={(t: string) => setFormData({ ...formData, visitDate: t })} />

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    className="mt-8 bg-pharmevo-dark p-5 rounded-2xl items-center flex-row justify-center gap-2 shadow-lg"
                    style={{ backgroundColor: '#075985' }}
                >
                    <Save color="white" size={20} />
                    <Text className="text-white text-lg font-bold">{loading ? "Simulting..." : "Submit Form & Complete"}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};
