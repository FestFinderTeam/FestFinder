import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import LoginGoogle from "./LoginGoogle";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import Styles from "../globalStyles/styles";

const getLoginData = async () => {
    return await SecureStore.getItem("login");
};

const Login = () => {
    useEffect(() => { }, []);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async () => {
        if ([email, password].includes("")) {
            alert("Todos los campos son obligatorios")
            return;
        }
        // Send to the server
        const data = { email, password }
        const API_URL = process.env.EXPO_PUBLIC_API_URL

        try {

            const response = await fetch(`${API_URL}/logear_usuario`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const userData = await response.json();
                console.log('Usuario logeado:', userData);
                alert('Inicio de sesion exitoso');
            } else {
                alert('Error en el inicio de sesion');
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión');
        }
    }

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
            <TouchableOpacity
                style={Styles.button}
                onPress={handleSubmit}
            >
                <Text style={Styles.buttonText}>Iniciar Sesion</Text>
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
