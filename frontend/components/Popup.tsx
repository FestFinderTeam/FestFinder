import type { PropsWithChildren } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type Props = PropsWithChildren<{
    isVisible: boolean;
    onClose: () => void;
    title?: string;
}>;

const Popup = ({ children, isVisible, onClose, title }: Props) => {
    return (
        <Modal animationType="slide" transparent={true} visible={isVisible}>
            <View
                style={{
                    height: "50%",
                    width: "100%",
                    backgroundColor: "white",
                    borderTopRightRadius: 18,
                    borderTopLeftRadius: 18,
                    position: "absolute",
                    bottom: 0,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingHorizontal: 20,
                        paddingTop: 15
                    }}
                >
                    <Text>{title}</Text>
                    <Pressable onPress={onClose}>
                        <MaterialIcons name="close" color="#000000" size={22} />
                    </Pressable>
                </View>
                {children}
            </View>
        </Modal>
    );
};

export default Popup;
