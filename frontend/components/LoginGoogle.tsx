import {
    GoogleSignin,
    GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import React, { useEffect, useState } from "react";
import { Button, Image, Pressable, StyleSheet, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useSession } from "@/hooks/ctx";
import { router } from "expo-router";
import Styles from "../globalStyles/styles";
import LoadingScreen from "./Loading";

WebBrowser.maybeCompleteAuthSession();

const LoginGoogle = () => {
    const { signIn } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const signinGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();

            const user = await GoogleSignin.signIn();
            setIsLoading(true);

            // Loguearse con los datos de google para obtener los datos del backend
            // y si no se puede registrar esos datos

            const data = {
                nombre: user.data?.user.name,
                email: user.data?.user.email,
                password: "",
                g_id: user.data?.user.id,
                photo: user.data?.user.photo,
            };
            const photo = user.data?.user.photo;
            console.log(data+"  -  -  "+photo);

            /*
            const API_URL = process.env.EXPO_PUBLIC_API_URL;
            const response = await fetch(`http://192.168.100.3:8000//api/logear_usuario/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const { imagen, ...user } = await response.json();
                //console.log("usuario", user, "imagen", imagen);
                signIn({ ...user, imagen_url: imagen ? imagen : photo });
                router.replace("/");
            }*/
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        } 
    };

    if (isLoading) return <LoadingScreen text="Iniciando sesion" />;

    return (
        <>
            <Pressable style={Styles.buttonGoogle} onPress={signinGoogle}>
                <Image
                    source={require("../assets/images/googleIcon.png")}
                    style={Styles.tinylogo}
                />
                <Text style={Styles.buttonTextGoogle}>Iniciar con Google</Text>
            </Pressable>
        </>
    );
};

export default LoginGoogle;
