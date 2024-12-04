from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from ..serializers.EstablecimientoSerializer import EstablecimientoSerializer
from ..models.FavoritosLocal import FavoritosLocal
from ..serializers.FavoritosLocalSerializer import FavoritosLocalSerializer

class CreateFavorito(APIView):
    def post(self, request, *args, **kwargs):
        # Extrae los datos enviados en el cuerpo de la solicitud
        establecimiento_id = request.data.get("establecimiento")
        usuario_id = request.data.get("usuario")

        # Verifica si ya existe un favorito con estas llaves
        if FavoritosLocal.objects.filter(establecimiento=establecimiento_id, usuario=usuario_id).exists():
            return Response(
                {"message": "El favorito ya existe."},
                status=status.HTTP_200_OK
            )

        # Si no existe, intenta crear el favorito
        serializer = FavoritosLocalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # Maneja errores en el serializador
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FavoritosPorEstablecimiento(APIView):
    def get(self, request, establecimiento_id, *args, **kwargs):
        favoritos = FavoritosLocal.objects.filter(establecimiento=establecimiento_id)
        serializer = FavoritosLocalSerializer(favoritos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class FavoritosDeUnUsuario(APIView):
    def get(self, request, usuario_id, *args, **kwargs):
        favoritos = FavoritosLocal.objects.filter(usuario=usuario_id)
        
        # Serializa la información del establecimiento en lugar de los IDs
        establecimientos = [
            {'establecimiento': EstablecimientoSerializer(favorito.establecimiento).data}
            for favorito in favoritos
        ]
        
        return Response(establecimientos, status=status.HTTP_200_OK)
    

class DeleteFavorito(APIView):
    def delete(self, request, establecimiento_id, usuario_id, *args, **kwargs):
        try:
            # Busca el favorito con el establecimiento y usuario especificados
            favorito = FavoritosLocal.objects.get(
                establecimiento=establecimiento_id,
                usuario=usuario_id
            )
            # Elimina el favorito
            favorito.delete()
            return Response({"message": "Favorito eliminado con éxito."}, status=status.HTTP_200_OK)
        except FavoritosLocal.DoesNotExist:
            # Maneja el caso en el que no se encuentra el favorito
            return Response(
                {"error": "El favorito no existe con los IDs proporcionados."},
                status=status.HTTP_404_NOT_FOUND
            )


