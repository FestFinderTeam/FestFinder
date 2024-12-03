from django.db import models
from .Establecimiento import Establecimiento
from .Usuario import Usuario

class FavoritosLocal(models.Model):
    establecimiento = models.ForeignKey(Establecimiento, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

class Meta:
        # Define la combinación única de las claves foráneas
        unique_together = ('establecimiento', 'usuario')
