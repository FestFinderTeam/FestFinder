from django.db import models
from .Evento import Evento
from .Usuario import Usuario

# Modelo de las asistencias de un usuario a un evento 
class Asistencia(models.Model):
    id_asistencia = models.AutoField(primary_key=True)
    id_evento_asistido_fk = models.ForeignKey(Evento, on_delete=models.CASCADE)
    id_usuario_fk = models.ForeignKey(Usuario, on_delete=models.CASCADE)
