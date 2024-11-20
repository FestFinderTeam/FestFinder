from django.db import models
from .Evento import Evento
from .Usuario import Usuario

class Interes(models.Model):
    id_interes = models.AutoField(primary_key=True)
    id_evento = models.ForeignKey(Evento, on_delete=models.CASCADE)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
