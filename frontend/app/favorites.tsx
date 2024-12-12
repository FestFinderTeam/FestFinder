import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { EstablecimientoType } from "./(tabs)/mapa";
import { getEstablecimientos } from "@/services/establecimientosServices";
import Establecimiento from "@/components/EstablecimientoExtra";
import Header from "@/components/Header";
import { getFavoritos } from "@/services/VisitasService";
import { useSession } from "@/hooks/ctx";

const favorites = () => {
    const { session, signOut } = useSession();
    const [establecimientos, setEstablecimientos] = useState<
        EstablecimientoType[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEstablecimientos = async () => {
        try {
            if (session?.id_usuario) {
                const favoritos = await getFavoritos(session.id_usuario.toString());
                setEstablecimientos(favoritos);
            }
            setIsLoading(false);
        }catch(error){
            console.error("Error al recuperar favoritos:", error);
        }
    };

    useEffect(() => {
        if (session?.id_usuario) {
            fetchEstablecimientos();
            console.log(establecimientos);
        }
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View>
            <Header title="Locales Favoritos" />

            
            <ScrollView style={{marginTop: 15}}>
                {establecimientos.map((establecimiento, index) => (
                    <Establecimiento
                        key={index}
                        establecimiento={establecimiento}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default favorites;
