import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, router, useLocalSearchParams, type Href } from "expo-router";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Styles from "@/globalStyles/styles";
import moment from "moment";
import ImageViewing from "react-native-image-viewing";
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
import {
    getEstablecimientoPorId,
    getEstablecimientosSimilares,
    getEventosPorEstablecimiento,
} from "@/services/establecimientosServices";
import EventItem from "@/components/EventItem";
import GoogleMap from "@/components/GoogleMap";
import LoadingScreen from "@/components/Loading";
import type { EstablecimientoType } from "../(tabs)/mapa";

type Establecimiento = {
    id: number;
    nombre: string;
    direccion?: string;
    tipo_fk?: number;
    tipo_fk_detail?: any;
    nombre_tipo?: string;
    nro_ref?: string;
    banner?: string;
    logo?: string;
    puntuacion?: number;
    etiquetas?: any;
    coordenada_x?: number;
    coordenada_y?: number;
};

type Evento = {
    id_evento: number;
    nombre: string;
    fecha_inicio: string;
    horario_inicio?: string;
    logo: any;
    id_genero_fk_detail: any;
};

interface Horario {
    inicio_atencion: string;
    fin_atencion: string;
}
export interface HorarioAtencion {
    dia: number;
    horario: Horario | null;
}

export interface Etiqueta {
    id_etiqueta: number;
    texto_etiqueta: string;
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
    const [loading, setLoading] = useState(false);
    const [establecimiento, setEstablecimiento] =
        useState<Establecimiento | null>(null);
    const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
    const [proximosEventos, setProximosEventos] = useState<Evento[]>([]);
    const [fotos, setFotos] = useState<any[]>([]);
    const [lugaresParecidos, setLugaresParecidos] = useState<Establecimiento[]>(
        []
    );
    const [horarioAtencion, setHorarioAtencion] = useState<HorarioAtencion[]>(
        []
    );
    const [calificacion, setCalificacion] = useState(0);
    const [textoCalificacion, setTextoCalificacion] = useState("");
    const [horarioOpened, setHorarioOpened] = useState<boolean>(false);
    const [establecimientoAbierto, setEstablecimientoAbierto] =
        useState<Boolean>(false);
    const [visibleImages, setVisibleImages] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const params = useLocalSearchParams();
    const [toggleMap, setToggleMap] = useState(false);

    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    });

    const obtenerDatosEstablecimiento = async (establecimientoId: any) => {
        setLoading(true);
        const data = await getEstablecimientoPorId(establecimientoId);
        console.log("establecimiento", data);
        setLoading(false);
        setEstablecimiento(data);
    };

    const obtenerEstablecimientosSimialres = async (establecimientoId: any) => {
        setLoading(true);
        const data = await getEstablecimientosSimilares(establecimientoId);
        //console.log(data);
        setLoading(false);
        setLugaresParecidos(data);
    };

    const obtenerDatosEventos = async (establecimientoId: any) => {
        setLoading(true);
        const data = await getEventosPorEstablecimiento(establecimientoId);
        console.log(data);
        //console.log(data);
        setLoading(false);
        setProximosEventos(data);
    };

    useEffect(() => {
        if (establecimiento && establecimiento.etiquetas && !etiquetas) {
            setEtiquetas(establecimiento.etiquetas);
        }
    }, [establecimiento]);

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
        const { id } = params;
        obtenerDatosEstablecimiento(id);
        obtenerDatosEventos(id);
        obtenerEstablecimientosSimialres(id);

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

            const inicio_atencion = moment(
                horarioToday.inicio_atencion,
                "HH:mm"
            );
            const fin_atencion = moment(horarioToday.fin_atencion, "HH:mm");
            const current = moment();

            if (fin_atencion.isBefore(inicio_atencion)) {
                // Verificar si está entre 'inicio_atencion' y medianoche o entre medianoche y 'fin_atencion'
                return (
                    current.isBetween(
                        inicio_atencion,
                        moment("23:59:59", "HH:mm")
                    ) ||
                    current.isBetween(moment("00:00", "HH:mm"), fin_atencion)
                );
            }

            // Si no cruza medianoche, comprobar de forma estándar
            return current.isBetween(inicio_atencion, fin_atencion);
        };

        // Establecer los estados
        setEstablecimiento(establecimiento);
        setEtiquetas(establecimiento?.etiquetas);
        setProximosEventos(proximosEventos);
        //setFotos(fotos);
        setLugaresParecidos(lugaresParecidos);
        setHorarioAtencion(horarioAtencion);
        setEstablecimientoAbierto(isOpenToday());
    }, []);

    const handleCalificar = () => {
        alert(`Calificación: ${calificacion}, Reseña: ${textoCalificacion}`);
    };

    const handleHorariosAtencion = () => {
        setHorarioOpened(true);
    };

    const getDay = (date: Date) => {
        const day = date.getDay();
        return day === 0 ? 6 : day - 1;
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <>
            {toggleMap && (
                <View
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        top: 0,
                        zIndex: 10,
                        flex: 1,
                    }}
                >
                    <GoogleMap
                        location={establecimiento ? {
                            latitude: Number(establecimiento.coordenada_y),
                            longitude: Number(establecimiento.coordenada_x),
                        } : null}
                        establecimientos={[
                            establecimiento as EstablecimientoType,
                        ]}
                        userLocation
                        onClose={() => { setToggleMap(false) }}
                    />
                </View>
            )}

            <ScrollView style={styles.container}>
                <ImageViewing
                    images={fotos}
                    imageIndex={imageIndex}
                    visible={visibleImages}
                    onRequestClose={() => setVisibleImages(false)}
                    doubleTapToZoomEnabled={true}
                    swipeToCloseEnabled={true}
                />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={horarioOpened}
                    onRequestClose={() => { }}
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
                                paddingTop: 40,
                                backgroundColor: "white",
                                borderRadius: 10,
                                elevation: 5,
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowRadius: 2,
                                position: "relative",
                            }}
                        >
                            <Pressable
                                onPress={() => setHorarioOpened(false)}
                                style={{
                                    position: "absolute",
                                    top: 10,
                                    right: 10,
                                    padding: 5,
                                    borderRadius: 15,
                                    backgroundColor: "#f0f0f0",
                                }}
                            >
                                <FontAwesome
                                    name="close"
                                    size={22}
                                    color="#787878"
                                />
                            </Pressable>

                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: "bold",
                                    marginBottom: 10,
                                    textAlign: "center",
                                    color: "#333",
                                }}
                            >
                                Horarios de Atención
                            </Text>

                            {horarioAtencion.map((horario, index) => (
                                <View
                                    key={index}
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        paddingVertical: 5,
                                        borderBottomWidth:
                                            index < horarioAtencion.length - 1
                                                ? 1
                                                : 0,
                                        borderBottomColor: "#e0e0e0",
                                    }}
                                >
                                    <Text
                                        style={{ fontSize: 16, color: "#666" }}
                                    >
                                        {days[horario.dia]}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: "#444",
                                            fontWeight: horario.horario
                                                ? "500"
                                                : "300",
                                        }}
                                    >
                                        {horario.horario
                                            ? `${horario.horario.inicio_atencion} / ${horario.horario.fin_atencion}`
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
                            source={
                                establecimiento.banner
                                    ? { uri: establecimiento.banner }
                                    : require("../../assets/images/defaultBanner.jpg")
                            }
                            style={Styles.imageBanner}
                        >
                            <Pressable onPress={router.back}>
                                <FontAwesome
                                    name="arrow-left"
                                    color={"white"}
                                    size={30}
                                    style={{
                                        position: "absolute",
                                        top: 10,
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
                            source={
                                establecimiento.logo
                                    ? { uri: establecimiento.logo }
                                    : require("../../assets/images/default.jpg")
                            }
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
                                    {establecimiento.tipo_fk_detail.nombre_tipo}
                                </Text>
                            </View>
                            <View style={{ top: "-20%", right: "40%" }}>
                                <Link
                                    href={
                                        ("https://wa.me/" +
                                            establecimiento.nro_ref) as Href
                                    }
                                >
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
                                        ? { color: "green", marginLeft: "2%" }
                                        : { color: "red", marginLeft: "2%" }
                                }
                            >
                                <FontAwesome
                                    name="circle"
                                    color={
                                        establecimientoAbierto ? "green" : "red"
                                    }
                                    size={15}
                                />
                                {establecimientoAbierto
                                    ? "  Abierto"
                                    : "  Cerrado"}
                            </Text>
                            <Pressable onPress={handleHorariosAtencion}>
                                <Text
                                    style={{
                                        color: "#787878",
                                        marginLeft: "2%",
                                    }}
                                >
                                    Ver horario y dias de atencion
                                    <FontAwesome
                                        name="plus"
                                        size={12}
                                        style={{ marginLeft: 10 }}
                                    />
                                </Text>
                            </Pressable>

                            <Pressable
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginLeft: 10,
                                }}
                                onPress={() => {
                                    console.log(
                                        "Presionado:",
                                        establecimiento.direccion
                                    ); //ACA RUTEAS BB
                                    setToggleMap(true);
                                }}
                            >
                                <FontAwesome
                                    name="location-arrow"
                                    style={{ marginRight: 10, fontSize: 14 }}
                                />
                                <Text
                                    style={{
                                        fontFamily: "Poppins-Regular",
                                        fontSize: 14,
                                    }}
                                >
                                    {establecimiento.direccion}
                                </Text>
                            </Pressable>

                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-around",
                                }}
                            >
                                {etiquetas &&
                                    etiquetas.map((etiqueta) => (
                                        <Text
                                            key={etiqueta.id_etiqueta}
                                            style={[
                                                {
                                                    fontFamily:
                                                        "Poppins-Regular",
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
                                            {etiqueta.texto_etiqueta}
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
                                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: "3%", marginLeft: "3%" }}>
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
                                                    <FontAwesome
                                                        name="star"
                                                        size={18}
                                                        color={index < calificacion ? "orange" : "#D3D3D3"}
                                                    />
                                                </Pressable>
                                            ))}
                                    </View>
                                    <TextInput
                                        style={{
                                            marginLeft: "3%",
                                            marginTop: "-2%",
                                        }}
                                        placeholder="Añade una reseña"
                                        placeholderTextColor="#7D5683"
                                        value={textoCalificacion}
                                        onChangeText={(text) => setTextoCalificacion(text)}
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
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <Pressable
                                onPress={() => router.push("/")}
                                style={({ pressed }) => ({
                                    backgroundColor: pressed ? "#7D5683" : "#402158",
                                    borderRadius: 10,
                                    paddingVertical: 10,
                                    paddingHorizontal: 20,
                                    alignItems: "center",
                                    marginTop: "5%",
                                    width: "80%",
                                })}
                            >
                                <Text
                                    style={{
                                        fontFamily: "Poppins-Regular",
                                        color: "#FFFFFF",
                                        fontWeight: "semibold",
                                    }}
                                >
                                    Ver reseñas
                                </Text>
                            </Pressable>
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
                        {proximosEventos.length > 0 ? (
                            <FlatList
                                style={{ marginLeft: "3%" }}
                                data={proximosEventos}
                                renderItem={({ item }) => (
                                    <EventItem item={item} />
                                )}
                                keyExtractor={(item, index) => index.toString()}
                                horizontal
                            />
                        ) : (
                            <Text
                                style={{
                                    marginTop: "4%",
                                    fontFamily: "Poppins-Regular",
                                    fontSize: 16,
                                    marginLeft: "3%",
                                    color: "#787878",
                                }}
                            >
                                Sin eventos
                            </Text>
                        )}

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
                            renderItem={({ item, index }) => (
                                <Pressable
                                    onPress={() => {
                                        setImageIndex(index);
                                        setVisibleImages(true);
                                    }}
                                >
                                    <Image
                                        source={
                                            item
                                                ? item
                                                : require("../../assets/images/default.jpg")
                                        }
                                        style={{
                                            width: "auto",
                                            height: 150,
                                            aspectRatio: "16/9",
                                            margin: 3,
                                            borderRadius: 10,
                                        }}
                                    />
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
                                        source={
                                            item.logo
                                                ? { uri: item.logo }
                                                : require("../../assets/images/default.jpg")
                                        }
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
                                        <FontAwesome
                                            name="star"
                                            color={"orange"}
                                        />
                                        <Text
                                            style={{
                                                marginLeft: 5,
                                                fontFamily: "Poppins-SemiBold",
                                            }}
                                        >
                                            {item.puntuacion}/5
                                        </Text>
                                    </View>
                                </Pressable>
                            )}
                            horizontal
                        />
                    </>
                )}
            </ScrollView>
        </>
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
