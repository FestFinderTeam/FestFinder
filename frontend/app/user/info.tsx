import Header from "@/components/Header";
import Styles from "@/globalStyles/styles";
import { useSession } from "@/hooks/ctx";
import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
const defaultImage = require("../../assets/images/default-profile.png");

interface Perfil {
    nombre: string | null;
    email: string | null;
    telefono: string | null;
    fecha_nacimiento: string | null;
    imagen_url: string | null;
}

const info = () => {
    const { session } = useSession();
    const [perfil, setPerfil] = useState<Perfil | null>();
    console.log(session);

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
    }, []);

    return (
        <>
            <Header title="Informacion personal" />

            <View style={{ alignItems: "center" }}>
                <Image
                    source={perfil ? { uri: perfil.imagen_url } : defaultImage}
                    style={[
                        Styles.imageProfile,
                        { width: 200, height: 200, borderRadius: 100 },
                    ]}
                />

                <Text style={Styles.title}>Nombre completo</Text>
                <Text style={Styles.subtitle}>{perfil?.nombre}</Text>
                <Text style={Styles.title}>E-mail</Text>
                <Text style={Styles.subtitle}>{perfil?.email}</Text>
                <Text style={Styles.title}>Numero telefonico</Text>
                <Text style={Styles.subtitle}>{perfil?.telefono}</Text>
                <Text style={Styles.title}>Fecha de nacimiento</Text>
                <Text style={Styles.subtitle}>{perfil?.fecha_nacimiento}</Text>
            </View>
        </>
    );
};

export default info;
