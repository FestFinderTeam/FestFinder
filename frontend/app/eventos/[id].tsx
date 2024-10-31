import Header from "@/components/Header";
import Notch from "@/components/Notch";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, useLocalSearchParams, type Href } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

interface Evento {
    id_evento: number;
    nombre: string;
    descripcion: string;
    fecha_inicio: Date;
    direccion: string;
    horario_inicio: Date;
    horario_fin: Date;
    precioInicial: number;
    precioFinal: number;
    logo: any;
    puntuacion: number;
    puntuaciones: number;
    interesados: number;
}
interface Local {
    id_evento: number;
    nombre: string;
    telefono: string;
}

const Evento = () => {
    const params = useLocalSearchParams();
    const [evento, setEvento] = useState<Evento>();
    const [interesado, setInteresado] = useState(false);
    const [puntuacion, setCalificacion] = useState(0);
    const [local, setLocal] = useState<Local>();
    console.log(params);

    useEffect(() => {
        const { id_evento } = params;
        //hacer la peticion en base al id_evento del evento
        const evento = {
            id_evento: 1,
            nombre: "Noche de colores",
            descripcion:
                "¡Prepárate para una noche llena de brillo y energía! Únete a nuestra Fiesta Neon, donde los colores vibran, la música no para y tú eres el protagonista. ¡No te pierdas la experiencia más electrizante del año!",
            fecha_inicio: new Date("2024-11-19"),
            direccion: "Av Melchor Urquidi S/N, Cochabamba",
            horario_inicio: new Date("24-11-19 18:00"),
            horario_fin: new Date("24-11-20 04:00"),
            precioInicial: 50,
            precioFinal: 100,
            logo: require("../../assets/images/alice-park-event-1.png"),
            puntuacion: 4,
            puntuaciones: 150,
            interesados: 200,
        };
        const local = {
            id_evento: 1,
            nombre: "Alice Park",
            telefono: "70711360",
        };

        setLocal(local);
        setEvento(evento);
    }, []);

    const obtenerEstrellas = () => {
        const estrellas = Array(5).fill(0);
        return estrellas.map((item, index) => (
            <FontAwesome
                name="star"
                color={index < (evento?.puntuacion || 0) ? "orange" : "gray"}
            />
        ));
    };

    if (!evento) {
        return <Text>Cargando evento...</Text>;
    }
    return (
        <View>
            <Header title={evento.nombre} />
            <ScrollView>
                <Image
                    source={evento.logo}
                    style={{ height: 250, aspectRatio: "3/4" }}
                />
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <View style={{ flexDirection: "row" }}>
                        {obtenerEstrellas()}
                    </View>
                    <View>
                        <Text>({evento.puntuaciones} puntuaciones)</Text>
                    </View>
                    <Text>{evento.interesados} interesados</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <FontAwesome name="circle" />
                    <Text>{evento.direccion}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <Text>Fecha:</Text>
                    <Text>
                        {evento.fecha_inicio.toLocaleString("es-ES", {
                            month: "short",
                            year: "2-digit",
                            day: "numeric",
                        })}
                    </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <Text>Hora:</Text>
                    <Text>
                        {evento.horario_inicio.toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hourCycle: "h12",
                        })}{" "}
                        -{" "}
                        {evento.horario_fin.toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hourCycle: "h12",
                        })}
                    </Text>
                </View>
                <Text>{evento.descripcion}</Text>

                <Text>
                    {evento.precioInicial}Bs - {evento.precioFinal}Bs
                </Text>

                <View>
                    <Text>Estas Interesado</Text>
                    <Pressable
                        onPress={() => {
                            setInteresado(true);
                        }}
                        style={[
                            { height: 10, width: 10, backgroundColor: "green" },
                            interesado && {},
                        ]}
                    />
                    <Pressable
                        style={[
                            { height: 10, width: 10, backgroundColor: "red" },
                            !interesado && {},
                        ]}
                        onPress={() => {
                            setInteresado(false);
                        }}
                    />
                </View>
                <View style={{ flexDirection: "row" }}>
                    <Text>Califica el evento</Text>
                    {Array(5)
                        .fill("")
                        .map((item, index) => (
                            <Pressable
                                key={index}
                                onPress={() => {
                                    setCalificacion(index + 1);
                                }}
                            >
                                <FontAwesome
                                    name="star"
                                    color={
                                        index < puntuacion ? "orange" : "gray"
                                    }
                                />
                            </Pressable>
                        ))}
                </View>
                <Link href={("https://wa.me/" + local?.telefono) as Href}>
                    <Text>Contactate</Text>
                </Link>
                <View>
                    <Text>¿Quieres saber mas de {local?.nombre}?</Text>
                    <Link href={("/places/" + local?.id_evento) as Href}>
                        Visita el perfil de {local?.nombre}
                    </Link>
                </View>
                <View>
                    <Text>¿Quieres saber mas del evento?</Text>
                    <Link href={("https://wa.me/" + local?.telefono) as Href}>
                        Contacta con el equipo de {local?.nombre}
                    </Link>
                </View>
            </ScrollView>
        </View>
    );
};

export default Evento;
