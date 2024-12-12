from rest_framework import serializers
from ..models import ValoracionEstablecimiento, Usuario
from .UsuarioSerializer import UsuarioSerializer

class ValoracionEstablecimientoSerializer(serializers.ModelSerializer):

    # Usamos PrimaryKeyRelatedField solo para las solicitudes POST/PUT (registro)
    usuario = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all(), write_only=True)  # Solo para POST/PUT

    # Usamos TipoEstablecimientoSerializer solo para las solicitudes GET (lectura)
    usuario_info = UsuarioSerializer(read_only=True, source='usuario')  # Para GET (lectura)


    class Meta:
        model = ValoracionEstablecimiento
        fields = ['id_valoracion_establecimiento', 'usuario', 'usuario_info', 'establecimiento','puntuacion', 'comentario', 'fecha_publicacion', 'verificado']
