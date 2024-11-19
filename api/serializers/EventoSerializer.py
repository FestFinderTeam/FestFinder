from rest_framework import serializers

from api.serializers import EstablecimientoSerializer
from .GeneroEventoSerializer import GeneroEventoSerializer
from ..models import Evento, GeneroEvento, Establecimiento

class EventoSerializer(serializers.ModelSerializer):
    # Usamos PrimaryKeyRelatedField solo para las solicitudes POST/PUT (registro)
    id_establecimiento = serializers.PrimaryKeyRelatedField(queryset=Establecimiento.objects.all(), write_only=True)  # Solo para POST/PUT
    id_genero_fk = serializers.PrimaryKeyRelatedField(queryset=GeneroEvento.objects.all(), write_only=True)  # Solo para POST/PUT

    # Usamos los serializadores completos solo para las solicitudes GET (lectura)
    id_establecimiento_detail = EstablecimientoSerializer(read_only=True, source='id_establecimiento')  # Para GET (lectura)
    id_genero_fk_detail = GeneroEventoSerializer(read_only=True, source='id_genero_fk')  # Para GET (lectura)

    class Meta:
        model = Evento
        fields = ['id_evento', 'nombre', 'descripcion', 'fecha_inicio', 
                  'id_establecimiento', 'id_establecimiento_detail',  # Mostramos tanto el ID como el detalle
                  'fecha_final', 'horario_inicio', 'horario_fin', 
                  'id_genero_fk', 'id_genero_fk_detail',  # Mostramos tanto el ID como el detalle
                  'precio_min', 'precio_max']