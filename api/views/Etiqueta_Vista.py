from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from ..models import Etiqueta, EtiquetaEstablecimiento
from ..serializers import EtiquetaSerializer
from django.db.models import Count


# Vista para crear etiquetas
class CrearEtiqueta(APIView):
    def post(self, request, *args, **kwargs):
        serializer = EtiquetaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Vista para listar etiquetas
class ListarEtiquetas(APIView):
    def get(self, request, *args, **kwargs):
        etiquetas = Etiqueta.objects.all()
        serializer = EtiquetaSerializer(etiquetas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ListarEtiquetasPorTexto(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener el texto que se pasa en la consulta
        texto_busqueda = request.query_params.get("texto", "")

        # Filtrar las etiquetas que contengan el texto
        etiquetas = Etiqueta.objects.filter(texto_etiqueta__icontains=texto_busqueda)

        # Agregar el conteo de registros en EtiquetaEstablecimiento y ordenar por este conteo
        etiquetas_conteo = etiquetas.annotate(num_establecimientos=Count('etiquetaestablecimiento')).order_by('-num_establecimientos')

        # Limitar a las primeras 10 etiquetas
        etiquetas_conteo = etiquetas_conteo[:10]

        # Serializar las etiquetas
        serializer = EtiquetaSerializer(etiquetas_conteo, many=True)
        
        # Devolver la respuesta
        return Response(serializer.data, status=status.HTTP_200_OK)
