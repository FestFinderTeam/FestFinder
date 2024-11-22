# mi_app/serializers/establecimiento.py
from rest_framework import serializers
from ..models import Establecimiento, TipoEstablecimiento
from .TipoEstablecimientoSerializer import TipoEstablecimientoSerializer

class EstablecimientoSerializer(serializers.ModelSerializer):
    # Usamos PrimaryKeyRelatedField solo para las solicitudes POST/PUT (registro)
    tipo_fk = serializers.PrimaryKeyRelatedField(queryset=TipoEstablecimiento.objects.all(), write_only=True)  # Solo para POST/PUT

    # Usamos TipoEstablecimientoSerializer solo para las solicitudes GET (lectura)
    tipo_fk_detail = TipoEstablecimientoSerializer(read_only=True, source='tipo_fk')  # Para GET (lectura)

    calificacion = serializers.SerializerMethodField()


    class Meta:
        model = Establecimiento
        fields = ['id', 'nombre', 'banner', 'logo', 'direccion', 'coordenada_x', 'coordenada_y', 'tipo_fk', 'tipo_fk_detail','usuario','rango_de_precios', 'nro_ref', 'em_ref', 'calificacion']
        extra_kwargs = {
            'nombre': {
                'error_messages': {
                    'blank': 'El nombre del establecimiento no puede estar vacío.',
                    'max_length': 'El nombre no debe exceder 100 caracteres.'
                }
            },
            'banner': {
                'error_messages': {
                    'invalid': 'El banner debe ser una imagen válida.'
                }
            },
            'logo': {
                'error_messages': {
                    'invalid': 'El logo debe ser una imagen válida.'
                }
            },
            'direccion': {
                'error_messages': {
                    'blank': 'La dirección no puede estar vacía.',
                    'max_length': 'La dirección no debe exceder 255 caracteres.'
                }
            },
            'coordenada_x': {
                'error_messages': {
                    'invalid': 'La coordenada X debe ser un número decimal.',
                    'max_digits': 'La coordenada X no debe tener más de 10 dígitos en total.',
                    'max_decimal_places': 'La coordenada X no debe tener más de 8 decimales.'
                }
            },
            'coordenada_y': {
                'error_messages': {
                    'invalid': 'La coordenada Y debe ser un número decimal.',
                    'max_digits': 'La coordenada Y no debe tener más de 10 dígitos en total.',
                    'max_decimal_places': 'La coordenada Y no debe tener más de 8 decimales.'
                }
            },
            'tipo_fk': {
                'error_messages': {
                    'null': 'El tipo de establecimiento es obligatorio.',
                    'does_not_exist': 'El tipo de establecimiento proporcionado no existe.'
                }
            },
            'usuario': {
                'error_messages': {
                    'null': 'El usuario es obligatorio.',
                    'does_not_exist': 'El usuario proporcionado no existe.'
                }
            },
            'rango_de_precios': {
                'error_messages': {
                    'max_length': 'El rango de precios no debe exceder 5 caracteres.'
                }
            },
            'nro_ref': {
                'error_messages': {
                    'max_length': 'El número de referencia no debe exceder 13 caracteres.'
                }
            },
            'em_ref': {
                'error_messages': {
                    'invalid': 'El formato del correo electrónico es inválido.'
                }
            }
        }
        
    def get_calificacion(self, obj):
        # Retorna el valor de la propiedad calificacion
        return obj.calificacion