export default {
  "expo": {
    "name": "FestFinder",
    "slug": "FestFinder",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/festLogo.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },

    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.mobile.festfinder",
      "googleServicesFile": process.env.GOOGLE_SERVICES_INFOPLIST
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.mobile.festfinder",
      "googleServicesFile": process.env.GOOGLE_SERVICES_JSON
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      "@react-native-google-signin/google-signin",
      "expo-secure-store",
      [

        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to let you share them with your friends."
        },
      ],
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "979255f8-347b-4804-96b2-f1fa93c19fe6"
      }
    }
  }
}
