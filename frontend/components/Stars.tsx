import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Pressable, View } from "react-native";

interface Props {
    value?: number;
    setValue?: (value: number) => void;
}
const Stars = ({value, setValue}:Props) => {
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: "3%",
                marginLeft: "3%",
            }}
        >
            {Array(5)
                .fill("")
                .map((_, index) => (
                    <Pressable
                        key={index}
                        onPress={() => {
                            setValue && setValue(index + 1);
                        }}
                        style={{ marginRight: 5 }}
                    >
                        <FontAwesome
                            name="star"
                            size={18}
                            color={value && index < value ? "orange" : "#D3D3D3"}
                        />
                    </Pressable>
                ))}
        </View>
    );
};

export default Stars;
