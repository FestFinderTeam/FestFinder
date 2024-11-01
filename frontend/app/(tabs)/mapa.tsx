import GoogleMap from "@/components/GoogleMap";
import Notch from "@/components/Notch";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import imagen from "../../assets/images/pablo.png";

const mapa = () => {


    return (
        <View>
            <Notch />
            <GoogleMap />
        </View>
    );
};

export default mapa;
