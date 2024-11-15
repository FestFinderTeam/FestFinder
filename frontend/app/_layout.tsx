import { SessionProvider } from "@/hooks/ctx";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { SafeAreaView, StyleSheet, StatusBar } from "react-native";
import theme from "@/constants/theme";
import store from "@/store";
import { Provider } from "react-redux";

const HomeLayout = () => {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <SessionProvider>
          <SafeAreaView style={styles.container}>
            <StatusBar
              backgroundColor={theme.colors.primary}
              
            />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="register" />
            </Stack>
          </SafeAreaView>
        </SessionProvider>
      </PaperProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
//    paddingTop: StatusBar.currentHeight,
  },
});

export default HomeLayout;
