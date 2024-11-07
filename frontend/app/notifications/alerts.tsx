import { View, Text, Switch } from "react-native"; // Asegúrate de importar Text
import Header from "@/components/Header";
import { useState } from "react";

const Notifications = () => {
    const [isGeneralNotificationsEnabled, setGeneralNotificationsEnabled] = useState(false);
    const [isSoundEnabled, setSoundEnabled] = useState(false);
    const [isVibrationEnabled, setVibrationEnabled] = useState(false);
    const [isUpdateEnabled, setUpdateEnabled] = useState(false);
    const [isCloseEnabled, setCloseEnabled] = useState(false);
    const [isLikedEventsEnabled, setLikedEventsEnabled] = useState(false);
    const [isTrendingEnabled, setTrendingEnabled] = useState(false);
    const [isPlacesUpdatesEnabled, setPlacesUpdatesEnabled] = useState(false);
    const [isDisccountsEnabled, setDisccountsEnabled] = useState(false);
    return (
        <View style={{}}>
            <Header title="Notificaciones" />
            <View style={{ flexDirection: "row", marginTop: "10%", marginLeft: "5%" }}>
                <Text style={styles.textoTitulo}>Personaliza tus </Text>
                <Text style={styles.tituloMorado}>notificaciones</Text>
            </View>
            <View style={{ marginTop: "10%", marginLeft: "5%" }}>
                <Text style={styles.textoTitulo}>Común</Text>
                <View style={{ marginTop: "4%" }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={styles.textoSubtitulo}>Notificaciones generales</Text>
                        <Switch
                            value={isGeneralNotificationsEnabled}
                            onValueChange={(value) => setGeneralNotificationsEnabled(value)}
                            trackColor={{ false: "#D3D3D3", true: "#402158" }}
                            thumbColor={isGeneralNotificationsEnabled ? "#FFFFFF" : "#FFFFFF"}
                        />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                        <Text style={styles.textoSubtitulo}>Sonido</Text>
                        <Switch
                            value={isSoundEnabled}
                            onValueChange={(value) => setSoundEnabled(value)}
                            trackColor={{ false: "#D3D3D3", true: "#402158" }}
                            thumbColor={isSoundEnabled ? "#FFFFFF" : "#FFFFFF"}
                        />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                        <Text style={styles.textoSubtitulo}>Vibración</Text>
                        <Switch
                            value={isVibrationEnabled}
                            onValueChange={(value) => setVibrationEnabled(value)}
                            trackColor={{ false: "#D3D3D3", true: "#402158" }}
                            thumbColor={isVibrationEnabled ? "#FFFFFF" : "#FFFFFF"}
                        />
                    </View>
                </View>
            </View>
            <View style={{
                width: "90%",
                height: 2,
                backgroundColor: "#808080",
                marginLeft: "5%",
                marginTop: "10%",
                marginBottom: "2%",
            }} />
            <View style={{ marginTop: "10%", marginLeft: "5%" }}>
                <Text style={[styles.textoTitulo,{marginBottom:"4%"}]}>Actualización de sistemas y servicios</Text>
                <View style={{ marginTop: "4%" }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={styles.textoSubtitulo}>Actualizaciones</Text>
                        <Switch
                            value={isUpdateEnabled}
                            onValueChange={(value) => setUpdateEnabled(value)}
                            trackColor={{ false: "#D3D3D3", true: "#402158" }}
                            thumbColor={isGeneralNotificationsEnabled ? "#FFFFFF" : "#FFFFFF"}
                        />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                        <Text style={styles.textoSubtitulo}>Eventos próximos</Text>
                        <Switch
                            value={isCloseEnabled}
                            onValueChange={(value) => setCloseEnabled(value)}
                            trackColor={{ false: "#D3D3D3", true: "#402158" }}
                            thumbColor={isSoundEnabled ? "#FFFFFF" : "#FFFFFF"}
                        />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                        <Text style={styles.textoSubtitulo}>Eventos que te gustan</Text>
                        <Switch
                            value={isLikedEventsEnabled}
                            onValueChange={(value) => setLikedEventsEnabled(value)}
                            trackColor={{ false: "#D3D3D3", true: "#402158" }}
                            thumbColor={isVibrationEnabled ? "#FFFFFF" : "#FFFFFF"}
                        />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                        <Text style={styles.textoSubtitulo}>Tendencias</Text>
                        <Switch
                            value={isTrendingEnabled}
                            onValueChange={(value) => setTrendingEnabled(value)}
                            trackColor={{ false: "#D3D3D3", true: "#402158" }}
                            thumbColor={isVibrationEnabled ? "#FFFFFF" : "#FFFFFF"}
                        />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                        <Text style={styles.textoSubtitulo}>Novedades de tus locales favoritos</Text>
                        <Switch
                            value={isPlacesUpdatesEnabled}
                            onValueChange={(value) => setPlacesUpdatesEnabled(value)}
                            trackColor={{ false: "#D3D3D3", true: "#402158" }}
                            thumbColor={isVibrationEnabled ? "#FFFFFF" : "#FFFFFF"}
                        />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                        <Text style={styles.textoSubtitulo}>Promociones</Text>
                        <Switch
                            value={isDisccountsEnabled}
                            onValueChange={(value) => setDisccountsEnabled(value)}
                            trackColor={{ false: "#D3D3D3", true: "#402158" }}
                            thumbColor={isVibrationEnabled ? "#FFFFFF" : "#FFFFFF"}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = {
    textoTitulo: {
        fontWeight: "bold" as "bold",
        fontSize: 18,
    },
    tituloMorado: {
        fontWeight: "bold" as "bold",
        fontSize: 18,
        color: "#7D5683"
    },
    textoSubtitulo: {
        fontWeight: "semibold" as "semibold",
        fontSize: 16,
        marginBottom: 10,
    },

};

export default Notifications;
