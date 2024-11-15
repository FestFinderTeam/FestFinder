import { DefaultTheme } from "react-native-paper";

const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: "#402158", // Color principal en botones, títulos, subtítulos, etc.
		accent: "purple", // Color para elementos destacados como enlaces
		background: "#ededed", // Fondo de vistas como `banner`
		surface: "#ffffff", // Fondo para tarjetas o componentes elevados
		text: "#402158", // Color de texto principal
		//onSurface: "#7D5683", // Texto adicional, como en `textDecoration2`
		placeholder: "#8c8b8b", // Color para bordes y textos secundarios en `input` y `imageRoundedContainer`
		error: "#B23A48", // Para errores y `buttonTextGoogle`
	},
};

export default theme;
