from rest_framework import serializers
from ..models import ValoracionEstablecimiento, Usuario
from .UsuarioSerializer import UsuarioSerializer

class ValoracionEstablecimientoSerializer(serializers.ModelSerializer):
    # Pide las llaves del usuario reseñador para las solicitudes POST/PUT (registro)
    usuario = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all(), write_only=True)  # Solo para POST/PUT

    # Devuelve la informacion completa del usuario para las solicitudes GET (lectura)
    usuario_info = UsuarioSerializer(read_only=True, source='usuario')  # Para GET (lectura)

    class Meta:
        model = ValoracionEstablecimiento
        fields = ['id_valoracion_establecimiento', 'usuario', 'usuario_info', 'establecimiento','puntuacion', 'comentario', 'fecha_publicacion', 'verificado']
