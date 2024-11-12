import Notch from "@/components/Notch";
import { useSession } from "@/hooks/ctx";

import Styles from "@/globalStyles/styles";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, type Href } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { Double } from "react-native/Libraries/Types/CodegenTypes";
import { pickImage } from "@/utils/Image";
import type { ImagePickerAsset } from "expo-image-picker";
import { SelectList } from "react-native-dropdown-select-list";
import { dateToHHmm, showTime } from "@/utils/DateTime";
import React from "react";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { getEstablecimientoPorPropietario } from "@/services/establecimientosServices";
import { getCategorias } from "@/services/categoriasService";
const image_default = require("../../assets/images/default_image.png");

interface Horario {
    inicio_atencion: string;
    fin_atencion: string;
}
interface HorarioAtencion {
    dia: number;
    horario: Horario | null;
}
const days = [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
    "Domingo",
];
export type Evento = {
    id_evento: number;
    nombre: string;
    fecha_inicio: Date;
    horario_inicio?: string;
    logo: any;
};

type Establecimiento = {
    id: number;
    nombre: string;
    direccion?: string;
    tipo_fk?: number;
    tipo_fk_detail?: any;
    nombre_tipo?: string;
    nro_ref?: string;
    banner?: any;
    logo?: any;
    puntuacion?: number;
    etiquetas?: any;
    rango_de_precios: string;
};

