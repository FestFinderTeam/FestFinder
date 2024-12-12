from rest_framework import serializers
from ..models.ValoracionEvento import ValoracionEvento

class ValoracionEventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValoracionEvento
        fields = ['id_valoracion_evento', 'usuario', 'evento', 'puntuacion', 'comentario', 'fecha_publicacion', 'verificado']
