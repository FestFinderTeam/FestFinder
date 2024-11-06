# mi_app/models/establecimiento.py
from django.db import models
from .TipoEstablecimiento import TipoEstablecimiento

class Establecimiento(models.Model):
    nombre = models.CharField(max_length=100)
    banner = models.ImageField(upload_to='imagenes/establecimientos/banners/', blank=True, null=True)
    logo = models.ImageField(upload_to='imagenes/establecimientos/logos/', blank=True, null=True)
    direccion = models.CharField(max_length=255)
    coordenada_x = models.DecimalField(max_digits=10, decimal_places=8)
    coordenada_y = models.DecimalField(max_digits=10, decimal_places=8)
    descripcion = models.TextField(blank=True)
    tipo_fk = models.ForeignKey(TipoEstablecimiento, on_delete=models.CASCADE)
    rango_de_precios = models.CharField(max_length=5, blank=True)
    nro_ref = models.CharField(max_length=13, blank=True, default='')
    em_ref = models.EmailField(blank=True)

