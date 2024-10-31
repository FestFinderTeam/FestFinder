import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import {
    Pressable,
    Text,
    View,
    type GestureResponderEvent,
    StyleSheet,
} from "react-native";

interface ItemProfileProps {
    onPress: (event: GestureResponderEvent) => void;
    text: string;
    color?: string;
    icon?: keyof typeof FontAwesome.glyphMap;
    textColor?: string;
}

const ItemProfile: React.FC<ItemProfileProps> = ({
    onPress,
    color = "#00000000",
    text,
    icon = "arrow-right",
    textColor = "#000000",
}) => {
    return (
        <Pressable onPress={onPress} style={styles.container}>
            <View style={styles.itemContent}>
                <FontAwesome size={20} name={icon} color={color} />
                <Text style={{ color: textColor, marginLeft: 15 }}>{text}</Text>
                <FontAwesome
                    name="angle-right"
                    size={20}
                    color="#402158"
                    style={styles.arrow}
                />
            </View>
            <View style={styles.separator} />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 5,
    },
    itemContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    arrow: {
        marginLeft: "auto",
        marginRight: 30,
    },
    separator: {
        height: 1,
        backgroundColor: "#D3D3D3",
        width: "95%",
        alignSelf: "center",
        marginVertical: 10,
        marginRight: 20,
    },
});

export default ItemProfile;
