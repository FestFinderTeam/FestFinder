import {
    ImageBackground,
    Pressable,
    Text,
    TextInput,
    View,
    ScrollView,
} from "react-native";

import { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Header from "@/components/Header";
import { SelectList } from "react-native-dropdown-select-list";
import { getImage, pickImage } from "@/utils/Image";
import type { ImagePickerAsset } from "expo-image-picker";
import {
    dateToDDMMYYYY,
    dateToHHmm,
    dateToYYYYMMDD,
    showSingleDate,
    showSingleTime,
} from "@/utils/DateTime";
import Styles from "@/globalStyles/styles";
import { router, type Href } from "expo-router";
import { useSession } from "@/hooks/ctx";
import { getCategoriasEventos } from "@/services/eventosService";

const imagen_defecto = require("../../assets/images/default_image.png");

const CrearEvento = () => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const { session } = useSession();
    const [nombre, setNombre] = useState("");
    const [logo, setImagenEvento] = useState<ImagePickerAsset>();
    const [fechaInicio, setFechaInicio] = useState<Date>(new Date());
    const [fechaFin, setFechaFin] = useState<Date>(new Date());
    const [horaInicio, sethoraInicio] = useState<Date>(new Date());
    const [horaFin, setHoraFin] = useState<Date>(new Date());
    const [descripcion, setDescripcion] = useState("");
    const [precioInicial, setPrecioInicial] = useState("0");
    const [precioFinal, setPrecioFinal] = useState("0");
    const [ubicacion, setUbicacion] = useState("");
    const [error, setError] = useState("");
    const [tipo_fk, setSelectedEvent] = useState("");
    const [dataTypesEvent, setDataTypesEvent] = useState([]);

    useEffect(() => {
        const fetchCategoriasEventos = async () => {
            const categorias = await getCategoriasEventos();
            const formattedCategorias = categorias.map((categoria: any) => ({
                key: categoria.id_genero_evento,
                value: categoria.titulo_genero,
            }));

            setDataTypesEvent(formattedCategorias);
        };

        fetchCategoriasEventos();
    }, []);

    const handleSubmit = async () => {
        if (session) {
            const { id_usuario, establecimiento } = session;
        }

        if (logo === undefined) {
            setError("Seleccione una imagen");
            return;
        }
        const formData = new FormData();
        if (logo) {
            formData.append("logo", getImage(logo));
        }

        formData.append("id_establecimiento", session?.establecimiento as string);
        formData.append("nombre", nombre as string);
        formData.append("fecha_inicio", dateToYYYYMMDD(fechaInicio));
        formData.append("fecha_fin", dateToYYYYMMDD(fechaFin));
        formData.append("horario_inicio", dateToHHmm(horaInicio) as string);
        formData.append("horario_fin", dateToHHmm(horaFin) as string);
        formData.append("fecha_final", '2024-11-11' as string);
        formData.append("descripcion", descripcion as string);
        formData.append("precio_min", precioInicial as string);
        formData.append("precio_max", precioFinal as string);
        formData.append("id_genero_fk", tipo_fk as string);

        console.log(formData);

        const response = await fetch(`${API_URL}/api/evento/`, {
            method: "POST",
            body: formData,
        });
        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(
                `Error al registrar el evento: ${response.statusText} (${response.status
                }). Detalles: ${JSON.stringify(errorDetails)}`
            );
        }

        const result = await response.json();
        console.log("Establecimiento registrado:", result);

        router.push('admin/eventos' as Href);
    };

    return (
        <ScrollView>
            <View>
                <Header title="Crear nuevo evento" />
                <View style={{ alignItems: "center" }}>
                    <ImageBackground
                        source={logo ? { uri: logo.uri } : imagen_defecto}
                        alt="imagen Evento"
                        style={{
                            backgroundColor: "gray",
                            height: 250,
                            width: 200,
                            position: "relative",
                            marginTop: "3%",
                            borderRadius: 20,
                        }}
                    >
                        <Pressable
                            style={{
                                position: "absolute",
                                top: "auto",
                                left: "auto",
                                bottom: 5,
                                right: 5,
                                borderRadius: 15,
                            }}
                            onPress={() => {
                                pickImage(setImagenEvento, [3, 4]);
                            }}
                        >
                            <FontAwesome name="camera" size={30} />
                        </Pressable>
                    </ImageBackground>
                    <Text
                        style={{
                            fontWeight: "600",
                            fontSize: 18,
                            color: "#333",
                            marginTop: "3%",
                            alignSelf: "flex-start",
                            marginLeft: "10%",
                        }}
                    >
                        Nombre
                    </Text>

                    <TextInput
                        placeholder="Nombre"
                        onChangeText={(e) => setNombre(e)}
                        style={[Styles.input, { marginTop: "3%", width: "80%" }]}
                    />
                    <Text
                        style={{
                            fontWeight: "600",
                            fontSize: 18,
                            color: "#333",
                            marginTop: "3%",
                            alignSelf: "flex-start",
                            marginLeft: "10%",
                            marginBottom: "2%",
                        }}
                    >
                        Tipo de Evento
                    </Text>
                    <SelectList
                        setSelected={setSelectedEvent}
                        data={dataTypesEvent}
                        save="key"
                        searchPlaceholder="Buscar"
                        placeholder="Tipo de evento"
                        boxStyles={Styles.input}
                        dropdownStyles={Styles.inputDropDown}
                    />
                </View>

                <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            marginTop: "3%",
                        }}
                    >
                        <View style={{ flex: 1, alignItems: "center" }}>
                            <Text
                                style={{
                                    fontWeight: "600",
                                    fontSize: 18,
                                    color: "#333",
                                    marginBottom: 8,
                                }}
                            >
                                Fecha Inicio
                            </Text>
                            <Pressable
                                onPress={() => showSingleDate(fechaInicio, setFechaInicio)}
                                style={[Styles.input, { width: "80%", alignItems: "center" }]}
                            >
                                <Text>{dateToDDMMYYYY(fechaInicio)}</Text>
                            </Pressable>
                        </View>
                        <View style={{ flex: 1, alignItems: "center" }}>
                            <Text
                                style={{
                                    fontWeight: "600",
                                    fontSize: 18,
                                    color: "#333",
                                    marginBottom: 8,
                                }}
                            >
                                Fecha Fin
                            </Text>
                            <Pressable
                                onPress={() => showSingleDate(fechaFin, setFechaFin)}
                                style={[Styles.input, { width: "80%", alignItems: "center" }]}
                            >
                                <Text>{dateToDDMMYYYY(fechaFin)}</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

                <View style={{ flex: 1, alignItems: "center" }}>
                    <Text
                        style={{
                            fontWeight: "600",
                            fontSize: 18,
                            color: "#333",
                            marginBottom: 8,
                        }}
                    >
                        Hora del evento
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            width: "100%",
                            alignItems: "center",
                        }}
                    >
                        <Pressable
                            onPress={() => showSingleTime(horaInicio, sethoraInicio)}
                            style={[Styles.input, { maxWidth: 120, alignItems: "center", marginRight: 10 }]}
                        >
                            <Text>{dateToHHmm(horaInicio)}</Text>
                        </Pressable>
                        <Text>-</Text>
                        <Pressable
                            onPress={() => showSingleTime(horaFin, setHoraFin)}
                            style={[Styles.input, { maxWidth: 120, alignItems: "center", marginLeft: 10 }]}
                        >
                            <Text>{dateToHHmm(horaFin)}</Text>
                        </Pressable>
                    </View>
                </View>

                <View
                    style={{
                        marginTop: "2%",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    <Text
                        style={{
                            fontWeight: "600",
                            fontSize: 18,
                            color: "#333",
                            marginBottom: 8,
                        }}
                    >
                        Rango de precio
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            width: "100%",
                            alignItems: "center",
                        }}
                    >
                        <TextInput
                            placeholder="Desde"
                            onChangeText={(e) => setPrecioInicial(e.replace(/[^0-9]/g, ""))} 
                            style={[
                                Styles.input,
                                { width: 120, marginRight: 10, textAlign: "center" },
                            ]}
                            keyboardType="numeric" 
                        />
                        <Text>-</Text>
                        <TextInput
                            placeholder="Hasta"
                            onChangeText={(e) => setPrecioFinal(e.replace(/[^0-9]/g, ""))} 
                            style={[
                                Styles.input,
                                { width: 120, marginLeft: 10, textAlign: "center" },
                            ]}
                            keyboardType="numeric" 
                        />
                    </View>
                </View>


                <Text
                    style={{
                        fontWeight: "600",
                        fontSize: 18,
                        color: "#333",
                        marginTop: "5%",
                        marginLeft: "10%",
                    }}
                >
                    Descripción
                </Text>
                <View style={{ justifyContent: "center", alignItems: "center", width: "100%" }}>
                    <TextInput
                        placeholder="Descripción"
                        onChangeText={(e) => setDescripcion(e)}
                        style={[Styles.input, { marginTop: "3%", width: "80%" }]}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <Pressable
                    style={[Styles.button, { marginTop: 15, width: "80%", alignSelf: "center", marginBottom: 10, }]}
                    onPress={handleSubmit}
                >
                    <Text style={{ color: "#fff" }}>Crear evento</Text>
                </Pressable>

            </View>
        </ScrollView>
    );
};

export default CrearEvento;
