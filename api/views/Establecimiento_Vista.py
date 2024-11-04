from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Establecimiento
from ..serializers import EstablecimientoSerializer

# Vista para listar establecimientos por tipo
class ListarEstablecimientosPorTipo(APIView):
    def get(self, request, tipo_id):
        establecimientos = Establecimiento.objects.filter(tipo_fk_id=tipo_id)
        serializer = EstablecimientoSerializer(establecimientos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)