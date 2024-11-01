import Notch from "@/components/Notch";
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

const MyPlace = () => {
    const [etiqueta, setEtiqueta] = useState("");
    const [banner, setBanner] = useState();
    const [imagenes, setImagenes] = useState();
    const [logo, setLogo] = useState();
    const [nombre, setNombre] = useState<string>();
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

    const dataTypesBusiness = [
        { key: "1", value: "Bar" },
        { key: "2", value: "Club" },
        { key: "3", value: "Discoteca" },
    ];
    const [rango_de_precios, setRango] = useState("");
    const dataRango = ["Bajo", "Medio", "Alto"];
    const [location, setLocation] = useState({ longitude: 0, latitude: 0 });

    useEffect(() => {
        const fotos = [
            require("../../assets/images/alice-park-1.png"),
            require("../../assets/images/alice-park-2.png"),
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

        const etiquetas = [
            "Etiqueta 1",
            "Etiqueta 2",
            "Etiqueta 3",
            "Etiqueta 4",
        ];
        const puntuacion = 9.2;

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
        setEstablecimientoAbierto(isOpenToday());
        setBanner(require("../../assets/images/alice-park.png"));
        setLogo(require("../../assets/images/alice-park.png"));
        setNombre("Alice Park");
        setTipo("Tipo de local");
        setDireccion("Av Melchor Urquidi S/N, Cochabamba");
        setValoracion(puntuacion);
        setEtiquetas(etiquetas);
        setHorarioAtencion(horarioAtencion);
        setFotos(fotos);
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
                    source={banner ? banner : image_default}
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
                            backgroundColor: "purple",
                            position: "absolute",
                            flexDirection: "row",
                        }}
                        onPress={() => pickImage(setBanner, [16, 9])}
                    >
                        <FontAwesome name="camera" color={"white"} size={20} />
                        <Text style={{ color: "white" }}>Cambiar Portada</Text>
                    </Pressable>
                </ImageBackground>
                <Image
                    source={logo ? logo : image_default}
                    style={[
                        styles.redondoImg,
                        styles.contenedorIMG,
                        {
                            left: "2%",
                        },
                    ]}
                />
                <Pressable
                    style={[styles.changeImage, { top: -70 }]}
                    onPress={() => pickImage(setLogo, [1, 1])}
                >
                    <FontAwesome name="camera" color={"white"} size={20} />
                </Pressable>
                <View style={{ top: -70 }}>
                    <View>
                        <Text>Nombre del Local</Text>
                        <TextInput
                            style={[
                                { fontFamily: "Poppins-Bold" },
                                { left: "10%" },
                                styles.nombreLocal,
                            ]}
                            value={nombre}
                            onChangeText={(text) => setNombre(text)}
                        />
                        <Text>Tipo de negocio</Text>
                        <SelectList
                            setSelected={setSelectedBusiness}
                            data={dataTypesBusiness}
                            save="key"
                            searchPlaceholder="Buscar"
                            placeholder="Tipo de negocio"
                            boxStyles={Styles.input}
                            dropdownStyles={Styles.inputDropDown}
                        />
                        <Text>Ubicacion del local</Text>
                        <Pressable
                            onPress={() => {
                                Alert.alert("selecciona la ubicacion");
                            }}
                        >
                            <Text>Cambiar Ubicacion</Text>
                        </Pressable>
                        <Text>Etiquetas</Text>
                        <TextInput
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
                                backgroundColor: "rgba(235, 182, 255, 0.5)",
                                borderRadius: 10,
                                paddingHorizontal: 8,
                                marginTop: "3%",
                            }}
                        >
                            <FontAwesome name="plus" color={"white"} />
                        </Pressable>
                        {etiquetas.map((etiqueta, index) => (
                            <>
                                <Text
                                    key={index}
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
                                <Pressable
                                    key={"remove" + index}
                                    onPress={() => {
                                        setEtiquetas(
                                            etiquetas.filter(
                                                (_, i) => i !== index
                                            )
                                        );
                                    }}
                                >
                                    <FontAwesome name="minus" />
                                </Pressable>
                            </>
                        ))}
                    </View>

                    <Text>Rango de precio</Text>
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

                    <View>
                        <Text>Horario de atencion</Text>
                        {horarioAtencion.map((horario, index) => (
                            <View
                                key={index}
                                style={{
                                    flexDirection: "row",
                                    width: "100%",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text>{days[horario.dia]}</Text>

                                <View style={{ flexDirection: "row" }}>
                                    <Pressable
                                        onPress={() => {
                                            const newValues = [...openHorario];
                                            newValues[index] =
                                                !openHorario[index];
                                            setOpenHorario(newValues);
                                        }}
                                    >
                                        <Text>
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
                                            >
                                                <Text>
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
                                            >
                                                <Text>
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

                    <Text>Fotos</Text>
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

                    <Pressable onPress={handleSubmit}>
                        <Text>Actualizar</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
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
});

export default MyPlace;
