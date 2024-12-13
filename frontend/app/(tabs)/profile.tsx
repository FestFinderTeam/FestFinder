import { useSession } from "@/hooks/ctx";
import { Image, Text, View, Alert } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Styles from "../../globalStyles/styles";
import ItemProfile from "@/components/ItemProfile";
import Header from "@/components/Header";
import { Href, Link, router } from "expo-router";
import { useEffect } from "react";
const defaultImage = require("../../assets/images/default-profile.png");

const profile = () => {
	const { session, signOut } = useSession();

	useEffect(() => {
		if (!session) {
			router.push("/");
		}else {
			console.log(session);
			
		}
	}, [session]);

	const handleSignOut = () => {
		Alert.alert(
			"Confirmar",
			"¿Está seguro de que desea cerrar sesión?",
			[
				{
					text: "Cancelar",
					style: "cancel",
				},
				{
					text: "Cerrar sesión",
					onPress: () => signOut(),
				},
			],
			{ cancelable: false }
		);
	};

	if (!session) return null;

	const { nombre, imagen_url, email, establecimiento } = session;

	return (
		<View>
			<Header title="Mi perfil" />
			<View style={Styles.containerProfile}>
				<Image
					source={imagen_url ? { uri: imagen_url } : defaultImage}
					style={Styles.imageProfile}
				/>
				<View
					style={{
						alignContent: "center",
						justifyContent: "center",
					}}
				>
					<Text style={styles.textoTitulo}>{nombre}</Text>
					<Text style={styles.textoMail}>{email}</Text>
				</View>
			</View>
			<Text style={styles.textoSubtitulo}>Perfil</Text>
			<View style={styles.parametros}>
				<ItemProfile
					onPress={() => {
						router.navigate("/user/info" as Href);
					}}
					color="#7D5683"
					text="Informacion personal"
					icon="user-o"
					textColor="#787878"
				/>
				<ItemProfile
					onPress={() => {router.navigate('/favorites')}}
					color="#7D5683"
					text="Lugares favoritos"
					icon="heart-o"
					textColor="#787878"
				/>
				<ItemProfile
					onPress={() => {}}
					color="#7D5683"
					text="Historial"
					icon="clock-o"
					textColor="#787878"
				/>
			</View>

			<Text style={styles.textoSubtitulo}>Configuracion</Text>
			<View style={styles.parametros}>
				<ItemProfile
					onPress={() => {
						router.navigate("/notifications/alerts" as Href);
					}}
					color="#7D5683"
					text="Notificaiones"
					icon="bell-o"
					textColor="#787878"
				/>
				<ItemProfile
					onPress={() => {
						if (establecimiento) {
							router.push("/admin");
						} else {
							router.navigate("/business/register_business");
						}
					}}
					color="#7D5683"
					text={establecimiento ? "Administrar mi local" : "Registrar establecimiento"}
					icon={establecimiento ? "gear" : "cart-plus"}
					textColor="#787878"
				/>
				<ItemProfile
					onPress={handleSignOut}
					color="#7D5683"
					text="Cerrar sesión"
					icon="arrow-circle-right"
					textColor="#787878"
				/>
			</View>
		</View>
	);
};

const styles = {
	textoTitulo: {
		fontWeight: "bold" as "bold",
		fontSize: 23,
	},
	textoSubtitulo: {
		fontWeight: "bold" as "semibold",
		fontSize: 16,
		marginTop: 40,
		marginLeft: 10,
	},
	parametros: {
		marginLeft: 20,
		marginTop: 10,
	},
	textoMail: {
		marginTop: 2,
	},
};

export default profile;
