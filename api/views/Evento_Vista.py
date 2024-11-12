from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Evento
from ..serializers import EventoSerializer
from datetime import datetime, timedelta
from rest_framework.parsers import MultiPartParser, FormParser


# Vista para crear un evento
class CrearEvento(APIView):
    parser_classes = (MultiPartParser, FormParser)
    def post(self, request, *args, **kwargs):
        serializer = EventoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Errores de validación:", serializer.errors)  # Imprime errores de validación
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Vista para listar todos los eventos
class ListarEventos(APIView):
    def get(self, request, *args, **kwargs):
        eventos = Evento.objects.all()
        serializer = EventoSerializer(eventos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
# Vista para listar los eventos que ocurren este mes (pero que aún no ocurrieron)
class ListarEventosMes(APIView):
    def post(self, request, *args, **kwargs):
        # Obtener la fecha enviada por el usuario en el request
        fecha_usuario = request.data.get('fecha')

        if not fecha_usuario:
            return Response({"error": "No se envió ninguna fecha."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Convertir la fecha enviada por el usuario a objeto datetime
            fecha_usuario = datetime.strptime(fecha_usuario, '%Y-%m-%d').date()
        except ValueError:
            return Response({"error": "Formato de fecha inválido. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # Calcular el primer y último día del mes según la fecha enviada por el usuario
        primer_dia_mes = fecha_usuario.replace(day=1)
        ultimo_dia_mes = (primer_dia_mes + timedelta(days=32)).replace(day=1) - timedelta(days=1)

        # Filtrar eventos que ocurren dentro del mes enviado por el usuario y que aún no han ocurrido
        eventos = Evento.objects.filter(fecha_final__gte=fecha_usuario, fecha_final__range=[primer_dia_mes, ultimo_dia_mes])
        serializer = EventoSerializer(eventos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Vista para listar los eventos que ocurren hoy según la fecha enviada por el usuario
class ListarEventosHoy(APIView):
    def post(self, request, *args, **kwargs):
        # Obtener la fecha enviada por el usuario en el request
        fecha_usuario = request.data.get('fecha')

        if not fecha_usuario:
            return Response({"error": "No se envió ninguna fecha."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Convertir la fecha enviada por el usuario a objeto datetime
            fecha_usuario = datetime.strptime(fecha_usuario, '%Y-%m-%d').date()
        except ValueError:
            return Response({"error": "Formato de fecha inválido. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # Filtrar eventos que ocurren hoy en la fecha enviada por el usuario
        eventos = Evento.objects.filter(fecha_inicio__lte=fecha_usuario, fecha_final__gte=fecha_usuario)
        serializer = EventoSerializer(eventos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

# Vista para obtener un único evento por ID
class ObtenerEventoPorID(APIView):
    def get(self, request, id, *args, **kwargs):
        try:
            # Buscar el evento por ID
            evento = Evento.objects.get(id_evento=id)
        except Evento.DoesNotExist:
            return Response({"error": "Evento no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
        # Serializar el evento encontrado
        serializer = EventoSerializer(evento)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class ListarEventosPorEstablecimiento(APIView):
    def get(self, request, id_establecimiento, *args, **kwargs):
        # Filtrar eventos por el ID del establecimiento
        eventos = Evento.objects.filter(id_establecimiento=id_establecimiento)
        
        if not eventos.exists():
            return Response({"error": "No se encontraron eventos para este establecimiento."}, status=status.HTTP_404_NOT_FOUND)
        
        # Serializar los eventos encontrados
        serializer = EventoSerializer(eventos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)