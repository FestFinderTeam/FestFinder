from django.db import models
from .Etiqueta import Etiqueta
from .Usuario import Usuario

# Modelo de los clientes interesados en asistir a un evento
class Preferencia(models.Model):
    id_preferencia = models.AutoField(primary_key=True)
    id_etiqueta = models.ForeignKey(Etiqueta, on_delete=models.CASCADE)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

# Control para evitar redundancias 
class Meta:
        unique_together = ('id_etiqueta', 'id_usuario')