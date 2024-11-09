import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { TextInput, View, StyleSheet, Pressable, Text } from "react-native";
import Styles from "../globalStyles/styles";
export type filterSearch = "todo" | "locales" | "eventos";
interface Props {
    setSearch: (value: string) => void;
    handleSearch: () => void;
    setFilter: (text: filterSearch) => void;
}

const Header = ({ setSearch, handleSearch, setFilter }: Props) => {
    return (
        <View>
            <View
                style={[
                    Styles.headerView,
                    { flexDirection: "row", alignItems: "center" },
                ]}
            >
                <View style={styles.headerContent}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar"
                        placeholderTextColor="#888"
                        onChangeText={setSearch}
                    />
                    <Pressable style={styles.icon} onPress={handleSearch}>
                        <FontAwesome name="search" size={20} color="#888" />
                    </Pressable>
                </View>
            </View>
            <View style={{ marginTop: "4%", paddingBottom: 10 }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 10,
                    }}
                >
                    <Pressable
                        onPress={() => {
                            setFilter("todo");
                        }}
                        style={styles.typeContainer}
                    >
                        <Text style={styles.types}>Todo</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            setFilter("eventos");
                        }}
                        style={styles.typeContainer}
                    >
                        <Text style={styles.types}>Eventos</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            setFilter("locales");
                        }}
                        style={styles.typeContainer}
                    >
                        <Text style={styles.types}>Locales</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContent: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 40,
        backgroundColor: "white",
        borderRadius: 10,
        paddingHorizontal: 10,
        width: "90%",
        alignSelf: "center",
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "black",
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    icon: {
        paddingLeft: 10,
    },
    typeContainer: {
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    types: {
        backgroundColor: "#402158",
        color: "white",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        textAlign: "center",
        width: 70,
    },
});

export default Header;
