import { Text, View } from "react-native";
import { ActivityIndicator, Button, Snackbar } from "react-native-paper";
import LoginGoogle from "./LoginGoogle";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import React from "react";
import { useSession } from "@/hooks/ctx";
import { useLoginMutation } from "@/api/userApi";
import TextInputWithHelper from "./TextInputWithHelperText";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormData {
	email: string;
	contraseña: string;
}

interface Errors {
	email: string;
	contraseña: string;
}

const fieldNames: { [key in keyof FormData]: string } = {
	email: "Email",
	contraseña: "Contraseña",
};

const getLoginData = async () => {
	return await SecureStore.getItem("login");
};

interface LoginProps {
	setSnackbarMessage: (message: string) => void;
	setVisibleSnackbar: (visible: boolean) => void;
}

const Login = ({ setSnackbarMessage, setVisibleSnackbar }: LoginProps) => {
	const { signIn } = useSession();
	const [showContraseña, setShowContraseña] = useState(false);
	const [login, { data, isSuccess, error, isError, isLoading }] =
		useLoginMutation();
	const [formData, setFormData] = useState<FormData>({
		email: "",
		contraseña: "",
	});
	const [errors, setErrors] = useState<Errors>({
		email: "",
		contraseña: "",
	});

	useEffect(() => {
		const clearError = (field: keyof FormData) => {
			if (formData[field]) {
				setErrors((prevErrors) => ({
					...prevErrors,
					[field]: "",
				}));
			}
		};
		// Itera sobre cada campo en formData y limpia su error si tiene valor
		Object.keys(formData).forEach((key) => {
			const field = key as keyof FormData;
			clearError(field);
		});
	}, [formData]);

	useEffect(() => {
		if (isSuccess) {
			console.log("Usuario logueado:", data);
			setSnackbarMessage("Iniciar sesión con éxito");
			setVisibleSnackbar(true);
		} else if (isError) {
			console.error(error);
            setSnackbarMessage("Usuario o contraseña incorrecta.");
			setVisibleSnackbar(true);
		}
	}, [isSuccess, isError, error, data]);

	const handleSubmit = async () => {
		const newErrors = { ...errors };
		Object.keys(formData).forEach((field) => {
			const key = field as keyof FormData;
			const value = formData[key].trim();

			if (!value) {
				// Campo vacío
				newErrors[key] = `El campo ${fieldNames[key]} es obligatorio`;
			} else {
				// Validación específica para cada campo
				switch (key) {
					case "email":
						if (!emailRegex.test(value)) {
							newErrors[key] = "El formato del correo electrónico es inválido";
						} else {
							newErrors[key] = "";
						}
						break;
					default:
						newErrors[key] = ""; // Limpia cualquier error anterior para campos válidos
						break;
				}
			}
		});

		setErrors(newErrors);

		const hasErrors = Object.values(newErrors).some((error) => error !== "");
		if (!hasErrors) {
			const data = {
				email: formData.email,
				password: formData.contraseña,
				g_id: "",
			};
			setShowContraseña(false);
			console.log("Formulario enviado:", data);
			login(data);
		}
	};

	if (isLoading)
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator animating={true} size="large" />
			</View>
		);

	return (
		<>
			<TextInputWithHelper
				label={"Email"}
				value={formData.email}
				onChangeText={(e: string) => setFormData({ ...formData, email: e })}
				mode="outlined"
				error={errors.email !== ""}
				errorText={errors.email}
			/>
			<TextInputWithHelper
				label={"Contraseña"}
				value={formData.contraseña}
				onChangeText={(e: string) =>
					setFormData({ ...formData, contraseña: e })
				}
				mode="outlined"
				error={errors.contraseña !== ""}
				errorText={errors.contraseña}
				icon={showContraseña ? "eye" : "eye-off"}
				onIconPress={() => setShowContraseña(!showContraseña)}
				secureTextEntry={!showContraseña}
			/>

			<Button mode="contained" onPress={handleSubmit} style={{ marginTop: 20 }}>
				Iniciar Sesión
			</Button>
			<View style={styles.centerContainer}>
				<View style={styles.lineContainer}>
					<View style={styles.line} />
					<Text style={styles.lineText}>Inicia sesión usando</Text>
					<View style={styles.line} />
				</View>
				<LoginGoogle />
			</View>
		</>
	);
};

const styles = {
	lineContainer: {
		flexDirection: "row" as const,
		alignItems: "center" as const,
		marginVertical: 10,
		paddingHorizontal: 20,
		marginTop: 20,
	},
	centerContainer: {
		alignItems: "center" as const,
	},
	line: {
		flex: 1,
		height: 1,
		backgroundColor: "#402158",
	},
	lineText: {
		marginHorizontal: 10,
		color: "#402158",
		fontWeight: "500" as const,
	},
};

export default Login;
