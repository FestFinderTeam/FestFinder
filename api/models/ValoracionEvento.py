from django.db import models
from .Usuario import Usuario

# Modelo para las reseñas de eventos
class ValoracionEvento(models.Model):
    id_valoracion_evento = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    evento = models.ForeignKey('Evento', on_delete=models.CASCADE)    
    puntuacion = models.IntegerField()
    comentario = models.CharField(max_length=50, blank=True)
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    
    # Campo para las reseñas que fueron verificadas con asistencias (influye en la calificacion)
    verificado = models.BooleanField(default=False)
