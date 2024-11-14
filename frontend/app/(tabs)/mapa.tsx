import GoogleMap from "@/components/GoogleMap";
import Notch from "@/components/Notch";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, Text, View } from "react-native";
import Popup from "@/components/Popup";
import { router, type Href } from "expo-router";
import Styles from "@/globalStyles/styles";
import { getEstablecimientos } from "@/services/establecimientosServices";
import { useSession } from "@/hooks/ctx";// Asegúrate de importar el hook de sesión

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
    const { session } = useSession();
    const [perfil, setPerfil] = useState<Perfil | null>(null);
    const [establecimientos, setEstablecimientos] = useState<EstablecimientoType[]>([]);
    const [establecimientoSeleccionado, setEstablecimientoSeleccionado] = useState<EstablecimientoType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    const obtenerDatosEstablecimiento = async () => {
        setIsLoading(true);
        const data = await getEstablecimientos(null);
        setEstablecimientos(data);
    };

    const obtenerUbicacionActual = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error obteniendo la ubicación: ", error);
                }
            );
        }
    };

    useEffect(() => {
        if (session) {
            setPerfil({
                nombre: session.nombre,
                email: session.email,
                telefono: session.telefono,
                fecha_nacimiento: "12/09/1991",
                imagen_url: session.imagen_url,
            });
        }
    }, [session]);

    useEffect(() => {
        obtenerDatosEstablecimiento();
        obtenerUbicacionActual(); // Obtiene la ubicación del usuario cuando se carga el componente
    }, []);

    useEffect(() => {
        if (establecimientos.length > 0) {
            setIsLoading(false);
        }
    }, [establecimientos]);

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
                userLocation={userLocation} 
                userIcon={perfil?.imagen_url} 
            />
            
            <Popup
                isVisible={establecimientoSeleccionado !== null}
                onClose={() => setEstablecimientoSeleccionado(null)}
            >
                <ScrollView style={{ backgroundColor: "white" }}>
                    <View style={{ alignItems: "center", backgroundColor: "white" }}>
                        <Text style={Styles.subtitle}>
                            {establecimientoSeleccionado?.nombre}
                        </Text>
                        <Image
                            source={{ uri: establecimientoSeleccionado?.logo }}
                            style={{ width: 200, height: 200, borderRadius: 100 }}
                        />
                        <Pressable
                            onPress={() => {
                                router.push(("/places/" + establecimientoSeleccionado?.id) as Href);
                            }}
                            style={Styles.button}
                        >
                            <Text style={Styles.buttonText}>Más Información</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </Popup>
        </View>
    );
};

export default Mapa;
