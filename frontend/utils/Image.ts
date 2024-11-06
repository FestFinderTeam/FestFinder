import * as ImagePicker from "expo-image-picker";

export type ImageAsset = ImagePicker.ImagePickerAsset;

export const pickImage = async (setImage: any, aspect: [number, number]) => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: aspect,
        quality: 1,
    });

    if (!result.canceled) {
        setImage(result.assets[0]);
    }
};

export const getImage = (image: ImagePicker.ImagePickerAsset):any => {
    if (!image) return null;
    const uri = image.uri;
    const filename = uri.split("/").pop();
    const fileType = uri.split(".").pop();

    return {
        uri,
        name: filename,
        type: `image/${fileType}`,
    };
};
