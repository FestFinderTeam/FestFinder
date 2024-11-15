import GoogleMap from "@/components/GoogleMap";
import Notch from "@/components/Notch";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Image,
	Modal,
	Pressable,
	ScrollView,
	Text,
	View,
} from "react-native";
import Popup from "@/components/Popup";
import { router, type Href } from "expo-router";
import Styles from "@/globalStyles/styles";
import { getEstablecimientos } from "@/services/establecimientosServices";
import { useSession } from "@/hooks/ctx"; // Asegúrate de importar el hook de sesión

export interface EstablecimientoType {
	id: number;
	coordenada_y: number;
	coordenada_x: number;
	nombre: string;
	logo: any;
}
interface Perfil {
	nombre: string | null;
	email: string | null;
	telefono: string | null;
	fecha_nacimiento: string | null;
	imagen_url: string | null;
}

const Mapa = () => {
	const [establecimientos, setEstablecimientos] = useState<
		EstablecimientoType[]
	>([]);
	const [establecimientoSeleccionado, setEstablecimientoSeleccionado] =
		useState<EstablecimientoType | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const obtenerDatosEstablecimiento = async () => {
		setIsLoading(true);
		const data = await getEstablecimientos();
		setEstablecimientos(data);
		setIsLoading(false);
	};

	useEffect(() => {
		obtenerDatosEstablecimiento();
	}, []);

	if (isLoading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<ActivityIndicator size="large" color="#0000ff" />
				<Text>Cargando establecimientos...</Text>
			</View>
		);
	}

	return (
		<View style={{ position: "relative" }}>
			<GoogleMap
				establecimientos={establecimientos}
				onMarkerPress={(establecimiento) => {
					console.log(establecimiento);
					setEstablecimientoSeleccionado(establecimiento);
				}}
			/>

			<Popup
				isVisible={establecimientoSeleccionado !== null}
				onClose={() => setEstablecimientoSeleccionado(null)}
			>
				<ScrollView style={{ backgroundColor: "white" }}>
					<View
						style={{
							alignItems: "center",
							backgroundColor: "white",
						}}
					>
						<Text style={Styles.subtitle}>
							{establecimientoSeleccionado?.nombre}
						</Text>
						<Image
							source={
								establecimientoSeleccionado?.logo
									? { uri: establecimientoSeleccionado.logo }
									: require("../../assets/images/default.jpg")
							}
							style={{
								width: 200,
								height: 200,
								borderRadius: 100,
							}}
						/>
						<Pressable
							onPress={() => {
								router.push(
									("/places/" + establecimientoSeleccionado?.id) as Href
								);
							}}
							style={Styles.button}
						>
							<Text style={Styles.buttonText}>Más Información</Text>
						</Pressable>
					</View>
				</ScrollView>
			</Popup>
		</View>
	);
};

export default Mapa;
