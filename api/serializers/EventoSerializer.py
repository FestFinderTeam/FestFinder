from rest_framework import serializers

from api.serializers import EstablecimientoSerializer
from .GeneroEventoSerializer import GeneroEventoSerializer
from ..models import Evento

class EventoSerializer(serializers.ModelSerializer):
    id_genero_fk = GeneroEventoSerializer(read_only=True)  # Agregado para obtener datos completos del tipo
    id_establecimiento = EstablecimientoSerializer(read_only=True)  # Agregado para obtener datos completos del lugar

    class Meta:
        model = Evento
        fields = ['id_evento', 'nombre', 'banner', 'logo', 'descripcion', 'fecha_inicio', 'id_establecimiento', 'fecha_final', 'horario_inicio', 'horario_fin', 'id_genero_fk', 'precio_min', 'precio_max']
