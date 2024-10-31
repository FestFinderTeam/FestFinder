import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, router, useLocalSearchParams, type Href } from "expo-router";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Styles from "@/globalStyles/styles";
import moment from "moment";

import {
    ImageBackground,
    Text,
    View,
    StyleSheet,
    Image,
    Pressable,
    TextInput,
    ScrollView,
    FlatList,
    Modal,
} from "react-native";

type Establecimiento = {
    id: number;
    nombre: string;
    direccion?: string;
    descripcion?: string;
    nombre_tipo?: string;
    nro_ref?: string;
    banner?: any;
    logo?: any;
    puntuacion?: number;
};

type Evento = {
    id_evento: number;
    nombre: string;
    fecha_inicio: Date;
    horario_inicio?: string;
    logo: any;
};

type Params = {
    id: string;
};

interface Horario {
    inicio_atencion: string;
    fin_atencion: string;
}
export interface HorarioAtencion {
    dia: number;
    horario: Horario | null;
}

export const days = [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
    "Domingo",
];

const Place = () => {
    const [establecimiento, setEstablecimiento] =
        useState<Establecimiento | null>(null);
    const [etiquetas, setEtiquetas] = useState<string[]>([]);
    const [proximosEventos, setProximosEventos] = useState<Evento[]>([]);
    const [fotos, setFotos] = useState<any[]>([]);
    const [lugaresParecidos, setLugaresParecidos] = useState<Establecimiento[]>([]);
    const [horarioAtencion, setHorarioAtencion] = useState<HorarioAtencion[]>(
        []
    );
    const [horarioOpened, setHorarioOpened] = useState<boolean>(false);
    const [establecimientoAbierto, setEstablecimientoAbierto] =
        useState<Boolean>(false);

    const params = useLocalSearchParams();

    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    });
    useEffect(() => {
        const prepare = async () => {
            try {
                if (!fontsLoaded) {
                    await SplashScreen.preventAutoHideAsync();
                }
            } catch (e) {
                console.warn(e);
            }
        };
        prepare();
    }, [fontsLoaded]);

    useEffect(() => {
        
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    useEffect(() => {
        // id del establecimiento
        const { id } = params;

        // Simulación de llamada a API para el establecimiento
        const establecimiento = {
            id: 1,
            nombre: "Alice Park",
            direccion: "Av Melchor Urquidi S/N, Cochabamba",
            descripcion: "",
            banner: require("../../assets/images/alice-park.png"),
            logo: require("../../assets/images/alice-park.png"),
            nombre_tipo: "Discoteca",
            nro_ref: "70711360",
            puntuacion: 9.2
        };

        // Simulación de llamada a API para etiquetas
        const etiquetas = [
            "Etiqueta 1",
            "Etiqueta 2",
            "Etiqueta 3",
            "Etiqueta 4",
        ];

        // Simulación de llamada a API para valoraciones

        // Simulación de llamada a API para próximos eventos
        const proximosEventos = [
            {
                id_evento: 2,
                nombre: "Alice Park-Noche de colores",
                fecha_inicio: new Date("2024-09-02"),
                logo: require("../../assets/images/alice-park-event-1.png"),
            },
            {
                id_evento: 3,
                nombre: "Alice Park - Neon Party",
                fecha_inicio: new Date("2024-09-07"),
                logo: require("../../assets/images/alice-park-event-2.png"),
            },
            {
                id_evento: 4,
                nombre: "Alice Park-Noche de colores",
                fecha_inicio: new Date("2024-09-02"),
                logo: require("../../assets/images/alice-park-event-1.png"),
            },
            {
                id_evento: 5,
                nombre: "Alice Park - Neon Party",
                fecha_inicio: new Date("2024-09-07"),
                logo: require("../../assets/images/alice-park-event-2.png"),
            },
        ];

        // Simulación de llamada a API para fotos
        const fotos = [
            require("../../assets/images/alice-park-1.png"),
            require("../../assets/images/alice-park-2.png"),
        ];

        const lugaresParecidos = [
            {
                id: 10,
                nombre: "Mandarina",
                puntuacion: 8,
                logo: require("../../assets/images/lugar-1.png"),
            },
            {
                id: 11,
                nombre: "Noma",
                puntuacion: 9,
                logo: require("../../assets/images/lugar-2.png"),
            },
            {
                id: 12,
                nombre: "Euphoria",
                puntuacion: 9,
                logo: require("../../assets/images/lugar-3.png"),
            },
            {
                id: 13,
                nombre: "Mamba",
                puntuacion: 9,
                logo: require("../../assets/images/lugar-4.png"),
            },
        ];

        const horarioAtencion = [
            {
                dia: 0,
                horario: {
                    inicio_atencion: "09:00",
                    fin_atencion: "01:00",
                },
            },
            {
                dia: 1,
                horario: null,
            },
            {
                dia: 2,
                horario: null,
            },
            {
                dia: 3,
                horario: null,
            },
            {
                dia: 4,
                horario: null,
            },
            {
                dia: 5,
                horario: {
                    inicio_atencion: "19:00",
                    fin_atencion: "01:00",
                },
            },
            {
                dia: 6,
                horario: {
                    inicio_atencion: "19:00",
                    fin_atencion: "01:00",
                },
            },
        ];

        const isOpenToday = () => {
            const today = getDay(new Date());
            const atencionToday = horarioAtencion.filter(
                (horario) => horario.dia === today
            )[0];
            const horarioToday = atencionToday.horario;

            if (!horarioToday) return false;

            const inicio_atencion = moment(horarioToday.inicio_atencion, "HH:mm");
            const fin_atencion = moment(horarioToday.fin_atencion, "HH:mm");
            const current = moment();

            if (fin_atencion.isBefore(inicio_atencion)) {
                // Verificar si está entre 'inicio_atencion' y medianoche o entre medianoche y 'fin_atencion'
                return (
                    current.isBetween(inicio_atencion, moment("23:59:59", "HH:mm")) ||
                    current.isBetween(moment("00:00", "HH:mm"), fin_atencion)
                );
            }

            // Si no cruza medianoche, comprobar de forma estándar
            return current.isBetween(inicio_atencion, fin_atencion);
        };

        // Establecer los estados
        setEstablecimiento(establecimiento);
        setEtiquetas(etiquetas);
        setProximosEventos(proximosEventos);
        setFotos(fotos);
        setLugaresParecidos(lugaresParecidos);
        setHorarioAtencion(horarioAtencion);
        setEstablecimientoAbierto(isOpenToday());
    }, []);

    const handleCalificar = () => {
        alert("enviando calificacion");
    };

    const handleHorariosAtencion = () => {
        setHorarioOpened(true);
    };

    const getDay = (date: Date) => {
        const day = date.getDay();
        return day === 0 ? 6 : day - 1;
    };

    return (
        <ScrollView style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={horarioOpened}
                onRequestClose={() => {}}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            padding: 20,
                            backgroundColor: "white",
                            borderRadius: 10,
                            elevation: 5,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                        }}
                    >
                        <Pressable
                            onPress={() => {
                                setHorarioOpened(false);
                            }}
                        >
                            <FontAwesome name="close" size={22} />
                        </Pressable>
                        <Text>Horarios de Atencion</Text>
                        {horarioAtencion.map((horario, index) => (
                            <View
                                key={index}
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text>{days[horario.dia]}</Text>

                                <Text>
                                    {horario.horario
                                        ? horario.horario.inicio_atencion +
                                          " / " +
                                          horario.horario.fin_atencion
                                        : "Cerrado"}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </Modal>

            {establecimiento && (
                <>
                    <ImageBackground
                        source={establecimiento.banner}
                        style={Styles.imageBanner}
                    >
                        <Pressable onPress={router.back}>
                            <FontAwesome
                                name="arrow-left"
                                color={"white"}
                                size={30}
                                style={{
                                    position: "absolute",
                                    top: 40,
                                    left: 10,
                                }}
                            />
                        </Pressable>
                        <FontAwesome
                            name="heart"
                            color={"white"}
                            size={30}
                            style={{
                                position: "absolute",
                                bottom: 10,
                                right: 10,
                            }}
                        />
                    </ImageBackground>

                    <Image
                        source={establecimiento.logo}
                        style={[
                            styles.redondoImg,
                            styles.contenedorIMG,
                            {
                                left: "2%",
                            },
                        ]}
                    />
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <View style={styles.localInfo}>
                            <Text
                                style={[
                                    { fontFamily: "Poppins-Bold" },
                                    { left: "10%" },
                                    styles.nombreLocal,
                                ]}
                            >
                                {establecimiento.nombre}
                            </Text>
                            <Text
                                style={[
                                    { fontFamily: "Poppins-Regular" },
                                    { left: "10%" },
                                    styles.tipoLocal,
                                ]}
                            >
                                {establecimiento.nombre_tipo}
                            </Text>
                        </View>
                        <View style={{ top: "-20%", right: "40%" }}>
                            <Link href={"https://wa.link/9nq0oq"}>
                                <FontAwesome
                                    name="whatsapp"
                                    color={"green"}
                                    size={30}
                                />
                            </Link>
                        </View>
                    </View>

                    <View style={styles.localData}>
                        <Text
                            style={
                                establecimientoAbierto
                                    ? { color: "green" }
                                    : { color: "red" }
                            }
                        >
                            <FontAwesome
                                name="circle"
                                color={establecimientoAbierto ? "green" : "red"}
                                size={15}
                            />
                            {establecimientoAbierto ? "Abierto" : "Cerrado"}
                        </Text>
                        <Pressable onPress={handleHorariosAtencion}>
                            <Text>
                                Ver horario y dias de atencion
                                <FontAwesome name="chevron-down" size={15} />
                            </Text>
                        </Pressable>

                        <Text
                            style={[
                                { fontFamily: "Poppins-Regular" },
                                { marginLeft: 10, fontSize: 14 },
                            ]}
                        >
                            <FontAwesome
                                name="location-arrow"
                                style={{ marginRight: 10 }}
                            />
                            {establecimiento.direccion}
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                            }}
                        >
                            {etiquetas.map((etiqueta) => (
                                <Text
                                    key={etiqueta}
                                    style={[
                                        {
                                            fontFamily: "Poppins-Regular",
                                            marginTop: "3%",
                                        },
                                        {
                                            backgroundColor:
                                                "rgba(235, 182, 255, 0.5)",
                                            borderRadius: 10,
                                            paddingHorizontal: 8,
                                        },
                                    ]}
                                >
                                    {etiqueta}
                                </Text>
                            ))}
                        </View>
                        <Text
                            style={[
                                { fontFamily: "Poppins-Regular" },
                                {
                                    color: "#402158",
                                    marginLeft: "3%",
                                    marginTop: "3%",
                                },
                            ]}
                        >
                            Calificación
                        </Text>
                        <View
                            style={{
                                borderColor: "#7D5683",
                                borderWidth: 2,
                                borderRadius: 10,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "95%",
                                alignSelf: "center",
                                borderStyle: "dashed",
                            }}
                        >
                            <View>
                                <Text
                                    style={{
                                        marginLeft: "2%",
                                        fontFamily: "Poppins-SemiBold",
                                        marginTop: 5,
                                    }}
                                >
                                    {" "}
                                    <FontAwesome
                                        name="star"
                                        color={"orange"}
                                    />{" "}
                                    {establecimiento.puntuacion} / 10
                                </Text>
                                <TextInput
                                    style={{
                                        marginLeft: "3%",
                                        marginTop: "-2%",
                                    }}
                                    placeholder="Añade tus calificaciones y reseñas"
                                    placeholderTextColor="#7D5683"
                                />
                            </View>
                            <Pressable
                                onPress={handleCalificar}
                                style={{
                                    borderColor: "#402158",
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    paddingHorizontal: 6,
                                    paddingVertical: 2,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: "2%",
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "Poppins-Regular",
                                        color: "#402158",
                                        textAlign: "center",
                                    }}
                                >
                                    Calificar
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                    <Text
                        style={{
                            marginTop: "4%",
                            fontFamily: "Poppins-SemiBold",
                            fontSize: 18,
                            marginLeft: "3%",
                        }}
                    >
                        Eventos próximos
                    </Text>
                    <FlatList
                        style={{ marginLeft: "3%" }}
                        data={proximosEventos}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => {
                                    router.navigate(
                                        ("/eventos/" + item.id_evento) as Href
                                    );
                                }}
                                style={{
                                    flexDirection: "column",
                                    flex: 1,
                                    borderRadius: 150,
                                    marginTop: "2%",
                                }}
                                key={item.id_evento}
                            >
                                <ImageBackground
                                    source={item.logo}
                                    style={{
                                        height: 200,
                                        width: 150,
                                        borderRadius: 150,
                                        alignItems: "flex-end",
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor: "white",
                                            width: "35%",
                                            alignItems: "center",
                                            padding: 3,
                                            borderRadius: 10,
                                            marginTop: 5,
                                            marginRight: 5,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 24,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {item.fecha_inicio.getDate()}
                                        </Text>
                                        <Text style={{ fontSize: 12 }}>
                                            {item.fecha_inicio.toLocaleString(
                                                "es-ES",
                                                { month: "short" }
                                            )}
                                        </Text>
                                    </View>
                                </ImageBackground>
                                <Text style={{ fontFamily: "Poppins-Regular" }}>
                                    {item.nombre}
                                </Text>
                            </Pressable>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                    />
                    
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text
                            style={{
                                marginTop: "4%",
                                fontFamily: "Poppins-SemiBold",
                                fontSize: 18,
                                marginLeft: "3%",
                            }}
                        >
                            Fotos
                        </Text>
                        <Link
                            href={"/"}
                            style={{
                                marginTop: "4%",
                                fontFamily: "Poppins-regular",
                                color: "#7D5683",
                                marginRight: "3%",
                            }}
                        >
                            Ver más <FontAwesome name="arrow-right" />
                        </Link>
                    </View>
                    <FlatList
                        style={{ marginLeft: "3%" }}
                        data={fotos}
                        renderItem={({ item }) => (
                            <Image
                                source={item}
                                style={{
                                    width: "auto",
                                    height: 150,
                                    aspectRatio: "16/9",
                                    margin: 3,
                                    borderRadius: 10,
                                }}
                            />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                    />
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text
                            style={{
                                marginTop: "4%",
                                fontFamily: "Poppins-SemiBold",
                                fontSize: 18,
                                marginLeft: "3%",
                            }}
                        >
                            Lugares parecidos
                        </Text>
                        <Link
                            href={"/"}
                            style={{
                                marginTop: "4%",
                                fontFamily: "Poppins-regular",
                                color: "#7D5683",
                                marginRight: "3%",
                            }}
                        >
                            Ver más <FontAwesome name="arrow-right" />
                        </Link>
                    </View>

                    <FlatList
                        data={lugaresParecidos}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => {
                                    router.navigate(
                                        ("/places/" + item.id) as Href
                                    );
                                }}
                                style={{
                                    alignItems: "center",
                                    margin: 10,
                                }}
                            >
                                <Image
                                    source={item.logo}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        marginBottom: 5,
                                        borderRadius: 100,
                                    }}
                                />
                                <Text
                                    style={{
                                        fontFamily: "Poppins-Regular",
                                        textAlign: "center",
                                    }}
                                >
                                    {item.nombre}
                                </Text>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <FontAwesome name="star" color={"orange"} />
                                    <Text
                                        style={{
                                            marginLeft: 5,
                                            fontFamily: "Poppins-SemiBold",
                                        }}
                                    >
                                        {item.puntuacion}/10
                                    </Text>
                                </View>
                            </Pressable>
                        )}
                        horizontal
                    />
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageBackground: {
        width: "100%",
        height: 200,
        justifyContent: "space-between",
    },
    text: {
        fontSize: 24,
        color: "#fff",
        textAlign: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 10,
    },
    logo: {
        width: 150,
        height: 150,
        borderRadius: 100,
    },
    contenedorIMG: {
        top: -70,
    },
    redondoImg: {
        width: 120,
        height: 120,
        borderRadius: 100,
    },
    nombreLocal: {
        fontSize: 24,
    },
    tipoLocal: {
        backgroundColor: "#e0dede",
        borderRadius: 30,
        paddingHorizontal: 5,
        textAlign: "center",
    },
    localInfo: {
        top: "-20%",
    },
    localData: {
        marginTop: "-18%",
    },
});

export default Place;
