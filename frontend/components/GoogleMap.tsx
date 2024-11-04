import Styles from "@/globalStyles/styles";
import React, { useState } from "react";
import { Alert, Button, Image, Pressable, Text } from "react-native";
import MapView, {
    Marker,
    MarkerAnimated,
    type LatLng,
    type MapPressEvent,
} from "react-native-maps";
const imagen = require("../assets/images/pablo.png");

export interface MapProps {
    selectedLocation?: LatLng | null;
    setSelectedLocation?: any;
    onPressConfirmLocation?: any;
}

const GoogleMap = ({
    selectedLocation,
    setSelectedLocation,
    onPressConfirmLocation,
}: MapProps) => {
    const [address, setAddress] = useState(null);
    const handleMapPress = async (event: MapPressEvent) => {
        const coordinate = event.nativeEvent.coordinate;
        console.log(coordinate);
        if (setSelectedLocation) {
            setSelectedLocation(coordinate);
        }
    };
    const places = [
        {
            id: 1,
            latitude: -17.385494,
            longitude: -66.058982,

            nombre: "Casa de Pablo",
            photo: imagen,
        },
    ];

    const handleMarkerPress = (place:any) => {
        Alert.alert(
            place.nombre + ` id: ${place.id}`,
            `Lat: ${place.latitude}, Lon: ${place.longitude}`,
            [
                {
                    text: "OK",
                    onPress: () => console.log("OK Pressed"),
                },
            ]
        );
    };

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

                {places.map((place) => (
                    <Marker
                        key={place.id}
                        coordinate={{
                            latitude: place.latitude,
                            longitude: place.longitude,
                        }}
                        title={place.nombre}
                        onPress={() => handleMarkerPress(place)}
                    >
                        <Image
                            source={imagen}
                            style={{ width: 40, height: 40, borderRadius: 20 }}
                        />
                    </Marker>
                ))}
            </MapView>
            {selectedLocation && (
                <Pressable
                    onPress={onPressConfirmLocation}
                    style={[{ top: -100},Styles.button]}
                >
                    <Text style={Styles.buttonText}>Confirmar</Text>
                </Pressable>
            )}
        </>
    );
};

export default GoogleMap;
