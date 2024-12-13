from django.db import models

#Modelo para almacenar imagenes genericas (para galerias por ejemplo)
class Imagen(models.Model):
    imagen = models.ImageField(upload_to='imagenes/')
    descripcion = models.CharField(max_length=255, blank=True)
