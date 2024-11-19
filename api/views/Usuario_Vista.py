import logging

from django.db import IntegrityError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from ..utils import ResponseFormatter

from api.models import Imagen
from ..models import Usuario
from ..serializers import UsuarioSerializer

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
        g_p = request.data.get('g_id', "")  # Obtener g_id

        # Caso 1: Si es con Google
        if g_p:
            logger.info("Caso: Google ID login")  
            try:
                user = Usuario.objects.get(email=email)
                if check_password (g_p, user.g_id):
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
                #imagen_url = request.data.get('imagen')  # URL de la foto
                if not nombre:
                    return Response({"detail": "Nombre y foto son requeridos para el registro."}, status=status.HTTP_400_BAD_REQUEST)
                
                try:
                    #imagen = Imagen.objects.create(url=imagen_url)  # Suponiendo que tienes un modelo Imagen que guarda la URL
                    usuario = Usuario(
                        nombre=nombre,
                        email=email,
                        g_id=g_p,
                        #imagen=imagen,
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