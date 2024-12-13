from rest_framework import serializers
from ..models import Usuario, Imagen
from django.contrib.auth.hashers import make_password
from ..serializers import ImagenSerializer

class UsuarioSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Usuario
        fields = [
            'id_usuario', 'nombre', 'email', 'telefono', 'p_field', 'g_id', 'imagen', 'imagen_url', 'duenio', 'establecimiento'
        ]

    # Valida la contraseña encriptada
    def validate_p_field(self, value):
        """Hash la contraseña antes de guardarla"""
        return make_password(value)