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

WebBrowser.maybeCompleteAuthSession();

const LoginGoogle = () => {
    const { signIn } = useSession();

    const signinGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const user = await GoogleSignin.signIn();

            // Loguearse con los datos de google para obtener los datos del backend
            // y si no se puede registrar esos datos

            /*
            const data = {
                name: user.data?.user.name,
                email: user.data?.user.email,
                password: user.data?.user.id,
            };

            const API_URL = process.env.EXPO_PUBLIC_API_URL;
            const response = await fetch(`${API_URL}/logear_usuario`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if(!response.ok){     
                await fetch(API_URL + "/registrar_usuario", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
            }
            */

            if (user.data) {
                const { email, name, id, photo } = user.data.user;
                signIn({
                    email,
                    imagen_url: photo,
                    telefono: "",
                    id_usuario: id,
                    nombre: name,
                });
                router.replace("/");
            }
        } catch (e) {
            console.error(e);
        }
    };

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
