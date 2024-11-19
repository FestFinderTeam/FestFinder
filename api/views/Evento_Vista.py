from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Evento
from ..serializers import EventoSerializer
from datetime import date, datetime, timedelta
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q



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
        ciudad = request.data.get("ciudad", "").strip()

        if not fecha_usuario:
            return Response({"error": "No se envió ninguna fecha."}, status=status.HTTP_400_BAD_REQUEST)
        if not ciudad:
            return Response({"error": "El campo 'ciudad' es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Convertir la fecha enviada por el usuario a objeto datetime
            fecha_usuario = datetime.strptime(fecha_usuario, '%Y-%m-%d').date()
        except ValueError:
            return Response({"error": "Formato de fecha inválido. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # Calcular el primer y último día del mes según la fecha enviada por el usuario
        primer_dia_mes = fecha_usuario.replace(day=1)
        ultimo_dia_mes = (primer_dia_mes + timedelta(days=32)).replace(day=1) - timedelta(days=1)

        # Filtrar eventos que ocurren dentro del mes enviado por el usuario y que aún no han ocurrido
        eventos = Evento.objects.filter(
            fecha_final__gte=fecha_usuario,
            fecha_final__range=[primer_dia_mes, ultimo_dia_mes],
            id_establecimiento__direccion__icontains=ciudad  # Filtrar por ciudad en la dirección del establecimiento
        )
        serializer = EventoSerializer(eventos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Vista para listar los eventos que ocurren hoy según la fecha enviada por el usuario
class ListarEventosHoy(APIView):
    def post(self, request, *args, **kwargs):
        # Obtener la fecha enviada por el usuario en el request
        fecha_usuario = request.data.get('fecha')
        ciudad = request.data.get("ciudad", "").strip()  # Nuevo campo 'ciudad'

        if not fecha_usuario:
            return Response({"error": "No se envió ninguna fecha."}, status=status.HTTP_400_BAD_REQUEST)
        if not ciudad:
            return Response({"error": "El campo 'ciudad' es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Convertir la fecha enviada por el usuario a objeto datetime
            fecha_usuario = datetime.strptime(fecha_usuario, '%Y-%m-%d').date()
        except ValueError:
            return Response({"error": "Formato de fecha inválido. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # Filtrar eventos que ocurren hoy en la fecha enviada por el usuario
        eventos = Evento.objects.filter(
            fecha_inicio__lte=fecha_usuario, 
            fecha_final__gte=fecha_usuario,
            id_establecimiento__direccion__icontains=ciudad  # Filtrar por ciudad en la dirección del establecimiento        
            )
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
        
        # Obtener la fecha de hoy (del servidor)
        fecha_hoy = date.today()
        

        # Filtrar eventos por el ID del establecimiento
        eventos = Evento.objects.filter(
            id_establecimiento=id_establecimiento,
            fecha_final__gte=fecha_hoy
            )
        
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
    

class FiltrarEventos(APIView):
    def post(self, request):
        nombre = request.data.get("nombre", "").strip()
        id_genero_fk = request.data.get("id_genero_fk", [])
        fecha_actual = request.data.get("fecha_actual")
        ciudad = request.data.get("ciudad", "").strip()  # Nuevo campo 'ciudad'


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
            query &= Q(id_genero_fk__in=id_genero_fk)

        if ciudad:
            # Filtrar por ciudad en la dirección del establecimiento relacionado
            query &= Q(id_establecimiento__direccion__icontains=ciudad)

        # Filtrar eventos utilizando la consulta construida
        eventos = Evento.objects.filter(query)

        # Serializar y devolver los resultados
        eventos_data = EventoSerializer(eventos, many=True).data
        return Response(eventos_data, status=status.HTTP_200_OK)


class ModificarEvento(APIView):
    parser_classes = (MultiPartParser, FormParser)
    
    def put(self, request, *args, **kwargs):
        # Obtener el ID del evento desde los parámetros de la URL
        evento_id = kwargs.get('id_evento')
        
        # Obtener el evento desde la base de datos
        evento = get_object_or_404(Evento, id_evento=evento_id)
        
        # Obtener los datos que fueron enviados en la petición
        data = request.data
        
        # Comprobar si algún dato ha cambiado
        fields_to_update = {}

        # Comprobar y asignar nuevos valores si se han enviado
        if data.get("nombre") and data["nombre"] != evento.nombre:
            fields_to_update["nombre"] = data["nombre"]
        
        if data.get("logo") and data["logo"] != evento.logo.name:
            fields_to_update["logo"] = data["logo"]
        
        if data.get("descripcion") and data["descripcion"] != evento.descripcion:
            fields_to_update["descripcion"] = data["descripcion"]
        
        if data.get("fecha_inicio") and str(data["fecha_inicio"]) != str(evento.fecha_inicio):
            fields_to_update["fecha_inicio"] = data["fecha_inicio"]
        
        if data.get("fecha_final") and str(data["fecha_final"]) != str(evento.fecha_final):
            fields_to_update["fecha_final"] = data["fecha_final"]
        
        if data.get("horario_inicio") and str(data["horario_inicio"]) != str(evento.horario_inicio):
            fields_to_update["horario_inicio"] = data["horario_inicio"]
        
        if data.get("horario_fin") and str(data["horario_fin"]) != str(evento.horario_fin):
            fields_to_update["horario_fin"] = data["horario_fin"]
        
        if data.get("id_genero_fk") and str(data["id_genero_fk"]) != str(evento.id_genero_fk.id):
            fields_to_update["id_genero_fk"] = data["id_genero_fk"]
        
        if data.get("precio_min") and data["precio_min"] != str(evento.precio_min):
            fields_to_update["precio_min"] = data["precio_min"]
        
        if data.get("precio_max") and data["precio_max"] != str(evento.precio_max):
            fields_to_update["precio_max"] = data["precio_max"]
        
        # Si existen campos a actualizar, realizamos la actualización
        if fields_to_update:
            for field, value in fields_to_update.items():
                setattr(evento, field, value)
            evento.save()
            return Response(EventoSerializer(evento).data, status=status.HTTP_200_OK)
        
        # Si no hay cambios, respondemos con un mensaje de que no se modificó nada
        return Response({"message": "No hubo cambios en los datos proporcionados."}, status=status.HTTP_304_NOT_MODIFIED)
    

class BorrarEvento(APIView):
    def delete(self, request, id_evento, *args, **kwargs):
        try:
            # Buscar el evento por su ID
            evento = Evento.objects.get(id_evento=id_evento)
        except Evento.DoesNotExist:
            return Response(
                {"error": "Evento no encontrado."}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Eliminar el evento
        evento.delete()
        return Response(
            {"message": f"El evento con ID {id_evento} ha sido eliminado con éxito."},
            status=status.HTTP_200_OK
        )
