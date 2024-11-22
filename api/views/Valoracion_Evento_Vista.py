from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models.Asistencia import Asistencia
from ..models.ValoracionEvento import ValoracionEvento
from ..models.Asistencia import Asistencia
from ..serializers.ValoracionEventoSerializer import ValoracionEventoSerializer

class RegistrarValoracionEvento(APIView):
    def post(self, request, *args, **kwargs):

        usuario_id = request.data.get("usuario")
        evento_id = request.data.get("evento")
        
        # Verificar si existe una asistencia registrada
        if not Asistencia.objects.filter(id_usuario_fk=usuario_id, id_evento_asistido_fk=evento_id).exists():
            return Response(
                {"error": "No se puede registrar la valoración. El usuario no asistió al evento."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ValoracionEventoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ValoracionesPorEvento(APIView):
    def get(self, request, evento_id, *args, **kwargs):
        valoraciones = ValoracionEvento.objects.filter(evento_id=evento_id)
        serializer = ValoracionEventoSerializer(valoraciones, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)