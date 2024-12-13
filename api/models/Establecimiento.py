# mi_app/models/establecimiento.py
from django.db import models
from django.db.models import Avg

from .Usuario import Usuario
from .ValoracionEstablecimiento import ValoracionEstablecimiento
from .TipoEstablecimiento import TipoEstablecimiento

# Modelo para los establecimientos de ocio nocturno
class Establecimiento(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    # Enlaces a las imagenes (subidas en AWS)
    banner = models.ImageField(upload_to='imagenes/establecimientos/banners/', blank=True, null=True)
    logo = models.ImageField(upload_to='imagenes/establecimientos/logos/', blank=True, null=True)

    direccion = models.CharField(max_length=255)
    coordenada_x = models.DecimalField(max_digits=10, decimal_places=8)
    coordenada_y = models.DecimalField(max_digits=10, decimal_places=8)
    tipo_fk = models.ForeignKey(TipoEstablecimiento, on_delete=models.CASCADE)
    
    # Usuario representante del establecimiento en la aplicación 
    usuario = models.OneToOneField(
        Usuario,
        on_delete=models.CASCADE,
        unique=True,
        related_name='establecimiento_usuario'
    )
    rango_de_precios = models.CharField(max_length=5, blank=True)
    nro_ref = models.CharField(max_length=13, blank=True, default='')
    em_ref = models.EmailField(max_length=100, unique=True)

    #Campo de calificacion conseguido por consulta de las valoraciones del establecimiento promediadas
    @property
    def calificacion(self):
        avg_calificacion = ValoracionEstablecimiento.objects.filter(establecimiento=self).aggregate(Avg('puntuacion'))['puntuacion__avg']
        return avg_calificacion if avg_calificacion is not None else 0

