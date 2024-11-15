import { View, Image } from "react-native";
import { useSession } from "@/hooks/ctx";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Text, Button } from "react-native-paper";

const Index = () => {
	const { session } = useSession();

	useEffect(() => {
		if (session) {
			router.replace("/inicio");
		}
	}, [session]);

	return (
		<View
			style={{
				flex: 1,
				padding: 20,
				alignContent: "center",
				justifyContent: "center",
			}}
		>
			<View style={{ alignItems: "center" }}>
				<Image
					source={require("../assets/images/festLogoHD.png")}
					style={{ aspectRatio: 1, width: "100%", height: "auto" }}
					resizeMode="contain"
				/>
				<Text style={{ fontSize: 24, fontWeight: "bold" }}>
					Bienvenido a Fest Finder
				</Text>
			</View>

			<Button
				mode="contained"
				onPress={() => router.navigate("/login")}
				style={{ marginTop: 15 }}
			>
				Iniciar sesión
			</Button>
			<Button
				mode="contained"
				onPress={() => router.navigate("/register")}
				style={{ marginTop: 15 }}
			>
				Registrarse
			</Button>
		</View>
	);
};

export default Index;
