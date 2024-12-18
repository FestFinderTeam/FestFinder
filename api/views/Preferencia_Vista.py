from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Preferencia, Etiqueta, Usuario
from ..serializers import PreferenciaSerializer

# Vista para registrar la preferencia de un usuario
class RegistrarPreferencia(APIView):
    def post(self, request, *args, **kwargs):
        id_etiqueta = request.data.get('id_etiqueta')
        id_usuario = request.data.get('id_usuario')

        if not id_etiqueta or not id_usuario:
            return Response({"error": "id_etiqueta y id_usuario son requeridos."}, status=status.HTTP_400_BAD_REQUEST)

        etiqueta = get_object_or_404(Etiqueta, id=id_etiqueta)
        usuario = get_object_or_404(Usuario, id=id_usuario)

        # Crear la relación
        serializer = PreferenciaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Vista para obtener las preferencias de un usuario
class PreferenciasPorUsuario(APIView):
    def get(self, request, usuario_id, *args, **kwargs):
        usuario_id = get_object_or_404(Usuario, id=usuario_id)
        etiquetas = Usuario.etiquetas.all()
        serializer = PreferenciaSerializer(etiquetas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class RegistrarPreferencias(APIView):
    def post(self, request, *args, **kwargs):
        id_usuario = request.data.get("id_usuario")
        etiquetas_texto = request.data.get("etiquetas", [])

        if not id_usuario or not etiquetas_texto:
            return Response(
                {"error": "id_usuario y un array de etiquetas son requeridos."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verificar si el usuario existe
        usuario = get_object_or_404(Usuario, id_usuario=id_usuario)

        # Iterar por las etiquetas proporcionadas
        preferencias_creadas = []

        for texto in etiquetas_texto:
            # Buscar etiqueta por texto
            etiqueta = Etiqueta.objects.filter(texto_etiqueta=texto).first()
            if etiqueta:
                # Verificar si ya existe una preferencia para este usuario y etiqueta
                if not Preferencia.objects.filter(id_usuario=usuario, id_etiqueta=etiqueta).exists():
                    preferencia = Preferencia(id_usuario=usuario, id_etiqueta=etiqueta)
                    preferencia.save()
                    preferencias_creadas.append({
                        "id_usuario": usuario.id_usuario,
                        "id_etiqueta": etiqueta.id_etiqueta,
                        "etiqueta": etiqueta.texto_etiqueta
                    })

        # Responder con los resultados
        return Response(
            {
                "preferencias_creadas": preferencias_creadas,
            },
            status=status.HTTP_201_CREATED
        )


