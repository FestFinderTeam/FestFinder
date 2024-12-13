import logging
from urllib.parse import unquote

from django.http import JsonResponse
from django.db import IntegrityError
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from ..utils import ResponseFormatter
from django.views.decorators.csrf import csrf_exempt

from ..models import Usuario, Imagen
from ..serializers import UsuarioSerializer
import json

logger = logging.getLogger(__name__)

#Registrar un nuevo usuario
class CrearUsuario(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return ResponseFormatter.success(
                data=serializer.data,
                message="Usuario creado exitosamente",
                status_code=status.HTTP_201_CREATED
            )
        return ResponseFormatter.error(
            message="Error de validacion",
            errors=serializer.errors,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
        )

#Devolver todos los usuarios
class ListarUsuarios(APIView):
    def get(self, request, *args, **kwargs):
        usuarios = Usuario.objects.all()
        serializer = UsuarioSerializer(usuarios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LoginUsuario(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        g_p = request.data.get('g_id')  # Obtener g_id

        # Caso 1: Si es con Google
        if g_p:
            logger.info("Caso: Google ID login")  
            try:
                user = Usuario.objects.get(email=email)
                if (g_p == user.g_id):
                    logger.info(f"Usuario encontrado")
                    serializer = UsuarioSerializer(user)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                else:
                    logger.info(f"Usuario incorrecto: {g_p}")
                    return Response({"detail": "Google ID incorrecto"}, status=status.HTTP_401_UNAUTHORIZED)

            except Usuario.DoesNotExist:
                # Si no existe, crear el usuario automáticamente con los datos recibidos
                logger.warning(f"Usuario con Google ID {g_p} no encontrado, creando usuario nuevo.")
                nombre = request.data.get('nombre')
                imagen_url = request.data.get('photo')  # URL de la foto

                if not nombre:
                    return Response({"detail": "Nombre y foto son requeridos para el registro."}, status=status.HTTP_400_BAD_REQUEST)
                
                try:
                    #imagen = Imagen.objects.create(url=imagen_url)  # Suponiendo que tienes un modelo Imagen que guarda la URL
                    usuario = Usuario(
                        nombre=nombre,
                        email=email,
                        g_id=g_p,
                        imagen_url=imagen_url if imagen_url else None,
                        p_field=None  # No se requiere contraseña para login con Google
                    )
                    usuario.save()
                    logger.info(f"Usuario creado con Google ID: {g_p}")
                    serializer = UsuarioSerializer(usuario)
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                except IntegrityError:
                    logger.error(f"Error al crear usuario con Google ID {g_p}. Es posible que ya exista un usuario con este correo.")
                    return Response({"detail": "Ya existe un usuario con este correo."}, status=status.HTTP_400_BAD_REQUEST)

        # Caso 2: Inicio normal
        else:
            logger.info("Caso: Email y password login") 
            try:
                user = Usuario.objects.get(email=email)
                logger.info(f"Usuario encontrado con email: {email}")
                
                if check_password(password, user.p_field):  # Comprobar la contraseña
                    logger.info(f"Contraseña correcta para el usuario {email}")
                    serializer = UsuarioSerializer(user)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                else:
                    logger.warning("Contraseña {password} incorrecta para el usuario {email}")
                    return Response({"detail": "Contraseña incorrecta"}, status=status.HTTP_401_UNAUTHORIZED)
            except Usuario.DoesNotExist:
                logger.warning(f"Usuario con email {email} no encontrado")
                return Response({"detail": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)


class ModificarUsuario(APIView):
    # Recupera el formData
    parser_classes = (MultiPartParser, FormParser)

    def put(self, request, *args, **kwargs):
        # Obtener el ID del usuario desde la URL
        id_usuario = kwargs.get('id_usuario')

        # Obtener el usuario desde la base de datos
        usuario = get_object_or_404(Usuario, id_usuario=id_usuario)

        # Obtiene los datos nuevos de la petición para modificar
        data = request.data

        # Comprueba si algún dato se ha enviado y ha cambiado 
        fields_to_update = {}

        if data.get("nombre") and data["nombre"] != usuario.nombre:
            fields_to_update["nombre"] = data["nombre"]

        if data.get("imagen"):
            fields_to_update["imagen"] = data["imagen"]
            fields_to_update["imagen_url"] = None  # Reiniciar imagen_url al subir nueva imagen, automatico

        # Si existen campos a actualizar, realizamos la actualización
        if fields_to_update:
            for field, value in fields_to_update.items():
                setattr(usuario, field, value)
            usuario.save()

            return Response({
                "message": "Usuario actualizado exitosamente",
                "data": {
                    "id_usuario": usuario.id_usuario,
                    "nombre": usuario.nombre,
                    "imagen_url": usuario.imagen.url if usuario.imagen else usuario.imagen_url
                }
            }, status=status.HTTP_200_OK)

        # Si no hay cambios, respondemos con un mensaje de que no se modificó nada
        return Response({"message": "No hubo cambios en los datos proporcionados."}, status=status.HTTP_304_NOT_MODIFIED)



@csrf_exempt         
def actualizar_token(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Método no permitido"}, status=405)

    try:
        # Cargar los datos del cuerpo de la solicitud
        data = json.loads(request.body)
        token_expo = data.get('expo_push_token')
        user_id = data.get('user_id')

        if not token_expo or not user_id:
            return JsonResponse({"error": "Faltan parámetros"}, status=400)

        # Buscar el usuario y actualizar el token
        usuario = Usuario.objects.get(id_usuario=user_id)
        usuario.expo_push_token = token_expo
        usuario.save()
        return JsonResponse({"mensaje": "Token actualizado con éxito"})
    except Usuario.DoesNotExist:
        return JsonResponse({"error": "Usuario no encontrado"}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Error al decodificar JSON"}, status=400)
    
    
