# mi_app/views/establecimiento.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Establecimiento
from ..serializers import EstablecimientoSerializer
from rest_framework.parsers import MultiPartParser, FormParser

class RegistrarEstablecimiento(APIView):
    parser_classes = (MultiPartParser, FormParser)
    def post(self, request, *args, **kwargs):
        print("se envio")
        print(request.data)
        serializer = EstablecimientoSerializer(data=request.data)
        print("datos bien enviados")
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Errores de validación:", serializer.errors)  # Imprime errores de validación
            return Response(
                {"message": "Error en la validación de los datos", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
