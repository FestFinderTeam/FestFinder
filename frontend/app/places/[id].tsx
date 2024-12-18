import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, router, useLocalSearchParams, type Href } from "expo-router";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Styles from "@/globalStyles/styles";
import moment from "moment";
import ErrorText from "@/components/ErrorText";
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
    getGaleriaPorEstablecimiento,
} from "@/services/establecimientosServices";
import { calificarEstablecimiento } from "@/services/VisitasService";

import EventItem from "@/components/EventItem";
import GoogleMap from "@/components/GoogleMap";
import LoadingScreen from "@/components/Loading";
import type { EstablecimientoType } from "../(tabs)/mapa";
import Stars from "@/components/Stars";
import { days, getDay } from "@/utils/DateTime";
import { useSession } from "@/hooks/ctx";
import {
    marcarFavorito,
    quitarFavorito,
    registrarVisita,
} from "@/services/VisitasService";

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
    es_favorito?: boolean;
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

const Place = () => {
    const { session } = useSession();
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
    const [isFavorite, setIsFavorite] = useState(false);
    const [verificado, setVerificado] = useState<boolean | null>();
    const [showVerificar, setShowVerificar] = useState(false);
    const [codigo, setCodigo] = useState("");

    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    });

    useEffect(() => {
        if (establecimiento?.es_favorito) {
            setIsFavorite(true);
        } else {
            setIsFavorite(false);
        }
    }, [establecimiento]);

    const obtenerDatosEstablecimiento = async (establecimientoId: any) => {
        setLoading(true);
        const data = await getEstablecimientoPorId(
            establecimientoId,
            session?.id_usuario
        );
        console.log("establecimiento", data);
        setLoading(false);
        setEstablecimiento(data);
    };
    const verificarCodigo = () => {
        const texto = codigo.replace("-", "");
        if (texto.match("^[0-9A-Z]{8}$")) {
            setVerificado(true);
            setShowVerificar(false);
            handleSubmit();
        } else {
            setVerificado(false);
        }
    };
    const handleSubmit = async () => {
        if (!session?.id_usuario || typeof params.id !== "string") return;

        const data = {
            puntuacion: calificacion,
            usuario: session.id_usuario,
            establecimiento: params.id,
        };

        setLoading(true);

        try {
            const visitaResult = await registrarVisita(
                data.usuario,
                data.establecimiento
            );

            if (visitaResult) {
                console.log("Visita registrada exitosamente:", visitaResult);
            }
        } catch (e) {
            console.error("Error al registrar una visita:", e);
        } finally {
            setLoading(false);
        }
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

    const obtenerGaleriaEstablecimiento = async (establecimientoId: any) => {
        setLoading(true);
        const data = await getGaleriaPorEstablecimiento(establecimientoId);
        console.log(data);
        //console.log(data);
        setLoading(false);
        setFotos(data);
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
        obtenerGaleriaEstablecimiento(id);

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
        const data = {
            puntuacion: calificacion,
            comentario: textoCalificacion,
            usuario: session?.id_usuario,
            establecimiento: params.id,
        };
        console.log(data);
        const valoracion = calificarEstablecimiento(
            data.usuario + "",
            data.establecimiento + "",
            data.puntuacion,
            data.comentario
        );
        setLoading(true);
        try {
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
        alert(`Calificación: ${calificacion}, Reseña: ${textoCalificacion}`);
    };

    const handleHorariosAtencion = () => {
        setHorarioOpened(true);
    };

    const removeFavorite = (est_id: String, usr_id: String) => {
        setIsFavorite(false);
        quitarFavorito(usr_id + "", est_id + "");
    };
    const addFavorite = (est_id: String, usr_id: String) => {
        setIsFavorite(true);
        marcarFavorito(usr_id + "", est_id + "");
    };

    const handleFavorite = () => {
        // peticion para guardar el establecimiento en favoritos
        console.log(
            "establecimiento",
            establecimiento?.id,
            "usuario",
            session?.id_usuario
        );

        if (isFavorite) {
            removeFavorite(establecimiento?.id + "", session?.id_usuario + "");
        } else {
            addFavorite(establecimiento?.id + "", session?.id_usuario + "");
        }
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
                        location={
                            establecimiento
                                ? {
                                      latitude: Number(
                                          establecimiento.coordenada_y
                                      ),
                                      longitude: Number(
                                          establecimiento.coordenada_x
                                      ),
                                  }
                                : null
                        }
                        establecimientos={[
                            establecimiento as EstablecimientoType,
                        ]}
                        userLocation
                        onClose={() => {
                            setToggleMap(false);
                        }}
                    />
                </View>
            )}

            <ScrollView style={styles.container}>
                <ImageViewing
                    images={fotos.map((foto) => {
                        return { uri: foto.imagen };
                    })}
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
                            <Pressable
                                onPress={handleFavorite}
                                style={{
                                    position: "absolute",
                                    bottom: 10,
                                    right: 10,
                                }}
                            >
                                <FontAwesome
                                    name="heart"
                                    color={isFavorite ? "red" : "white"}
                                    size={30}
                                />
                            </Pressable>
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
                                        ("https://wa.me/+591" +
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
                                    flexWrap: "wrap",
                                    justifyContent: "flex-start",
                                    padding: 10,
                                    gap: 10,
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
                            {showVerificar && (
                                <Modal transparent>
                                    <View style={styles.modalBackground}>
                                        <View style={styles.modalContent}>
                                            <Pressable
                                                onPress={() =>
                                                    setShowVerificar(false)
                                                }
                                                style={styles.closeButton}
                                            >
                                                <FontAwesome
                                                    name="close"
                                                    size={20}
                                                    color="#402158"
                                                />
                                            </Pressable>
                                            <Text
                                                style={[
                                                    Styles.linkText,
                                                    { marginBottom: 10 },
                                                ]}
                                            >
                                                Ingresa el código de una manilla
                                                válida
                                            </Text>
                                            <TextInput
                                                style={Styles.input}
                                                value={codigo}
                                                onChangeText={(e) => {
                                                    if (
                                                        e.length === 5 &&
                                                        codigo.length === 4
                                                    ) {
                                                        setCodigo(
                                                            codigo +
                                                                "-" +
                                                                e
                                                                    .charAt(
                                                                        e.length -
                                                                            1
                                                                    )
                                                                    .toUpperCase()
                                                        );
                                                    } else if (
                                                        e.length === 5 &&
                                                        e[e.length - 1] === "-"
                                                    ) {
                                                        setCodigo(
                                                            e.slice(0, -1)
                                                        );
                                                    } else {
                                                        setCodigo(
                                                            e.toUpperCase()
                                                        );
                                                    }
                                                }}
                                                placeholder="XXXX-XXXX"
                                            />
                                            {verificado === false && (
                                                <ErrorText error="Código inválido" />
                                            )}
                                            {verificado === true && (
                                                <Text
                                                    style={styles.successText}
                                                >
                                                    Código validado
                                                </Text>
                                            )}
                                            <Pressable
                                                style={Styles.button}
                                                onPress={verificarCodigo}
                                            >
                                                <Text style={Styles.buttonText}>
                                                    Verificar
                                                </Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </Modal>
                            )}
                            <Pressable
                                style={{ flexDirection: "row" }}
                                onPress={() => setShowVerificar(true)}
                            >
                                <FontAwesome
                                    name="check-circle"
                                    size={24}
                                    color={verificado ? "#238ed7" : "#A9A9A9"}
                                    style={{ marginLeft: 10 }}
                                />
                                <Text
                                    style={{
                                        color: verificado
                                            ? "#238ed7"
                                            : "#A9A9A9",
                                        marginLeft: 5,
                                        marginTop: 1,
                                    }}
                                >
                                    {verificado
                                        ? "Fuíste a este local "
                                        : "Validar asistencia "}
                                </Text>
                            </Pressable>
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
                                    <Stars
                                        value={calificacion}
                                        setValue={setCalificacion}
                                    />
                                    <TextInput
                                        style={{
                                            marginLeft: "3%",
                                            marginTop: "-2%",
                                        }}
                                        placeholder="Añade una reseña"
                                        placeholderTextColor="#7D5683"
                                        value={textoCalificacion}
                                        onChangeText={(text) =>
                                            setTextoCalificacion(text)
                                        }
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
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Pressable
                                onPress={() =>
                                    router.push(
                                        ("/reviews/" +
                                            establecimiento.id) as Href
                                    )
                                }
                                style={({ pressed }) => ({
                                    backgroundColor: pressed
                                        ? "#7D5683"
                                        : "#402158",
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
                                                ? { uri: item.imagen }
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
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
    },
    successText: {
        color: "#28A745",
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
        textAlign: "center",
    },
});

export default Place;
