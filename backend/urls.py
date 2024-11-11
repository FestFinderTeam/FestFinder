from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from api.views import SubirImagen
from api.views import AgregarTipoEstablecimiento
from api.views import ListarTiposEstablecimiento
from api.views.Establecimiento_Vista import EstablecimientoPorUsuario, EstablecimientosSimilares, ListarEstablecimientosPorTipo, RecuperarDatosEstablecimiento, RegistrarEstablecimiento, ListarEstablecimientos
from api.views.Etiqueta_Vista import CrearEtiqueta, ListarEtiquetas
from api.views.EtiquetaEstablecimiento_Vista import (
    RegistrarRelacion,
    EtiquetasPorEstablecimiento,
    EstablecimientosPorEtiqueta,
)
from api.views.Genero_Evento_Vista import CrearGeneroEvento, ListarGenerosEvento
from api.views.Evento_Vista import CrearEvento, ListarEventos, ListarEventosHoy, ListarEventosMes, ListarEventosPorEstablecimiento, ObtenerEventoPorID
from api.views.Entrada_Vista import CrearEntrada, ListarEntradasEvento
from api.views.Consumo_Vista import CrearConsumo, ListarConsumosPorEstablecimiento
from api.views.HorariosEstablecimiento_Vista import RecuperarHorarios, RecuperarHorariosPorEstablecimiento, RegistrarHorarioEstablecimiento
from api.views.Imagen_Vista import ImagenDetailView
from api.views.Usuario_Vista import CrearUsuario, ListarUsuarios, LoginUsuario
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

urlpatterns = [
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
    path("api/categorias-establecimientos/", ListarTiposEstablecimiento.as_view(), name="listar-categorias-establecimiento"),
    path("api/establecimiento/", RegistrarEstablecimiento.as_view(), name="registrar-establecimiento"),
    path("api/establecimientos/", ListarEstablecimientos.as_view(), name="listar-establecimiento"),
    path("api/establecimiento/est_id/<int:est_id>/", RecuperarDatosEstablecimiento.as_view(), name="recuperar-establecimiento"),
    path("api/establecimiento/propietario/<int:usuario_id>/", EstablecimientoPorUsuario.as_view(), name="recuperar-mi-establecimiento"),
    path('api/establecimientos/tipo/<int:tipo_id>/', ListarEstablecimientosPorTipo.as_view(), name='establecimientos_por_tipo'),
    path('api/establecimientos/<int:establecimiento_id>/horarios/', RecuperarHorariosPorEstablecimiento.as_view(), name='recuperar_horarios'),
    path('api/establecimientos/horarios/registrar/', RegistrarHorarioEstablecimiento.as_view(), name='registrar_horario'),
    path('api/establecimientos-similares/<int:est_id>/', EstablecimientosSimilares.as_view(), name='establecimientos-similares'),
    path('api/establecimientos/horarios/', RecuperarHorarios.as_view(), name='recuperar_todos_los_horarios'),
    path("api/genero-evento/", CrearGeneroEvento.as_view(), name="crear-genero-evento"),
    path(
        "api/generos-evento/",
        ListarGenerosEvento.as_view(),
        name="listar-generos-evento",
    ),
    path("api/evento/", CrearEvento.as_view(), name="crear-evento"),
    path("api/eventos/", ListarEventos.as_view(), name="listar-eventos"),
    path('api/eventos_mes/', ListarEventosMes.as_view(), name='eventos-mes'),
    path('api/eventos_hoy/', ListarEventosHoy.as_view(), name='eventos-hoy'),
    path('api/eventos/<int:id>/', ObtenerEventoPorID.as_view(), name='obtener_evento_por_id'),
    path('api/eventos/establecimiento/<int:id_establecimiento>/', ListarEventosPorEstablecimiento.as_view(), name='listar-eventos-por-establecimiento'),

    path("entrada/", CrearEntrada.as_view(), name="crear-entrada"),
    path(
        "entradas/evento/<int:id_evento>/",
        ListarEntradasEvento.as_view(),
        name="listar-entradas-evento",
    ),
    path("api/consumo/", CrearConsumo.as_view(), name="crear-consumo"),
    path(
        "api/consumos/establecimiento/<int:establecimiento_id>/",
        ListarConsumosPorEstablecimiento.as_view(),
        name="listar-consumos-por-establecimiento",
    ),
    path("api/usuario/", CrearUsuario.as_view(), name="crear-usuario"),
    path("api/usuarios/", ListarUsuarios.as_view(), name="listar-usuarios"),
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
        "api/registrar-valoracion-evento/",
        RegistrarValoracionEvento.as_view(),
        name="registrar-valoracion-evento",
    ),
    path(
        "api/valoraciones_eventos/evento/<int:evento_id>/",
        ValoracionesPorEvento.as_view(),
        name="valoraciones-por-evento",
    ),
    
    path('api/logear_usuario/', LoginUsuario.as_view(), name='logear-usuario'),
    path('api/imagen/<int:imagen_id>/', ImagenDetailView.as_view(), name='imagen-detalle'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
