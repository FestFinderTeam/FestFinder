from django.db import models
from django.contrib.auth.hashers import make_password

# Modelo para los usuarios de la aplicacion (usuario y representante)
class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)

    # campos de contraseña para los usuarios registrados manualmente y con google
    p_field = models.CharField(max_length=100, blank=True, null=True)  
    g_id = models.CharField(max_length=100, blank=True, null=True)

    # campo de subida de imagenes y url pura (para imagen del google)
    imagen = models.ImageField(upload_to='imagenes/', blank=True, null=True)
    imagen_url = models.URLField(blank=True, null=True)
    
    # Campo en caso sea representante de un establecimiento
    duenio = models.BooleanField(default=False)
    establecimiento = models.OneToOneField(
        'Establecimiento',  
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='usuario_establecimiento'
    )
    expo_push_token = models.CharField(max_length=255, blank=True, null=True)


def save(self, *args, **kwargs):
    # Encripta la contraseña ingresada manualmente
    if self.p_field:
        self.p_field = make_password(self.p_field)
        
    # Copia la url de la imagen si se subio manualmente
    if not self.imagen_url and self.imagen:
        self.imagen_url = self.imagen.url  # Obtiene la URL generada por el backend de almacenamiento
    
    super().save(*args, **kwargs)

    