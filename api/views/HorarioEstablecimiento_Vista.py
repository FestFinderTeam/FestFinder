# mi_app/views/horarios_establecimiento.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import horariosEstablecimiento, Establecimiento
from ..serializers import horariosEstablecimientoSerializer

# Vista para registrar un nuevo horario
class RegistrarHorarioEstablecimiento(APIView):
    def post(self, request):
        serializer = horariosEstablecimientoSerializer(data=request.data)
        if serializer.is_valid():
            # Verificar si el establecimiento existe
            establecimiento_id = request.data.get('establecimiento')
            try:
                Establecimiento.objects.get(id=establecimiento_id)
            except Establecimiento.DoesNotExist:
                return Response(
                    {"error": "El establecimiento proporcionado no existe"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Guardar el horario si todo está correcto
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # Retornar errores de validación si los hay
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# mi_app/views/horarios_establecimiento.py

# Vista para recuperar horarios de un establecimiento específico
class RecuperarHorariosPorEstablecimiento(APIView):
    def get(self, request, establecimiento_id):
        try:
            # Verificar que el establecimiento existe
            establecimiento = Establecimiento.objects.get(id=establecimiento_id)
        except Establecimiento.DoesNotExist:
            return Response(
                {"error": "El establecimiento no existe"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Filtrar los horarios por el establecimiento
        horarios = horariosEstablecimiento.objects.filter(establecimiento=establecimiento)
        serializer = horariosEstablecimientoSerializer(horarios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
