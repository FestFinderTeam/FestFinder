import { View, Image } from "react-native";
import { useSession } from "@/hooks/ctx";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Text, Button } from "react-native-paper";
import { registerForPushNotificationsAsync } from "@/notifications";
import * as Notifications from "expo-notifications";

const Index = () => {
    const { session } = useSession();
    useEffect(() => {
        if (session?.id_usuario) {
            const setupNotifications = async () => {
                const token = await registerForPushNotificationsAsync();
                if (token) {
                    console.log("Token registrado:", token);
                    // Obtener el user_id de la sesión
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

            // Listeners para manejar las notificaciones
            const notificationListener =
                Notifications.addNotificationReceivedListener(
                    (notification) => {
                        console.log("Notificación recibida:", notification);
                    }
                );

            const responseListener =
                Notifications.addNotificationResponseReceivedListener(
                    (response) => {
                        console.log("Respuesta a notificación:", response);
                    }
                );

            // Limpiar los listeners al desmontar el componente
            return () => {
                notificationListener.remove();
                responseListener.remove();
            };
        }
    }, [session]);
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
