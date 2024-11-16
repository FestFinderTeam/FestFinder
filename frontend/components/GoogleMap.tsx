import type { EstablecimientoType } from "@/app/(tabs)/mapa";
import Styles from "@/globalStyles/styles";
import React, { useEffect, useState } from "react";
import { Alert, Image, Pressable, Text } from "react-native";
import * as Location from "expo-location";

import MapView, {
	Marker,
	type LatLng,
	type MapPressEvent,
} from "react-native-maps";
import { useSession } from "@/hooks/ctx";
import Establecimiento from "./EstablecimientoExtra";
import EstablecimientoMarker from "./EstablecimientoMarker";

export interface MapProps {
	selectedLocation?: LatLng | null;
	setSelectedLocation?: any;
	onPressConfirmLocation?: any;
	establecimientos?: EstablecimientoType[];
	onMarkerPress?: (establecimiento: EstablecimientoType) => void;
	userIcon?: any;
}

const GoogleMap = ({
	selectedLocation,
	setSelectedLocation,
	onPressConfirmLocation,
	establecimientos,
	onMarkerPress,
}: MapProps) => {
	const [userLocation, setUserLocation] = useState<null | LatLng>(null);
	const { session } = useSession();

	useEffect(() => {
		const getCurrentLocation = async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				console.log("El permiso de acceso a la localizacion fue rechazado");
			} else {
				let location = await Location.getCurrentPositionAsync({});
				setUserLocation(location.coords);
			}
		};
		getCurrentLocation();
	}, []);

	// Manejador para el evento de presionar el mapa
	const handleMapPress = async (event: MapPressEvent) => {
		if (setSelectedLocation) {
			const coordinate = event.nativeEvent.coordinate;
			setSelectedLocation(coordinate);
		}
	};
	return (
		<>
			<MapView
				style={{ width: "100%", height: "100%" }}
				region={
					userLocation
						? {
								latitude: userLocation.latitude,
								longitude: userLocation.longitude,
								latitudeDelta: 0.0922,
								longitudeDelta: 0.0421,
						  }
						: {
								latitude: -17.39453,
								longitude: -66.16754,
								latitudeDelta: 0.0922,
								longitudeDelta: 0.0421,
						  }
				}
				onPress={handleMapPress}
			>
				{userLocation && (
					<Marker
						coordinate={userLocation}
						title="tu"
					>
						<Image
							source={
								session
									? { uri: session.imagen_url }
									: require("../assets/images/default.jpg")
							}
							style={{ width: 40, height: 40, borderRadius: 20 }}
						/>
					</Marker>
				)}
				{selectedLocation && <Marker coordinate={selectedLocation} tracksViewChanges={false}/>}
				{establecimientos &&
					establecimientos.map((place, index) => (
						<EstablecimientoMarker
							establecimiento={place}
							key={index}
							onMarkerPress={onMarkerPress}
						/>
					))}
			</MapView>

			{selectedLocation && (
				<Pressable
					onPress={onPressConfirmLocation}
					style={[
						{
							top: -100,
							left: 0,
							right: 0,
							marginHorizontal: "auto",
						},
						Styles.button,
					]}
				>
					<Text style={Styles.buttonText}>Confirmar</Text>
				</Pressable>
			)}
		</>
	);
};

export default GoogleMap;
