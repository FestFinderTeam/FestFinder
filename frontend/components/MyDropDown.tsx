import React, { useState } from "react";
import { Button, Menu, Divider } from "react-native-paper";
import { StyleSheet, View } from "react-native";

interface BusinessType {
	key: string;
	value: string;
}

interface MyDropdownProps {
	dataTypesBusiness: BusinessType[];
	setSelectedBusiness: (selected: string) => void;
}

const MyDropdown = ({
	dataTypesBusiness,
	setSelectedBusiness,
}: MyDropdownProps) => {
	const [visible, setVisible] = useState(false);
	const [selected, setSelected] = useState<string>("Tipo de negocio");

	const showMenu = () => setVisible(true);
	const hideMenu = () => setVisible(false);

	const handleSelect = (item: string) => {
		setSelected(item);
		setSelectedBusiness(item);
		hideMenu();
	};

	return (
		<View>
			<Button onPress={showMenu} mode="outlined" style={styles.button}>
				{selected}
			</Button>
			<Menu
				visible={visible}
				onDismiss={hideMenu}
				anchor={<Button onPress={showMenu}> </Button>}
			>
				{dataTypesBusiness.map((item) => (
					<Menu.Item
						key={item.key}
						onPress={() => handleSelect(item.value)}
						title={item.value}
					/>
				))}
				<Divider />
			</Menu>
		</View>
	);
};

const styles = StyleSheet.create({
	button: {
		width: "100%",
	},
});

export default MyDropdown;
