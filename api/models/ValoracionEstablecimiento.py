from django.db import models
from .Usuario import Usuario


class ValoracionEstablecimiento(models.Model):
    id_valoracion_establecimiento = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    establecimiento = models.ForeignKey('Establecimiento', on_delete=models.CASCADE)
    puntuacion = models.IntegerField()
    comentario = models.CharField(max_length=50, blank=True)
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    verificado = models.BooleanField(default=False)
