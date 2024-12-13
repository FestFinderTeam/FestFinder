from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from ..models import TipoEstablecimiento
from ..serializers import TipoEstablecimientoSerializer

# Vista para crear un nuevo tipo de establecimiento
class AgregarTipoEstablecimiento(APIView):
    parser_classes = (MultiPartParser, FormParser)
    # Funcion POST
    def post(self, request, *args, **kwargs):
        # Verificacion de campos con el serializador
        serializer = TipoEstablecimientoSerializer(data=request.data)
        # Si es valido lo guarda
        if serializer.is_valid():
            serializer.save()
            # Mensaje de confirmacion - 200
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            #Mensaje de error, mal envio - 400
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
