import Login from "@/components/Login";
import React from "react";
import { Text, View, Image } from "react-native";
import Styles from "../globalStyles/styles";
import { Link } from "@react-navigation/native";

const login = () => {
    return (
        <View style={Styles.container}>
          <Image
				source={require("../assets/images/festLogoHD.png")}
				style={{ aspectRatio: 1, width: "80%", height: "auto" }}
				resizeMode="contain"
			/>
            <Login />
            <View style={Styles.linkContainer}>
                <Text>No tienes una cuenta? </Text>
                <Link to="/register" style={Styles.textDecoration2}>
                    Registrarse
                </Link>
            </View>
        </View>
    );
};



export default login;
