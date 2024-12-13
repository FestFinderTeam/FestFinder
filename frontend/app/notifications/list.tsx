import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

interface NotificationContent {
    autoDismiss: boolean;
    badge: number | null;
    body: string;
    data: {
        extraData: string;
        id_evento: number;
    };
    priority: string;
    sound: string | null;
    sticky: boolean;
    subtitle: string | null;
    title: string;
    timestamp: string;
}

const NotificationList: React.FC = () => {
    const [notifications, setNotifications] = useState<NotificationContent[]>(
        []
    );

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const storedNotifications = await AsyncStorage.getItem(
                    "notifications"
                );
                if (storedNotifications) {
                    const parsedNotifications: NotificationContent[] =
                        JSON.parse(storedNotifications);

                    // Ordenar por más recientes
                    const sortedNotifications = parsedNotifications.sort(
                        (a, b) =>
                            new Date(b.timestamp).getTime() -
                            new Date(a.timestamp).getTime()
                    );

                    setNotifications(sortedNotifications);
                }
            } catch (error) {
                console.error("Error al cargar las notificaciones:", error);
            }
        };

        fetchNotifications();
    }, []);

    const handlePressNotification = (id_evento: number) => {
        // Navegar a la pantalla correspondiente
        router.push(`/eventos/${id_evento}`);
    };

    const renderNotification = ({ item }: { item: NotificationContent }) => (
        <TouchableOpacity
            onPress={() => handlePressNotification(item.data.id_evento)}
        >
            <View style={styles.notificationCard}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.body}>{item.body}</Text>
                <Text style={styles.timestamp}>
                    Recibida: {new Date(item.timestamp).toLocaleString()}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Lista de Notificaciones</Text>
            {notifications.length > 0 ? (
                <FlatList
                    data={notifications}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={renderNotification}
                />
            ) : (
                <Text style={styles.noNotifications}>
                    No hay notificaciones guardadas
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f7f7f7",
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    notificationCard: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    body: {
        fontSize: 14,
        marginBottom: 5,
    },
    extraData: {
        fontSize: 12,
        color: "#555",
    },
    idEvento: {
        fontSize: 12,
        color: "#999",
    },
    timestamp: {
        fontSize: 12,
        color: "#999",
        marginTop: 5,
    },
    noNotifications: {
        textAlign: "center",
        fontSize: 16,
        color: "#aaa",
        marginTop: 20,
    },
});

export default NotificationList;
