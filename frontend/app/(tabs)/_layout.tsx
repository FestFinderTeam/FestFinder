import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import Styles from "../../globalStyles/styles";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";
import { Screen } from "react-native-screens";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#402158",
                tabBarStyle: Styles.tabBarStyle,
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="inicio"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="home" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="buscar"
                options={{
                    title: "buscar",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="search" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "perfil",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <FontAwesome
                            size={28}
                            name="user-circle-o"
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
