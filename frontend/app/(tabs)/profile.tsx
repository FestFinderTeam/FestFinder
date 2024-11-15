import { useSession } from "@/hooks/ctx";
import { Image, Text, View } from "react-native";
import Styles from "../../globalStyles/styles";
import ItemProfile from "@/components/ItemProfile";
import Header from "@/components/Header";
import { Href, Link, router } from "expo-router";
const defaultImage = require("../../assets/images/default-profile.png");
const profile = () => {
	const { session, signOut } = useSession();

	if (!session) {
		router.push("/");
		return;
	}

	const { nombre, imagen_url, email, duenio, establecimiento } = session;
	console.log(session);

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
					onPress={() => {}}
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
						if (duenio) {
							router.push("/admin");
						} else {
							router.navigate("/business/register_business");
						}
					}}
					color="#7D5683"
					text={duenio ? "Administrar mi local" : "Registrar establecimiento"}
					icon={duenio ? "gear" : "cart-plus"}
					textColor="#787878"
				/>
				<ItemProfile
					onPress={() => {
						signOut();
					}}
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
