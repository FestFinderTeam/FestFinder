from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models.Asistencia import Asistencia
from ..serializers.AsistenciaSerializer import AsistenciaSerializer

class RegistrarAsistencia(APIView):
    def post(self, request, *args, **kwargs):
        serializer = AsistenciaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Vistas para GETs, filtros
class AsistenciasPorEventos(APIView):
    def get(self, request, establecimiento_id, *args, **kwargs):
        asistencias = Asistencia.objects.filter(id_evento_asistido_fk=establecimiento_id)
        serializer = AsistenciaSerializer(asistencias, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class AsistenciasPorUsuario(APIView):
    def get(self, request, usuario_id, *args, **kwargs):
        asistencias = Asistencia.objects.filter(id_usuario_fk=usuario_id)
        serializer = AsistenciaSerializer(asistencias, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
