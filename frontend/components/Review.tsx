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
                style={[Styles.imageProfile, { marginTop: 40 }]}
            />
            <Text
                style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    fontSize: 12,
                    color: "#A9A9A9",
                    fontWeight: "bold",
                    paddingHorizontal: 5,
                    paddingVertical: 2,
                    borderRadius: 5,
                    zIndex: 10,
                }}
            >
                {review.fecha_publicacion.split("T")[0]}
            </Text>

            <Text
                style={{
                    marginTop: 10,
                    fontWeight: "bold",
                    color: review.verificado ? "#238ed7" : "",
                }}
            >
                {review.usuario_info?.nombre + " "}
                {review.verificado && (
                    <FontAwesome name="check-circle" size={15} />
                )}
            </Text>
            <View style={{ position: "absolute", top: 10, right: 10 }}>
                <Stars value={review.puntuacion} />
            </View>
            <Text>{review.comentario}</Text>
        </View>
    );
};

export default Review;
