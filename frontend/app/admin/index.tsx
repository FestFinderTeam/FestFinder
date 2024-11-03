import Notch from "@/components/Notch";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View, StyleSheet } from "react-native";
import Styles from "@/globalStyles/styles";
import Header from "@/components/Header";
const admin = () => {
    return (
        <>
            <Header title={"Administrar mi Local"} />
            <Text style={[Styles.title, { color: "black", fontSize: 22, marginTop:"2%", marginLeft:"2%", marginBottom:"-10%"}]} >Selecciona una opcion</Text>
            <View style={styles.container}>
                <Pressable
                    onPress={() => {
                        router.push("/admin/myplace");
                    }}
                    style={styles.button}
                >
                    <Image source={require('../../assets/images/adminLocal.png')} style={styles.image} />
                    <Text style={styles.text}>Informacion del local</Text>
                </Pressable>
                <Pressable
                    onPress={() => {
                        router.push("/admin/eventos");
                    }}
                    style={styles.button}
                >
                    <Image source={require('../../assets/images/adminEventos.png')} style={styles.image} />
                    <Text style={styles.text}>Administrar eventos</Text>
                </Pressable>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: "center",
        flex:1,
    },
    button: {
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 10,
        width: "60%",
        height: 200,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: "80%",
        height: "60%",
        resizeMode: 'contain',
    },
    text: {
        alignSelf: "center",
        marginTop: 5,
    }
});

export default admin;