const MyPlace = () => {
    const { session} = useSession();
    const [establecimiento, setEstablecimiento] =
        useState<Establecimiento | null>(null);
    const [etiqueta, setEtiqueta] = useState("");
    const [banner, setBanner] = useState();
    const [imagenes, setImagenes] = useState();
    const [logo, setLogo] = useState();
    const [nombre, setNombre] = useState<string>();
    const [ubicacion, setUbicacion] = useState<string>();
    const [tipo, setTipo] = useState<String>();
    const [direccion, setDireccion] = useState<String>();
    const [establecimientoAbierto, setEstablecimientoAbierto] = useState(false);
    const [puntuacion, setValoracion] = useState<Double>();
    const [horariosInicio, setHorariosInicio] = useState<Date[]>(
        Array(7).fill(new Date())
    );
    const [horariosFin, setHorariosFin] = useState<Date[]>(
        Array(7).fill(new Date())
    );
    const [horarioAtencion, setHorarioAtencion] = useState<HorarioAtencion[]>([
        {
            dia: 0,
            horario: null,
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
            horario: null,
        },
        {
            dia: 6,
            horario: null,
        },
    ]);
    const [etiquetas, setEtiquetas] = useState<String[]>([]);
    const [fotos, setFotos] = useState<any[]>([]);
    const [tipo_fk, setSelectedBusiness] = useState("");
    const [openHorario, setOpenHorario] = useState(Array(7).fill(false));

    const [dataTypesBusiness, setDataTypesBusiness] = useState<any[]>([]);

    const [rango_de_precios, setRango] = useState("");
    const dataRango = ["Bajo", "Medio", "Alto"];
    const [location, setLocation] = useState({ longitude: 0, latitude: 0 });

    useEffect(() => {
        const fetchCategorias = async () => {
            const categorias = await getCategorias(); // Recuperamos las categorías desde la API
            if (categorias) {
                // Marcamos si el tipo_fk coincide con el key de alguna categoría
                const updatedDataTypes = categorias.map((categoria: any) => ({
                    key: categoria.id, // Asume que el id es el key
                    value: categoria.nombre_tipo,
                    selected: categoria.id === tipo_fk, // Compara tipo_fk
                }));
                setDataTypesBusiness(updatedDataTypes);
            }
        };

        fetchCategorias();
    }, [tipo_fk]); // Actualizamos cada vez que tipo_fk cambie
    
    
    useEffect(() => {
        const fetchEstablecimiento = async () => {
            const propietarioId = session?.id_usuario
            const data = await getEstablecimientoPorPropietario(propietarioId);
            
            if (data) {
                setEstablecimiento(data);
                setBanner(data.banner);
                setLogo(data.logo);
                setNombre(data.nombre);
                setTipo(data.tipo_fk_detail.nombre_tipo);
                setSelectedBusiness(data.tipo_fk_detail.id);
                setDireccion(data.direccion);
                setValoracion(8);
                setEtiquetas(data.etiquetas.map((etiqueta: any) => etiqueta.texto_etiqueta));
                setHorarioAtencion(data.horarios);
                setFotos(data.fotos || []);
                setRango(data.rango_de_precios);

                const isOpenToday = () => {
                    const today = getDay(new Date());
                    const atencionToday = data.horarios.find((horario: any) => horario.dia === today);
                    
                    if (!atencionToday || !atencionToday.inicio_atencion || !atencionToday.fin_atencion) return false;
                    
                    const inicio_atencion = moment(atencionToday.inicio_atencion, "HH:mm");
                    const fin_atencion = moment(atencionToday.fin_atencion, "HH:mm");
                    const current = moment();

                    if (fin_atencion.isBefore(inicio_atencion)) {
                        return (
                            current.isBetween(inicio_atencion, moment("23:59:59", "HH:mm")) ||
                            current.isBetween(moment("00:00", "HH:mm"), fin_atencion)
                        );
                    }

                    return current.isBetween(inicio_atencion, fin_atencion);
                };

                setEstablecimientoAbierto(isOpenToday());
            }
        };
        fetchEstablecimiento();
    }, []);

    const guardarImagen = async (imagen: ImagePickerAsset) => {
        //guardar en el servidor
        const formData = new FormData();

        if (imagen.uri) {
            const imagenBlob = await fetch(imagen.uri).then((res) =>
                res.blob()
            );
            formData.append("imagen", imagenBlob, "imagen.jpg");
        }

        //llamar al api para guardar la imagen

        console.log("guardando imagen en el servidor");
    };

    const getDay = (date: Date) => {
        const day = date.getDay();
        return day === 0 ? 6 : day - 1;
    };

    const handleFoto = () => {
        pickImage(
            (foto: ImagePickerAsset) => {
                guardarImagen(foto);
                setFotos([foto, ...fotos]);
            },
            [16, 9]
        );
    };

    const handleSubmit = () => {
        console.log(
            nombre,
            tipo_fk,
            location.latitude,
            location.longitude,
            etiquetas,
            rango_de_precios,
            horarioAtencion
        );
        console.log(banner);
        console.log(logo);
    };

    return (
        <View>
            <Notch />
            <ScrollView>
                <ImageBackground
                    source={{uri:establecimiento?.banner}}
                    style={[Styles.imageBanner, { position: "relative" }]}
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
                        style={{
                            right: 0,
                            bottom: 0,
                            top: "auto",
                            left: "auto",
                            backgroundColor: "#402158",
                            position: "absolute",
                            flexDirection: "row",
                            marginBottom: "2%",
                            marginRight: "2%",
                            borderRadius: 10,
                            paddingHorizontal: 10,
                            paddingVertical: 3,
                        }}
                        onPress={() => pickImage(setBanner, [16, 9])}
                    >
                        <FontAwesome name="camera" color={"white"} size={20} />
                        <Text style={{ color: "white", marginLeft: 5 }}>Cambiar Portada</Text>
                    </Pressable>

                </ImageBackground>
                <ImageBackground
                    source={logo ? {uri:logo} : image_default}
                    style={[
                        styles.redondoImg,
                        styles.contenedorIMG,
                        {
                            left: "2%",
                            width: 120,
                            height: 120,
                            borderRadius: 75,
                            overflow: 'hidden',
                        },
                    ]}
                >
                    <Pressable
                        style={[
                            styles.changeImage,
                            {
                                position: 'absolute',
                                bottom: 10,
                                right: 10,
                                backgroundColor: "#402158",
                                borderRadius: 50,
                                width: 40,
                                height: 40,
                                justifyContent: 'center',
                                alignItems: 'center',
                            },
                        ]}
                        onPress={() => pickImage(setLogo, [1, 1])}
                    >
                        <FontAwesome name="camera" color={"white"} size={20} />
                    </Pressable>
                </ImageBackground>

                <View style={{ top: -70, marginTop: "10%", }}>
                    <View>
                        <Text style={{ color: "#402158", marginLeft: "5%" }}>Nombre del Local</Text>
                        <View style={{ alignItems: "center", marginTop: "2%" }}>
                            <TextInput
                                style={[Styles.input, { width: "90%", fontWeight: 'bold', fontFamily: 'Poppins' }]}
                                value={nombre}
                                onChangeText={(text) => setNombre(text)}
                            />
                        </View>
                        <Text style={{ color: "#402158", marginLeft: "5%" }}>Tipo de negocio</Text>
                        <View style={{ alignItems: "center", marginTop: "2%" }}>
                            <SelectList
                                setSelected={setSelectedBusiness}
                                data={dataTypesBusiness}
                                save="key"
                                searchPlaceholder="Buscar"
                                placeholder= "Tipo de negocio"
                                boxStyles={{
                                    ...Styles.input,
                                    width: "90%",
                                }}
                                dropdownStyles={{
                                    ...Styles.inputDropDown,
                                    width: "90%",
                                }}
                                inputStyles={{
                                    fontWeight: 'bold',
                                    fontFamily: 'Poppins',
                                }}
                                defaultOption={dataTypesBusiness.find(
                                    (item) => item.key == tipo_fk,
                                    console.log(tipo_fk+"")
                                )}
                            />
                        </View>

                        <Text style={{ color: "#402158", marginLeft: "5%" }}>Ubicacion del local</Text>
                        <Pressable
                            onPress={() => {
                                Alert.alert("selecciona la ubicacion");
                            }}
                        >
                            <View style={{ alignItems: "center", marginTop: "2%" }}>
                                <TextInput
                                    style={[Styles.input, { width: "90%", fontWeight: 'bold', fontFamily: 'Poppins' }]}
                                    value={direccion+''} //CARGAR LA UBICACION ACA
                                    onChangeText={(text) => setUbicacion(text)}
                                />
                            </View>
                        </Pressable>
                        <Text style={{ color: "#402158", marginLeft: "5%" }}>Etiquetas</Text>
                        <View style={{ alignItems: "center", marginTop: "2%" }}>
                            <View style={{ flexDirection: "row", alignItems: "center", width: "90%" }}>
                                <TextInput
                                    style={[Styles.input, { flex: 1, fontWeight: 'bold', fontFamily: 'Poppins' }]}
                                    placeholder="Nueva Etiqueta"
                                    value={etiqueta}
                                    onChangeText={(text) => setEtiqueta(text)}
                                />
                                <Pressable
                                    onPress={() => {
                                        if (etiqueta) {
                                            setEtiquetas([...etiquetas, etiqueta]);
                                            setEtiqueta("");
                                        }
                                    }}
                                    style={{
                                        backgroundColor: "#402158",
                                        borderRadius: 10,
                                        paddingHorizontal: 12,
                                        paddingVertical: 8,
                                        marginLeft: 8,

                                    }}
                                >
                                    <FontAwesome name="plus" color={"white"} />
                                </Pressable>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", flexWrap: "wrap", width: "100%", justifyContent: "center" }}>
                            {etiquetas.map((etiqueta, index) => (
                                <View
                                    key={index}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        width: "40%",
                                        marginBottom: "1.5%",
                                        backgroundColor: "rgba(235, 182, 255, 0.5)",
                                        borderRadius: 10,
                                        paddingHorizontal: 8,
                                        paddingVertical: 3,
                                        marginRight: "2%",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: "Poppins-Regular",
                                            fontSize: 12,
                                            flex: 1,
                                            marginRight: 10,
                                        }}
                                    >
                                        {etiqueta}
                                    </Text>
                                    <Pressable
                                        onPress={() => {
                                            setEtiquetas(etiquetas.filter((_, i) => i !== index));
                                        }}
                                    >
                                        <FontAwesome name="minus" color="black" />
                                    </Pressable>
                                </View>
                            ))}
                        </View>


                    </View>

                    <Text style={{ color: "#402158", marginLeft: "5%", marginTop: "4%" }}>Rango de precio</Text>
                    <View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap", marginTop: 10 }}>
                        {dataRango.map((value, index) => (
                            <Pressable
                                key={index}
                                onPress={() => {
                                    setRango(value);
                                }}
                                style={[
                                    {
                                        paddingVertical: 10,
                                        paddingHorizontal: 20,
                                        margin: 5,
                                        borderRadius: 25,
                                        backgroundColor: value === rango_de_precios ? "#7D5683" : "#f1dff5",
                                        borderWidth: 2,
                                        borderColor: value === rango_de_precios ? "#7D5683" : "#B197FC",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        elevation: 3,
                                        shadowColor: "#000",
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 4,
                                    },
                                    value == rango_de_precios && { backgroundColor: "#7D5683" },
                                ]}
                            >
                                <Text
                                    style={[
                                        {
                                            color: value === rango_de_precios ? "#fff" : "#402158",
                                            fontFamily: "Poppins",
                                            fontWeight: "bold",
                                            fontSize: 14,
                                            marginRight: 5,
                                        },
                                        value == rango_de_precios && { color: "#fff" },
                                    ]}
                                >
                                    {value}
                                </Text>
                                <Text
                                    style={[
                                        {
                                            color: value === rango_de_precios ? "#fff" : "#402158",
                                            fontFamily: "Poppins",
                                            fontSize: 14,
                                        },
                                        value === rango_de_precios && { color: "#fff" },
                                    ]}
                                >
                                    {"$".repeat(index + 1)}
                                </Text>
                            </Pressable>
                        ))}
                    </View>


                    <View>
                        <Text style={{ color: "#402158", marginLeft: "5%", marginTop: "4%" }}>Horario de atencion</Text>
                        {horarioAtencion.map((horario, index) => (
                            <View key={index} style={styles.scheduleContainer}>
                                <Text style={styles.dayText}>
                                    {days[horario.dia]}
                                </Text>

                                <View style={styles.timeContainer}>
                                    <Pressable
                                        onPress={() => {
                                            const newValues = [...openHorario];
                                            newValues[index] =
                                                !openHorario[index];
                                            setOpenHorario(newValues);
                                        }}
                                        style={styles.toggleButton}
                                    >
                                        <Text style={styles.toggleButtonText}>
                                            {openHorario[index]
                                                ? "Cerrar"
                                                : "Abrir"}
                                        </Text>
                                    </Pressable>

                                    {openHorario[index] && (
                                        <>
                                            <Pressable
                                                onPress={() =>
                                                    showTime(
                                                        horariosInicio,
                                                        setHorariosInicio,
                                                        index
                                                    )
                                                }
                                                style={styles.timeButton}
                                            >
                                                <Text style={styles.timeText}>
                                                    {horariosInicio
                                                        ? dateToHHmm(
                                                            horariosInicio[
                                                            index
                                                            ]
                                                        )
                                                        : ""}
                                                </Text>
                                            </Pressable>
                                            <Pressable
                                                onPress={() =>
                                                    showTime(
                                                        horariosFin,
                                                        setHorariosFin,
                                                        index
                                                    )
                                                }
                                                style={styles.timeButton}
                                            >
                                                <Text style={styles.timeText}>
                                                    {horariosFin
                                                        ? dateToHHmm(
                                                            horariosFin[index]
                                                        )
                                                        : ""}
                                                </Text>
                                            </Pressable>
                                        </>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>

                    <Text style={{ color: "#402158", marginLeft: "5%", marginTop: "4%" }}>Fotos</Text>
                    <FlatList
                        style={{ marginLeft: "3%" }}
                        data={[null, ...fotos]}
                        renderItem={({ item }) => {
                            if (item === null) {
                                return (
                                    <Pressable
                                        onPress={handleFoto}
                                        style={{
                                            borderRadius: 10,
                                            marginTop: "2%",
                                            height: 150,
                                            aspectRatio: "16/9",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "gray",
                                        }}
                                    >
                                        <FontAwesome name="plus" />
                                    </Pressable>
                                );
                            } else {
                                return (
                                    <Image
                                        source={item ? item : image_default}
                                        style={{
                                            width: "auto",
                                            height: 150,
                                            aspectRatio: "16/9",
                                            margin: 3,
                                            borderRadius: 10,
                                        }}
                                    />
                                );
                            }
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                    />
                    <View style={{alignItems:"center"}}>
                        <Pressable onPress={handleSubmit} style={Styles.button}>
                            <Text style={{color:"white"}}>Actualizar</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </View >
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
    changeImage: {
        backgroundColor: "purple",
        padding: 10,
        borderRadius: 50,
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
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
    timeButton: {
        backgroundColor: "#B197FC",
        borderRadius: 4,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 10,
    },
    timeText: {
        color: "#fff",
        fontWeight: "500",
    },
    timeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    toggleButton: {
        backgroundColor: "#402158",
        borderRadius: 4,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 10,
    },
    toggleButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
    scheduleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    dayText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
});

export default MyPlace;
