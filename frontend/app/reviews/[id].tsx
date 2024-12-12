import Header from "@/components/Header";
import LoadingScreen from "@/components/Loading";
import Review from "@/components/Review";
import Stars from "@/components/Stars";
import Styles from "@/globalStyles/styles";
import { useSession } from "@/hooks/ctx";
import { calificarEstablecimiento, getValoracionesPorLocal } from "@/services/VisitasService";
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
    StyleSheet,
} from "react-native";

const reseñas = () => {
    const params = useLocalSearchParams();
    const [comentario, setComentario] = useState("");
    const [calificacion, setCalificacion] = useState(0);
    const [reviews, setReviews] = useState([]);
    const { session } = useSession();
    const [loading, setLoading] = useState(false);

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
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <>
            <Header title="Reseñas" />
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <Text style={styles.sectionTitle}>Comentarios</Text>
                {reviews.map((review, index) => (
                    <View key={index} style={styles.reviewContainer}>
                        <Review review={review} />
                    </View>
                ))}
            </ScrollView>
            <View style={styles.commentSection}>
                <Text style={styles.sectionTitle}>Comentar</Text>
                <Image
                    source={
                        (session?.imagen_url && { uri: session.imagen_url }) ||
                        require("../../assets/images/default-profile.png")
                    }
                    style={styles.profileImage}
                />
                <Stars value={calificacion} setValue={setCalificacion} />
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
