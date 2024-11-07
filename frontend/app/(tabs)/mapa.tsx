import GoogleMap from "@/components/GoogleMap";
import Notch from "@/components/Notch";
import React, { useEffect, useState } from "react";
import { Image, Modal, Pressable, ScrollView, Text, View } from "react-native";
import Popup from "@/components/Popup";
import { router, type Href } from "expo-router";
import Styles from "@/globalStyles/styles";

export interface Establecimiento {
    id: number;
    latitude: number;
    longitude: number;
    nombre: string;
    photo: any;
}

const mapa = () => {
    const [establecimientos, setEstablecimientos] = useState<Establecimiento[]>(
        []
    );
    const [establecimientoSeleccionado, setEstablecimientoSeleccionado] =
        useState<Establecimiento | null>(null);

    useEffect(() => {
        const establecimientos = [
            {
                id: 1,
                latitude: -17.385494,
                longitude: -66.058982,
                nombre: "Luna de Miel Pablo y Fernanda",
                photo: require("../../assets/images/limachis.jpg"),
            },
        ];
        setEstablecimientos(establecimientos);
    }, []);

    return (
        <View style={{ position: "relative" }}>
            <Notch />

            <GoogleMap
                establecimientos={establecimientos}
                onMarkerPress={(establecimiento) => {
                    setEstablecimientoSeleccionado(establecimiento);
                    console.log(establecimiento);
                }}
            />

            <Popup
                isVisible={establecimientoSeleccionado !== null}
                onClose={() => setEstablecimientoSeleccionado(null)}
            >
                <ScrollView style={{ backgroundColor: "white" }}>
                    <View style={{ alignItems: "center", backgroundColor:"white" }}>
                        <Text style={Styles.subtitle}>
                            {establecimientoSeleccionado?.nombre}
                        </Text>
                        <Image
                            source={establecimientoSeleccionado?.photo}
                            style={{
                                width: 200,
                                height: 200,
                                borderRadius: 100,
                            }}
                        />
                        <Pressable
                            onPress={() => {
                                router.push(
                                    ("/places/" +
                                        establecimientoSeleccionado?.id) as Href
                                );
                            }}
                            style={Styles.button}
                        >
                            <Text style={Styles.buttonText}>Mas Informacion</Text>
                        </Pressable>
                    </View>
                </ScrollView>

            </Popup>
        </View>
    );
};

export default mapa;
