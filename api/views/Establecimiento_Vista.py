import ast
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q

from ..serializers import HorariosEstablecimientoSerializer
from ..models import Establecimiento, Usuario, Etiqueta, FavoritosLocal
from ..serializers import EstablecimientoSerializer
from ..serializers import EtiquetaSerializer
from ..models import EtiquetaEstablecimiento, horariosEstablecimiento
from django.shortcuts import get_object_or_404

# Vista para listar establecimientos por tipo
class ListarEstablecimientosPorTipo(APIView):
    def get(self, request, tipo_id):
        establecimientos = Establecimiento.objects.filter(tipo_fk_id=tipo_id)
        if not establecimientos.exists():
            return Response({"message": "No hay establecimientos para el tipo especificado."}, status=status.HTTP_404_NOT_FOUND)

        establecimientos_data = []

        for establecimiento in establecimientos:
            establecimiento_data = EstablecimientoSerializer(establecimiento).data

            etiquetas_establecimiento = EtiquetaEstablecimiento.objects.filter(id_establecimiento=establecimiento.id)
            etiquetas = EtiquetaSerializer([ee.id_etiqueta for ee in etiquetas_establecimiento], many=True).data
            establecimiento_data['etiquetas'] = etiquetas

            horarios = horariosEstablecimiento.objects.filter(establecimiento=establecimiento.id)
            horarios_data = HorariosEstablecimientoSerializer(horarios, many=True).data
            establecimiento_data['horarios'] = horarios_data

            establecimientos_data.append(establecimiento_data)

        return Response(establecimientos_data, status=status.HTTP_200_OK)
    

# Vista para recuperar datos de un establecimiento por su ID
class RecuperarDatosEstablecimiento(APIView):
    def get(self, request, est_id):
        user_id = request.query_params.get('user_id', None)

        try:
            establecimiento = Establecimiento.objects.get(id=est_id)
            establecimiento_data = EstablecimientoSerializer(establecimiento).data

            # Obtenemos y serializamos las etiquetas del establecimiento
            etiquetas_establecimiento = EtiquetaEstablecimiento.objects.filter(id_establecimiento=establecimiento.id)
            etiquetas = EtiquetaSerializer([ee.id_etiqueta for ee in etiquetas_establecimiento], many=True).data
            establecimiento_data['etiquetas'] = etiquetas

            # Obtenemos y serializamos los horarios de atención del establecimiento
            horarios = horariosEstablecimiento.objects.filter(establecimiento=establecimiento.id)
            horarios_data = HorariosEstablecimientoSerializer(horarios, many=True).data
            establecimiento_data['horarios'] = horarios_data
            
            if user_id:
                es_favorito = FavoritosLocal.objects.filter(establecimiento=establecimiento, usuario_id=user_id).exists()
                establecimiento_data['es_favorito'] = es_favorito  # True o False según la consulta


            return Response(establecimiento_data, status=status.HTTP_200_OK)
        except Establecimiento.DoesNotExist:
            return Response({"error": "Establecimiento no encontrado"}, status=status.HTTP_404_NOT_FOUND)

# Vista para listar todos los establecimientos
class ListarEstablecimientos(APIView):
    def get(self, request, *args, **kwargs):
        establecimientos = Establecimiento.objects.all()
        establecimientos_data = []

        for establecimiento in establecimientos:
            # Serializamos cada establecimiento
            establecimiento_data = EstablecimientoSerializer(establecimiento).data

            # Obtenemos y serializamos las etiquetas del establecimiento
            etiquetas_establecimiento = EtiquetaEstablecimiento.objects.filter(id_establecimiento=establecimiento.id)
            etiquetas = EtiquetaSerializer([ee.id_etiqueta for ee in etiquetas_establecimiento], many=True).data
            establecimiento_data['etiquetas'] = etiquetas

            # Obtenemos y serializamos los horarios de atención del establecimiento
            horarios = horariosEstablecimiento.objects.filter(establecimiento=establecimiento.id)
            horarios_data = HorariosEstablecimientoSerializer(horarios, many=True).data
            establecimiento_data['horarios'] = horarios_data

            # Añadimos el establecimiento con etiquetas y horarios a la lista
            establecimientos_data.append(establecimiento_data)

        return Response(establecimientos_data, status=status.HTTP_200_OK)
    


