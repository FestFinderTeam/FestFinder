from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models.Interes import Interes
from ..serializers.InteresSerializer import InteresSerializer

class RegistrarInteres(APIView):
    def post(self, request, *args, **kwargs):
        id_evento = request.data.get('id_evento')
        id_usuario = request.data.get('id_usuario')

        # Verificar si ya existe un registro con la combinación de id_evento y id_usuario
        if Interes.objects.filter(id_evento=id_evento, id_usuario=id_usuario).exists():
            return Response({"message": "El interés ya está registrado."}, status=status.HTTP_200_OK)

        # Si no existe, se intenta registrar un nuevo interés
        serializer = InteresSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InteresPorEventos(APIView):
    def get(self, request, evento_id, *args, **kwargs):
        asistencias = Interes.objects.filter(id_evento=evento_id)
        serializer = InteresSerializer(asistencias, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class InteresPorUsuario(APIView):
    def get(self, request, usuario_id, *args, **kwargs):
        asistencias = Interes.objects.filter(id_usuario=usuario_id)
        serializer = InteresSerializer(asistencias, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class EliminarInteres(APIView):
    def delete(self, request, usuario_id, evento_id, *args, **kwargs):
        try:
            interes = Interes.objects.get(id_usuario=usuario_id, id_evento=evento_id)
            interes.delete()
        except Interes.DoesNotExist:
            pass
        return Response({"message": "Interés eliminado con éxito."}, status=status.HTTP_204_NO_CONTENT)
