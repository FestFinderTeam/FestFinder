# api/serializers.py

from rest_framework import serializers
from ..models import  horariosEstablecimiento

class horariosEstablecimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = horariosEstablecimiento
        fields = ['establecimiento', 'dia_semana', 'inicio_atencion', 'fin_atencion']