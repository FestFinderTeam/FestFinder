from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models.Visita import Visita
from ..models.ValoracionEstablecimiento import ValoracionEstablecimiento
from ..serializers.ValoracionEstablecimientoSerializer import ValoracionEstablecimientoSerializer

class RegistrarValoracion(APIView):
    def post(self, request, *args, **kwargs):

        usuario_id = request.data.get("usuario")
        establecimiento_id = request.data.get("establecimiento")
        
        # Verificar si existe una visita registrada
        if not Visita.objects.filter(id_usuario_fk=usuario_id, id_establecimiento_visitado_fk=establecimiento_id).exists():
            return Response(
                {"error": "No se puede registrar la valoración. El usuario no visito el local."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Buscar si ya existe una valoración para este usuario y evento
        try:
            valoracion_existente = ValoracionesPorEstablecimiento.objects.get(usuario=usuario_id, establecimiento=establecimiento_id)
            serializer = ValoracionEstablecimientoSerializer(valoracion_existente, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ValoracionesPorEstablecimiento.DoesNotExist:
            # Crear una nueva valoración si no existe
            serializer = ValoracionEstablecimientoSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ValoracionesPorEstablecimiento(APIView):
    def get(self, request, establecimiento_id, *args, **kwargs):
        valoraciones = ValoracionEstablecimiento.objects.filter(establecimiento=establecimiento_id)
        serializer = ValoracionEstablecimientoSerializer(valoraciones, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)