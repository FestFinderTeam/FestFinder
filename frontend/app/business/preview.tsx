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
import { type HorarioAtencion } from "../places/[id]";
import React from "react";
import type { ImagePickerAsset } from "expo-image-picker";
import { getImage, pickImage } from "@/utils/Image";
import { dateToHHmm, days, showTime } from "@/utils/DateTime";
import { useSession } from "@/hooks/ctx";
import { getDireccion } from "@/utils/Direccion";
import LoadingScreen from "@/components/Loading";
import { buscarEtiquetas } from "@/services/etiquetasService"; // Importa la función de buscarEtiquetas


const preview = () => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const [loading, setLoading] = useState(false);

  const { session, signIn } = useSession();
  const [logo, setimage2] = useState<ImagePickerAsset>();
  const [imageBanner, setImageBanner] = useState<ImagePickerAsset>();
  const [tags, setTags] = useState<string[] | []>([]);
  const [tag, setTag] = useState<string>("");
  const [sugerenciasEtiquetas, setSugerenciasEtiquetas] = useState<any[]>([]);
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

  const handleTagInputChange = async (texto: string) => {
    setTag(texto.toLowerCase());  // Actualizar el valor del input
  
    if (texto.length >= 0) {  // Realizar la búsqueda solo si el texto tiene más de 3 caracteres
      try {
        const etiquetasEncontradas = await buscarEtiquetas(texto);
        
        // Si no se encuentra ninguna etiqueta, muestra un guion
        if (etiquetasEncontradas.length === 0) {
          setSugerenciasEtiquetas(["-"]);  // Mostrar guion si no hay etiquetas
        } else {
          setSugerenciasEtiquetas(etiquetasEncontradas);
        }
      } catch (error) {
        console.error("Error al buscar etiquetas:", error);
        setSugerenciasEtiquetas(["-"]);  // Mostrar guion en caso de error
      }
    } else {
      setSugerenciasEtiquetas(["-"]);  // Limpiar las sugerencias si el texto es corto
    }
  };

  const addTag = () => {
    if (!tag) {
      return;
    }
    console.log(tag);
    setTag("");
    console.log(tags);
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
          dia: index+1,
          horario: horario,
        };
      });
  };

  const local = useLocalSearchParams();
  console.log(local);
  
  const handleSubmit = async () => {
    // obtener datos del params
    const data = { ...local };
    //const data = { ...local, horarios: obtenerHorarios(), etiquetas: tags };
    
    // ObtenerHorarios
    const horarios = obtenerHorarios();
    
    const formData = new FormData();

    setLoading(true)
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

      formData.append("horarios", JSON.stringify(horarios));
      
      if (tags.length > 0) {
        formData.append("etiquetas", JSON.stringify(tags));
      }
      console.log(formData);
      console.log(API_URL);
      const response = await fetch(`${API_URL}/api/establecimiento/registro/`, {
        method: "POST",
        body: formData,
      });

      // Manejo de errores en la respuesta
      if (!response.ok) {
        // Intentamos extraer información de error del cuerpo de la respuesta
        const errorDetails = await response.json();
        throw new Error(
          `Error al registrar el establecimiento: ${response.statusText} (${response.status
          }). Detalles: ${JSON.stringify(errorDetails)}`
        );
      }

      // Procesar la respuesta
      const result = await response.json();
      console.log("Establecimiento registrado:", result);
      const {id} = result

      if (session) {
        signIn({
          ...session,
          establecimiento: id,
        });
      }
      

      //router.navigate('/')
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          "Error en el registro del establecimiento:",
          error.message
        );
      } else {
        console.error("Error desconocido:", error);
      }

    }
    setLoading(false)
  };

  if(loading) return <LoadingScreen/>
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
              <Image
                source={require('../../assets/images/defaultBanner.jpg')}
                style={Styles.imageBanner}
              />
            )}
            {!imageBanner && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  position: "absolute",
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
              { left: "-30%" },
            ]}
            onPress={() => {
              pickImage(setimage2, [1, 1]);
            }}
          >
            {logo ? (
              <Image source={{ uri: logo.uri }} style={Styles.imageRounded} />
            ) : (
              <>
                <Image source={require('../../assets/images/default.jpg')} style={Styles.imageRounded} />
                <View style={styles.overlay}>
                  <Text style={styles.plusText}>+</Text>
                </View>
              </>
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
              onChangeText={handleTagInputChange}
              placeholder="Etiquetas"
              style={[{ color: "#402158", width: "80%" }]}
            />
            <Pressable onPress={addTag} style={Styles.addTag}>
              <FontAwesome color={"white"} name="plus" />
            </Pressable>
          </View>
          {tag.length >= 2 && sugerenciasEtiquetas.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {sugerenciasEtiquetas.map((etiqueta, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    setTags([...tags, etiqueta.texto_etiqueta]);  // Agregar la etiqueta al estado
                    setTag("");  // Limpiar el campo de texto
                    setSugerenciasEtiquetas([]);  // Limpiar las sugerencias
                  }}
                  style={styles.suggestionItem}
                >
                  <Text>{etiqueta.texto_etiqueta+''}</Text>
                </Pressable>
              ))}
            </View>
          )}
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
  suggestionsContainer: {
    overflow: "scroll",  // desplazamiento si hay muchas sugerencias
    backgroundColor: "#fff",
    borderRadius: 4,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 5,
    zIndex: 1,
    width: "80%",
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
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
    color: "#fff", 
    fontWeight: "500",
  },
  overlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  plusText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000', 
  },
});

export default preview;
