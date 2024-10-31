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
        onChange: (event, selectedDate: Date | undefined) =>
            selectedDate && setValue(selectedDate),
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
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
