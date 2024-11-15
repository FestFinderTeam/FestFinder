import Login from "@/components/Login";
import React from "react";
import { Text, View, Image } from "react-native";
import Styles from "../globalStyles/styles";
import { Link } from "@react-navigation/native";
import { Snackbar } from "react-native-paper";
import { useState } from "react";

const login = () => {
	const [visibleSnackbar, setVisibleSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	return (
		<View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
			<Image
				source={require("../assets/images/festLogo.png")}
				style={{ alignSelf: "center", marginVertical: 20 }}
			/>
			<Login
				setSnackbarMessage={setSnackbarMessage}
				setVisibleSnackbar={setVisibleSnackbar}
			/>
			<View style={{ alignItems: "center", marginTop: 20 }}>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<Text>No tienes una cuenta? </Text>
					<Link to="/register" style={Styles.textDecoration2}>
						Registrarse
					</Link>
				</View>
			</View>
			{/* Snackbar para mostrar mensajes */}
			<Snackbar
				visible={visibleSnackbar}
				onDismiss={() => setVisibleSnackbar(false)}
				duration={Snackbar.DURATION_SHORT}
			>
				{snackbarMessage}
			</Snackbar>
		</View>
	);
};

export default login;
