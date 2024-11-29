require("dotenv").config();
export default {
    expo: {
        name: "FestFinder",
        slug: "FestFinder",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "festfinder",
        userInterfaceStyle: "automatic",
        splash: {
            image: "./assets/images/festLogoHD.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff",
        },
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.mobile.festfinder",
            googleServicesFile: process.env.GOOGLE_SERVICES_INFOPLIST,
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/icon.png",
                backgroundColor: "#402158",
            },
            package: "com.mobile.festfinder",
            googleServicesFile: process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
            config: {
                googleMaps: {
                    apiKey: "AIzaSyCCi7U0FG1-Mq_eH1pOooq3g3I41mrXWsg",
                },
            },
            intentFilters: [
                {
                    action: "VIEW",
                    autoVerify: true,
                    category: ["DEFAULT", "BROWSABLE"],
                    data: {
                        scheme: "https",
                        host: "fest-finder.vercel.app",
                        pathPrefix: "/",
                    },
                },
            ],
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/icon.png",
        },
        plugins: [
            [
                "expo-image-picker",
                {
                    photosPermission:
                        "The app accesses your photos to let you share them with your friends.",
                },
            ],
            [
                "expo-location",
                {
                    locationAlwaysAndWhenInUsePermission:
                        "Permitir a FestFinder usar tu localizacion",
                },
            ],
            "expo-router",
            "@react-native-google-signin/google-signin",
            "expo-secure-store",
        ],
        experiments: {
            typedRoutes: true,
        },
        extra: {
            apiUrl: process.env.EXPO_PUBLIC_API_URL,
            router: {
                origin: false,
            },
            eas: {
                projectId: "979255f8-347b-4804-96b2-f1fa93c19fe6",
            },
        },
        owner: "festfinder",
    },
};
