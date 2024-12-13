from rest_framework import serializers

from api.serializers import EstablecimientoSerializer
from .GeneroEventoSerializer import GeneroEventoSerializer
from ..models import Evento, GeneroEvento, Establecimiento

class EventoSerializer(serializers.ModelSerializer):
    # Espera recibir las llaves para las solicitudes POST/PUT (registro)
    id_establecimiento = serializers.PrimaryKeyRelatedField(queryset=Establecimiento.objects.all(), write_only=True)  # Solo para POST/PUT
    id_genero_fk = serializers.PrimaryKeyRelatedField(queryset=GeneroEvento.objects.all(), write_only=True)  # Solo para POST/PUT

    # Retorna los datos completos solo para las solicitudes GET (lectura)
    id_establecimiento_detail = EstablecimientoSerializer(read_only=True, source='id_establecimiento')  # Para GET (lectura)
    id_genero_fk_detail = GeneroEventoSerializer(read_only=True, source='id_genero_fk')  # Para GET (lectura)

    # Campos de consulta de interesados y calificación del evento 
    interesados = serializers.SerializerMethodField()
    calificacion = serializers.SerializerMethodField()

    class Meta:
        model = Evento
        fields = ['id_evento', 'nombre', 'logo', 'descripcion', 'fecha_inicio', 
                  'id_establecimiento', 'id_establecimiento_detail',  # Mostramos tanto el ID como el detalle
                  'fecha_final', 'horario_inicio', 'horario_fin', 
                  'id_genero_fk', 'id_genero_fk_detail',  # Mostramos tanto el ID como el detalle
                  'precio_min', 'precio_max', 'interesados', 'calificacion']
        
    
    def get_interesados(self, obj):
        # Verifica si el objeto es una instancia del modelo Evento
        if isinstance(obj, Evento):
            # Retorna el número de registros relacionados
            return obj.interes_set.count()
        # En caso contrario, retorna 0 o un valor predeterminado
        return 0
    
    def get_calificacion(self, obj):
        # Verifica si el objeto es una instancia del modelo Evento
        if isinstance(obj, Evento):
            # Retorna el valor de la propiedad calificación
            return obj.calificacion
        # En caso contrario, retorna None o un valor predeterminado
        return None