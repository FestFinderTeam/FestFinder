import { useSession } from "@/hooks/ctx";
import { Image, Pressable, Text, View } from "react-native";
import Styles from "../../globalStyles/styles";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import ItemProfile from "@/components/ItemProfile";
import Header from "@/components/Header";
import { router } from "expo-router";

const profile = () => {
    const { session, signOut } = useSession();

    if (!session) {
        router.push("/");
        return;
    }

    const { nombre, imagen_url, email } = session;

    return (
        <View>
            <Header title="Mi perfil" />
            <View style={Styles.containerProfile}>
                <Image
                    source={{ uri: imagen_url }}
                    style={Styles.imageProfile}
                />
                <View
                    style={{
                        alignContent: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text style={styles.textoTitulo}>{nombre}</Text>
                    <Text style={styles.textoMail}>{email}</Text>
                </View>
            </View>
            <Text style={styles.textoSubtitulo}>Perfil</Text>
            <View style={styles.parametros}>
                <ItemProfile
                    onPress={() => {}}
                    color="#7D5683"
                    text="Informacion personal"
                    icon="user-o"
                    textColor="#787878"
                />
                <ItemProfile
                    onPress={() => {}}
                    color="#7D5683"
                    text="Lugares favoritos"
                    icon="heart-o"
                    textColor="#787878"
                />
                <ItemProfile
                    onPress={() => {}}
                    color="#7D5683"
                    text="Historial"
                    icon="clock-o"
                    textColor="#787878"
                />
                <ItemProfile
                    onPress={() => {
                        router.push("/places/myplace");
                    }}
                    color="#7D5683"
                    text="Administrar mi local"
                    icon="gear"
                    textColor="#787878"
                />
            </View>

            <Text style={styles.textoSubtitulo}>Configuracion</Text>
            <View style={styles.parametros}>
                <ItemProfile
                    onPress={() => {}}
                    color="#7D5683"
                    text="Notificaiones"
                    icon="bell-o"
                    textColor="#787878"
                />
                <ItemProfile
                    onPress={() => {
                        router.navigate("/business/register_business");
                    }}
                    color="#7D5683"
                    text="Registrar mi local"
                    icon="cart-plus"
                    textColor="#787878"
                />
                <ItemProfile
                    onPress={() => {
                        signOut();
                    }}
                    color="#7D5683"
                    text="Cerrar sesión"
                    icon="arrow-circle-right"
                    textColor="#787878"
                />
            </View>
        </View>
    );
};

const styles = {
    textoTitulo: {
        fontWeight: "bold" as "bold",
        fontSize: 23,
    },
    textoSubtitulo: {
        fontWeight: "bold" as "semibold",
        fontSize: 16,
        marginTop: 40,
        marginLeft: 10,
    },
    parametros: {
        marginLeft: 20,
        marginTop: 10,
    },
    textoMail: {
        marginTop: 2,
    },
};

export default profile;
