import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { TextInput, View, StyleSheet, Pressable, FlatList } from "react-native";
import Styles from "../globalStyles/styles";
import { Button } from "react-native-paper";
export type filterSearch = "todo" | "locales" | "eventos";

interface Props {
	setSearch: (value: string) => void;
	handleSearch: () => void;
	filtro: string;
	setFilter: (text: filterSearch) => void;
}

const Header = ({ setSearch, handleSearch, filtro, setFilter }: Props) => {
	return (
		<View>
			<View
				style={[
					Styles.headerView,
					{ flexDirection: "row", alignItems: "center" },
				]}
			>
				<View style={styles.headerContent}>
					<TextInput
						style={styles.searchInput}
						placeholder="Buscar"
						placeholderTextColor="#888"
						onChangeText={setSearch}
					/>
					<Pressable style={styles.icon} onPress={handleSearch}>
						<FontAwesome name="search" size={20} color="#888" />
					</Pressable>
				</View>
			</View>

			{/*Filtros*/}
			<FlatList
				data={["locales", "eventos",]}
				keyExtractor={(item) => item}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					gap: 8,
					padding: 8,
				}}
				renderItem={({ item: type }) => (
					<Button
						mode={filtro === type ? "contained" : "outlined"}
						onPress={() => setFilter(type as filterSearch)}
					>
						{type.charAt(0).toUpperCase() + type.slice(1)}
					</Button>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "white",
		borderRadius: 10,
		paddingHorizontal: 10,
		width: "100%",
		alignSelf: "center",
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		color: "black",
		paddingVertical: 6,
		paddingHorizontal: 10,
	},
	icon: {
		paddingLeft: 10,
	},
	typeContainer: {
		marginRight: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	types: {
		backgroundColor: "#402158",
		color: "white",
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 15,
		textAlign: "center",
		width: 70,
	},
});

export default Header;
