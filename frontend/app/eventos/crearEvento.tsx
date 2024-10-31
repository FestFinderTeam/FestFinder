import {
    ImageBackground,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

import { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Header from "@/components/Header";

import { pickImage } from "@/utils/Image";
import type { ImagePickerAsset } from "expo-image-picker";
import {
    dateToDDMMYYYY,
    dateToHHmm,
    showSingleDate,
    showSingleTime,
} from "@/utils/DateTime";

const imagen_defecto = require("../../assets/images/default_image.png");

const CrearEvento = () => {
    const [nombre, setNombre] = useState("");
    const [logo, setImagenEvento] = useState<ImagePickerAsset>();
    const [horario_inicio, setHoraInicio] = useState<Date>(new Date());
    const [horario_fin, setHoraFin] = useState<Date>(new Date());
    const [descripcion, setDescripcion] = useState("");
    const [precioInicial, setPrecioInicial] = useState("0");
    const [precioFinal, setPrecioFinal] = useState("0");
    const [ubicacion, setUbicacion] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (logo === undefined) {
            setError("Seleccione una imagen");
            return;
        }
        const formData = new FormData();
        if (logo?.uri) {
            const logoBlob = await fetch(logo.uri).then((res) => res.blob());
            formData.append("logo", logoBlob, "logo.png");
        }

        formData.append("nombre", nombre);
        formData.append("fecha_inicio", dateToDDMMYYYY(horario_inicio));
        formData.append("horario_inicio", dateToHHmm(horario_inicio));
        formData.append("horario_fin", dateToHHmm(horario_fin));

        formData.append("descripcion", descripcion);
        formData.append("precioInicial", precioInicial);
        formData.append("precioFinal", precioFinal);
        formData.append("ubicacion", ubicacion);

        //enviar al servidor
    };
    return (
        <View>
            <Header title="Crear nuevo evento" />

            <ImageBackground
                source={logo ? { uri: logo.uri } : imagen_defecto}
                alt="imagen Evento"
                style={{
                    backgroundColor: "gray",
                    height: 200,
                    width: 150,
                    position: "relative",
                }}
            >
                <Pressable
                    style={{
                        position: "absolute",
                        top: "auto",
                        left: "auto",
                        bottom: 5,
                        right: 5,
                    }}
                    onPress={() => {
                        pickImage(setImagenEvento, [3, 4]);
                    }}
                >
                    <FontAwesome name="camera" size={30} />
                </Pressable>
            </ImageBackground>
            <Text>Nombre de evento</Text>
            <TextInput
                placeholder="Nombre"
                onChangeText={(e) => setNombre(e)}
            />
            <View style={{ flexDirection: "row" }}>
                <View>
                    <Text>Fecha</Text>
                    <Pressable
                        onPress={() =>
                            showSingleDate(horario_inicio, setHoraInicio)
                        }
                    >
                        <Text>{dateToDDMMYYYY(horario_inicio)}</Text>
                    </Pressable>
                </View>
                <View>
                    <Text>Hora</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Pressable
                            onPress={() =>
                                showSingleTime(horario_inicio, setHoraInicio)
                            }
                        >
                            <Text>{dateToHHmm(horario_inicio)}</Text>
                        </Pressable>
                        <Text>-</Text>

                        <Pressable
                            onPress={() =>
                                showSingleTime(horario_fin, setHoraFin)
                            }
                        >
                            <Text>{dateToHHmm(horario_fin)}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
            <Text>Rango de Precio</Text>
            <View style={{ flexDirection: "row" }}>
                <TextInput
                    onChangeText={(e) => setPrecioInicial(e)}
                    keyboardType="number-pad"
                    placeholder="00"
                />
                <Text>-</Text>
                <TextInput
                    onChangeText={(e) => setPrecioFinal(e)}
                    keyboardType="number-pad"
                    placeholder="00"
                />
            </View>
            <Text>Descripcion</Text>
            <TextInput
                multiline={true}
                onChangeText={(e) => setDescripcion(e)}
                placeholder="Describe tu eventos"
            />
            <Text>Ubicacion</Text>
            <TextInput
                onChangeText={(e) => setUbicacion(e)}
                placeholder="Av Melchor Urquidi S/N, Cochabamba"
            />
            <Pressable>
                <Text>Ubicacion Predeterminada</Text>
            </Pressable>
            <Text>Se pondra la ubicacion fijada del local</Text>
            <Pressable>
                <Text>Agregar ubicacion nueva</Text>
            </Pressable>
            {error && <Text style={{ color: "red" }}>{error}</Text>}

            <Pressable onPress={handleSubmit}>
                <Text>Crear nuevo evento</Text>
            </Pressable>
        </View>
    );
};

export default CrearEvento;
