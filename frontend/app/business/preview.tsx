import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Styles from "@/globalStyles/styles";
import { days, type HorarioAtencion } from "../places/[id]";
import React from "react";
import type { ImagePickerAsset } from "expo-image-picker";
import { pickImage } from "@/utils/Image";
import { dateToHHmm, showTime } from "@/utils/DateTime";

const preview = () => {
    const [logo, setimage2] = useState<ImagePickerAsset>();
    const [imageBanner, setImageBanner] = useState<ImagePickerAsset>();
    const [tags, setTags] = useState<string[] | []>([]);
    const [tag, setTag] = useState<string>("");
    const [openHorario, setOpenHorario] = useState(Array(7).fill(false));
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

    const addTag = () => {
        if (!tag) {
            return;
        }
        setTag("");
        setTags([...tags, tag]);
    };
    const removeTag = (tag: string) => {
        const newTags = tags.filter((t) => t !== tag);
        setTags(newTags);
    };

    const obtenerHorarios = () => {
        return Array(7)
            .fill(0)
            .map((_, index) => {
                const horario = openHorario[index]
                    ? {
                          inicio_atencion: dateToHHmm(horariosInicio[index]),
                          fin_atencion: dateToHHmm(horariosFin[index]),
                      }
                    : null;
                return {
                    dia: index,
                    horario: horario,
                };
            });
    };

    const local = useLocalSearchParams();
    const handleSubmit = async () => {
        // obtener datos del params
        const data = { ...local, horarios: obtenerHorarios(), etiquetas: tags };
        const formData = new FormData();

        if (logo?.uri) {
            const logoBlob = await fetch(logo.uri).then((res) => res.blob());
            formData.append("logo", logoBlob, "logo.png");
        }
        if (imageBanner?.uri) {
            const imageBlob = await fetch(imageBanner.uri).then((res) =>
                res.blob()
            );
            formData.append("banner", imageBlob, "banner.png");
        }
        formData.append("data", JSON.stringify(data));

        console.log(formData);
    };

    return (
        <ScrollView>
            <View
                style={[
                    {
                        flex: 1,
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "space-between",
                    },
                ]}
            >
                <View
                    style={{
                        width: "100%",
                        alignItems: "center",
                        minHeight: 800,
                    }}
                >
                    <Pressable
                        onPress={router.back}
                        style={{
                            left: "-40%",
                            marginTop: 30,
                            zIndex: 1,
                        }}
                    >
                        <FontAwesome name="arrow-left" size={25} />
                    </Pressable>

                    <Text
                        style={[
                            Styles.subtitle,
                            {
                                marginLeft: 30,
                                alignSelf: "flex-start",
                                marginTop: 10,
                            },
                        ]}
                    >
                        Vista previa
                    </Text>
                    <Pressable
                        onPress={() => {
                            pickImage(setImageBanner, [4, 3]);
                        }}
                        style={Styles.banner}
                    >
                        {imageBanner ? (
                            <Image
                                source={{ uri: imageBanner.uri }}
                                style={Styles.imageBanner}
                            />
                        ) : (
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <FontAwesome
                                    name="plus"
                                    style={{ marginRight: 10 }}
                                />
                                <Text>Agregar banner</Text>
                            </View>
                        )}
                    </Pressable>

                    <Pressable
                        style={[
                            Styles.imageRoundedContainer,
                            {
                                left: "-30%",
                            },
                        ]}
                        onPress={() => {
                            pickImage(setimage2, [1, 1]);
                        }}
                    >
                        {logo ? (
                            <Image
                                source={{ uri: logo.uri }}
                                style={Styles.imageRounded}
                            />
                        ) : (
                            <FontAwesome name="camera" size={30} />
                        )}
                    </Pressable>

                    {tags &&
                        tags.map((tag, index) => (
                            <View
                                style={[
                                    Styles.input,
                                    {
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    },
                                ]}
                                key={index}
                            >
                                <Text>{tag}</Text>
                                <Pressable
                                    onPress={() => {
                                        removeTag(tag);
                                    }}
                                >
                                    <FontAwesome name="minus" />
                                </Pressable>
                            </View>
                        ))}

                    <View style={[Styles.input, Styles.tag]}>
                        <TextInput
                            value={tag}
                            onChangeText={setTag}
                            placeholder="Etiquetas"
                            style={[{ color: "#402158", width: "80%" }]}
                        />
                        <Pressable onPress={addTag} style={Styles.addTag}>
                            <FontAwesome color={"white"} name="plus" />
                        </Pressable>
                    </View>
                    <View>
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

                    <Pressable onPress={handleSubmit} style={Styles.button}>
                        <Text style={Styles.buttonText}>Registrar negocio</Text>
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
                        <View style={[Styles.line, { borderRadius: 10 }]} />
                        <View
                            style={[Styles.lineSelected, { borderRadius: 10 }]}
                        />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default preview;
