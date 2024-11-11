from django.db import models
from .GeneroEvento import GeneroEvento  
from .Establecimiento import Establecimiento  

class Evento(models.Model):
    id_evento = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    logo = models.ImageField(upload_to='imagenes/eventos/logos/', blank=True, null=True)
    descripcion = models.TextField(blank=True)
    fecha_inicio = models.DateField()
    id_establecimiento = models.ForeignKey(Establecimiento, on_delete=models.CASCADE)
    fecha_final = models.DateField()
    horario_inicio = models.TimeField()
    horario_fin = models.TimeField()
    id_genero_fk = models.ForeignKey(GeneroEvento, on_delete=models.CASCADE)
    precio_min = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    precio_max = models.DecimalField(max_digits=10, decimal_places=2, default=100.0)

    

