from rest_framework import serializers
from ..models.ValoracionEstablecimiento import ValoracionEstablecimiento

class ValoracionEstablecimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValoracionEstablecimiento
        fields = ['id_valoracion_establecimiento', 'usuario', 'establecimiento','puntuacion', 'comentario', 'fecha_publicacion']
