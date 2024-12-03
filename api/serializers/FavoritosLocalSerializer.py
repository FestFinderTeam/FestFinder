from rest_framework import serializers
from ..models.FavoritosLocal import FavoritosLocal

class FavoritosLocalSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoritosLocal
        fields = ['establecimiento', 'usuario']
