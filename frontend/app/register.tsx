import { Text, View, Image } from "react-native";
import Styles from "../globalStyles/styles";
import { Link } from "@react-navigation/native";
import { useEffect, useState } from "react";
import LoginGoogle from "@/components/LoginGoogle";
import { API_URL } from "@/constants/Url";
import TextInputWithHelper from "@/components/TextInputWithHelperText";
import { Button } from "react-native-paper";

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  contraseña: string;
  confirmarContraseña: string;
}

interface Errors {
  nombre: string;
  email: string;
  telefono: string;
  contraseña: string;
  confirmarContraseña: string;
}

const fieldNames: { [key in keyof FormData]: string } = {
  nombre: "Nombre",
  email: "Email",
  telefono: "Teléfono",
  contraseña: "Contraseña",
  confirmarContraseña: "Confirmar Contraseña",
};

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{8}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    telefono: "",
    contraseña: "",
    confirmarContraseña: "",
  });

  useEffect(() => {
    const clearError = (field: keyof FormData) => {
      if (formData[field]) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: "",
        }));
      }
    };
    // Itera sobre cada campo en formData y limpia su error si tiene valor
    Object.keys(formData).forEach((key) => {
      const field = key as keyof FormData;
      clearError(field);
    });
  }, [formData]);

  const [errors, setErrors] = useState<Errors>({
    nombre: "",
    email: "",
    telefono: "",
    contraseña: "",
    confirmarContraseña: "",
  });

  const handleSubmit = async () => {
    const newErrors = { ...errors };
    Object.keys(formData).forEach((field) => {
      const key = field as keyof FormData;
      const value = formData[key].trim();

      if (!value) {
        // Campo vacío
        newErrors[key] = `El campo ${fieldNames[key]} es obligatorio`;
      } else {
        // Validación específica para cada campo
        switch (key) {
          case "email":
            if (!emailRegex.test(value)) {
              newErrors[key] = "El formato del correo electrónico es inválido";
            } else {
              newErrors[key] = "";
            }
            break;
          case "telefono":
            if (!phoneRegex.test(value)) {
              newErrors[key] = "El teléfono debe tener exactamente 8 dígitos";
            } else {
              newErrors[key] = "";
            }
            break;
          case "contraseña":
            if (!passwordRegex.test(value)) {
              newErrors[key] =
                "La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula y un número";
            } else {
              newErrors[key] = "";
            }
            break;
          case "confirmarContraseña":
            if (value !== formData.contraseña) {
              newErrors[key] = "Las contraseñas no coinciden";
            } else {
              newErrors[key] = "";
            }
            break;
          default:
            newErrors[key] = ""; // Limpia cualquier error anterior para campos válidos
            break;
        }
      }
    });

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (!hasErrors) {
      console.log("Formulario enviado:", formData);
      const data = {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        p_field: formData.contraseña,
        imagen: 1,
      };

      try {
        const response = await fetch(API_URL + "/api/usuario/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const userData = await response.json();
          console.log("Usuario registrado:", userData);
          alert("Usuario registrado");
        } else {
          alert("Error al registrar");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <View>
      <Image
        source={require("../assets/images/festLogo.png")}
        style={Styles.festLogo}
      />
      <TextInputWithHelper
        label={"Nombre"}
        value={formData.nombre}
        onChangeText={(e: string) => setFormData({ ...formData, nombre: e })}
        mode="outlined"
        error={errors.nombre !== ""}
        errorText={errors.nombre}
      />

      <TextInputWithHelper
        label={"Email"}
        value={formData.email}
        onChangeText={(e: string) => setFormData({ ...formData, email: e })}
        mode="outlined"
        error={errors.email !== ""}
        errorText={errors.email}
      />

      <TextInputWithHelper
        label={"Teléfono"}
        value={formData.telefono}
        onChangeText={(e: string) => setFormData({ ...formData, telefono: e })}
        mode="outlined"
        error={errors.telefono !== ""}
        errorText={errors.telefono}
      />

      <TextInputWithHelper
        label={"Contraseña"}
        value={formData.contraseña}
        onChangeText={(e: string) =>
          setFormData({ ...formData, contraseña: e })
        }
        mode="outlined"
        error={errors.contraseña !== ""}
        errorText={errors.contraseña}
        icon={showPassword ? "eye" : "eye-off"}
        onIconPress={() => setShowPassword(!showPassword)}
        secureTextEntry={!showPassword}
      />

      <TextInputWithHelper
        label={"Confirmar Contraseña"}
        value={formData.confirmarContraseña}
        onChangeText={(e: string) =>
          setFormData({ ...formData, confirmarContraseña: e })
        }
        mode="outlined"
        error={errors.confirmarContraseña !== ""}
        errorText={errors.confirmarContraseña}
        icon={showPassword2 ? "eye" : "eye-off"}
        onIconPress={() => setShowPassword2(!showPassword2)}
        secureTextEntry={!showPassword2}
      />

      <Button mode="contained" onPress={handleSubmit} style={{ marginTop: 20 }}>
        Registrarse
      </Button>

      <View style={styles.lineContainer}>
        <View style={styles.line} />
        <Text style={styles.lineText}>Registrarse usando</Text>
        <View style={styles.line} />
      </View>
      <LoginGoogle />

      <View style={Styles.linkContainer}>
        <Text>Ya tienes una cuenta? </Text>
        <Link to="/login" style={Styles.textDecoration2}>
          Iniciar sesion
        </Link>
      </View>
    </View>
  );
};

const styles = {
  lineContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#402158",
  },
  lineText: {
    marginHorizontal: 10,
    color: "#402158",
    fontWeight: "500" as const,
  },
};

export default Register;
