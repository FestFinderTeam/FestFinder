import Header from "@/components/Header";
import LoadingScreen from "@/components/Loading";
import Review from "@/components/Review";
import Stars from "@/components/Stars";
import Styles from "@/globalStyles/styles";
import { useSession } from "@/hooks/ctx";
import {
    calificarEstablecimiento,
    getValoracionesPorLocal,
} from "@/services/VisitasService";
import { useLocalSearchParams } from "expo-router";
import { ReviewType } from "@/utils/Review";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import ErrorText from "@/components/ErrorText";
import {
    Button,
    Image,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
    StyleSheet,
    Modal,
} from "react-native";

const reseñas = () => {
    const params = useLocalSearchParams();
    const [comentario, setComentario] = useState("");
    const [calificacion, setCalificacion] = useState(0);
    const [reviews, setReviews] = useState([]);
    const { session } = useSession();
    const [loading, setLoading] = useState(false);
    const [verificado, setVerificado] = useState<boolean | null>();
    const [showVerificar, setShowVerificar] = useState(false);
    const [codigo, setCodigo] = useState("");

    const fetchReviews = async () => {
        const { id } = params;
        console.log("id establecimiento", id);
        const reviews = await getValoracionesPorLocal(id + "");
        console.log(reviews);
        setReviews(reviews);
    };

    useEffect(() => {
        setLoading(true);
        try {
            fetchReviews();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSubmit = () => {
        const data = {
            puntuacion: calificacion,
            comentario,
            usuario: session?.id_usuario,
            establecimiento: params.id,
        };
        console.log(data);
        calificarEstablecimiento(
            data.usuario + "",
            data.establecimiento + "",
            data.puntuacion,
            data.comentario
        );
        setLoading(true);
        try {
        } catch (e) {
            console.error(e);
        } finally {
            fetchReviews()
            setLoading(false);
        }
    };
    const verificarCodigo = () => {
        const texto = codigo.replace("-", "");
        if (texto.match("^[0-9A-Z]{8}$")) {
            setVerificado(true);
            setShowVerificar(false);
        } else {
            setVerificado(false);
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <>
            <Header title="Reseñas" />
            {showVerificar && (
                <Modal transparent>
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContent}>
                            <Pressable
                                onPress={() => setShowVerificar(false)}
                                style={styles.closeButton}
                            >
                                <FontAwesome
                                    name="close"
                                    size={20}
                                    color="#402158"
                                />
                            </Pressable>
                            <Text style={Styles.linkText}>
                                Código de verificación
                            </Text>
                            <TextInput
                                style={Styles.input}
                                value={codigo}
                                onChangeText={(e) => {
                                    if (e.length === 5 && codigo.length === 4) {
                                        setCodigo(
                                            codigo +
                                                "-" +
                                                e
                                                    .charAt(e.length - 1)
                                                    .toUpperCase()
                                        );
                                    } else if (
                                        e.length === 5 &&
                                        e[e.length - 1] === "-"
                                    ) {
                                        setCodigo(e.slice(0, -1));
                                    } else {
                                        setCodigo(e.toUpperCase());
                                    }
                                }}
                                placeholder="XXXX-XXXX"
                            />
                            {verificado === false && (
                                <ErrorText error="Código inválido" />
                            )}
                            {verificado === true && (
                                <Text style={styles.successText}>
                                    Código validado
                                </Text>
                            )}
                            <Pressable
                                style={Styles.button}
                                onPress={verificarCodigo}
                            >
                                <Text style={Styles.buttonText}>Verificar</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            )}
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <Text style={styles.sectionTitle}>Comentarios</Text>
                {reviews.map((review, index) => (
                    <View key={index} style={styles.reviewContainer}>
                        <Review review={review} />
                    </View>
                ))}
            </ScrollView>
            <View style={styles.commentSection}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Text style={styles.sectionTitle}>Comentar</Text>
                    <Pressable
                        style={{ flexDirection: "row" }}
                        onPress={() => setShowVerificar(true)}
                    >
                        <Text
                            style={{
                                color: verificado ? "#238ed7" : "#A9A9A9",
                            }}
                        >
                            {verificado ? "Verificado " : "Verificar "}
                        </Text>
                        <FontAwesome
                            name="check-circle"
                            size={24}
                            color={verificado ? "#238ed7" : "#A9A9A9"}
                        />
                    </Pressable>
                </View>
                <View style={styles.commentHeader}>
                    <Image
                        source={
                            (session?.imagen_url && {
                                uri: session.imagen_url,
                            }) ||
                            require("../../assets/images/default-profile.png")
                        }
                        style={styles.profileImage}
                    />
                    <Stars value={calificacion} setValue={setCalificacion} />
                </View>

                <TextInput
                    style={styles.textInput}
                    onChangeText={setComentario}
                    value={comentario}
                    placeholder="Deja tu comentario"
                    placeholderTextColor="#888"
                />
                <Pressable style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Compartir</Text>
                </Pressable>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    commentHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    successText: {
        color: "#28A745",
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
        textAlign: "center",
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
    },
    scrollViewContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
        marginLeft: 10,
    },
    reviewContainer: {
        backgroundColor: "#f9f9f9",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    commentSection: {
        padding: 20,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 10,
        marginRight: 10,
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        backgroundColor: "#f9f9f9",
        color: "#333",
    },
    button: {
        backgroundColor: "#402158",
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default reseñas;
