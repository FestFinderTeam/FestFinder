from django.db import models

# Modelo para las etiquetas de clasificacion de eventos y establecimientos (Iluminado, Refill, etc)
class Etiqueta(models.Model):
    id_etiqueta = models.AutoField(primary_key=True)
    texto_etiqueta = models.CharField(max_length=50)

 