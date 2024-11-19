import React from "react";
import { StyleSheet, Text } from "react-native";

const ErrorText = ({ error }: { error?: string }) => {
    return <Text style={styles.errorText2}>{error}</Text>;
};

const styles = StyleSheet.create({
    errorText2: {
        color: "red",
        fontSize: 12,
        textAlign: "center" as "center",
        marginBottom: 10,
    },
})
export default ErrorText;
