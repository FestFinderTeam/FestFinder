import os
from pathlib import Path
from django.urls import path
from django.urls import re_path
from django.contrib import admin
from django.conf import settings
from django.views.static import serve
from django.conf.urls.static import static
from api.views import SubirImagen
from api.views import AgregarTipoEstablecimiento
from api.views import ListarTiposEstablecimiento
from api.views.Establecimiento_Vista import EstablecimientoPorUsuario, EstablecimientosSimilares, EstablecimientosSimilaresPorUsuario, FiltrarEstablecimientos, ListarEstablecimientosPorTipo, ModificarEstablecimiento, RecuperarDatosEstablecimiento, RegistrarEstablecimiento, ListarEstablecimientos, RegistrarEstablecimientoC
from api.views.Etiqueta_Vista import CrearEtiqueta, ListarEtiquetas, ListarEtiquetasPorTexto
from api.views.EtiquetaEstablecimiento_Vista import (
    RegistrarRelacion,
    EtiquetasPorEstablecimiento,
    EstablecimientosPorEtiqueta,
)
from api.views.FavoritosLocal_Vista import CreateFavorito, FavoritosPorEstablecimiento, FavoritosDeUnUsuario, DeleteFavorito
from api.views.Filtrado_Vista import FiltrarEstablecimientosYEventos
from api.views.GaleriaEstablecimiento_Vista import GaleriaEstablecimiento, GetGaleriaEstablecimiento, RegistrarImagenEnGaleriaEstablecimiento, EliminarGaleriaEstablecimiento, RecuperarGaleriaPorEstablecimiento, RegistrarVariasImagenesGaleria
from api.views.Genero_Evento_Vista import CrearGeneroEvento, ListarGenerosEvento
from api.views.Evento_Vista import ListarEventosPopulares, BorrarEvento, CrearEvento, FiltrarEventos, ListarEventos, ListarEventosHoy, ListarEventosMes, ListarEventosPorCategoria, ListarEventosPorEstablecimiento, ListarEventosTuEstablecimiento, ModificarEvento, ObtenerEventoPorID
from api.views.Entrada_Vista import CrearEntrada, ListarEntradasEvento
from api.views.Consumo_Vista import CrearConsumo, ListarConsumosPorEstablecimiento
from api.views.HorariosEstablecimiento_Vista import RecuperarHorarios, RecuperarHorariosPorEstablecimiento, RegistrarHorarioEstablecimiento
from api.views.Imagen_Vista import ImagenDetailView
from api.views.Interes_Vista import EliminarInteres, InteresPorEventos, InteresPorUsuario, RegistrarInteres
from api.views.Usuario_Vista import CrearUsuario, ListarUsuarios, LoginUsuario, ModificarUsuario
from api.views.Visita_Vista import (
    RegistrarVisita,
    VisitasPorEstablecimiento,
    VisitasPorUsuario,
)
from api.views.Valoracion_Establecimiento_Vista import (
    RegistrarValoracion,
    ValoracionesPorEstablecimiento,
)
from api.views.Asistencia_Vista import (
    RegistrarAsistencia,
    AsistenciasPorEventos,
    AsistenciasPorUsuario,
)
from api.views.Valoracion_Evento_Vista import (
    RegistrarValoracionEvento,
    ValoracionesPorEvento,
)

from api.views.Usuario_Vista import actualizar_token
from api.utils import prueba_enviar_notificaciones

from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="API FestFinder",
        default_version="v1",
        description="Descripción de mi API",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@miapi.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
)

BASE_DIR = Path(__file__).resolve().parent.parent