class EstablecimientoPorUsuario(APIView):
    def get(self, request, usuario_id):
        try:
            # Filtra el establecimiento por el ID del usuario
            establecimiento = Establecimiento.objects.get(usuario=usuario_id)
            establecimiento_data = EstablecimientoSerializer(establecimiento).data

            # Obtén etiquetas asociadas al establecimiento
            etiquetas_establecimiento = EtiquetaEstablecimiento.objects.filter(id_establecimiento=establecimiento.id)
            etiquetas = EtiquetaSerializer([ee.id_etiqueta for ee in etiquetas_establecimiento], many=True).data
            establecimiento_data['etiquetas'] = etiquetas

            # Obtén horarios asociados al establecimiento
            horarios = horariosEstablecimiento.objects.filter(establecimiento=establecimiento.id)
            horarios_data = HorariosEstablecimientoSerializer(horarios, many=True).data
            establecimiento_data['horarios'] = horarios_data

            return Response(establecimiento_data, status=status.HTTP_200_OK)

        except Establecimiento.DoesNotExist:
            return Response({"message": "No se encontró un establecimiento para el usuario especificado."}, status=status.HTTP_404_NOT_FOUND)
        

class EstablecimientosSimilares(APIView):
    def get(self, request, est_id):
        try:
            # Obtener el establecimiento solicitado
            establecimiento = Establecimiento.objects.get(id=est_id)
            
            # Filtrar establecimientos que compartan el mismo tipo o rango de precio, excluyendo el actual
            establecimientos_relacionados = Establecimiento.objects.filter(
                Q(tipo_fk=establecimiento.tipo_fk) | Q(rango_de_precios=establecimiento.rango_de_precios)
            ).exclude(id=est_id)

            # Serializar y devolver los datos
            establecimientos_data = EstablecimientoSerializer(establecimientos_relacionados, many=True).data
            return Response(establecimientos_data, status=status.HTTP_200_OK)
        
        except Establecimiento.DoesNotExist:
            return Response({"message": "Establecimiento no encontrado"}, status=status.HTTP_404_NOT_FOUND)


