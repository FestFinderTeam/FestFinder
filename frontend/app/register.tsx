import { View, Image } from "react-native";
import Styles from "../globalStyles/styles";
import { Link } from "@react-navigation/native";
import { useEffect, useState } from "react";
import LoginGoogle from "@/components/LoginGoogle";
import TextInputWithHelper from "@/components/TextInputWithHelperText";
import { Button, ActivityIndicator, Snackbar, Text } from "react-native-paper";
import { useRegisterMutation } from "@/api/userApi";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{8}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

interface FormData {
	nombre: string;
	email: string;
	telefono: string;
	contraseña: string;
	confirmarContraseña: string;
}

interface Errors {
	nombre: string;
	email: string;
	telefono: string;
	contraseña: string;
	confirmarContraseña: string;
}

const fieldNames: { [key in keyof FormData]: string } = {
	nombre: "Nombre",
	email: "Email",
	telefono: "Teléfono",
	contraseña: "Contraseña",
	confirmarContraseña: "Confirmar Contraseña",
};

const Register = () => {
	const [showContraseña, setShowContraseña] = useState(false);
	const [showConfirmarContraseña, setShowConfirmarContraseña] = useState(false);
	const [visibleSnackbar, setVisibleSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [register, { data, error, isLoading, isSuccess, isError }] =
		useRegisterMutation();

	useEffect(() => {
		if (isSuccess) {
			console.log("Usuario registrado:", data);
			setSnackbarMessage("Usuario registrado con éxito");
			setVisibleSnackbar(true);
		} else if (isError) {
			console.error(error);
			setSnackbarMessage("Error al registrar");
			setVisibleSnackbar(true);
		}
	}, [isSuccess, isError, error, data]);

	const [formData, setFormData] = useState<FormData>({
		nombre: "",
		email: "",
		telefono: "",
		contraseña: "",
		confirmarContraseña: "",
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

	const [errors, setErrors] = useState<Errors>({
		nombre: "",
		email: "",
		telefono: "",
		contraseña: "",
		confirmarContraseña: "",
	});

	const handleSubmit = () => {
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
					case "telefono":
						if (!phoneRegex.test(value)) {
							newErrors[key] = "El teléfono debe tener exactamente 8 dígitos";
						} else {
							newErrors[key] = "";
						}
						break;
					case "contraseña":
						if (!passwordRegex.test(value)) {
							newErrors[key] =
								"La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula y un número";
						} else {
							newErrors[key] = "";
						}
						break;
					case "confirmarContraseña":
						if (value !== formData.contraseña) {
							newErrors[key] = "Las contraseñas no coinciden";
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
				nombre: formData.nombre,
				email: formData.email,
				telefono: formData.telefono,
				p_field: formData.contraseña,
				imagen: 1,
			};
			setShowContraseña(false);
			setShowConfirmarContraseña(false);
			console.log("Formulario enviado:", data);
			register(data);
		}
	};

	if (isLoading)
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator animating={true} size="large" />
			</View>
		);

	return (
		<View style={styles.container}>
			<Image
				source={require("../assets/images/festLogoHD.png")}
				style={{ aspectRatio: 1, width: "100%", height: "auto" }}
				resizeMode="contain"
			/>
			<TextInputWithHelper
				label={"Nombre"}
				value={formData.nombre}
				onChangeText={(e: string) => setFormData({ ...formData, nombre: e })}
				mode="outlined"
				error={errors.nombre !== ""}
				errorText={errors.nombre}
			/>

			<TextInputWithHelper
				label={"Email"}
				value={formData.email}
				onChangeText={(e: string) => setFormData({ ...formData, email: e })}
				mode="outlined"
				error={errors.email !== ""}
				errorText={errors.email}
			/>

			<TextInputWithHelper
				label={"Teléfono"}
				value={formData.telefono}
				onChangeText={(e: string) => setFormData({ ...formData, telefono: e })}
				mode="outlined"
				error={errors.telefono !== ""}
				errorText={errors.telefono}
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

			<TextInputWithHelper
				label={"Confirmar Contraseña"}
				value={formData.confirmarContraseña}
				onChangeText={(e: string) =>
					setFormData({ ...formData, confirmarContraseña: e })
				}
				mode="outlined"
				error={errors.confirmarContraseña !== ""}
				errorText={errors.confirmarContraseña}
				icon={showConfirmarContraseña ? "eye" : "eye-off"}
				onIconPress={() => setShowConfirmarContraseña(!showConfirmarContraseña)}
				secureTextEntry={!showConfirmarContraseña}
			/>

			<Button mode="contained" onPress={handleSubmit} style={{ marginTop: 20 }}>
				Registrarse
			</Button>

			<View style={styles.centerContainer}>
				<View style={styles.lineContainer}>
					<View style={styles.line} />
					<Text>Registrarse usando</Text>
					<View style={styles.line} />
				</View>

				<LoginGoogle />

				<View style={Styles.linkContainer}>
					<Text>Ya tienes una cuenta? </Text>
					<Link to="/login" style={Styles.textDecoration2}>
						Iniciar sesion
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

const styles = {
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#fff",
	},
	image: {
		alignSelf: "center" as const,
		marginVertical: 20,
	},
	centerContainer: {
		alignItems: "center" as const,
	},
	lineContainer: {
		flexDirection: "row" as const,
		alignItems: "center" as const,
		marginVertical: 10,
		paddingHorizontal: 20,
		marginTop: 20,
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

export default Register;
