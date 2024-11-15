import Login from "@/components/Login";
import React from "react";
import { Text, View, Image } from "react-native";
import Styles from "../globalStyles/styles";
import { Link } from "@react-navigation/native";
import { Snackbar, ActivityIndicator } from "react-native-paper";
import { useState } from "react";

const login = () => {
	const [visibleSnackbar, setVisibleSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	return (
		<View style={{ flex: 1 }}>
			<Image
				source={require("../assets/images/festLogo.png")}
				style={Styles.festLogo}
			/>
			<Login
				setSnackbarMessage={setSnackbarMessage}
				setVisibleSnackbar={setVisibleSnackbar}
			/>
			<View style={Styles.linkContainer}>
				<Text>No tienes una cuenta? </Text>
				<Link to="/register" style={Styles.textDecoration2}>
					Registrarse
				</Link>
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
