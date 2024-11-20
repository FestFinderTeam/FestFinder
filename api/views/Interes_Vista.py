from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models.Interes import Interes
from ..serializers.InteresSerializer import InteresSerializer

class RegistrarInteres(APIView):
    def post(self, request, *args, **kwargs):
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
            return Response({"message": "Interés eliminado con éxito."}, status=status.HTTP_204_NO_CONTENT)
        except Interes.DoesNotExist:
            return Response({"error": "Interés no encontrado."}, status=status.HTTP_404_NOT_FOUND)
