from django.db import models
from .Establecimiento import Establecimiento

class horariosEstablecimiento(models.Model):
    establecimiento = models.ForeignKey(Establecimiento, on_delete=models.CASCADE)
    dia_semana = models.TextField(max_length=1)
    inicio_atencion = models.TimeField()
    fin_atencion = models.TimeField()

    class Meta:
        unique_together = ('establecimiento', 'dia_semana')
