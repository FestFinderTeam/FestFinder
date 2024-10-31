import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import Styles from "../globalStyles/styles";
import { router } from "expo-router";

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <View style={Styles.headerView}>
            <View style={styles.headerContent}>
                <Pressable onPress={()=> router.back()}>

                <FontAwesome name="arrow-left" size={20} color={"white"} style={styles.icon} />
                </Pressable>
                <Text style={Styles.headerTitle}>{title}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContent: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 40,  
    },
    icon: {
        marginRight: 10,  
    }
});

export default Header;
