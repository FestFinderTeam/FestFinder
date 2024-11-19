import React from "react";
import { View, Text, ActivityIndicator, StyleSheet, Modal } from "react-native";
interface Props {
    text?: string;
}

const LoadingScreen = ({ text }: Props) => {
    return (
        <Modal visible={true}>
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#6200EE" />
                <Text style={styles.text}>{text || "Cargando"}</Text>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
    text: {
        marginTop: 20,
        fontSize: 18,
        color: "#402158",
    },
});

export default LoadingScreen;
