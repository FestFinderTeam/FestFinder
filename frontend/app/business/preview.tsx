import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Styles from "@/globalStyles/styles";
import { days, type HorarioAtencion } from "../places/[id]";
import React from "react";
import type { ImagePickerAsset } from "expo-image-picker";
import { getImage, pickImage } from "@/utils/Image";
import { dateToHHmm, showTime } from "@/utils/DateTime";
import { useSession } from "@/hooks/ctx";
import { getDireccion } from "@/utils/Direccion";

const preview = () => {
  //const API_URL = "http://(TU IPv4 PARA PROBAR ANTES QUE RESUBAN LA API):8000/";
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const { session } = useSession();
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
    if (session) {
      const { id_usuario } = session;
    }
    // obtener datos del params
    const data = { ...local };
    //const data = { ...local, horarios: obtenerHorarios(), etiquetas: tags };
    const formData = new FormData();

    try {
      if (logo) {
        formData.append("logo", getImage(logo));
      }

      if (imageBanner) {
        formData.append("banner", getImage(imageBanner));
      }

      formData.append("nombre", data.nombre as string);
      formData.append("direccion", data.direccion as string);
      formData.append("coordenada_x", data.coordenada_x as string);
      formData.append("coordenada_y", data.coordenada_y as string);
      formData.append("descripcion", "Huayllani");
      formData.append("nro_ref", "123456789");
      formData.append("em_ref", data.em_ref as string);
      formData.append("tipo_fk", data.tipo_fk as string);
      formData.append("usuario", data.id_usuario as string);
      formData.append("rango_de_precios", data.rango_de_precios as string);

      const response = await fetch(`${API_URL}/api/establecimiento/`, {
        method: "POST",
        body: formData,
      });

      // Manejo de errores en la respuesta
      if (!response.ok) {
        // Intentamos extraer información de error del cuerpo de la respuesta
        const errorDetails = await response.json();
        throw new Error(
          `Error al registrar el establecimiento: ${response.statusText} (${
            response.status
          }). Detalles: ${JSON.stringify(errorDetails)}`
        );
      }

      // Procesar la respuesta
      const result = await response.json();
      console.log("Establecimiento registrado:", result);
      router.navigate('/')
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          "Error en el registro del establecimiento:",
          error.message
        );
      } else {
        console.error("Error desconocido:", error);
      }
      return null;
    }
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
                <FontAwesome name="plus" style={{ marginRight: 10 }} />
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
              <Image source={{ uri: logo.uri }} style={Styles.imageRounded} />
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
          <View style={styles.container}>
            {horarioAtencion.map((horario, index) => (
              <View key={index} style={styles.scheduleContainer}>
                <Text style={styles.dayText}>{days[horario.dia]}</Text>

                <View style={styles.timeContainer}>
                  <Pressable
                    onPress={() => {
                      const newValues = [...openHorario];
                      newValues[index] = !openHorario[index];
                      setOpenHorario(newValues);
                    }}
                    style={styles.toggleButton}
                  >
                    <Text style={styles.toggleButtonText}>
                      {openHorario[index] ? "Cerrar" : "Abrir"}
                    </Text>
                  </Pressable>

                  {openHorario[index] && (
                    <>
                      <Pressable
                        onPress={() =>
                          showTime(horariosInicio, setHorariosInicio, index)
                        }
                        style={styles.timeButton}
                      >
                        <Text style={styles.timeText}>
                          {horariosInicio
                            ? dateToHHmm(horariosInicio[index])
                            : ""}
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() =>
                          showTime(horariosFin, setHorariosFin, index)
                        }
                        style={styles.timeButton}
                      >
                        <Text style={styles.timeText}>
                          {horariosFin ? dateToHHmm(horariosFin[index]) : ""}
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
            <View style={[Styles.lineSelected, { borderRadius: 10 }]} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    elevation: 2,
    width: "80%",
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
  timeButton: {
    backgroundColor: "#B197FC",
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  timeText: {
    color: "#fff", // Texto blanco
    fontWeight: "500",
  },
});

export default preview;
