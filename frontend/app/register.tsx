import { Text, TextInput, TouchableOpacity, View, Image, Pressable } from "react-native";
import Styles from "../globalStyles/styles";
import { Link } from "@react-navigation/native";
import { useState } from "react";
import LoginGoogle from "@/components/LoginGoogle";
import { API_URL } from "@/constants/Url";
import { FontAwesome } from '@expo/vector-icons';
const Register = () => {
    const [nombre, setName] = useState("");
    const [email, setEmail] = useState("");
    const [p_field, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [telefono, setTelephone] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const handleSubmit = async () => {
        if ([nombre, email, p_field, confirmPassword, telefono].includes("")) {
            alert("Todos los campos son obligatorios");
            return null;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(p_field)) {
            alert("La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula y un número.");
            return null;
        }

        if (p_field !== confirmPassword) {
            alert("La confirmación de la contraseña no coincide.");
            return null;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("El email debe tener un formato válido: local@dominio.");
            return;
        }
        if (!/^\d{8}$/.test(telefono)) {
            alert("El teléfono debe tener solo números y 8 dígitos.");
            return;
        }
        const data = { nombre, email, telefono, p_field, imagen: 1 };

        try {
            const response = await fetch(API_URL + "/api/usuario/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const userData = await response.json();
                console.log("Usuario registrado:", userData);
                alert("Usuario registrado");
            } else {
                alert("Error al registrar");
            }
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <View style={Styles.container}>
            <Image
                source={require("../assets/images/festLogo.png")}
                style={Styles.festLogo}
            />
            <TextInput
                placeholder="Nombre"
                placeholderTextColor="#402158"
                style={Styles.input}
                onChangeText={(e: string) => setName(e)}
            />
            <TextInput
                placeholder="Email"
                keyboardType="email-address"
                placeholderTextColor="#402158"
                style={Styles.input}
                onChangeText={setEmail}
                onEndEditing={() => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                        alert("El email debe tener un formato válido: local@dominio.");
                    }
                }}
            />
            <TextInput
                placeholder="Teléfono"
                keyboardType="phone-pad"
                placeholderTextColor="#402158"
                style={Styles.input}
                onChangeText={setTelephone}
                onEndEditing={() => {
                    if (!/^\d{8}$/.test(telefono)) {
                        alert("El teléfono debe tener solo números y 8 dígitos.");
                    }
                }}
            />
            <View style={{ width: '80%', position: 'relative' }}>
                <TextInput
                    placeholder="Contraseña"
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#402158"
                    style={[Styles.input, { paddingRight: 40, width: '100%' }]}
                    onChangeText={(e: string) => setPassword(e)}
                />
                <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={{
                        position: 'absolute',
                        right: 10,
                        top: '40%',
                        transform: [{ translateY: -10 }],
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <FontAwesome
                        name={showPassword ? "eye" : "eye-slash"}
                        size={20}
                        color="#402158"
                    />
                </Pressable>
            </View>

            <View style={{ width: '80%', position: 'relative' }}>
                <TextInput
                    placeholder="Confirmación de contraseña"
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#402158"
                    style={[Styles.input, { paddingRight: 40, width: '100%' }]}
                    onChangeText={(e: string) => setConfirmPassword(e)}
                />
                <Pressable
                    onPress={() => setShowPassword2(!showPassword2)}
                    style={{
                        position: 'absolute',
                        right: 10,
                        top: '40%',
                        transform: [{ translateY: -10 }],
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <FontAwesome
                        name={showPassword ? "eye" : "eye-slash"}
                        size={20}
                        color="#402158"
                    />
                </Pressable>
            </View>
            <TouchableOpacity style={Styles.button} onPress={handleSubmit}>
                <Text style={Styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>
            <View style={styles.lineContainer}>
                <View style={styles.line} />
                <Text style={styles.lineText}>Registrarse usando</Text>
                <View style={styles.line} />
            </View>
            <LoginGoogle />

            <View style={Styles.linkContainer}>
                <Text>Ya tienes una cuenta? </Text>
                <Link to="/login" style={Styles.textDecoration2}>
                    Iniciar sesion
                </Link>
            </View>
        </View>
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

export default Register;
