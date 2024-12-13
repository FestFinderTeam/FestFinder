import Header from "@/components/Header";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FronAwesome from "@expo/vector-icons/FontAwesome";
import { Link, useLocalSearchParams, type Href } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
    Linking,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import Styles from "@/globalStyles/styles";
import React from "react";
import { getEventoPorID } from "@/services/eventosService";
import { marcarInteres, quitarInteres } from "@/services/AsistenciaService";
import { calificarEvento } from "@/services/AsistenciaService";
import { getEstablecimientoPorId } from "@/services/establecimientosServices";
import { ActivityIndicator } from "react-native-paper";
import { useSession } from "@/hooks/ctx";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Modal, TouchableOpacity } from "react-native";
export interface Evento {
    id_evento: number;
    nombre: string;
    descripcion: string;
    fecha_inicio: Date;
    fecha_final: Date;
    direccion: string;
    horario_inicio: Date;
    horario_fin: Date;
    precio_min: number;
    precio_max: number;
    logo: any;
    puntuacion: number;
    puntuaciones: number;
    interesados: number;
    id_establecimiento: any;
    id_establecimiento_detail: any;
    calificacion: number;
}
export interface Local {
    id: number;
    nombre: string;
    telefono: string;
}

const Evento = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const shareOptions: {
        name: string;
        icon:
            | "whatsapp"
            | "facebook"
            | "copy"
            | "x-twitter"
            | "telegram"
            | "envelope";
        action: () => void;
        color: string;
    }[] = [
        {
            name: "Copiar enlace",
            icon: "copy",
            action: () => {
                Clipboard.setString(
                    `https://fest-finder.vercel.app/eventos/${evento?.id_evento}`
                );
            },
            color: "#fcba03",
        },
        {
            name: "WhatsApp",
            icon: "whatsapp",
            action: () => {
                Linking.openURL(
                    `https://wa.me/?text=https://fest-finder.vercel.app/eventos/${evento?.id_evento}`
                );
            },
            color: "#25D366",
        },
        {
            name: "Facebook",
            icon: "facebook",
            action: () => {
                Linking.openURL(
                    `https://www.facebook.com/sharer/sharer.php?u=https://fest-finder.vercel.app/eventos/${evento?.id_evento}`
                );
            },
            color: "#3b5998",
        },
        {
            name: "X",
            icon: "x-twitter",
            action: () => {
                Linking.openURL(
                    `https://twitter.com/intent/tweet?url=https://fest-finder.vercel.app/eventos/${evento?.id_evento}`
                );
            },
            color: "#1DA1F2",
        },
        {
            name: "Telegram",
            icon: "telegram",
            action: () => {
                Linking.openURL(
                    `https://t.me/share/url?url=https://fest-finder.vercel.app/eventos/${evento?.id_evento}`
                );
            },
            color: "#0088cc",
        },
        {
            name: "Correo Electrónico",
            icon: "envelope",
            action: () => {
                Linking.openURL(
                    `mailto:?subject=Mira este evento&body=https://fest-finder.vercel.app/eventos/${evento?.id_evento}`
                );
            },
            color: "#D44638",
        },
    ];

    const { session } = useSession();
    const [ejemplo, setEjemplo] = useState<any | null>(null);
    const params = useLocalSearchParams();
    const [evento, setEvento] = useState<Evento>();
    const [interesado, setInteresado] = useState(false);
    const [puntuacion, setCalificacion] = useState(0);
    const [local, setLocal] = useState<Local>();
    //console.log(params);

    const obtenerDatosEvento = async (id: string) => {
        const data = await getEventoPorID(id);
        console.log(data.id_establecimiento_detail);
        setLocal(data.id_establecimiento_detail);
        data.fecha_inicio = new Date(data.fecha_inicio);
        data.fecha_final = new Date(data.fecha_final);
        data.horario_inicio = new Date(`1970-01-01T${data.horario_inicio}Z`);
        data.horario_fin = new Date(`1970-01-01T${data.horario_fin}Z`);
        setEvento(data);
    };

    const obtenerDatosEstablecimiento = async (id: string) => {
        const data = await getEstablecimientoPorId(id);
        //console.log(data);
        setLocal(data);
    };

    const cambiarInteres = async (interes: boolean) => {
        if (interes) {
            marcarInteres(session?.id_usuario + "", evento?.id_evento + "");
        } else {
            quitarInteres(session?.id_usuario + "", evento?.id_evento + "");
        }
    };

    useEffect(() => {
        const { id } = params;
        if (id) {
            obtenerDatosEvento(id as string);
        }
    }, []);

    useEffect(() => {
        if (evento && evento.id_establecimiento && !local) {
            obtenerDatosEstablecimiento(evento.id_establecimiento + "");
        }
    }, [evento, local]);

    const obtenerEstrellas = (calificacion: number) => {
        const totalEstrellas = 5;
        const estrellas = [];
        const colorEstrella = "#FFA500";

        // Calcular cuántas estrellas están llenas, vacías y a la mitad
        for (let i = 0; i < totalEstrellas; i++) {
            const calificacionRestante = calificacion - i;

            if (calificacionRestante >= 1) {
                // Estrella llena
                estrellas.push(
                    <FronAwesome
                        key={i}
                        name="star"
                        size={18}
                        color={colorEstrella}
                        style={{ marginHorizontal: 2 }}
                    />
                );
            } else if (calificacionRestante >= 0.5) {
                // Estrella mitad
                estrellas.push(
                    <FronAwesome
                        key={i}
                        name="star-half"
                        size={18}
                        color={colorEstrella}
                        style={{ marginHorizontal: 2 }}
                    />
                );
            } else {
                // Estrella vacía
                estrellas.push(
                    <FronAwesome
                        key={i}
                        name="star-o"
                        size={18}
                        color="#D3D3D3"
                        style={{ marginHorizontal: 2 }}
                    />
                );
            }
        }

        return estrellas;
    };

    const handleCalificar = async () => {
        try {
            if (!evento || puntuacion === 0) {
                alert(
                    "Por favor, selecciona una puntuación y escribe un comentario."
                );
                return;
            }

            const response = await calificarEvento(
                session?.id_usuario + "", // ID del usuario
                evento.id_evento + "", // ID del evento
                puntuacion, // Puntuación seleccionada
                "" // Comentario ingresado
            );

            if (response && response.success) {
                alert("¡Calificación registrada con éxito!");
                //setComentario(""); // Reinicia el comentario
                setCalificacion(0); // Reinicia la puntuación
            } else {
                alert("Hubo un problema al registrar la calificación.");
            }
        } catch (error) {
            console.error(error);
            alert("Ocurrió un error inesperado.");
        }
    };

    if (!evento || !local)
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator animating={true} size="large" />
            </View>
        );
    return (
        <>
            <Header title={"Informacion del evento"} />
            <ScrollView>
                <Text
                    style={[
                        Styles.subtitle,
                        {
                            color: "black",
                            fontWeight: "bold",
                            marginTop: "2%",
                            marginLeft: "2%",
                        },
                    ]}
                >
                    {local?.nombre} - {evento.nombre}
                </Text>

                <Image
                    source={{ uri: evento.logo }}
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
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 10,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                {obtenerEstrellas(evento.calificacion)}
                            </View>
                            <Text
                                style={{
                                    color: "#787878",
                                    marginHorizontal: 5,
                                }}
                            >
                                |
                            </Text>
                            <Text style={{ color: "green" }}>
                                {evento.interesados} personas interesadas
                            </Text>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: "4%",
                        marginTop: "2%",
                    }}
                >
                    <FontAwesome6 name="circle" style={{ color: "#402158" }} />
                    <Text style={{ color: "#402158", marginLeft: 5 }}>
                        {evento.id_establecimiento_detail.direccion}
                    </Text>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        marginLeft: "4%",
                        marginTop: "2%",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            color: "#402158",
                            fontWeight: "bold",
                            fontSize: 16,
                            marginRight: 5,
                        }}
                    >
                        Fecha:
                    </Text>
                    <Text style={{ color: "#5A5A5A", fontSize: 16 }}>
                        {evento.fecha_inicio.toLocaleString("es-ES", {
                            month: "short",
                            year: "2-digit",
                            day: "numeric",
                        })}
                    </Text>
                    <Text
                        style={{
                            color: "#402158",
                            fontWeight: "bold",
                            fontSize: 16,
                            marginRight: 5,
                        }}
                    >
                        {" "}
                        -{" "}
                    </Text>
                    <Text style={{ color: "#5A5A5A", fontSize: 16 }}>
                        {evento.fecha_final.toLocaleString("es-ES", {
                            month: "short",
                            year: "2-digit",
                            day: "numeric",
                        })}
                    </Text>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        marginLeft: "4%",
                        marginTop: "2%",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            color: "#402158",
                            fontWeight: "bold",
                            fontSize: 16,
                            marginRight: 5,
                        }}
                    >
                        Hora:
                    </Text>
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
                <Text
                    style={{
                        color: "#402158",
                        fontWeight: "bold",
                        fontSize: 16,
                        marginBottom: 2,
                        marginLeft: "4%",
                        marginTop: "4%",
                    }}
                >
                    Descripción:
                </Text>
                <View style={{ alignItems: "center", marginTop: "2%" }}>
                    <View
                        style={{
                            padding: 10,
                            backgroundColor: "white",
                            borderRadius: 10,
                            elevation: 3,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 4,
                            width: "90%",
                        }}
                    >
                        <Text style={{ color: "#5A5A5A" }}>
                            {evento.descripcion}
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        marginLeft: "4%",
                        marginRight: "4%",
                        marginTop: "2%",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                    >
                        <Text
                            style={{
                                color: "#402158",
                                fontWeight: "bold",
                                fontSize: 16,
                                marginRight: 5,
                            }}
                        >
                            Precio:
                        </Text>
                        <Text
                            style={{
                                fontSize: 16,
                                color: "#5A5A5A",
                            }}
                        >
                            {evento.precio_min} Bs - {evento.precio_max} Bs
                        </Text>
                    </View>
                    <Pressable
                        onPress={() => {
                            setModalVisible(true);
                        }}
                        style={{
                            marginLeft: 10,
                            padding: 5,
                            borderRadius: 5,
                            backgroundColor: "#402158",
                        }}
                    >
                        <FontAwesome6 name="share" size={20} color="white" />
                    </Pressable>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "rgba(0,0,0,0.2)",
                            }}
                        >
                            <View
                                style={{
                                    width: "90%",
                                    padding: 20,
                                    backgroundColor: "white",
                                    borderRadius: 10,
                                    alignItems: "center",
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 4,
                                    elevation: 5,
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignContent: "center",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        width: "100%",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Compartir evento
                                    </Text>

                                    <Pressable
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Ionicons
                                            name="close-outline"
                                            size={24}
                                            color="black"
                                        />
                                    </Pressable>
                                </View>
                                {shareOptions.map((option, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            option.action();
                                            setModalVisible(false);
                                        }}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            padding: 10,
                                            width: "100%",
                                        }}
                                    >
                                        <FontAwesome6
                                            name={option.icon}
                                            size={24}
                                            color={option.color}
                                        />
                                        <Text
                                            style={{
                                                marginLeft: 10,
                                                fontSize: 16,
                                                color: option.color,
                                            }}
                                        >
                                            {option.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </Modal>
                </View>
                <View
                    style={{
                        height: 2,
                        backgroundColor: "#7D5683",
                        width: "90%",
                        alignSelf: "center",
                        marginVertical: 10,
                    }}
                />

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 10,
                        marginLeft: "4%",
                    }}
                >
                    <Text
                        style={{
                            color: "#402158",
                            fontWeight: "bold",
                            fontSize: 16,
                            marginRight: 5,
                        }}
                    >
                        Estás Interesado?
                    </Text>
                    <Pressable
                        onPress={() => {
                            setInteresado(true);
                            cambiarInteres(true);
                        }}
                        style={{
                            height: 20,
                            width: 20,
                            borderRadius: 12,
                            backgroundColor: interesado
                                ? "lightgreen"
                                : "green",
                            borderWidth: 2,
                            borderColor: interesado
                                ? "darkgreen"
                                : "transparent",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 10,
                        }}
                    />
                    <Pressable
                        onPress={() => {
                            setInteresado(false);
                            cambiarInteres(false);
                        }}
                        style={{
                            height: 20,
                            width: 20,
                            borderRadius: 12,
                            backgroundColor: !interesado ? "lightcoral" : "red",
                            borderWidth: 2,
                            borderColor: !interesado
                                ? "darkred"
                                : "transparent",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    />
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: "4%",
                        marginTop: "3%",
                    }}
                >
                    <Text
                        style={{
                            color: "#402158",
                            fontWeight: "bold",
                            fontSize: 16,
                            marginRight: 5,
                        }}
                    >
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
                                style={{ marginRight: 5 }}
                            >
                                <FontAwesome6
                                    name="star"
                                    size={18}
                                    color={
                                        index < puntuacion
                                            ? "orange"
                                            : "#D3D3D3"
                                    }
                                />
                            </Pressable>
                        ))}
                </View>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Pressable style={Styles.button} onPress={handleCalificar}>
                        <Text style={Styles.buttonText}>Calificar</Text>
                    </Pressable>
                </View>
                <View
                    style={{
                        borderWidth: 2,
                        borderColor: "black",
                        padding: 16,
                        borderRadius: 8,
                        margin: 16,
                    }}
                >
                    <View
                        style={{
                            borderWidth: 1,
                            borderColor: "black",
                            padding: 12,
                            borderRadius: 4,
                            marginVertical: 8,
                        }}
                    >
                        <Text>
                            ¿Quieres saber más de{" "}
                            <Text style={{ color: "#402158" }}>
                                {local?.nombre}
                            </Text>
                            ?
                        </Text>
                        <Link
                            href={`/places/${local?.id}`}
                            style={{ textDecorationLine: "underline" }}
                        >
                            Visita el perfil de{" "}
                            <Text style={{ color: "#402158" }}>
                                {local?.nombre}
                            </Text>
                        </Link>
                    </View>
                    <View
                        style={{
                            borderWidth: 1,
                            borderColor: "black",
                            padding: 12,
                            borderRadius: 4,
                            marginVertical: 8,
                        }}
                    >
                        <Text>¿Quieres saber más del evento?</Text>
                        <Link
                            href={`https://wa.me/${local?.telefono}`}
                            style={{ textDecorationLine: "underline" }}
                        >
                            Contacta con el equipo de{" "}
                            <Text style={{ color: "#402158" }}>
                                {local?.nombre}
                            </Text>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </>
    );
};

export default Evento;
