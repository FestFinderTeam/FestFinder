import React from "react";
import { TextInput, HelperText } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

interface TextInputWithHelperProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: boolean;
  errorText?: string;
  icon?: IconSource;
  onIconPress?: () => void;
  [key: string]: any;
}

const TextInputWithHelper = ({
  label,
  value,
  onChangeText,
  error,
  errorText,
  icon,
  onIconPress,
  ...props
}: TextInputWithHelperProps) => {
  return (
    <>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        error={!!error}
        mode="outlined"
        right={
          icon ? (
            <TextInput.Icon icon={icon} onPress={onIconPress} />
          ) : undefined
        }
        {...props}
      />
      {error && (
        <HelperText type="error" visible={!!error}>
          {errorText}
        </HelperText>
      )}
    </>
  );
};

export default TextInputWithHelper;
