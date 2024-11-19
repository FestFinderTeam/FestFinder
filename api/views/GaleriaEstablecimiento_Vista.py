from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import GaleriaEstablecimiento
from rest_framework.parsers import MultiPartParser, FormParser
from ..serializers import GaleriaEstablecimientoSerializador

class GaleriaEstablecimiento(APIView):
    def get(self, request, id, *args, **kwargs):
        galerias = GaleriaEstablecimiento.objects.filter(establecimiento=id)
        serializer = GaleriaEstablecimientoSerializador(galerias, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class RegistrarImagenEnGaleriaEstablecimiento(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        serializer = GaleriaEstablecimientoSerializador(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class EliminarGaleriaEstablecimiento(APIView):
    def delete(self, request, id, *args, **kwargs):
        try:
            galeria = GaleriaEstablecimiento.objects.get(id=id)
            galeria.delete()
            return Response({"detail": "Imagen eliminada exitosamente."}, status=status.HTTP_200_OK)
        except GaleriaEstablecimiento.DoesNotExist:
            return Response({"error": "La imagen no existe."}, status=status.HTTP_404_NOT_FOUND)


class RecuperarGaleriaPorEstablecimiento(APIView):
    def get(self, request, id_establecimiento, *args, **kwargs):
        galerias = GaleriaEstablecimiento.objects.filter(establecimiento=id_establecimiento)
        if not galerias.exists():
            return Response({"detail": "No se encontraron registros para este establecimiento."}, status=status.HTTP_404_NOT_FOUND)
        serializer = GaleriaEstablecimientoSerializador(galerias, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)