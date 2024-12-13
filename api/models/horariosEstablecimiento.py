from django.db import models
from .Establecimiento import Establecimiento

# Modelo para los horarios de atencion ligados a un establecimiento
class horariosEstablecimiento(models.Model):
    establecimiento = models.ForeignKey(Establecimiento, on_delete=models.CASCADE)
    dia_semana = models.TextField(max_length=1) # Lunes - Martes - Miercoles - Jueves - Viernes - Sabado - Domingo
    inicio_atencion = models.TimeField()
    fin_atencion = models.TimeField()

# Control para evitar sobreposicion de horarios en un mismo dia
    class Meta:
        unique_together = ('establecimiento', 'dia_semana')
