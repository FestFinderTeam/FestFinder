import requests
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from .models import Establecimiento, Usuario, FavoritosLocal

EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"

class ResponseFormatter:
    @staticmethod
    def success(
        data=None, message="Operation successful", status_code=status.HTTP_200_OK
    ):
        return Response(
            {"errors": None, "message": message, "data": data},
            status=status_code,
        )

    @staticmethod
    def error(message, status_code=status.HTTP_400_BAD_REQUEST, errors=None):
        return Response(
            {"errors": errors, "message": message, "data": None},
            status=status_code,
        )

def prueba_enviar_notificaciones(request):
    # Obtener los parámetros de la URL
    establecimiento_id = request.GET.get('establecimiento_id')
    id_evento = request.GET.get('id_evento')
    mensaje = request.GET.get('mensaje')
    
    # Verificar que los parámetros estén presentes
    if not establecimiento_id or not mensaje or not id_evento:
        return JsonResponse({'error': 'Faltan parámetros: establecimiento_id o mensaje'}, status=400)

    # Llamar a la función para enviar las notificaciones
    try:
        establecimiento_id = int(establecimiento_id)  # Asegurarse de que el id sea un entero
        enviar_notificaciones_establecimiento(establecimiento_id, mensaje, int(id_evento))
        return JsonResponse({'success': 'Notificaciones enviadas exitosamente'}, status=200)
    except ValueError:
        return JsonResponse({'error': 'El establecimiento_id debe ser un número entero válido'}, status=400)

def enviar_notificaciones_establecimiento(establecimiento_id, mensaje, id_evento):
    print('Enviando notificaciones a los favoritos del establecimiento...', id_evento, establecimiento_id)
    # Obtener los favoritos del establecimiento con notificación habilitada
    favoritos = FavoritosLocal.objects.filter(establecimiento_id=establecimiento_id)
    
    tokens = []
    for favorito in favoritos:
        usuario = favorito.usuario
        if usuario.expo_push_token:
            tokens.append(usuario.expo_push_token)
    
    print('Tokens:', tokens)
    
    # Si hay tokens, enviar la notificación
    if tokens:
        enviar_notificaciones_push(tokens, mensaje, id_evento)
    else:
        print('No se encontraron tokens válidos para notificación.')

def enviar_notificaciones_push(tokens, mensaje, id_evento):
    payload = {
        "to": tokens,
        "title": "¡Notificación de tu Establecimiento Favorito!",
        "body": mensaje,
        "data": {
            "extraData": "Aquí puedes agregar más datos",
            "id_evento": id_evento,
        },
    }

    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
    }

    try:
        # Realizamos la solicitud a la API de Expo
        response = requests.post(EXPO_PUSH_URL, json=payload, headers=headers)
        response_data = response.json()

        if response.status_code == 200:
            print(f"Notificación enviada exitosamente: {response_data}")
        else:
            print(f"Error al enviar la notificación: {response_data}")
    except Exception as e:
        print(f"Error en la solicitud: {e}")
