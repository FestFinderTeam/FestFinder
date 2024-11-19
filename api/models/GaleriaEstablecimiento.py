from django.db import models
from .Establecimiento import Establecimiento

class GaleriaEstablecimiento(models.Model):
    establecimiento = models.ForeignKey(Establecimiento, on_delete=models.CASCADE)
    imagen = models.ImageField(upload_to='imagenes/', blank=True, null=True)
    fecha_subida = models.DateTimeField(auto_now_add=True)  # Fecha de subida automática

