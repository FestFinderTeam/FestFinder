import GoogleMap from "@/components/GoogleMap";
import Notch from "@/components/Notch";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, Text, View } from "react-native";
import Popup from "@/components/Popup";
import { router, type Href } from "expo-router";
import Styles from "@/globalStyles/styles";
import { getEstablecimientos } from "@/services/establecimientosServices";

export interface EstablecimientoType {
    id: number;
    coordenada_y: number;
    coordenada_x: number;
    nombre: string;
    logo: any;
}

const mapa = () => {
    const [establecimientos, setEstablecimientos] = useState<
        EstablecimientoType[]
    >([]);
    const [establecimientoSeleccionado, setEstablecimientoSeleccionado] =
        useState<EstablecimientoType | null>(null);
    
    const [isLoading, setIsLoading] = useState<boolean>(true); 


    const obtenerDatosEstablecimiento = async () => {
        console.log('PIDIOENDO');
        setIsLoading(true);
        const data = await getEstablecimientos(null);
        console.log(data);
        setEstablecimientos(data);
        
    };

    useEffect(() => {
        console.log(establecimientos);
        if (establecimientos.length > 0) {
            console.log("cargado");
            setIsLoading(false); // Cambia el estado de carga solo después de que `establecimientos` tenga datos
        }
    }, [establecimientos]);

    useEffect(() => {
        obtenerDatosEstablecimiento();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Cargando establecimientos...</Text>
            </View>
        );
    }

    return (
        <View style={{ position: "relative" }}>
            <Notch />
            
            <GoogleMap
                
                establecimientos={establecimientos}
                onMarkerPress={(establecimiento) => {
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
