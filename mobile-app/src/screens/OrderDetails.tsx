import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Phone, MapPin, User, Calendar } from "lucide-react-native";
import axios from "axios";
import { API_BASE_URL } from "../constants/Config";

export const OrderDetails = ({ route, navigation }: any) => {
    const { orderId } = route.params;
    const insets = useSafeAreaInsets();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrder() {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/orders/${orderId}`);
                setOrder(res.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchOrder();
    }, [orderId]);

    if (loading) return <View className="flex-1 justify-center items-center"><ActivityIndicator /></View>;
    if (!order) return <View className="flex-1 justify-center items-center"><Text>Order not found</Text></View>;

    return (
        <ScrollView className="flex-1 bg-zinc-50 dark:bg-black" contentContainerStyle={{ paddingTop: insets.top + 20 }}>
            <View className="px-6 flex-row items-center mb-8">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                    <ArrowLeft color="black" size={24} />
                </TouchableOpacity>
                <Text className="text-2xl font-bold ml-2">Order Details</Text>
            </View>

            <View className="px-6 mb-8">
                <View className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] shadow-sm">
                    <View className="items-center mb-6">
                        <View className="w-20 h-20 rounded-full bg-pharmevo-blue/10 items-center justify-center mb-4">
                            <User size={40} color="#075985" />
                        </View>
                        <Text className="text-2xl font-bold text-center">{order.patientName}</Text>
                        <View className={`mt-2 px-4 py-1 rounded-full ${order.status === 'COMPLETED' ? 'bg-green-100' : 'bg-orange-100'}`}>
                            <Text className={`font-bold ${order.status === 'COMPLETED' ? 'text-green-600' : 'text-orange-600'}`}>{order.status}</Text>
                        </View>
                    </View>

                    <View className="space-y-6">
                        <View className="flex-row items-start gap-4">
                            <Phone size={20} color="#999" />
                            <View>
                                <Text className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Phone Number</Text>
                                <Text className="text-lg font-medium">{order.patientPhone}</Text>
                            </View>
                        </View>

                        <View className="flex-row items-start gap-4">
                            <MapPin size={20} color="#999" />
                            <View>
                                <Text className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Address</Text>
                                <Text className="text-lg font-medium">{order.patientCity}</Text>
                                <Text className="text-zinc-500 mt-1">{order.homeAddress}</Text>
                            </View>
                        </View>

                        <View className="flex-row items-start gap-4">
                            <Calendar size={20} color="#999" />
                            <View>
                                <Text className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Created On</Text>
                                <Text className="text-lg font-medium">{new Date(order.createdAt).toLocaleString()}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {order.status === 'CONFIRMED' && (
                    <TouchableOpacity
                        onPress={() => navigation.navigate("InstallationForm", { order })}
                        className="mt-8 bg-pharmevo-dark p-5 rounded-2xl items-center shadow-lg"
                    >
                        <Text className="text-white text-lg font-bold">Open Installation Form</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
};
