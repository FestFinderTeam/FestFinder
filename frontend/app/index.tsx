import { View, Image } from "react-native";
import { useSession } from "@/hooks/ctx";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Text, Button } from "react-native-paper";
import { registerForPushNotificationsAsync } from "@/notifications";
import * as Notifications from "expo-notifications";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Index = () => {
    const { session } = useSession();
    useEffect(() => {
        if (session?.id_usuario) {
            const setupNotifications = async () => {
                const token = await registerForPushNotificationsAsync();
                if (token) {
                    console.log("Token registrado:", token);
                    const userId = session.id_usuario;

                    console.log("Enviando token al backend...", userId, token);

                    fetch(
                        "https://fest-finder.vercel.app/api/actualizar_token/",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                expo_push_token: token,
                                user_id: userId,
                            }),
                        }
                    )
                        .then((response) => response.json())
                        .then((data) => {
                            console.log("Respuesta del backend:", data);
                        })
                        .catch((error) => {
                            console.error("Error al enviar el token:", error);
                        });
                }
            };

            setupNotifications();
        }
    }, [session]);




    // Define el tipo de datos que manejarán las notificaciones
    interface NotificationData {
      [key: string]: any; // Puedes especificar mejor los campos según lo que contenga `data`
    }
    
    const addNotificationToStorage = async (notification: Notifications.Notification): Promise<void> => {
      try {
        // Obtener notificaciones existentes
        const storedNotifications = await AsyncStorage.getItem('notifications');
        const existingNotifications: NotificationData[] = storedNotifications ? JSON.parse(storedNotifications) : [];
    
        // Agregar la nueva notificación
        const newNotification = {
            ...notification.request.content,
            timestamp: new Date().toISOString(),
          };
        existingNotifications.push(newNotification);
    
        // Guardar de nuevo en AsyncStorage
        await AsyncStorage.setItem('notifications', JSON.stringify(existingNotifications));
    
        console.log("Notificación agregada al AsyncStorage:", newNotification);
      } catch (error) {
        console.error("Error guardando notificación en AsyncStorage:", error);
      }
    };

    useEffect(() => {
        // Listeners para manejar las notificaciones
        Notifications.addNotificationReceivedListener((notification) => {
            console.log("Notificación recibida:", notification);
            console.log("Agregando notificación al localStorage");
            // Agregar la notificación
            addNotificationToStorage(notification);
        });

        const handleNotificationResponse = (
            response: Notifications.NotificationResponse
        ) => {
            console.log("Respuesta a notificación:", response);
            const notification = response.notification;
            const eventId = notification.request.content.data.id_evento;
            if (eventId) {
                router.replace(`/eventos/${eventId}`);
            } else {
                console.log("Redirigiendo a inicio...");
                router.replace("/");
            }
        };

        Notifications.addNotificationResponseReceivedListener(
            handleNotificationResponse
        );
    }, []);
    useEffect(() => {
        if (session) {
            router.replace("/inicio");
        }
    }, [session]);

    return (
        <View
            style={{
                flex: 1,
                padding: 20,
                alignContent: "center",
                justifyContent: "center",
            }}
        >
            <View style={{ alignItems: "center" }}>
                <Image
                    source={require("../assets/images/festLogoHD.png")}
                    style={{ aspectRatio: 1, width: "100%", height: "auto" }}
                    resizeMode="contain"
                />
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                    Bienvenido a Fest Finder
                </Text>
            </View>

            <Button
                mode="contained"
                onPress={() => router.navigate("/login")}
                style={{ marginTop: 15 }}
            >
                Iniciar sesión
            </Button>
            <Button
                mode="contained"
                onPress={() => router.navigate("/register")}
                style={{ marginTop: 15 }}
            >
                Registrarse
            </Button>
        </View>
    );
};

export default Index;
