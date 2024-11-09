import GoogleMap from "@/components/GoogleMap";
import Notch from "@/components/Notch";
import React, { useEffect, useState } from "react";
import { Image, Modal, Pressable, ScrollView, Text, View } from "react-native";
import Popup from "@/components/Popup";
import { router, type Href } from "expo-router";
import Styles from "@/globalStyles/styles";
import { getEstablecimientos } from "@/services/establecimientosServices";

export interface Establecimiento {
    id: number;
    coordenada_y: number;
    coordenada_x: number;
    nombre: string;
    logo: any;
}

const mapa = () => {
    const [establecimientos, setEstablecimientos] = useState<Establecimiento[]>(
        []
    );
    const [establecimientoSeleccionado, setEstablecimientoSeleccionado] =
        useState<Establecimiento | null>(null);


    const obtenerDatosEstablecimiento = async () => {
        const data = await getEstablecimientos();
        console.log(data);
        setEstablecimientos(data);
    };

    useEffect(() => {
        if(!establecimientos){
            obtenerDatosEstablecimiento();
        }
    }, []);

    return (
        <View style={{ position: "relative" }}>
            <Notch />

            <GoogleMap
                establecimientos={establecimientos}
                onMarkerPress={(establecimiento) => {
                //    console.log(establecimiento);
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
                            source={{ uri: establecimientoSeleccionado?.logo }}
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
                            <Text style={Styles.buttonText}>
                                Mas Informacion
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </Popup>
        </View>
    );
};

export default mapa;
