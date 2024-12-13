import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import LoginGoogle from "./LoginGoogle";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import Styles from "../globalStyles/styles";
import React from "react";
import { useSession } from "@/hooks/ctx";
import { API_URL } from "@/constants/Url";
import LoadingScreen from "./Loading";
import { FA5Style } from "@expo/vector-icons/build/FontAwesome5";

const getLoginData = async () => {
    return await SecureStore.getItem("login");
};

const Login = () => {
    const { signIn } = useSession();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    const validateForm = () => {
        let updatedErrors: any = {};

        if (!email || !emailRegex.test(email)) {
            updatedErrors.email = "El correo electrónico no es válido";
        }

        if (!password || !passwordRegex.test(password)) {
            updatedErrors.password =
                "La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número";
        }

        setErrors(updatedErrors);
        return Object.keys(updatedErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            alert(
                "Por favor corrige los errores antes de enviar el formulario."
            );
            return;
        }

        // Send to the server
        const data = { email, password, g_id: "" };

        try {
            setLoading(true);
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
                    establecimiento,
                } = data;

                let imagen_url = "";
                const fullImageUrl = `${API_URL}${imagen}`; // URL completa de la imagen
                imagen_url = fullImageUrl; // Guarda la URI de la imagen
                signIn({
                    id_usuario,
                    imagen_url,
                    nombre,
                    email,
                    telefono,
                    establecimiento,
                });
            } else {
                alert("Correo o contraseña incorrecto");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        }finally {
            setLoading(false)
        }
    };

    if (loading) return <LoadingScreen text="Iniciando Sesion" />;

    return (
        <>
            <TextInput
                placeholder="Email"
                keyboardType="email-address"
                placeholderTextColor="#402158"
                style={Styles.input}
                onChangeText={setEmail}
            />
            {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <TextInput
                placeholder="Contraseña"
                secureTextEntry={true}
                placeholderTextColor="#402158"
                style={Styles.input}
                onChangeText={setPassword}
            />
            {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
            )}

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
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 5,
    },
};

export default Login;