class RegistrarEstablecimiento(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        print("se envio")
        print(request.data)
        serializer = EstablecimientoSerializer(data=request.data)
        print("datos bien enviados")
        
        if serializer.is_valid():
            establecimiento=serializer.save()
            # Actualizar el campo `duenio` a True para el usuario relacionado
            usuario_id = request.data.get("usuario")
            if(usuario_id):
                print (usuario_id)
                Usuario.objects.filter(id_usuario=usuario_id).update(
                    duenio=True,
                    establecimiento=establecimiento
                )
                print("Campo `duenio` actualizado a True para el usuario", usuario_id)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Errores de validación:", serializer.errors)  # Imprime errores de validación
            return Response(
                {"message": "Error en la validación de los datos", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

class FiltrarEstablecimientos(APIView):
    def post(self, request):
        ciudad = request.data.get("ciudad", "").strip()
        tipos = request.data.get("tipos", [])
        rango_de_precios = request.data.get("rango_de_precios", "").strip()
        nombre = request.data.get("nombre", "").strip()

        # Verificar que 'ciudad' esté presente, ya que es obligatorio
        if not ciudad:
            return Response(
                {"message": "El campo 'ciudad' es requerido."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Construir el filtro inicial para ciudad en dirección
        query = Q(direccion__icontains=ciudad)

        # Agregar filtros adicionales según estén presentes
        if tipos:
            query &= Q(tipo_fk__id__in=tipos)
        if rango_de_precios:
            query &= Q(rango_de_precios=rango_de_precios)
        if nombre:
            query &= Q(nombre__icontains=nombre)

        # Filtrar eventos utilizando la consulta construida
        establecimientos = Establecimiento.objects.filter(query)

        # Serializar y devolver los resultados
        establecimientos_data = EstablecimientoSerializer(establecimientos, many=True).data
        return Response(establecimientos_data, status=status.HTTP_200_OK)
    

class ModificarEstablecimiento(APIView):
    parser_classes = (MultiPartParser, FormParser)
    
    def put(self, request, *args, **kwargs):
        # Obtener el ID del establecimiento desde los parámetros de la URL
        establecimiento_id = kwargs.get('id_establecimiento')
        
        # Obtener el establecimiento desde la base de datos
        establecimiento = get_object_or_404(Establecimiento, id=establecimiento_id)
        
        # Obtener los datos que fueron enviados en la petición
        data = request.data
        
        # Comprobar si algún dato ha cambiado
        fields_to_update = {}

        # Comprobar y asignar nuevos valores si se han enviado
        if data.get("nombre") and data["nombre"] != establecimiento.nombre:
            fields_to_update["nombre"] = data["nombre"]
        
        if data.get("banner") and data["banner"] != establecimiento.banner.name:
            fields_to_update["banner"] = data["banner"]
        
        if data.get("logo") and data["logo"] != establecimiento.logo.name:
            fields_to_update["logo"] = data["logo"]
        
        if data.get("direccion") and data["direccion"] != establecimiento.direccion:
            fields_to_update["direccion"] = data["direccion"]
        
        if data.get("coordenada_x") and data["coordenada_x"] != str(establecimiento.coordenada_x):
            fields_to_update["coordenada_x"] = data["coordenada_x"]
        
        if data.get("coordenada_y") and data["coordenada_y"] != str(establecimiento.coordenada_y):
            fields_to_update["coordenada_y"] = data["coordenada_y"]
        
        if data.get("tipo_fk") and data["tipo_fk"] != str(establecimiento.tipo_fk.id):
            fields_to_update["tipo_fk"] = data["tipo_fk"]
        
        if data.get("rango_de_precios") and data["rango_de_precios"] != establecimiento.rango_de_precios:
            fields_to_update["rango_de_precios"] = data["rango_de_precios"]
        
        if data.get("nro_ref") and data["nro_ref"] != establecimiento.nro_ref:
            fields_to_update["nro_ref"] = data["nro_ref"]
        
        if data.get("em_ref") and data["em_ref"] != establecimiento.em_ref:
            fields_to_update["em_ref"] = data["em_ref"]
        
        
        # Si existen campos a actualizar, realizamos la actualización
        if fields_to_update:
            for field, value in fields_to_update.items():
                setattr(establecimiento, field, value)
            establecimiento.save()
            
        # Procesar las etiquetas
        if data.get("etiquetas"):
            # Obtener las etiquetas enviadas
            etiquetas_recibidas = json.loads(data.get("etiquetas"))

            # Obtener las etiquetas actuales del establecimiento
            etiquetas_existentes = EtiquetaEstablecimiento.objects.filter(id_establecimiento=establecimiento)

            # Buscar las etiquetas que deben eliminarse
            etiquetas_a_eliminar = etiquetas_existentes.exclude(id_etiqueta__texto_etiqueta__in=etiquetas_recibidas)

            # Eliminar las relaciones de etiquetas que no están en la lista recibida
            for etiqueta in etiquetas_a_eliminar:
                etiqueta.delete()

            # Buscar y agregar nuevas etiquetas
            for etiqueta_texto in etiquetas_recibidas:
                # Verificar si la etiqueta ya existe
                try:
                    etiqueta_obj = Etiqueta.objects.get(texto_etiqueta=etiqueta_texto)
                    # Crear la relación si no existe
                    EtiquetaEstablecimiento.objects.get_or_create(id_establecimiento=establecimiento, id_etiqueta=etiqueta_obj)
                except Etiqueta.DoesNotExist:
                    # Si la etiqueta no existe, no hacemos nada
                    pass
            return Response(EstablecimientoSerializer(establecimiento).data, status=status.HTTP_200_OK)
        
        # Si no hay cambios, respondemos con un mensaje de que no se modificó nada
        return Response({"message": "No hubo cambios en los datos proporcionados."}, status=status.HTTP_304_NOT_MODIFIED)


class RegistrarEstablecimientoC(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        print("se envio")
        print(request.data)
        serializer = EstablecimientoSerializer(data=request.data)
        print("datos bien enviados")
        
        if serializer.is_valid():
            # Guardar el establecimiento
            establecimiento = serializer.save()

            # Parsear los horarios (se recibe como una cadena JSON)
            horarios = json.loads(request.data.get("horarios", "[]"))
            for horario in horarios:
                dia_semana = horario.get("dia", None)
                horario_data = horario.get("horario", None)
                
                # Solo guardar si hay horario
                if horario_data and dia_semana:
                    inicio_atencion = horario_data.get("inicio_atencion")
                    fin_atencion = horario_data.get("fin_atencion")
                    
                    if inicio_atencion and fin_atencion:
                        horariosEstablecimiento.objects.create(
                            establecimiento=establecimiento,
                            dia_semana=str(dia_semana),  # Usar dia_semana como string
                            inicio_atencion=inicio_atencion,
                            fin_atencion=fin_atencion
                        )
            print("Horarios Guardados")

            # Parsear las etiquetas (se recibe como una cadena JSON)
            etiquetas = json.loads(request.data.get("etiquetas", "[]"))
            for etiqueta_texto in etiquetas:
                etiqueta_obj, created = Etiqueta.objects.get_or_create(texto_etiqueta=etiqueta_texto)
                EtiquetaEstablecimiento.objects.create(
                    id_establecimiento=establecimiento,
                    id_etiqueta=etiqueta_obj
                )
            print("Etiquetas Guardadas")

            # Actualizar el campo `duenio` a True para el usuario relacionado
            usuario_id = request.data.get("usuario")
            if usuario_id:
                Usuario.objects.filter(id_usuario=usuario_id).update(
                    duenio=True,
                    establecimiento=establecimiento
                )
                print("Campo `duenio` actualizado a True para el usuario", usuario_id)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Errores de validación:", serializer.errors)  # Imprime errores de validación
            return Response(
                {"message": "Error en la validación de los datos", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )