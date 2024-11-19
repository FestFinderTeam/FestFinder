import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

export const showTime = (values: Date[], setValues: any, index: number) => {
    DateTimePickerAndroid.open({
        value: values[index],
        onChange: (event, selectedDate: Date | undefined) => {
            if (selectedDate) {
                const newValues = [...values];
                newValues[index] = selectedDate;
                setValues(newValues);
            }
        },
        mode: "time",
        is24Hour: true,
    });
};
export const showDate = (values: Date[], setValues: any, index: number) => {
    DateTimePickerAndroid.open({
        value: values[index],
        onChange: (event, selectedDate: Date | undefined) => {
            if (selectedDate) {
                const newValues = [...values];
                newValues[index] = selectedDate;
                setValues(newValues);
            }
        },
        mode: "date",
        is24Hour: true,
    });
};

export const showSingleDate = (value: Date, setValue: any) => {
    DateTimePickerAndroid.open({
        value: value,
        onChange: (event, selectedDate: Date | undefined) => {
            console.log("fecha seleccionada", selectedDate);

            selectedDate && setValue(selectedDate);
        },
        mode: "date",
        is24Hour: true,
    });
};
export const showSingleTime = (value: Date, setValue: any) => {
    DateTimePickerAndroid.open({
        value: value,
        onChange: (event, selectedDate: Date | undefined) =>
            selectedDate && setValue(selectedDate),
        mode: "time",
        is24Hour: true,
    });
};

export const dateToHHmm = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const dateToDDMMYYYY = (date: Date) =>
    date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

export const dateToYYYYMMDD = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
