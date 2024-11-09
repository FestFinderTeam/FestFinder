import type { EstablecimientoType } from "@/app/(tabs)/mapa";
import Styles from "@/globalStyles/styles";
import React, { useState } from "react";
import { Alert, Image, Pressable, Text } from "react-native";
import MapView, {
    Marker,
    type LatLng,
    type MapPressEvent,
} from "react-native-maps";
const imagen = require("../assets/images/pablo.png");

export interface MapProps {
    selectedLocation?: LatLng | null;
    setSelectedLocation?: any;
    onPressConfirmLocation?: any;
    establecimientos?: EstablecimientoType[];
    onMarkerPress?: (establecimiento: EstablecimientoType) => void;
}
const GoogleMap = ({
    selectedLocation,
    setSelectedLocation,
    onPressConfirmLocation,
    establecimientos,
    onMarkerPress,
}: MapProps) => {
    const handleMapPress = async (event: MapPressEvent) => {
        if (setSelectedLocation) {
            const coordinate = event.nativeEvent.coordinate;
            setSelectedLocation(coordinate);
        }
    };
    console.log("Datos de establecimientos recibidos:", establecimientos);

    return (
        <>
            <MapView
                style={{ width: "100%", height: "100%" }}
                initialRegion={{
                    latitude: -17.39453, // latitud inicial
                    longitude: -66.16754, // longitude inicial
                    latitudeDelta: 0.0922, // rango de visualización
                    longitudeDelta: 0.0421, // rango de visualización
                }}
                onPress={handleMapPress}
            >
                {selectedLocation && <Marker coordinate={selectedLocation} />}

                {establecimientos &&
                    establecimientos.map((place) => (
                        <Marker
                            key={place.id}
                            coordinate={{
                                latitude: Number(place.coordenada_y),
                                longitude: Number(place.coordenada_x),
                            }}
                            title={place.nombre}
                            onPress={() =>
                                onMarkerPress && onMarkerPress(place)
                            }
                        >
                            <Image
                                source={{uri: place.logo}}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                }}
                            />
                        </Marker>
                    ))}
            </MapView>

            {selectedLocation && (
                <Pressable
                    onPress={onPressConfirmLocation}
                    style={[{ top: -100 }, Styles.button]}
                >
                    <Text style={Styles.buttonText}>Confirmar</Text>
                </Pressable>
            )}
        </>
    );
};

export default GoogleMap;
