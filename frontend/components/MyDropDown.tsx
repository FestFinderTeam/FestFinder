import React, { useState } from "react";
import { Button, Menu, Divider, TextInput, List } from "react-native-paper";
import { FlatList } from "react-native";
import { View } from "react-native";

interface BusinessType {
	key: string;
	value: string;
}

interface MyDropdownProps {
	dataTypesBusiness: BusinessType[];
	setSelectedBusiness: (selected: string) => void;
	[key: string]: any;
}

const MyDropdown = ({
	dataTypesBusiness,
	setSelectedBusiness,
	...props
}: MyDropdownProps) => {
	const [visible, setVisible] = useState(false);
	const [search, setSearch] = useState("");
	const filteredData = dataTypesBusiness.filter((item) =>
		item.value.toLowerCase().includes(search.toLowerCase())
	);

	const [selected, setSelected] = useState<string>("Tipo de negocio");

	const handleSelect = (item: BusinessType) => {
		setSelected(item.value);
		setSelectedBusiness(item.value);
		setVisible(false);
	};

	return (
		<View {...props} >
			<Menu
				visible={visible}
				onDismiss={() => setVisible(false)}
				anchor={
					<Button onPress={() => setVisible(true)} mode="outlined">
						{selected}
					</Button>
				}
				anchorPosition="bottom"
				style={{ flex: 1 }}
			>
				<View style={{ width: "100%" }}>
					<TextInput
						label="Buscar"
						value={search}
						onChangeText={(e: string) => setSearch(e)}
						right={
							search !== "" && (
								<TextInput.Icon icon="delete" onPress={() => setSearch("")} />
							)
						}
					/>

					<FlatList
						data={filteredData}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({ item }) => (
							<List.Item
								title={item.value}
								onPress={() => handleSelect(item)}
							/>
						)}
						showsVerticalScrollIndicator={true}
						style={{ maxHeight: 200 }}
                        ItemSeparatorComponent={Divider}
					/>
				</View>
			</Menu>
		</View>
	);
};

export default MyDropdown;
