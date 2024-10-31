import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, router, type Href } from "expo-router";
import Styles from "@/globalStyles/styles";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import {
    FlatList,
    ImageBackground,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import { red } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import Notch from "@/components/Notch";
import { FadeIn } from "react-native-reanimated";

interface Place {
    id: number;
    name: string;
    score: number;
    views: number;
    uri: any;
}

interface Evento {
    id_evento: number;
    nombre: string;
    logo: any;
    fecha_final: any;
    horario_fin: any;
}

const inicio = () => {
    const [popularPlaces, setPopularPlaces] = useState<Place[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [openSearch, setOpenSearch] = useState(false);
    const [search, setSearch] = useState("");
    const [eventosDelMes, setEventosDelMes] = useState<Evento[]>([]);
    const [eventosDelDia, setEventosDelDia] = useState<Evento[]>([]);
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {
        const places = [
            {
                id: 1,
                name: "AlicePark",
                score: 10,
                views: 540,
                uri: require("../../assets/images/alice-park.png"),
            },
        ];
        const newTags = ["Fiestas", "Conciertos", "Fiestas +21", "Bailes"];
        setPopularPlaces(places);
        setTags(newTags);

        fetchEventosDelMes();
        fetchEventosDelDia();
        //fetchEstablecimientos();
        //fetchCategoriasEstablecimientos();
    }, []);

    const fetchEstablecimientos = async () => {
        try {
            const response = await fetch(`${API_URL}/api/establecimientos/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            console.log(data);
            setPopularPlaces(data);
        } catch (error) {
            //Alert.alert("Error", "No se pudo obtener los establecimientos");
            console.error("Error fetching establecimientos:", error);
        }
    };

    const fetchCategoriasEstablecimientos = async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/categorias-establecimientos/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await response.json();
            console.log(data);
            setTags(data);
        } catch (error) {
            //Alert.alert("Error", "No se pudo obtener los establecimientos");
            console.error("Error fetching establecimientos:", error);
        }
    };
    const fetchGeneroEvento = async () => {
        try {
            const response = await fetch(`${API_URL}/api/generos-evento/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            console.log(data);
            setTags(data);
        } catch (error) {
            //Alert.alert("Error", "No se pudo obtener los establecimientos");
            console.error("Error fetching establecimientos:", error);
        }
    };

    const fetchEventosDelMes = async () => {
        try {
            console.log(new Date().toISOString().split("T")[0] + "");

            const response = await fetch(`${API_URL}/api/eventos_mes/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fecha: new Date().toISOString().split("T")[0],
                }), // Envía la fecha actual
            });
            const data = await response.json();
            console.log(data);
            setEventosDelMes(data);
        } catch (error) {
            //Alert.alert("Error", "No se pudo obtener los eventos del mes");
            console.error("Error fetching eventos del mes:", error);
        }
    };

    const fetchEventosDelDia = async () => {
        try {
            console.log(new Date().toISOString().split("T")[0] + "");
            const response = await fetch(`${API_URL}/api/eventos_hoy/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fecha: new Date().toISOString().split("T")[0],
                }), // Envía la fecha actual
            });
            const data = await response.json();
            console.log(data);
            setEventosDelDia(data);
        } catch (error) {
            //Alert.alert("Error", "No se pudo obtener los eventos del día");
            console.error("Error fetching eventos del día:", error);
        }
    };

    const handleSubmitSearch = () => {
        console.log("buscando " + search);
        setOpenSearch(false);
    };

    const searchPress = () => {
        if (openSearch) {
            handleSubmitSearch();
        }
        setOpenSearch(!openSearch);
    };

    return (
        <ScrollView>
            {/* Notch*/}
            <Notch />
            <View
                style={{
                    backgroundColor: "#402158",
                    paddingVertical: 15,
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    borderRadius: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    bottom: 5,
                }}
            >
                <FontAwesome
                    style={{ marginLeft: "7%" }}
                    name="bell"
                    size={23}
                    color={"white"}
                />
                {openSearch ? (
                    <TextInput
                        placeholder="Buscar"
                        value={search}
                        onChangeText={(text) => setSearch(text)}
                        placeholderTextColor={"gray"}
                        autoFocus
                        onSubmitEditing={handleSubmitSearch}
                    />
                ) : (
                    <Pressable
                        style={{ flexDirection: "row" }}
                        onPress={() => console.log("cambiando de ciudad")}
                    >
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ color: "white" }}>Ciudad</Text>
                            <Text style={{ color: "white" }}>Cochabamba</Text>
                        </View>
                        <FontAwesome name="sort-down" size={23} color="white" />
                    </Pressable>
                )}

                <Pressable onPress={searchPress}>
                    <FontAwesome
                        name="search"
                        size={23}
                        color={"white"}
                        style={{ marginRight: "7%" }}
                    />
                </Pressable>
            </View>

            <Text style={styles.textoTitulo}>Categorias</Text>
            <FlatList
                data={tags}
                style={styles.slider}
                keyExtractor={(item) => item.toString()}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => {}}
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
                            {item}
                        </Text>
                    </Pressable>
                )}
                horizontal
            />

            <Text style={[styles.textoTitulo, { marginTop: "5%" }]}>
                Eventos hoy
            </Text>

            <FlatList
                data={eventosDelDia}
                style={styles.slider}
                keyExtractor={(item) => JSON.stringify(item)}
                renderItem={({ item }) => (
                    <Link
                        href={("/eventos/" + item.id_evento) as Href}
                        style={{ marginLeft: "3%" }}
                    >
                        <ImageBackground
                            resizeMode="cover"
                            source={{ uri: `${API_URL}${item.logo}` }}
                            style={{
                                width: 150,
                                height: 200,
                                borderRadius: 10,
                                overflow: "hidden",
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                    padding: 5,
                                }}
                            >
                                <Text
                                    style={{
                                        color: "white",
                                        fontFamily: "Poppins-Regular",
                                        textAlign: "center",
                                    }}
                                >
                                    {item.nombre}
                                </Text>
                                <Text
                                    style={{
                                        color: "white",
                                        textAlign: "center",
                                    }}
                                >
                                    <FontAwesome
                                        name="clock-o"
                                        color={"yellow"}
                                    />
                                    {item.horario_fin}
                                </Text>
                            </View>
                        </ImageBackground>
                    </Link>
                )}
                horizontal
            />

            <Text style={[styles.textoTitulo, { marginTop: "5%" }]}>
                Lugares populares
            </Text>
            <FlatList
                data={popularPlaces}
                style={styles.slider}
                keyExtractor={(item) => JSON.stringify(item)}
                renderItem={({ item }) => (
                    <Link
                        href={("/places/" + item.id) as Href}

                        style={{ marginLeft: "3%" }}
                    >
                        <ImageBackground
                            resizeMode="cover"
                            source={item.uri}
                            style={{
                                width: 150,
                                height: 200,
                                borderRadius: 10,
                                overflow: "hidden",
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                    padding: 5,
                                }}
                            >
                                <Text
                                    style={{
                                        color: "white",
                                        fontFamily: "Poppins-Regular",
                                        textAlign: "center",
                                    }}
                                >
                                    {item.name}
                                </Text>
                                <Text
                                    style={{
                                        color: "white",
                                        textAlign: "center",
                                    }}
                                >
                                    <FontAwesome name="star" color={"yellow"} />
                                    {item.score} / 10
                                </Text>
                            </View>
                        </ImageBackground>
                    </Link>
                )}
                horizontal
            />

            <Text style={[styles.textoTitulo, { marginTop: "5%" }]}>
                Eventos populares
            </Text>
            <FlatList
                data={eventosDelMes}
                style={styles.slider}
                keyExtractor={(item) => JSON.stringify(item)}
                renderItem={({ item, index }) => (
                    <Link
                        href={("/eventos/" + item.id_evento) as Href}
                        key={index}
                        style={{ marginLeft: "3%" }}
                    >
                        <ImageBackground
                            resizeMode="cover"
                            source={{ uri: `${API_URL}${item.logo}` }}
                            style={{
                                width: 150,
                                height: 200,
                                borderRadius: 10,
                                overflow: "hidden",
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                    padding: 5,
                                }}
                            >
                                <Text
                                    style={{
                                        color: "white",
                                        fontFamily: "Poppins-Regular",
                                        textAlign: "center",
                                    }}
                                >
                                    {item.nombre}
                                </Text>
                                <Text
                                    style={{
                                        color: "white",
                                        textAlign: "center",
                                    }}
                                >
                                    <FontAwesome
                                        name="clock-o"
                                        color={"yellow"}
                                    />
                                    {item.horario_fin}
                                </Text>
                            </View>
                        </ImageBackground>
                    </Link>
                )}
                horizontal
            />
        </ScrollView>
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
});

export default inicio;
