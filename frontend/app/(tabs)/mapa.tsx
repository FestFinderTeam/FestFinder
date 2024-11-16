import GoogleMap from "@/components/GoogleMap";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { Pressable, Text, View, Image } from "react-native";
import { getEstablecimientos } from "@/services/establecimientosServices";
import { ActivityIndicator, Button } from "react-native-paper";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { router, Href } from "expo-router";
import Styles from "@/globalStyles/styles";

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
	const snapPoints = useMemo(() => ["42%"], []);
	const bottomSheetRef = useRef<BottomSheet>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);
	const [establecimientos, setEstablecimientos] = useState<
		EstablecimientoType[]
	>([]);
	const [establecimientoSeleccionado, setEstablecimientoSeleccionado] =
		useState<EstablecimientoType | null>(null);
	const obtenerDatosEstablecimiento = async () => {
		setIsLoading(true);
		const data = await getEstablecimientos();
		setEstablecimientos(data);
		setIsLoading(false);
	};

	useEffect(() => {
		obtenerDatosEstablecimiento();
	}, []);

	useEffect(() => {
		if (establecimientoSeleccionado) {
			bottomSheetRef.current?.expand();
		} else {
			bottomSheetRef.current?.close();
		}
	}, [establecimientoSeleccionado]);

	if (isLoading)
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator animating={true} size="large" />
				<Text>Cargando establecimientos...</Text>
			</View>
		);

	return (
		<View style={{ position: "relative" }}>
			<GoogleMap
				establecimientos={establecimientos}
				onMarkerPress={(establecimiento) => {
					console.log(establecimiento);
					setEstablecimientoSeleccionado(establecimiento);
				}}
			/>

			<BottomSheet
				ref={bottomSheetRef}
				snapPoints={snapPoints}
				enablePanDownToClose={true}
				backdropComponent={(props) =>
					!isBottomSheetOpen ? null : (
						<Pressable
							style={[
								props.style,
								{
									flex: 1,
									backgroundColor: "rgba(0, 0, 0, 0.1)",
								},
							]}
							onPress={() => bottomSheetRef.current?.close()}
						/>
					)
				}
				onClose={() => setEstablecimientoSeleccionado(null)}
				onChange={(index) => setIsBottomSheetOpen(index >= 0)}
				index={-1}
			>
				<BottomSheetView>
					<View
						style={{
							alignItems: "center",
						}}
					>
						<Text style={Styles.subtitle}>
							{establecimientoSeleccionado?.nombre}
						</Text>
						<Image
							source={
								establecimientoSeleccionado?.logo
									? { uri: establecimientoSeleccionado.logo }
									: require("@/assets/images/default.jpg")
							}
							style={{
								width: 200,
								height: 200,
								borderRadius: 100,
							}}
						/>
						<Button
							onPress={() => {
								router.push(
									("/places/" + establecimientoSeleccionado?.id) as Href
								);
							}}
							mode="contained"
							style={{ marginTop: 10 }}
						>
							Más Información
						</Button>
					</View>
				</BottomSheetView>
			</BottomSheet>
		</View>
	);
};

export default Mapa;
