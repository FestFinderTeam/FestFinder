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
        const colorEstrella = "#FFA500";

        return estrellas.map((item, index) => (
            <FontAwesome
                key={index}
                name="star"
                size={18}
                color={index < (evento?.puntuacion || 0) ? colorEstrella : "#D3D3D3"}
                style={{ marginHorizontal: 2 }}
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
                    style={{
                        height: 250,
                        aspectRatio: 3 / 4,
                        alignSelf: "center",
                        borderRadius: 20,
                        marginTop: "5%",
                    }}
                />
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 10 }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                {obtenerEstrellas()}
                            </View>
                            <Text style={{ color: "#787878", marginLeft: 5 }}>
                                ({evento.puntuaciones} calificaciones)
                            </Text>
                            <Text style={{ color: "#787878", marginHorizontal: 5 }}>|</Text>
                            <Text style={{ color: "green" }}>{evento.interesados} interesados</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: "4%", marginTop: "2%" }}>
                    <FontAwesome name="circle" style={{ color: "#402158" }} />
                    <Text style={{ color: "#402158", marginLeft: 5 }}>{evento.direccion}</Text>
                </View>

                <View style={{ flexDirection: "row", marginLeft: "4%", marginTop: "2%", alignItems: "center" }}>
                    <Text style={{ color: "#402158", fontWeight: "bold", fontSize: 16, marginRight: 5 }}>Fecha:</Text>
                    <Text style={{ color: "#5A5A5A", fontSize: 16 }}>
                        {evento.fecha_inicio.toLocaleString("es-ES", {
                            month: "short",
                            year: "2-digit",
                            day: "numeric",
                        })}
                    </Text>
                </View>

                <View style={{ flexDirection: "row", marginLeft: "4%", marginTop: "2%", alignItems: "center" }}>
                    <Text style={{ color: "#402158", fontWeight: "bold", fontSize: 16, marginRight: 5 }}>Hora:</Text>
                    <Text style={{ color: "#5A5A5A", fontSize: 16 }}>
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
                <Text style={{ color: "#402158", fontWeight: "bold", fontSize: 16, marginBottom: 2, marginLeft: "4%", marginTop: "4%" }}>Descripción:</Text>
                <View style={{ alignItems: "center", marginTop: "2%" }}>
                    <View style={{
                        padding: 10,
                        backgroundColor: "white",
                        borderRadius: 10,
                        elevation: 3,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        width: "90%",
                    }}>
                        <Text style={{ color: "#5A5A5A" }}>{evento.descripcion}</Text>
                    </View>
                </View>

                <View style={{ marginLeft: "4%", marginTop: "2%", flexDirection: "row", alignItems: "center" }}>
                    <Text style={{
                        color: "#402158",
                        fontWeight: "bold",
                        fontSize: 16,
                        marginRight: 5
                    }}>
                        Precio:
                    </Text>
                    <Text style={{
                        fontSize: 16,
                        color: "#5A5A5A",
                    }}>
                        {evento.precioInicial} Bs - {evento.precioFinal} Bs
                    </Text>
                </View>
                <View style={{
                    height: 2,
                    backgroundColor: "#7D5683",
                    width: "90%",
                    alignSelf: "center",
                    marginVertical: 10
                }} />


                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, marginLeft: "4%" }}>
                    <Text style={{ color: "#402158", fontWeight: "bold", fontSize: 16, marginRight: 5 }}>
                        Estás Interesado?
                    </Text>
                    <Pressable
                        onPress={() => {
                            setInteresado(true);
                        }}
                        style={{
                            height: 20,
                            width: 20,
                            borderRadius: 12,
                            backgroundColor: interesado ? "lightgreen" : "green",
                            borderWidth: 2,
                            borderColor: interesado ? "darkgreen" : "transparent",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 10,
                        }}
                    />
                    <Pressable
                        onPress={() => {
                            setInteresado(false);
                        }}
                        style={{
                            height: 20,
                            width: 20,
                            borderRadius: 12,
                            backgroundColor: !interesado ? "lightcoral" : "red",
                            borderWidth: 2,
                            borderColor: !interesado ? "darkred" : "transparent",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    />
                </View>



                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: "4%", marginTop: "3%" }}>
                    <Text style={{ color: "#402158", fontWeight: "bold", fontSize: 16, marginRight: 5 }}>
                        Califica el evento
                    </Text>
                    {Array(5)
                        .fill("")
                        .map((item, index) => (
                            <Pressable
                                key={index}
                                onPress={() => {
                                    setCalificacion(index + 1);
                                }}
                                style={{ marginRight: 5 }} // Espacio entre las estrellas
                            >
                                <FontAwesome
                                    name="star"
                                    size={18}
                                    color={index < puntuacion ? "orange" : "#D3D3D3"}
                                />
                            </Pressable>
                        ))}
                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: "3%" }}>
                    <Link href={`https://wa.me/${local?.telefono}`}>
                        <Text style={{
                            backgroundColor: '#7D5683',
                            color: 'white',
                            fontSize: 18,
                            fontWeight: 'bold',
                            paddingVertical: 15,
                            paddingHorizontal: 50,
                            borderRadius: 10,
                            textAlign: 'center'
                        }}>
                            Contactate
                        </Text>
                    </Link>
                </View>



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
