from rest_framework import serializers
from ..models import Usuario, Imagen
from django.contrib.auth.hashers import make_password
from ..serializers import ImagenSerializer


class UsuarioSerializer(serializers.ModelSerializer):
    # Usamos PrimaryKeyRelatedField para las solicitudes POST/PUT (registro)
    imagen = serializers.PrimaryKeyRelatedField(queryset=Imagen.objects.all(), write_only=True)
    
    # Usamos el serializador completo solo para las solicitudes GET (lectura)
    imagen_detail = ImagenSerializer(read_only=True, source='imagen')

    class Meta:
        model = Usuario
        fields = [
            'id_usuario', 'nombre', 'email', 'telefono', 'p_field', 'g_id', 
            'imagen', 'imagen_detail', 'duenio', 'establecimiento'
        ]

    def validate_p_field(self, value):
        """Hash la contraseña antes de guardarla"""
        return make_password(value)