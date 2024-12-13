from django.db import models

# Modelo para los tipos de establecimientos (bar, club, discoteca, etc.)
class TipoEstablecimiento(models.Model):
    nombre_tipo = models.CharField(max_length=30)
    descripcion_tipo = models.CharField(max_length=100, blank=True)