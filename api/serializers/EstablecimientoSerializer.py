# mi_app/serializers/establecimiento.py
from rest_framework import serializers
from ..models import Establecimiento, TipoEstablecimiento
from .TipoEstablecimientoSerializer import TipoEstablecimientoSerializer

class EstablecimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Establecimiento
        fields = ['id', 'nombre', 'banner', 'logo', 'direccion', 'coordenada_x', 'coordenada_y', 'descripcion', 'tipo_fk', 'rango_de_precios', 'nro_ref', 'em_ref']
