import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, router, type Href } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Image, Modal, Alert } from "react-native";
import { FlatList, Pressable, Text, View } from "react-native";
import Notch from "@/components/Notch";
import React from "react";
import { getCategorias } from "@/services/categoriasService";
import { getEstablecimientos } from "@/services/establecimientosServices";
import { getEventosDelDia, getEventosDelMes } from "@/services/eventosService";
import ListadoEventosInicio from "@/components/ListadoEventos";
import Establecimiento, { type Place } from "@/components/Establecimiento";
import type { EventoType } from "@/components/Evento";

interface TipoEstablecimiento {
    id: number;
    nombre_tipo: string;
}

const inicio = () => {

    const [popularPlaces, setPopularPlaces] = useState<Place[]>([]);
    const [tags, setTags] = useState<TipoEstablecimiento[]>([]);
    const [openSearch, setOpenSearch] = useState(false);
    const [eventosDelMes, setEventosDelMes] = useState<EventoType[]>([]);
    const [eventosDelDia, setEventosDelDia] = useState<EventoType[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCity, setSelectedCity] = useState("Cochabamba");
    const cities = ["Cochabamba", "Santa Cruz", "La Paz"];
    const handleCitySelect = (city: string) => {
        setSelectedCity(city);
        setModalVisible(false);
    };
    useEffect(() => {
        fetchCategoriasEstablecimientos();
        fetchEventosDelMes();
        fetchEventosDelDia();
        fetchEstablecimientos();
    }, []);

    const fetchEstablecimientos = async (tipoId: string | null = null) => {
        const establecimientos = await getEstablecimientos(tipoId);
    
        if (establecimientos.length === 0) {
            Alert.alert(
                "Sin resultados",
                "No se encontraron establecimientos para esta categoría"
            );
            // Vuelve a cargar todos los establecimientos si no hay resultados
            const todosEstablecimientos = await getEstablecimientos(null);
            setPopularPlaces(todosEstablecimientos);
        } else {
            setPopularPlaces(establecimientos);
        }
    };

    const fetchCategoriasEstablecimientos = async () => {
        const categories = await getCategorias();
        setTags(categories); // Ajusta si el campo en tu API tiene otro nombre
    };

    const fetchEventosDelMes = async () => {
        const eventos = await getEventosDelMes();
        setEventosDelMes(eventos); // Ajusta si el campo en tu API tiene otro nombre
    };

    const fetchEventosDelDia = async () => {
        const eventos = await getEventosDelDia();
        //console.log(eventos[0].id_evento);
        setEventosDelDia(eventos); // Ajusta si el campo en tu API tiene otro nombre
    };

    const handleSubmitSearch = () => {
        //console.log("buscando " + search);
        setOpenSearch(false);
    };

    const searchPress = () => {
        if (openSearch) {
            handleSubmitSearch();
        }
        setOpenSearch(!openSearch);
    };

    const handleCategoryPress = (tipoId: string| null) => {
        console.log(tipoId);
        fetchEstablecimientos(tipoId);

    };

    return (
        <>
            <Notch />
            <View
                style={{
                    backgroundColor: "#402158",
                    paddingVertical: 15,
                    alignItems: "center",
                    flexDirection: "row",
                    borderRadius: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    bottom: 4,
                }}
            >
                <FontAwesome
                    style={{ flex: 1, marginLeft: "7%" }}
                    name="bell"
                    size={23}
                    color="white"
                />

                <Pressable
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 3,
                    }}
                    onPress={() => setModalVisible(true)}
                >
                    <View style={{ alignItems: "center" }}>
                        <Text style={{ color: "white" }}>Ciudad</Text>
                        <Text style={{ color: "white" }}>{selectedCity}</Text>
                    </View>
                    <FontAwesome name="sort-down" size={23} color="white" />
                </Pressable>

                <View style={{ flex: 1 }} />

                {/* Modal para seleccionar la ciudad */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>
                                Seleccionar la ciudad
                            </Text>
                            {cities.map((city) => (
                                <Pressable
                                    key={city}
                                    style={styles.option}
                                    onPress={() => handleCitySelect(city)}
                                >
                                    <View
                                        style={[
                                            styles.radioButton,
                                            selectedCity === city &&
                                                styles.radioButtonSelected,
                                        ]}
                                    />
                                    <Text style={styles.optionText}>
                                        {city}
                                    </Text>
                                </Pressable>
                            ))}
                            <Pressable
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>
                                    Cerrar
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>

            <ScrollView>
                <Text style={styles.textoTitulo}>Categorias</Text>
                <FlatList
                    data={tags}
                    style={styles.slider}
                    keyExtractor={(item) => JSON.stringify(item)}
                    renderItem={({ item }) => (
                        <Pressable
                            onPress={() => handleCategoryPress(item.id+'')}
                            style={{
                                alignItems: "center",
                                marginHorizontal: 10,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "Poppins-Regular",
                                    textAlign: "center",
                                    borderRadius: 20,
                                    borderWidth: 2,
                                    borderColor: "#956ca3",
                                    color: "#956ca3",
                                    paddingHorizontal: 10,
                                    paddingVertical: 4,
                                    lineHeight: 24,
                                }}
                            >
                                {item.nombre_tipo}
                            </Text>
                        </Pressable>
                    )}
                    horizontal
                />

                <Text style={[styles.textoTitulo, { marginTop: "5%" }]}>
                    Eventos hoy
                </Text>

                <ListadoEventosInicio eventos={eventosDelDia} />
                <View style={{ alignItems: "center", marginTop: "3%" }}>
                    <View
                        style={{
                            backgroundColor: "#FDC500",
                            width: 320,
                            height: 120,
                            borderRadius: 10,
                            flexDirection: "row",
                            padding: 10,
                        }}
                    >
                        <Image
                            source={require("../../assets/images/ticket.png")}
                            style={{
                                width: "40%",
                                height: "100%",
                                borderTopLeftRadius: 10,
                                borderBottomLeftRadius: 10,
                                resizeMode: "contain",
                            }}
                        />
                        <View
                            style={{
                                width: "60%",
                                paddingLeft: 10,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "Poppins-Regular",
                                    fontSize: 16,
                                    color: "black",
                                    fontWeight: "bold",
                                }}
                            >
                                Reserva tus entradas
                            </Text>
                            <Text
                                style={{
                                    fontFamily: "Poppins-Regular",
                                    fontSize: 16,
                                    color: "black",
                                    fontWeight: "bold",
                                }}
                            >
                                &
                            </Text>
                            <Text
                                style={{
                                    fontFamily: "Poppins-Regular",
                                    fontSize: 13,
                                    color: "black",
                                }}
                            >
                                No vivas de horas de filas
                            </Text>
                            <Pressable
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: 15,
                                    paddingVertical: 6,
                                    paddingHorizontal: 12,
                                    marginTop: 8,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "Poppins-Regular",
                                        fontSize: 14,
                                        color: "black",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Ver eventos
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        paddingHorizontal: "5%",
                    }}
                >
                    <Text style={[styles.textoTitulo, { marginTop: "5%" }]}>
                        Lugares populares
                    </Text>
                    <Pressable
                        onPress={() => {
                            router.navigate("/places/popular");
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "Poppins-Regular",
                                    fontSize: 14,
                                    color: "#402158",
                                    marginTop: 15,
                                    
                                }}
                            >
                                Ver más &gt;
                            </Text>
                            
                        </View>
                    </Pressable>
                </View>

                <FlatList
                    data={popularPlaces}
                    style={styles.slider}
                    keyExtractor={(item) => JSON.stringify(item)}
                    renderItem={({ item, index }) => (
                        <Establecimiento establecimiento={item} key={index} />
                    )}
                    horizontal
                />

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        paddingHorizontal: "5%",
                    }}
                >
                    <Text style={[styles.textoTitulo, { marginTop: "5%" }]}>
                        Eventos populares del mes
                    </Text>
                    <Pressable
                        onPress={() => {
                            router.navigate("/eventos/popular");
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "Poppins-Regular",
                                    fontSize: 14,
                                    color: "#402158",
                                    marginTop: 15,
                                }}
                            >
                                Ver más &gt;
                            </Text>
                            
                        </View>
                    </Pressable>
                </View>
                <View style={{ marginBottom: "5%" }}>
                    <ListadoEventosInicio eventos={eventosDelMes} />
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    textoTitulo: {
        fontWeight: "bold" as "bold",
        fontSize: 18,
        marginLeft: "3%",
    },
    slider: {
        marginLeft: "5%",
        marginTop: "3%",
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: 300,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
        width: "100%",
        justifyContent: "flex-start",
    },

    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#402158",
        marginRight: 10,
        marginLeft: 10,
    },
    radioButtonSelected: {
        backgroundColor: "#402158",
    },
    optionText: {
        fontSize: 16,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: "#402158",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default inicio;
