from django.db import models
from django.contrib.auth.hashers import make_password

from .Imagen import Imagen

class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    p_field = models.CharField(max_length=100, blank=True, null=True)  
    g_id = models.CharField(max_length=100, blank=True, null=True)
    imagen = models.ForeignKey(Imagen, on_delete=models.CASCADE,blank=True, null=True)
    duenio = models.BooleanField(default=False)
    establecimiento = models.OneToOneField(
        'Establecimiento',  # Usar comillas para evitar dependencia circular
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='usuario_establecimiento'
    )


def save(self, *args, **kwargs):
    if self.p_field:  # Si hay una contraseña, encriptarla
        self.p_field = make_password(self.p_field)
    if self.g_id:
        self.g_id = make_password(self.g_id)
    super().save(*args, **kwargs)

    