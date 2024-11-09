import Styles from "@/globalStyles/styles";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, type Href } from "expo-router";
import React from "react";
import { FlatList, ImageBackground, Text, View } from "react-native";
import Evento, { EventoType } from "./Evento";

interface Props {
    eventos: EventoType[];
}

const ListadoEventosInicio = ({ eventos }: Props) => {
    return (
        <FlatList
            data={eventos}
            style={Styles.slider}
            keyExtractor={(item) => JSON.stringify(item)}
            renderItem={({ item, index }) => (
                <Evento evento={item} key={index} />
            )}
            horizontal
        />
    );
};

export default ListadoEventosInicio;
