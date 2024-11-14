from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from datetime import datetime, timedelta
from ..models import Evento, Establecimiento
from ..serializers import EventoSerializer, EstablecimientoSerializer

class FiltrarEstablecimientosYEventos(APIView):
    def post(self, request):
        ciudad = request.data.get("ciudad", "").strip()
        tipos = request.data.get("tipos", [])
        nombre = request.data.get("nombre", "").strip()
        fecha_actual = request.data.get("fecha_actual")

        # Validar que la ciudad esté presente, ya que es obligatoria
        if not ciudad:
            return Response(
                {"message": "El campo 'ciudad' es requerido."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validar que la fecha actual esté presente y en formato correcto (para eventos)
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

        # Establecer el límite de tiempo para los eventos
        fecha_limite = fecha_actual - timedelta(days=30)

        # Filtro de establecimientos
        establecimiento_query = Q(direccion__icontains=ciudad)
        if tipos:
            establecimiento_query &= Q(tipo_fk__id__in=tipos)
        if nombre:
            establecimiento_query &= Q(nombre__icontains=nombre)

        establecimientos = Establecimiento.objects.filter(establecimiento_query)

        # Filtro de eventos
        evento_query = (
            Q(fecha_inicio__lte=fecha_actual) | Q(fecha_inicio__gte=fecha_actual, fecha_inicio__lte=fecha_limite)
        ) & Q(fecha_final__gte=fecha_actual)

        if nombre:
            evento_query &= Q(nombre__icontains=nombre)
        if tipos:
            evento_query &= Q(id_establecimiento__tipo_fk__id__in=tipos)
        evento_query &= Q(id_establecimiento__direccion__icontains=ciudad)

        eventos = Evento.objects.filter(evento_query)

        # Serializar los resultados
        establecimientos_data = EstablecimientoSerializer(establecimientos, many=True).data
        eventos_data = EventoSerializer(eventos, many=True).data

        # Respuesta combinada
        return Response(
            {
                "establecimientos": establecimientos_data,
                "eventos": eventos_data
            },
            status=status.HTTP_200_OK
        )
