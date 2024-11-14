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
            return Response(
                {"message": "Error en la validación de los datos", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

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
    
class ListarEventosPorCategoria(APIView):
    def get(self, request, id_categoria, *args, **kwargs):
        # Filtrar eventos por el ID del establecimiento
        eventos = Evento.objects.filter(id_categoria=id_categoria)
        
        if not eventos.exists():
            return Response({"error": "No se encontraron eventos para esta categoria."}, status=status.HTTP_404_NOT_FOUND)
        
        # Serializar los eventos encontrados
        serializer = EventoSerializer(eventos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from datetime import timedelta, datetime

from ..models import Evento
from ..serializers import EventoSerializer

class FiltrarEventos(APIView):
    def post(self, request):
        nombre = request.data.get("nombre", "").strip()
        id_genero_fk = request.data.get("id_genero_fk", [])
        fecha_actual = request.data.get("fecha_actual")

        # Validar que la fecha actual esté presente y tenga un formato correcto
        if not fecha_actual:
            return Response(
                {"message": "El campo 'fecha_actual' es requerido."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            fecha_actual = datetime.strptime(fecha_actual, "%Y-%m-%d").date()
        except ValueError:
            return Response(
                {"message": "Formato de 'fecha_actual' inválido. Use 'AAAA-MM-DD'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        fecha_limite = fecha_actual - timedelta(days=30)

        # Construir el filtro inicial para la fecha actual
        query = Q()
        # Filtrar por fecha de inicio
        query &= (Q(fecha_inicio__lte=fecha_actual) | Q(fecha_inicio__gte=fecha_actual, fecha_inicio__lte=fecha_limite))
        # Filtrar por fecha final (debe ser mayor o igual a la fecha actual)
        query &= Q(fecha_final__gte=fecha_actual)

        # Agregar filtros adicionales según estén presentes
        if nombre:
            query &= Q(nombre__icontains=nombre)
        if id_genero_fk:
            query &= Q(id_genero_fk__id__in=id_genero_fk)

        # Filtrar eventos utilizando la consulta construida
        eventos = Evento.objects.filter(query)

        # Serializar y devolver los resultados
        eventos_data = EventoSerializer(eventos, many=True).data
        return Response(eventos_data, status=status.HTTP_200_OK)
