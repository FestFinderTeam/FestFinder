from django.db import models
from .Evento import Evento
from .Imagen import Imagen

# Modelo para las galerias ligadas a un establecimiento
class GaleriaEvento(models.Model):
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE)
    imagen = models.ForeignKey(Imagen, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('evento', 'imagen')
