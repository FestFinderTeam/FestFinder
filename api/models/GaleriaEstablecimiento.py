from django.db import models
from .Establecimiento import Establecimiento

# Modelo para las galerias ligadas a un establecimiento
class GaleriaEstablecimiento(models.Model):
    establecimiento = models.ForeignKey(Establecimiento, on_delete=models.CASCADE)
    imagen = models.ImageField(upload_to='imagenes/', blank=True, null=True)
    fecha_subida = models.DateTimeField(null=True, blank=True, auto_now_add=True)  # Fecha de subida automática
