from django.db import models
from .Evento import Evento
from .Usuario import Usuario

# Modelo de los clientes interesados en asistir a un evento
class Interes(models.Model):
    id_interes = models.AutoField(primary_key=True)
    id_evento = models.ForeignKey(Evento, on_delete=models.CASCADE)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

# Control para evitar redundancias 
class Meta:
        unique_together = ('id_evento', 'id_usuario')