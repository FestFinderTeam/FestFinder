from django.db import models
from django.contrib.auth.hashers import make_password

class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    p_field = models.CharField(max_length=100, blank=True, null=True)  
    g_id = models.CharField(max_length=100, blank=True, null=True)
    imagen = models.ImageField(upload_to='imagenes/', blank=True, null=True)
    imagen_url = models.URLField(blank=True, null=True)
    duenio = models.BooleanField(default=False)
    establecimiento = models.OneToOneField(
        'Establecimiento',  
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='usuario_establecimiento'
    )


def save(self, *args, **kwargs):
    # Encriptar la contraseña si existe
    if self.p_field:
        self.p_field = make_password(self.p_field)
        
    # Si img_url es nulo pero imagen no lo es, copiar la URL de imagen
    if not self.imagen_url and self.imagen:
        self.imagen_url = self.imagen.url  # Obtiene la URL generada por el backend de almacenamiento
    
    super().save(*args, **kwargs)

    