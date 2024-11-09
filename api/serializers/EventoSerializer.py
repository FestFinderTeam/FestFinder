from rest_framework import serializers
from .GeneroEventoSerializer import GeneroEventoSerializer
from ..models import Evento

class EventoSerializer(serializers.ModelSerializer):
    id_genero_fk = GeneroEventoSerializer(read_only=True)  # Agregado para obtener datos completos del tipo

    class Meta:
        model = Evento
        fields = ['id_evento', 'nombre', 'banner', 'logo', 'fecha_inicio', 'id_establecimiento', 'fecha_final', 'horario_inicio', 'horario_fin', 'id_genero_fk']
