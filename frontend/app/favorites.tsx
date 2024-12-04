import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
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
    const fetchEstablecimientos = async () => {
        if (session?.id_usuario) {
            const favoritos = await getFavoritos(session.id_usuario.toString());
            setEstablecimientos(favoritos);
        }
    };

    useEffect(() => {
        if (session?.id_usuario) {
            fetchEstablecimientos();
            console.log(establecimientos);
        }
    }, []);

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
