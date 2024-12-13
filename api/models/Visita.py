from django.db import models
from .Establecimiento import Establecimiento
from .Usuario import Usuario

# Modelo de las visitas de un usuario a un establecimiento 
class Visita(models.Model):
    id_visita = models.AutoField(primary_key=True)
    id_establecimiento_visitado_fk = models.ForeignKey(Establecimiento, on_delete=models.CASCADE)
    id_usuario_fk = models.ForeignKey(Usuario, on_delete=models.CASCADE)
