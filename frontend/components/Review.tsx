import type { ReviewType } from "@/utils/Review";
import { FontAwesome } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";
import Stars from "./Stars";
import Styles from "@/globalStyles/styles";

interface Props {
    review: ReviewType;
}

const Review = ({ review }: Props) => {
    return (
        <View style={{ position: "relative" }}>
            <Image
                source={
                    (review.usuario_info?.imagen_detail && {
                        uri: review.usuario_info?.imagen_detail?.imagen,
                    }) ||
                    require("../assets/images/default-profile.png")
                }
                style={[Styles.imageProfile, { marginTop: 30 }]} 
            />
            <Text
                style={{
                    position: "absolute",
                    top: 10, 
                    left: 10,
                    fontSize: 12,
                    color: "#A9A9A9",
                    fontWeight: "bold",
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                    paddingHorizontal: 5,
                    paddingVertical: 2,
                    borderRadius: 5,
                    zIndex: 10, 
                }}
            >
                {review.fecha_publicacion}
            </Text>

            <Text style={{ marginTop: 10, fontWeight: "bold" }}>
                {review.usuario_info?.nombre}
            </Text>
            <View style={{ position: "absolute", top: 10, right: 10 }}>
                <Stars value={review.puntuacion} />
            </View>
            <Text>{review.comentario}</Text>
        </View>
    );
};

export default Review;
