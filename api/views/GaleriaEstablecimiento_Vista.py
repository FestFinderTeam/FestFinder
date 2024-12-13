from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from ..models import GaleriaEstablecimiento
from ..serializers import GaleriaEstablecimientoSerializer

class GetGaleriaEstablecimiento(APIView):
    def get(self, request, *args, **kwargs):
        galerias = GaleriaEstablecimiento.objects.all()
        serializer = GaleriaEstablecimientoSerializer(galerias, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class RegistrarImagenEnGaleriaEstablecimiento(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        serializer = GaleriaEstablecimientoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class EliminarGaleriaEstablecimiento(APIView):
    def delete(self, request, id, *args, **kwargs):
        try:
            galeria = GaleriaEstablecimiento.objects.get(id=id)
            galeria.delete()
            return Response({"detail": "Imagen eliminada exitosamente."}, status=status.HTTP_200_OK)
        except GaleriaEstablecimiento.DoesNotExist:
            return Response({"error": "La imagen no existe."}, status=status.HTTP_404_NOT_FOUND)


class RecuperarGaleriaPorEstablecimiento(APIView):
    def get(self, request, id_establecimiento, *args, **kwargs):
        galerias = GaleriaEstablecimiento.objects.filter(establecimiento=id_establecimiento)
        if not galerias.exists():
            return Response({"detail": "No hay imagenes en la galeria de este establecimiento."}, status=status.HTTP_200_OK)
        serializer = GaleriaEstablecimientoSerializer(galerias, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class RegistrarVariasImagenesGaleria(APIView):
    parser_classes = (MultiPartParser, FormParser)  # Manejo de FormData

    def post(self, request, *args, **kwargs):
        establecimiento_id = request.data.get('establecimiento')  # ID del establecimiento asociado
        print(establecimiento_id)

        if not establecimiento_id:
            return Response({"error": "El campo 'establecimiento' es requerido."}, status=status.HTTP_400_BAD_REQUEST)
        
        imagenes = request.FILES.getlist('fotos_nuevas')  # Obtener lista de archivos del campo 'imagenes'
        print(imagenes)
        
        if not imagenes:
            return Response({"error": "No se enviaron imágenes para registrar."}, status=status.HTTP_400_BAD_REQUEST)

        galerias_creadas = []

        for imagen in imagenes:
            info = {
                "imagen": imagen,
                "establecimiento": establecimiento_id
            }
            serializer = GaleriaEstablecimientoSerializer(data=info)
            if serializer.is_valid():
                serializer.save()
                galerias_creadas.append(serializer.data)
            else:
                return Response(
                    {"error": "Error al guardar las imágenes.", "details": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        return Response(
            {"message": f"Se han registrado {len(galerias_creadas)} imágenes.", "imagenes": galerias_creadas},
            status=status.HTTP_201_CREATED,
        )