import type { EstablecimientoType } from "@/app/(tabs)/mapa";
import React from "react";
import { Image } from "react-native";
import { Marker } from "react-native-maps";

interface Props {
	establecimiento: EstablecimientoType;
	onMarkerPress?: (establecimiento: EstablecimientoType) => void;
}
const EstablecimientoMarker = ({ establecimiento, onMarkerPress }: Props) => {
	return (
		<Marker
			tracksViewChanges={false}
			key={establecimiento.id}
			coordinate={{
				latitude: Number(establecimiento.coordenada_y),
				longitude: Number(establecimiento.coordenada_x),
			}}
			title={establecimiento.nombre}
			onPress={() => onMarkerPress && onMarkerPress(establecimiento)}
		>
			<Image
				source={
					establecimiento.logo
						? { uri: establecimiento.logo }
						: require("../assets/images/default.jpg")
				}
				style={{
					width: 40,
					height: 40,
					borderRadius: 20,
				}}
			/>
		</Marker>
	);
};

export default EstablecimientoMarker;
