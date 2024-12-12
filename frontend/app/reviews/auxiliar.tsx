import ErrorText from "@/components/ErrorText";
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
import { dateToYYYYMMDD } from "@/utils/DateTime";
import { ReviewType } from "@/utils/Review";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState, version } from "react";
import {
    Button,
    Image,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

const reseñas = () => {
    const params = useLocalSearchParams();
    const [comentario, setComentario] = useState("");
    const [calificacion, setCalificacion] = useState(0);
    const [reviews, setReviews] = useState<ReviewType[]>([]);
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
        const valoracion = calificarEstablecimiento(
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
            setLoading(false);
        }
    };
    const verificarCodigo = () => {
        const texto = codigo.replace('-', '')
        if (texto.match("^[0-9A-Z]{8}$")) {
            setVerificado(true);
            setShowVerificar(false)
            handleSubmit();
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
                    <View style={{ backgroundColor: "white" }}>
                        <Pressable onPress={() => setShowVerificar(false)}>
                            <FontAwesome name="close" />
                        </Pressable>
                        <Text style={Styles.linkText}>
                            Codigo de verficacion
                        </Text>
                        <TextInput
                            style={Styles.input}
                            value={codigo}
                            onChangeText={(e) => {
                                if (e.length === 5 && codigo.length === 4) {
                                    setCodigo(codigo + '-' + e.charAt(e.length-1).toUpperCase() );
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
                            <ErrorText error="codigo invalido" />
                        )}
                        <Pressable
                            style={Styles.button}
                            onPress={verificarCodigo}
                        >
                            <Text style={Styles.buttonText}>Verificar</Text>
                        </Pressable>
                    </View>
                </Modal>
            )}
            <ScrollView>
                <Text>Comentarios</Text>
                {reviews.map((review, index) => (
                    <Review key={index} review={review} />
                ))}
            </ScrollView>
            <Text>Comentar</Text>
            <View>
                <Image
                    source={
                        (session?.imagen_url && { uri: session.imagen_url }) ||
                        require("../../assets/images/default-profile.png")
                    }
                    style={Styles.imageProfile}
                />
                <Stars value={calificacion} setValue={setCalificacion} />
                <TextInput
                    onChangeText={setComentario}
                    value={comentario}
                    placeholder="Deja tu comentario"
                />
                <Pressable
                    style={Styles.button}
                    onPress={() => {
                        setShowVerificar(true);
                    }}
                >
                    <Text style={Styles.buttonText}>Compartir</Text>
                </Pressable>
            </View>
        </>
    );
};

export default reseñas;