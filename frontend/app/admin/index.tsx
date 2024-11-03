import Notch from "@/components/Notch";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const admin = () => {
    return (
        <>
            <Notch />
            <View>
                <Text>Administrar mi local</Text>

                <Pressable
                    onPress={() => {
                        router.push("/admin/myplace");
                    }}
                >
                    <Image source={require('../../assets/images/adminLocal.png')} />
                    <Text>Informacion del local</Text>
                </Pressable>
                <Pressable
                    onPress={() => {
                        router.push("/admin/eventos");
                    }}
                >
                    <Image source={require('../../assets/images/adminEventos.png')} />
                    <Text>Administrar eventos</Text>
                </Pressable>
            </View>
        </>
    );
};

export default admin;
