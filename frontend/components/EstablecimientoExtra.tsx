import type { EstablecimientoType } from "@/app/(tabs)/mapa";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, type Href } from "expo-router";
import React from "react";
import { ImageBackground, Text, View, StyleSheet } from "react-native";
const default_image = require("@/assets/images/default_image.png");

interface Props {
    establecimiento: EstablecimientoType;
}

const Establecimiento = ({ establecimiento }: Props) => {
    return (
        <Link
            href={("/places/" + establecimiento.id) as Href}
            style={styles.link}
        >
            <View style={styles.container}>
                <ImageBackground
                    resizeMode="cover"
                    source={
                        establecimiento.logo
                            ? { uri: establecimiento.logo }
                            : default_image
                    }
                    style={styles.imageBackground}
                />
                <View style={styles.details}>
                    <Text style={styles.nombre}>{establecimiento.nombre}</Text>
                    <Text style={styles.tipo}>
                        {establecimiento.tipo_fk_detail?.nombre_tipo}
                    </Text>
                    <Text style={styles.puntuacion}>
                        <FontAwesome name="star" color="orange" />
                        {` ${establecimiento.score ?? 0} / 5`}
                    </Text>
                    <Text style={styles.puntuacion}>
                        <FontAwesome name="circle" color="purple" />
                        {" " +
                            (establecimiento.direccion &&
                            establecimiento.direccion.length > 30
                                ? establecimiento.direccion.substring(0, 31) +
                                  "..."
                                : establecimiento.direccion)}
                    </Text>
                </View>
            </View>
        </Link>
    );
};

const styles = StyleSheet.create({
    link: {
        marginLeft: "3%",
        marginBottom: 15,
    },
    container: {
        flexDirection: "row", // Para alinear imagen y detalles en una fila
        alignItems: "center",
    },
    imageBackground: {
        width: 100,
        height: 100,
        borderRadius: 10,
        overflow: "hidden",
    },
    details: {
        marginLeft: 10,
        flex: 1,
    },
    nombre: {
        fontSize: 16,
        fontWeight: "bold",
        color: "black",
    },
    tipo: {
        fontSize: 14,
        color: "gray",
    },
    puntuacion: {
        fontSize: 14,
        color: "gray",
        marginTop: 5,
    },
});

export default Establecimiento;
