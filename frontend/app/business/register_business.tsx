import GoogleMap from "@/components/GoogleMap";
import Styles from "@/globalStyles/styles";
import { getCategorias } from "@/services/categoriasService";
import { getDireccion } from "@/utils/Direccion";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React from "react";
import { useEffect, useState } from "react";
import { useSession } from "@/hooks/ctx";
import {
    Pressable,
    Text,
    TextInput,
    View,
    Image,
    StyleSheet,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { LatLng } from "react-native-maps";
const register_business = () => {
    const [nombre, setName] = useState("");
    const [nameError, setNameError] = useState(false);
    const [location, setLocation] = useState<LatLng | null>(null);
    const [em_ref, setEmail] = useState("");
    const [nro_ref, setPhone] = useState("");
    const [tipo_fk, setSelectedBusiness] = useState("");
    const [rango_de_precios, setRango] = useState("");
    const [coordenada_x, setCoordenadaX] = useState<number>();
    const [coordenada_y, setCoordenadaY] = useState<number>();
    const [direccion, setDireccion] = useState("");
    const [toggleMap, setToggleMap] = useState(false);
    const [dataTypesBusiness, setDataTypesBusiness] = useState([]);
    const { session } = useSession();
    const [id_us, setID] = useState("");

    const dataRango = ["Bajo", "Medio", "Alto"];

    // Llama a getCategorias al montar el componente para obtener las categorías
    useEffect(() => {
        const fetchCategorias = async () => {
            const categorias = await getCategorias();
            // Mapear las categorías al formato que necesita SelectList
            const formattedCategorias = categorias.map((categoria: any) => ({
                key: categoria.id, // Utiliza "id" como clave única
                value: categoria.nombre_tipo, // Utiliza "nombre_tipo" como el nombre visible
            }));

            setDataTypesBusiness(formattedCategorias);
        };

        fetchCategorias();
    }, []);

    const handleNext = () => {
        if (session) {
            setID(session.id_usuario + "");
        }
        if (nombre.length < 3) {
            alert("El nombre del negocio debe tener al menos 3 caracteres.");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(em_ref)) {
            alert("El email debe tener un formato válido: local@dominio.");
            return;
        }
        if (!/^\d{8}$/.test(nro_ref)) {
            alert("El teléfono debe tener solo números y 8 dígitos.");
            return;
        }
        const dataBusiness = [
            nombre,
            location,
            nro_ref,
            em_ref,
            tipo_fk,
            rango_de_precios,
            id_us,
            coordenada_x,
            coordenada_y,
        ];
        if (dataBusiness.includes("")) {
            alert("Todos los campos son obligatorios.");
            return;
        }
        router.push({
            pathname: "/business/preview",
            params: {
                nombre,
                nro_ref,
                em_ref,
                tipo_fk,
                rango_de_precios,
                coordenada_x,
                coordenada_y,
                direccion,
                id_usuario: id_us,
            },
        });
    };

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
                        selectedLocation={location}
                        setSelectedLocation={setLocation}
                        onPressConfirmLocation={async () => {
                            setToggleMap(false);
                            if (location) {
                                setCoordenadaX(
                                    Number(location.longitude.toFixed(8))
                                );
                                setCoordenadaY(
                                    Number(location.latitude.toFixed(8))
                                );

                                const direccion = await getDireccion(
                                    location.latitude,
                                    location.longitude
                                );
                                setDireccion(direccion);
                            }
                        }}
                    />
                </View>
            )}
            <View
                style={[Styles.container, { justifyContent: "space-between" }]}
            >
                <Pressable
                    onPress={router.back}
                    style={{
                        left: "-40%",
                        marginTop: 30,
                        zIndex: 1,
                    }}
                >
                    <FontAwesome nombre="arrow-left" size={25} />
                </Pressable>
                <View
                    style={{
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Image
                        source={require("../../assets/images/festLogo.png")}
                        style={Styles.festLogo}
                    />
                    <Text
                        style={[
                            Styles.subtitle,
                            { marginLeft: 30, alignSelf: "flex-start" },
                        ]}
                    >
                        Registra tu negocio:
                    </Text>

                    <TextInput
                        placeholder="Nombre del negocio"
                        keyboardType="default"
                        placeholderTextColor="#402158"
                        style={Styles.input}
                        onChangeText={(text) => {
                            setName(text);
                            if (text.length >= 3) {
                                setNameError(false);
                            }
                        }}
                        onEndEditing={() => {
                            if (nombre.length < 3) {
                                setNameError(true);
                            }
                        }}
                    />
                    <TextInput
                        placeholder="Email del negocio"
                        keyboardType="email-address"
                        placeholderTextColor="#402158"
                        style={Styles.input}
                        onChangeText={setEmail}
                        onEndEditing={() => {
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (!emailRegex.test(em_ref)) {
                                alert("El email debe tener un formato válido: local@dominio.");
                            }
                        }}
                    />
                    <TextInput
                        placeholder="Teléfono del negocio"
                        keyboardType="phone-pad"
                        placeholderTextColor="#402158"
                        style={Styles.input}
                        onChangeText={setPhone} 
                        onEndEditing={() => {
                            if (!/^\d{8}$/.test(nro_ref)) {
                                alert("El teléfono debe tener solo números y 8 dígitos.");
                            }
                        }}
                    />

                    <Pressable
                        onPress={() => {
                            setToggleMap(true);
                        }}
                        style={Styles.input}
                    >
                        <Text
                            style={{
                                color: "#402158",
                                paddingTop: 2,
                                paddingBottom: 2,
                            }}
                        >
                            {location
                                ? `Cambiar Ubicacion de ${direccion}` || ""
                                : "Seleccionar ubicación"}
                        </Text>
                    </Pressable>
                    <SelectList
                        setSelected={setSelectedBusiness}
                        data={dataTypesBusiness}
                        save="key"
                        searchPlaceholder="Buscar"
                        placeholder="Tipo de negocio"
                        boxStyles={Styles.input}
                        dropdownStyles={Styles.inputDropDown}
                    />

                    <Text
                        style={[
                            Styles.textDecoration2,
                            {
                                marginBottom: 10,
                                marginLeft: 30,
                                alignSelf: "flex-start",
                            },
                        ]}
                    >
                        Rango de precios del local:
                    </Text>

                    <View style={{ flexDirection: "row" }}>
                        {dataRango.map((value, index) => (
                            <Pressable
                                key={index}
                                onPress={() => {
                                    setRango(value);
                                }}
                                style={
                                    value === rango_de_precios
                                        ? styles.buttonSelected
                                        : styles.button
                                }
                            >
                                <Text
                                    style={
                                        value === rango_de_precios
                                            ? styles.textSelected
                                            : styles.text
                                    }
                                >
                                    {value}
                                </Text>
                                <Text
                                    style={
                                        value === rango_de_precios
                                            ? styles.textSelected
                                            : styles.text
                                    }
                                >
                                    {"$".repeat(index + 1)}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <Pressable onPress={handleNext} style={Styles.button}>
                        <Text style={Styles.buttonText}>Siguiente</Text>
                    </Pressable>
                </View>
                <View>
                    <View
                        style={[
                            Styles.lineContainer,
                            {
                                marginBottom: 30,
                                flexDirection: "row",
                                justifyContent: "center",
                                gap: 10,
                            },
                        ]}
                    >
                        <View
                            style={[Styles.lineSelected, { borderRadius: 10 }]}
                        />
                        <View style={[Styles.line, { borderRadius: 10 }]} />
                    </View>
                </View>
            </View>
        </>
    );
};

export default register_business;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        width: "25%",
        borderColor: "#7d5683",
        borderWidth: 2,
        backgroundColor: "#fef5ff",
        borderRadius: 10,
        padding: 3,
        alignItems: "center",
        marginHorizontal: 5,
    },
    text: {
        color: "#7d5683",
        fontSize: 16,
    },
    buttonSelected: {
        width: "25%",
        borderColor: "#fef5ff",
        borderWidth: 2,
        backgroundColor: "#7d5683",
        borderRadius: 10,
        padding: 3,
        alignItems: "center",
        marginHorizontal: 5,
    },
    textSelected: {
        color: "#fef5ff",
        fontSize: 16,
    },
});
