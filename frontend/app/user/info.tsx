import Header from "@/components/Header";
import Styles from "@/globalStyles/styles";
import { useSession } from "@/hooks/ctx";
import React, { useEffect, useState } from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const defaultImage = require("../../assets/images/default-profile.png");

interface Perfil {
    nombre: string | null;
    email: string | null;
    telefono: string | null;
    imagen_url: string | null;
}

const info = () => {
    const { session } = useSession();
    const [perfil, setPerfil] = useState<Perfil | null>();

    useEffect(() => {
        if (session) {
            setPerfil({
                nombre: session.nombre,
                email: session.email,
                telefono: session.telefono,
                imagen_url: session.imagen_url,
            });
        }
    }, []);

    return (
        <>
            <Header title="Información Personal" />

            <View style={{ alignItems: "center", padding: 20 }}>
                <View
                    style={{
                        position: "relative",
                        width: 200,
                        height: 200,
                        borderRadius: 100,
                        overflow: "hidden",
                    }}
                >
                    <Image
                        source={
                            perfil && perfil.imagen_url
                                ? { uri: perfil.imagen_url }
                                : defaultImage
                        }
                        style={{ width: "100%", height: "100%" }}
                    />

                    <TouchableOpacity
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(0, 0, 0, 0.4)",
                            borderRadius: 100,
                        }}
                    >
                        <FontAwesome name="camera" size={24} color="#fff" />
                        <Text style={{ color: "#fff", marginTop: 5, fontSize: 14 }}>
                            Cambiar imagen
                        </Text>
                    </TouchableOpacity>
                </View>

                <View
                    style={{
                        marginTop: 20,
                        width: "90%",
                        backgroundColor: "#f9f9f9",
                        borderRadius: 10,
                        padding: 15,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        elevation: 3,
                    }}
                >
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                        <Text style={[Styles.title, { fontSize: 20, marginBottom: 2 }]} >Nombre completo</Text>
                    </View>
                    <Text style={[{ marginBottom: 20, fontWeight: "bold", color: "black" }]}>{perfil?.nombre}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                        <Text style={[Styles.title, { fontSize: 20, marginBottom: 2 }]}>E-mail</Text>
                    </View>
                    <Text style={[{ marginBottom: 10, fontWeight: "bold", color: "black" }]}>{perfil?.email}</Text>
                </View>
            </View>
        </>
    );
};

export default info;
