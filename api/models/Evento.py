from django.db import models

from .ValoracionEvento import ValoracionEvento

from .GeneroEvento import GeneroEvento  
from .Establecimiento import Establecimiento  
from django.db.models import Avg

# Modelo para los eventos de ocio nocturno
class Evento(models.Model):
    id_evento = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)

    # Enlace del logo del evento (subido en AWS)
    logo = models.ImageField(upload_to='imagenes/eventos/logos/', blank=True, null=True) 

    descripcion = models.TextField(blank=True)
    fecha_inicio = models.DateField()

    # Establecimiento al que esta ligado el evento
    id_establecimiento = models.ForeignKey(Establecimiento, on_delete=models.CASCADE)

    fecha_final = models.DateField()
    horario_inicio = models.TimeField()
    horario_fin = models.TimeField()
    id_genero_fk = models.ForeignKey(GeneroEvento, on_delete=models.CASCADE) #Enlace al tipo de evento

    # Para detallar mejor el rango de precios del evento
    precio_min = models.DecimalField(max_digits=10, decimal_places=2)
    precio_max = models.DecimalField(max_digits=10, decimal_places=2)

    
    
    # Campo dinamico para mostrar todos los interesados en asistir al evento
    @property
    def interesados(self):
        return self.interes_set.count()

    #Campo de calificacion conseguido por consulta de las valoraciones del evento promediadas
    @property
    def calificacion(self):
        avg_calificacion = ValoracionEvento.objects.filter(evento=self).aggregate(Avg('puntuacion'))['puntuacion__avg']
        return avg_calificacion if avg_calificacion is not None else 0
