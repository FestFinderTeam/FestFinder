import { Text, TextInput, TouchableOpacity, View, Image, Pressable, ScrollView } from "react-native";
import Styles from "../globalStyles/styles";
import { Link } from "@react-navigation/native";
import { useState } from "react";
import LoginGoogle from "@/components/LoginGoogle";
import { API_URL } from "@/constants/Url";
import { FontAwesome } from '@expo/vector-icons';
import { router } from "expo-router";
import { useSession } from "@/hooks/ctx";
const Register = () => {
	const { signIn } = useSession();
	const [nombre, setName] = useState("");
	const [email, setEmail] = useState("");
	const [p_field, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [telefono, setTelephone] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showPassword2, setShowPassword2] = useState(false);
	const [errors, setErrors] = useState<any>({});
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	const validateForm = () => {
		let errorMessages: any = {};

		if ([nombre, email, p_field, confirmPassword, telefono].includes("")) {
			errorMessages.general = "Todos los campos son obligatorios";
		}

		if (!passwordRegex.test(p_field)) {
			errorMessages.password = "La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula y un número.";
		}

		if (p_field !== confirmPassword) {
			errorMessages.confirmPassword = "Las contraseñas no coinciden.";
		}

		if (!emailRegex.test(email)) {
			errorMessages.email = "El email debe tener un formato válido: usuario@dominio.";
		}

		if (!/^\d{8}$/.test(telefono)) {
			errorMessages.telefono = "El teléfono debe tener solo números y 8 dígitos.";
		}

		setErrors(errorMessages);
		return Object.keys(errorMessages).length === 0;
	};

	const handleFieldChange = (field: string, setState: Function, fieldName: string) => {
		setState(field);
		const updatedErrors = { ...errors };
		delete updatedErrors.general;
		if (fieldName === "nombre" && !field) {
			updatedErrors.nombre = "El nombre es obligatorio";
		} else if (fieldName === "email" && !emailRegex.test(field)) {
			updatedErrors.email = "El email debe tener un formato válido: usuario@dominio.";
		} else if (fieldName === "telefono" && !/^\d{8}$/.test(field)) {
			updatedErrors.telefono = "El teléfono debe tener solo números y 8 dígitos.";
		} else if (fieldName === "p_field") {
			if (passwordRegex.test(field)) {
				delete updatedErrors.password;
			} else {
				updatedErrors.password = "La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula y un número.";
			}
		} else if (fieldName === "confirmPassword" && field !== p_field) {
			updatedErrors.confirmPassword = "Las contraseñas no coinciden.";
		} else {
			delete updatedErrors[fieldName];
		}
		setErrors(updatedErrors);
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;

		const data = { nombre, email, telefono, p_field};

		try {
			const response = await fetch(API_URL + "/api/usuario/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (response.ok) {
				const userData = await response.json();
				console.log("Usuario registrado:", userData);
				const {
                    email,
                    id_usuario,
                    imagen,
                    nombre,
                    telefono,
                    duenio,
                    establecimiento,
                } = userData;
				 let imagen_url = "";
								const fullImageUrl = `${API_URL}${imagen}`; 
								imagen_url = fullImageUrl; 
				signIn({
                    id_usuario,
                    imagen_url,
                    nombre,
                    email,
                    telefono,
                    duenio,
                    establecimiento,
                });
			} else {
				alert("Error al registrar");
				console.log(await response.json());
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<ScrollView>
			<View style={Styles.container}>
				<Image
					source={require("../assets/images/festLogoHD.png")}
					style={{ aspectRatio: 1, width: "60%", height: "auto" }}
					resizeMode="contain"
				/>
				<TextInput
					placeholder="Nombre"
					placeholderTextColor="#402158"
					style={[Styles.input, { marginTop: -40 }]}
					onChangeText={(e: string) => handleFieldChange(e, setName, 'nombre')}
					onEndEditing={() => handleFieldChange(nombre, setName, 'nombre')}
				/>
				{errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}

				<TextInput
					placeholder="Email"
					keyboardType="email-address"
					placeholderTextColor="#402158"
					style={Styles.input}
					onChangeText={(e: string) => handleFieldChange(e, setEmail, 'email')}
					onEndEditing={() => handleFieldChange(email, setEmail, 'email')}
				/>
				{errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

				<TextInput
					placeholder="Teléfono"
					keyboardType="phone-pad"
					placeholderTextColor="#402158"
					style={Styles.input}
					onChangeText={(e: string) => handleFieldChange(e, setTelephone, 'telefono')}
					onEndEditing={() => handleFieldChange(telefono, setTelephone, 'telefono')}
				/>
				{errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}
				<View style={{ width: '80%' }}>
					<View style={{ position: 'relative' }}>
						<TextInput
							placeholder="Contraseña"
							secureTextEntry={!showPassword}
							placeholderTextColor="#402158"
							style={[Styles.input, { paddingRight: 40, width: '100%' }]}
							onChangeText={(e: string) => handleFieldChange(e, setPassword, 'p_field')}
							onEndEditing={() => handleFieldChange(p_field, setPassword, 'p_field')}
						/>
						{errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
						<Pressable
							onPress={() => setShowPassword(!showPassword)}
							style={{
								position: 'absolute',
								right: 10,
								top: '40%',
								transform: [{ translateY: -10 }],
								justifyContent: 'center',
								alignItems: 'center',
								zIndex: 1,
							}}
						>
							<FontAwesome
								name={showPassword ? "eye" : "eye-slash"}
								size={20}
								color="#402158"
							/>
						</Pressable>
					</View>
				</View>

				<View style={{ width: '80%' }}>
					<View style={{ position: 'relative' }}>
						<TextInput
							placeholder="Confirmación de contraseña"
							secureTextEntry={!showPassword2}
							placeholderTextColor="#402158"
							style={[Styles.input, { paddingRight: 40, width: '100%' }]}
							onChangeText={(e: string) => handleFieldChange(e, setConfirmPassword, 'confirmPassword')}
							onEndEditing={() => handleFieldChange(confirmPassword, setConfirmPassword, 'confirmPassword')}
						/>
						{errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
						<Pressable
							onPress={() => setShowPassword2(!showPassword2)}
							style={{
								position: 'absolute',
								right: 10,
								top: '40%',
								transform: [{ translateY: -10 }],
								justifyContent: 'center',
								alignItems: 'center',
								zIndex: 1,
							}}
						>
							<FontAwesome
								name={showPassword2 ? "eye" : "eye-slash"}
								size={20}
								color="#402158"
							/>
						</Pressable>
					</View>
				</View>

				<TouchableOpacity style={Styles.button} onPress={handleSubmit}>
					<Text style={Styles.buttonText}>Registrarse</Text>
				</TouchableOpacity>
				{errors.general && <Text style={styles.errorText2}>{errors.general}</Text>}
				<View style={styles.lineContainer}>
					<View style={styles.line} />
					<Text style={styles.lineText}>Registrarse usando</Text>
					<View style={styles.line} />
				</View>
				<LoginGoogle />
				<View style={[Styles.linkContainer, { marginBottom: 20 }]}>
					<Text>Ya tienes una cuenta? </Text>
					<Link to="/login" style={[Styles.textDecoration2,]}>
						Iniciar sesión
					</Link>
				</View>
			</View>
		</ScrollView>
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
	errorText: {
		color: 'red',
		fontSize: 12,
		marginTop: 2,
		textAlign: 'center' as 'center',
		marginBottom: 5,
	},
	errorText2: {
		color: 'red',
		fontSize: 12,
		marginTop: 7,
		textAlign: 'center' as 'center',

	}
};

export default Register;
