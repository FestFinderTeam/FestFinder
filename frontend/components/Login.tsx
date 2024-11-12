import {
    Button,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
} from "react-native";
import LoginGoogle from "./LoginGoogle";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import Styles from "../globalStyles/styles";
import React from "react";
import { useSession } from "@/hooks/ctx";
import { API_URL } from "@/constants/Url";

const getLoginData = async () => {
    return await SecureStore.getItem("login");
};

const Login = () => {
    const { signIn } = useSession();
    useEffect(() => {}, []);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async () => {
        if ([email, password].includes("")) {
            alert("Todos los campos son obligatorios");
            return;
        }
        // Send to the server
        const data = { email, password, g_id: "" };

        try {
            const response = await fetch(`${API_URL}/api/logear_usuario/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const data = await response.json();
                const {
                    email,
                    g_id,
                    id_usuario,
                    imagen,
                    nombre,
                    telefono,
                    duenio,
                    establecimiento,
                } = data;

                //setUserData(userData);  // Guarda los datos del usuario
                let imagen_url = "";
                // Obtener la imagen del usuario
                const imageResponse = await fetch(
                    `${API_URL}/api/imagen/${imagen}/`
                );
                if (imageResponse.ok) {
                    const imageData = await imageResponse.json();
                    const fullImageUrl = `${API_URL}${imageData.imagen}`; // URL completa de la imagen
                    imagen_url = fullImageUrl; // Guarda la URI de la imagen
                }
                signIn({
                    id_usuario,
                    imagen_url,
                    nombre,
                    email,
                    telefono,
                    duenio,
                    establecimiento,
                });
            } else {
                alert("Error en el inicio de sesión");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        }
    };

    return (
        <>
            <TextInput
                placeholder="Email"
                keyboardType="email-address"
                placeholderTextColor="#402158"
                style={Styles.input}
                onChangeText={setEmail}
            />
            <TextInput
                placeholder="Contraseña"
                secureTextEntry={true}
                placeholderTextColor="#402158"
                style={Styles.input}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={Styles.button} onPress={handleSubmit}>
                <Text style={Styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>

            <View style={styles.lineContainer}>
                <View style={styles.line} />
                <Text style={styles.lineText}>Inicia sesión usando</Text>
                <View style={styles.line} />
            </View>
            <LoginGoogle />
        </>
    );
};

const styles = {
    lineContainer: {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        marginVertical: 10,
        paddingHorizontal: 20,
        marginTop: 20,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#402158",
    },
    lineText: {
        marginHorizontal: 10,
        color: "#402158",
        fontWeight: "500" as const,
    },
};

export default Login;
