import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Truck, Package, CheckCircle2, LogOut } from "lucide-react-native";
import axios from "axios";
import { API_BASE_URL } from "../constants/Config";

export const DistributorDashboard = ({ navigation }: any) => {
    const { user, logout } = useAuth();
    const insets = useSafeAreaInsets();
    const [orders, setOrders] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/orders?distributorId=${user?.id}`);
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
                    <Text className="text-[34px] font-bold text-black dark:text-white tracking-tight">Distributor</Text>
                    <Text className="text-zinc-500 text-[17px] font-medium mt-1">Manage delivery requests</Text>
                </View>
                <TouchableOpacity
                    onPress={logout}
                    className="p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800"
                >
                    <LogOut color="#ef4444" size={24} />
                </TouchableOpacity>
            </View>

            <View className="px-6 flex-row gap-4 mb-8">
                <View className="flex-1 bg-white dark:bg-zinc-900 p-6 rounded-[28px] items-center justify-center shadow-sm">
                    <Text className="text-[32px] font-bold text-pharmevo-blue">{orders.filter(o => o.status === 'PENDING').length}</Text>
                    <Text className="text-zinc-500 font-medium text-center">New Requests</Text>
                </View>
                <View className="flex-1 bg-white dark:bg-zinc-900 p-6 rounded-[28px] items-center justify-center shadow-sm">
                    <Text className="text-[32px] font-bold text-green-500">{orders.filter(o => o.status === 'COMPLETED').length}</Text>
                    <Text className="text-zinc-500 font-medium text-center">Delivered</Text>
                </View>
            </View>

            <View className="px-6">
                <Text className="text-xl font-bold mb-4">Service Requests</Text>
                {orders.map((order) => (
                    <View
                        key={order.id}
                        className="bg-white dark:bg-zinc-900 p-5 rounded-[24px] mb-4 shadow-sm border border-zinc-100 dark:border-zinc-800"
                    >
                        <View className="flex-row justify-between items-start mb-2">
                            <View className="flex-1">
                                <Text className="text-lg font-bold">{order.patientName}</Text>
                                <Text className="text-zinc-500">{order.patientCity}</Text>
                            </View>
                            <View className={`px-3 py-1 rounded-full ${order.status === 'PENDING' ? 'bg-orange-100' : 'bg-green-100'}`}>
                                <Text className={`text-xs font-bold ${order.status === 'PENDING' ? 'text-orange-600' : 'text-green-600'}`}>{order.status}</Text>
                            </View>
                        </View>

                        <View className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex-row justify-between items-center">
                            <View>
                                <Text className="text-zinc-400 text-xs uppercase font-bold pr-2">Assigned KAM</Text>
                                <Text className="font-medium">{order.kam?.name || 'Pharmevo Office'}</Text>
                            </View>
                            {order.status === 'PENDING' && (
                                <TouchableOpacity className="bg-pharmevo-dark px-4 py-2 rounded-xl" style={{ backgroundColor: '#075985' }}>
                                    <Text className="text-white font-bold">Confirm Stock</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                ))}
                {orders.length === 0 && (
                    <View className="items-center py-20">
                        <Truck color="#ccc" size={48} />
                        <Text className="text-zinc-400 mt-4 font-medium">No requests found.</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};