urlpatterns = [
    re_path(
        r'^\.well-known/(?P<path>.*)$',
        serve,
        {'document_root': os.path.join(BASE_DIR, '.well-known')}
    ),
    path(
        "api/documentacion/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path(
        "api/redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"
    ),
    path("api/schema/", schema_view.without_ui(cache_timeout=0), name="schema-json"),
    path("admin/", admin.site.urls),

    path("api/subir-imagen/", SubirImagen.as_view(), name="subir-imagen"),
    
    path(
        "api/etiquetas/all",
        ListarEtiquetas.as_view(),
        name="listar-etiquetas",
    ),
    
    # Endpoints de etiquetas
    path('api/etiquetas/', ListarEtiquetasPorTexto.as_view(), name='listar-etiquetas-por-texto'),
    path(
        "api/reg-etiqueta-establecimiento/",
        RegistrarRelacion.as_view(),
        name="registrar-relacion",
    ),
    path(
        "api/etiquetas/establecimiento/<int:establecimiento_id>/",
        EtiquetasPorEstablecimiento.as_view(),
        name="etiquetas-por-establecimiento",
    ),
    path(
        "api/establecimientos/etiqueta/<int:etiqueta_id>/",
        EstablecimientosPorEtiqueta.as_view(),
        name="establecimientos-por-etiqueta",
    ),

    # Endpoints de establecimientos
    path("api/categorias-establecimientos/", ListarTiposEstablecimiento.as_view(), name="listar-categorias-establecimiento"),
    path("api/establecimiento/", RegistrarEstablecimiento.as_view(), name="registrar-establecimiento"),
    path("api/establecimiento/registro/", RegistrarEstablecimientoC.as_view(), name="registrar-establecimiento-completo"),
    path('api/establecimiento/modificar/<int:id_establecimiento>/', ModificarEstablecimiento.as_view(), name='modificar_establecimiento'),
    path("api/establecimientos/", ListarEstablecimientos.as_view(), name="listar-establecimiento"),
    path("api/establecimiento/est_id/<int:est_id>/", RecuperarDatosEstablecimiento.as_view(), name="recuperar-establecimiento"),
    path("api/establecimiento/propietario/<int:usuario_id>/", EstablecimientoPorUsuario.as_view(), name="recuperar-mi-establecimiento"),
    path('api/establecimientos/tipo/<int:tipo_id>/', ListarEstablecimientosPorTipo.as_view(), name='establecimientos_por_tipo'),
    path('api/establecimientos/<int:establecimiento_id>/horarios/', RecuperarHorariosPorEstablecimiento.as_view(), name='recuperar_horarios'),
    path('api/establecimientos/horarios/registrar/', RegistrarHorarioEstablecimiento.as_view(), name='registrar_horario'),
    path('api/establecimientos-similares/<int:est_id>/', EstablecimientosSimilares.as_view(), name='establecimientos-similares'),
    path('api/establecimientos/horarios/', RecuperarHorarios.as_view(), name='recuperar_todos_los_horarios'),
    path('api/establecimientos/filtro/', FiltrarEstablecimientos.as_view(), name='filtrar_establecimientos'),
    path('api/establecimientos/recomendacion/<int:id_usuario>/', EstablecimientosSimilaresPorUsuario.as_view(), name='recomendar_establecimientos'),

    # Endpoints de galeria de establecimiento
    path('api/galeria/establecimiento/<int:id_establecimiento>/', RecuperarGaleriaPorEstablecimiento.as_view(), name='recuperar-galeria-establecimiento'),
    path('api/galeria/establecimiento/imagen/<int:id>/', EliminarGaleriaEstablecimiento.as_view(), name='eliminar-imagen-galeria'),
    path('api/galeria/establecimiento/', GetGaleriaEstablecimiento.as_view(), name='recuperar-galeria'),
    path('api/galeria/establecimiento/registrar/', RegistrarImagenEnGaleriaEstablecimiento.as_view(), name='eliminar-imagen-galeria'),
    path('api/galeria/registrar-multiples/', RegistrarVariasImagenesGaleria.as_view(), name='registrar_multiples_imagenes'),

    #endpoints de genero evento
    path("api/genero-evento/", CrearGeneroEvento.as_view(), name="crear-genero-evento"),
    path(
        "api/generos-evento/",
        ListarGenerosEvento.as_view(),
        name="listar-generos-evento",
    ),

    #endpoints de eventos
    path("api/evento/", CrearEvento.as_view(), name="crear-evento"),
    path("api/eventos/", ListarEventos.as_view(), name="listar-eventos"),
    path('api/eventos_mes/', ListarEventosMes.as_view(), name='eventos-mes'),
    path('api/eventos_hoy/', ListarEventosHoy.as_view(), name='eventos-hoy'),
    path('api/eventos/<int:id>/', ObtenerEventoPorID.as_view(), name='obtener_evento_por_id'),
    path('api/eventos/establecimiento/<int:id_establecimiento>/', ListarEventosPorEstablecimiento.as_view(), name='listar-eventos-por-establecimiento'),
    path('api/eventos/establecimiento/myplace/<int:id_establecimiento>/', ListarEventosTuEstablecimiento.as_view(), name='listar-eventos-por-establecimiento'),
    path('api/eventos/categoria/<int:id_categoria>/', ListarEventosPorCategoria.as_view(), name='listar-eventos-por-categoria'),
    path('api/eventos/filtro/', FiltrarEventos.as_view(), name='filtrar_eventos'),
    path('api/eventos/populares/<str:ciudad>/', ListarEventosPopulares.as_view(), name='filtrar_eventos_populares'),
    path('api/eventos/modificar/<int:id_evento>/', ModificarEvento.as_view(), name='modificar_evento'),
    path('api/eventos/<int:id_evento>/borrar/', BorrarEvento.as_view(), name='borrar_evento'),
    path('api/filtrar/establecimientos-eventos/', FiltrarEstablecimientosYEventos.as_view(), name='filtrar-establecimientos-eventos'),

    #Endpoints de entradas y consumo (complementarias)
    path("api/entrada/", CrearEntrada.as_view(), name="crear-entrada"),
    path(
        "api/entradas/evento/<int:id_evento>/",
        ListarEntradasEvento.as_view(),
        name="listar-entradas-evento",
    ),
    path("api/consumo/", CrearConsumo.as_view(), name="crear-consumo"),
    path(
        "api/consumos/establecimiento/<int:establecimiento_id>/",
        ListarConsumosPorEstablecimiento.as_view(),
        name="listar-consumos-por-establecimiento",
    ),

    #endpoints de usuarios
    path("api/usuario/", CrearUsuario.as_view(), name="crear-usuario"),
    path("api/usuarios/", ListarUsuarios.as_view(), name="listar-usuarios"),
    path('api/usuario/modificar/<int:id_usuario>/', ModificarUsuario.as_view(), name='modificar_establecimiento'),

    # Endpoints de visitas y relacionados a la interaccion del usuario con los locales
    path("api/registrar-visita/", RegistrarVisita.as_view(), name="registrar-visita"),
    path(
        "api/visitas/establecimiento/<int:establecimiento_id>/",
        VisitasPorEstablecimiento.as_view(),
        name="visitas-por-establecimiento",
    ),
    path(
        "api/visitas/usuario/<int:usuario_id>/",
        VisitasPorUsuario.as_view(),
        name="visitas-por-usuario",
    ),
    path('api/create-favoritos/', 
         CreateFavorito.as_view(), 
         name='create_favorito'
    ),
    path('api/establecimiento/<int:establecimiento_id>/favoritos/', FavoritosPorEstablecimiento.as_view(), name='favoritos_por_establecimiento'),
    path('api/usuario/<int:usuario_id>/favoritos/', FavoritosDeUnUsuario.as_view(), name='favoritos_de_un_usuario'),
    path('api/delete-favoritos/<int:establecimiento_id>/<int:usuario_id>/', DeleteFavorito.as_view(), name='delete_favorito'),
   
    # endpoints de valoraciones de establecimientos
    path(
        "api/registrar-valoracion/",
        RegistrarValoracion.as_view(),
        name="registrar-valoracion",
    ),
    path(
        "api/valoraciones/establecimiento/<int:establecimiento_id>/",
        ValoracionesPorEstablecimiento.as_view(),
        name="valoraciones-por-establecimiento",
    ),

    # Endpoints de asistencias y la interaccion del usuario y el evento
    path(
        "api/asistencias/evento/<int:evento_id>/",
        AsistenciasPorEventos.as_view(),
        name="asistencia-por-evento",
    ),
    path(
        "api/asistencias/usuario/<int:usuario_id>/",
        AsistenciasPorUsuario.as_view(),
        name="asistencia-por-usuario",
    ),
    path(
        "api/registrar-asistencia/",
        RegistrarAsistencia.as_view(),
        name="registrar-asistencia",
    ),

    path(
        "api/intereses/evento/<int:evento_id>/",
        InteresPorEventos.as_view(),
        name="asistencia-por-evento",
    ),
    path(
        "api/intereses/usuario/<int:usuario_id>/",
        InteresPorUsuario.as_view(),
        name="asistencia-por-usuario",
    ),
    path(
        "api/registrar-interes/",
        RegistrarInteres.as_view(),
        name="registrar-asistencia",
    ),
    path(
        'api/interes/quitar/<int:usuario_id>/<int:evento_id>/', 
        EliminarInteres.as_view(), 
        name='eliminar_interes'
    ),

    # Enpoints de valoraciones del evento
    path(
        "api/registrar-valoracion-evento/",
        RegistrarValoracionEvento.as_view(),
        name="registrar-valoracion-evento",
    ),
    path(
        "api/valoraciones_eventos/evento/<int:evento_id>/",
        ValoracionesPorEvento.as_view(),
        name="valoraciones-por-evento",
    ),

    
    # Enpoints de tokes y notificaciones
    path('api/actualizar_token/', actualizar_token, name='actualizar_token'),
    
    path('api/enviar-notificacion/', prueba_enviar_notificaciones, name='enviar_notificacion'),

    # Endpoints de login y auxiliar de imagenes
    path('api/logear_usuario/', LoginUsuario.as_view(), name='logear-usuario'),
    path('api/imagen/<int:imagen_id>/', ImagenDetailView.as_view(), name='imagen-detalle'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
