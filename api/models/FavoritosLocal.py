from django.db import models
from .Establecimiento import Establecimiento
from .Usuario import Usuario

# Modelo para guardar los establecimientos favoritos de un usuario
class FavoritosLocal(models.Model):
    establecimiento = models.ForeignKey(Establecimiento, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

# Control para no permitir repetidos (redundancia)
class Meta:
        unique_together = ('establecimiento', 'usuario')
