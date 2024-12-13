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
import { FontAwesome } from "@expo/vector-icons"; // Para el ícono de papelera

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

    const clearNotifications = async () => {
        try {
            // Borrar todas las notificaciones del AsyncStorage
            await AsyncStorage.removeItem("notifications");
            setNotifications([]); // Limpiar el estado
            console.log("Todas las notificaciones han sido borradas");
        } catch (error) {
            console.error("Error al borrar las notificaciones:", error);
        }
    };

    const deleteNotification = async (timestamp: string) => {
        try {
            // Filtrar la notificación a eliminar
            const updatedNotifications = notifications.filter(
                (notification) => notification.timestamp !== timestamp
            );

            // Guardar las notificaciones actualizadas
            await AsyncStorage.setItem(
                "notifications",
                JSON.stringify(updatedNotifications)
            );
            setNotifications(updatedNotifications); // Actualizar el estado
            console.log("Notificación eliminada");
        } catch (error) {
            console.error("Error al eliminar la notificación:", error);
        }
    };

    const renderNotification = ({ item }: { item: NotificationContent }) => (
        <View style={styles.notificationCard}>
            <TouchableOpacity
                onPress={() => handlePressNotification(item.data.id_evento)}
            >
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.body}>{item.body}</Text>
                <Text style={styles.timestamp}>
                    Recibida: {new Date(item.timestamp).toLocaleString()}
                </Text>
            </TouchableOpacity>

            {/* Icono de papelera para eliminar la notificación */}
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteNotification(item.timestamp)}
            >
                <FontAwesome name="trash" size={18} color="red" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Lista de Notificaciones</Text>
                <TouchableOpacity onPress={clearNotifications}>
                    <FontAwesome name="trash" size={24} color="red" />
                </TouchableOpacity>
            </View>
            {notifications.length > 0 ? (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.timestamp} // Usar timestamp como key
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
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
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
        position: "relative", // Necesario para posicionar el ícono de la papelera
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
    deleteButton: {
        position: "absolute",
        top: 10,
        right: 10,
        padding: 5,
    },
});

export default NotificationList;
