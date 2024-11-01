import React, { useState } from "react";
import { Alert, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import imagen from "../assets/images/pablo.png";

const GoogleMap = () => {
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState(null);
    const handleMapPress = async (event) => {
        const coordinate = event.nativeEvent.coordinate;
        setLocation(coordinate);
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

    const handleMarkerPress = (place) => {
        Alert.alert(place.nombre+ ` id: ${place.id}`, `Lat: ${place.latitude}, Lon: ${place.longitude}`, [
            {
                text: "OK",
                onPress: () => console.log("OK Pressed"),
            },
        ]);
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
        </>
    );
};

export default GoogleMap;
