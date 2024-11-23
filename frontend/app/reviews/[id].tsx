import Header from "@/components/Header";
import LoadingScreen from "@/components/Loading";
import Review from "@/components/Review";
import Stars from "@/components/Stars";
import Styles from "@/globalStyles/styles";
import { useSession } from "@/hooks/ctx";
import { calificarEstablecimiento, getValoracionesPorLocal } from "@/services/VisitasService";
import { dateToYYYYMMDD } from "@/utils/DateTime";
import { ReviewType } from "@/utils/Review";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Button,
    Image,
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
    
    const fetchReviews = async () => {
        const { id } = params;
        console.log("id establecimiento", id);
        const reviews = await getValoracionesPorLocal(id+'');
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
        const valoracion = calificarEstablecimiento(
                                                    data.usuario+"",
                                                    data.establecimiento+"",
                                                    data.puntuacion,
                                                    data.comentario
                                                )
        setLoading(true);
        try {
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return <LoadingScreen />;
    }
    return (
        <>
            <Header title="Reseñas" />
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
                <Pressable style={Styles.button} onPress={handleSubmit}>
                    <Text style={Styles.buttonText}>Compartir</Text>
                </Pressable>
            </View>
        </>
    );
};

export default reseñas;
