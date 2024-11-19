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
import { FontAwesome } from "@expo/vector-icons";

export interface MapProps {
    selectedLocation?: LatLng | null;
    setSelectedLocation?: any;
    onPressConfirmLocation?: any;
    establecimientos?: EstablecimientoType[];
    onMarkerPress?: (establecimiento: EstablecimientoType) => void;
    location?: LatLng | null;
    userLocation?: boolean;
	onClose?: () => void;
}

const GoogleMap = ({
    selectedLocation,
    setSelectedLocation,
    onPressConfirmLocation,
    establecimientos,
    onMarkerPress,
    location,
    userLocation,
	onClose
}: MapProps) => {
    const [region, setRegion] = useState<LatLng>({
        latitude: -17.39453,
        longitude: -66.16754,
    });
	const [userCoords, setUserCoords] = useState<LatLng>()
    const { session } = useSession();

    useEffect(() => {
        if (userLocation) {
            const getCurrentLocation = async () => {
                let { status } =
                    await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    console.log(
                        "El permiso de acceso a la localizacion fue rechazado"
                    );
                } else {

                    let userLocation = await Location.getCurrentPositionAsync({});
                    setUserCoords(userLocation.coords);
					if(!location) setRegion(userLocation.coords)
                }
            };
            getCurrentLocation();
        }
		if(location){
			setRegion(location)
		}
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
                region={{
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                    ...region,
                }}
                onPress={handleMapPress}
            >
                {userCoords && (
                    <Marker coordinate={userCoords} title="Tu">
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
                {selectedLocation && (
                    <Marker
                        coordinate={selectedLocation}
                        tracksViewChanges={false}
                    />
                )}
                {establecimientos &&
                    establecimientos.map((place, index) => (
                        <EstablecimientoMarker
                            establecimiento={place}
                            key={index}
                            onMarkerPress={onMarkerPress}
                        />
                    ))}
            </MapView>
			    {onClose && (
                    <Pressable
                        onPress={onClose}
                        style={
							{
								position: "absolute",
                                right: 10,
								top: 10,
                                padding: 10,
                                backgroundColor: "#F00",
                                borderRadius: 100,
                                justifyContent: "center",
                                alignItems: "center",
							}
						}
						>
							<FontAwesome name="close" color={"white"}/>
						</Pressable>)}

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
