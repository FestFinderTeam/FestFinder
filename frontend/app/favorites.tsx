import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { EstablecimientoType } from "./(tabs)/mapa";
import { getEstablecimientos } from "@/services/establecimientosServices";
import Establecimiento from "@/components/EstablecimientoExtra";
import Header from "@/components/Header";

const favorites = () => {
    const [establecimientos, setEstablecimientos] = useState<
        EstablecimientoType[]
    >([]);
    const fetchEstablecimientos = async () => {
        const establecimientos = await getEstablecimientos();
        setEstablecimientos(establecimientos);
    };
    useEffect(() => {
        fetchEstablecimientos();
    });

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
