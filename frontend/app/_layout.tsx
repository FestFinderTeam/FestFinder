import { SessionProvider } from "@/hooks/ctx";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import theme from "@/constants/theme";

const HomeLayout = () => {
  return (
    <PaperProvider theme={theme}>
      <SessionProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
        </Stack>
      </SessionProvider>
    </PaperProvider>
  );
};

export default HomeLayout;
