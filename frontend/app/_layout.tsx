import { SessionProvider } from "@/hooks/ctx";
import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const HomeLayout = () => {
    return (
        <SessionProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="index" />
                <Stack.Screen name="login" />
                <Stack.Screen name="register" />
            </Stack>
        </SessionProvider>
    );
};

export default HomeLayout;
