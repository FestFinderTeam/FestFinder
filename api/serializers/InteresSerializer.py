from rest_framework import serializers
from ..models.Interes import Interes

class InteresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interes
        fields = ['id_interes', 'id_evento', 'id_usuario']
