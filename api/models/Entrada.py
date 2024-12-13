from django.db import models
from .Evento import Evento 

# Modelo para las categorias de entradas que tenga un evento (digase por proximidad al artista por ejemplo)
class Entrada(models.Model):
    id_entrada = models.AutoField(primary_key=True)
    id_evento_fk = models.ForeignKey(Evento, on_delete=models.CASCADE)
    titulo_entrada = models.CharField(max_length=20)
    precio_entrada = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion_entrada = models.CharField(max_length=100)
