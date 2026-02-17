import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plus, Package, Clock, CheckCircle, LogOut } from "lucide-react-native";
import axios from "axios";
import { API_BASE_URL } from "../constants/Config";

export const KAMDashboard = ({ navigation }: any) => {
    const { user, logout } = useAuth();
    const insets = useSafeAreaInsets();
    const [orders, setOrders] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/orders?kamId=${user?.id}`);
            setOrders(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchOrders().then(() => setRefreshing(false));
    }, []);

    return (
        <ScrollView
            className="flex-1 bg-zinc-50 dark:bg-black"
            contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 100 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View className="px-6 mb-8 flex-row justify-between items-start">
                <View className="flex-1">
                    <Text className="text-[34px] font-bold text-black dark:text-white tracking-tight">KAM Portal</Text>
                    <Text className="text-zinc-500 text-[17px] font-medium mt-1">Manage your patient orders</Text>
                </View>
                <TouchableOpacity
                    onPress={logout}
                    className="p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800"
                >
                    <LogOut color="#ef4444" size={24} />
                </TouchableOpacity>
            </View>

            <View className="flex-row px-6 gap-4 mb-8">
                <TouchableOpacity
                    onPress={() => navigation.navigate("NewOrder")}
                    className="flex-1 bg-pharmevo-dark p-6 rounded-[28px] items-center justify-center shadow-lg"
                    style={{ backgroundColor: '#075985' }}
                >
                    <Plus color="white" size={32} />
                    <Text className="text-white font-bold mt-2 text-center">New Order</Text>
                </TouchableOpacity>

                <View className="flex-1 bg-white dark:bg-zinc-900 p-6 rounded-[28px] items-center justify-center shadow-sm">
                    <Text className="text-[32px] font-bold text-pharmevo-blue">{orders.length}</Text>
                    <Text className="text-zinc-500 font-medium text-center">Total Orders</Text>
                </View>
            </View>

            <View className="px-6">
                <Text className="text-xl font-bold mb-4">Assigned Orders</Text>
                {orders.map((order) => (
                    <TouchableOpacity
                        key={order.id}
                        onPress={() => navigation.navigate("OrderDetails", { orderId: order.id })}
                        className="bg-white dark:bg-zinc-900 p-5 rounded-[24px] mb-4 shadow-sm border border-zinc-100 dark:border-zinc-800"
                    >
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-lg font-bold">{order.patientName}</Text>
                            <View className={`px-3 py-1 rounded-full ${order.status === 'COMPLETED' ? 'bg-green-100' : 'bg-orange-100'}`}>
                                <Text className={`text-xs font-bold ${order.status === 'COMPLETED' ? 'text-green-600' : 'text-orange-600'}`}>{order.status}</Text>
                            </View>
                        </View>
                        <Text className="text-zinc-500 mb-1">{order.patientCity} • {order.patientPhone}</Text>
                        <Text className="text-zinc-400 text-xs">Created: {new Date(order.createdAt).toLocaleDateString()}</Text>

                        {order.status === 'CONFIRMED' && (
                            <TouchableOpacity
                                onPress={() => navigation.navigate("InstallationForm", { order })}
                                className="mt-4 bg-pharmevo-blue/10 p-3 rounded-xl items-center"
                            >
                                <Text className="text-pharmevo-dark font-bold">Complete Installation</Text>
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>
                ))}
                {orders.length === 0 && (
                    <View className="items-center py-20">
                        <Package color="#ccc" size={48} />
                        <Text className="text-zinc-400 mt-4 font-medium">No orders assigned yet.</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};
