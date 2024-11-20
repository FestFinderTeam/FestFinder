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
        <View>
            <Image
                source={
                    (review.usuario?.imagen_url && {
                        uri: review.usuario?.imagen_url,
                    }) ||
                    require("../assets/images/default-profile.png")
                }
                style={Styles.imageProfile}
            />
            <Text>{review.usuario?.nombre}</Text>
            <View style={{ flexDirection: "row" }}>
                <Stars value={review.puntuacion} />
            </View>
            <Text>{review.fecha}</Text>
            <Text>{review.comentario}</Text>
        </View>
    );
};

export default Review;
