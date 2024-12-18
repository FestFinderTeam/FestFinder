from rest_framework import serializers
from ..models.Preferencia import Preferencia

class PreferenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Preferencia
        fields = ['id_preferencia', 'id_etiqueta', 'id_usuario']
