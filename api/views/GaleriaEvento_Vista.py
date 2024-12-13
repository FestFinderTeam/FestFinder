from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import GaleriaEvento
from ..serializers import GeneroEventoSerializer

class GaleriaPorEvento(APIView):
    def get(self, request, id, *args, **kwargs):
        galerias = GaleriaEvento.objects.filter(establecimiento=id)
        if not galerias.exists():
            return Response(
                {"message": "No hay imagenes en la galeria de este establecimiento."},
                status=status.HTTP_200_OK
            )
        serializer = GeneroEventoSerializer(galerias, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class RegistrarGaleriaEvento(APIView):
    def post(self, request, *args, **kwargs):
        serializer = GeneroEventoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)