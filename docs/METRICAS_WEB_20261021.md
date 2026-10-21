# Métricas de la web comercial

Cuenta verificada en la interfaz: `fconuva@gmail.com`. Propiedad GA4 **Profe Francisco | Portafolios**, ID `559976412`, separada de Estudia CEST. Zona horaria Chile y moneda CLP. Flujo **Web Profe Francisco**, ID `16174928880`, dominio `https://www.profefranciscopancho.com`, medición `G-TPX8R8EP26`.

La etiqueta solo funciona en la portada y en crear cuenta. El consentimiento es previo a la descarga de Google Analytics y se puede retirar. No se miden admin, dashboard ni estudiantes; no se leen campos, UID, RUT, teléfono, nombres ni correos. La URL enviada no lleva consulta ni fragmento y se omite la referencia de navegación. Google Signals y personalización publicitaria desactivados en el código. La medición mejorada del flujo está desactivada para evitar formularios automáticos.

| Evento | Qué demuestra | Parámetros |
|---|---|---|
| `page_view` | Vista consentida de una página pública medida | Ruta sin parámetros |
| `pricing_viewed` | La sección de precios entró en pantalla | `location: prices` |
| `registration_clicked` | Clic hacia crear cuenta | Ubicación del enlace |
| `whatsapp_clicked` | Clic al enlace de WhatsApp; no prueba mensaje enviado | Ubicación del enlace |
| `sign_up` | Registro nuevo completado, después de guardar los datos | `method: email` o `google` |

No confundir un clic con una inscripción ni con una venta. No hay evento de compra sin pago confirmado. La medición nunca bloquea el registro: continúa aunque la etiqueta esté bloqueada o tarde en responder. Pruebas con datos ficticios; no se crean clientes de prueba en producción.

Validación: `node --test tests/marketing-metrics.test.js`. La verificación de recepción en producción se registra al publicar.

En GA4, `sign_up` está marcado como evento clave sin asignarle un valor monetario. Se creó la dimensión de evento **Ubicación del botón** (`location`) para comparar los enlaces de cada sección. La recogida mejorada está desactivada; los eventos se emiten desde la integración controlada.

Tag Manager abrió una pantalla vacía con la cuenta correcta, incluso después de recargar y fijar `authuser=0`. La medición se implementó con la etiqueta oficial directa de GA4 para no dejarla detenida ni duplicar etiquetas. No hay un contenedor GTM instalado.

## Comprobado en producción, 21 de octubre

- Despliegue `dpl_F9skivprjv2SUnsvVtFMHjg15W7r`, estado READY, código `45c549bae2819cd869c800032a5513bdb5fe21d8`.
- El dominio público devuelve la configuración y los dos puntos de registro (Google y correo); el acceso Google espera a que termine la persistencia.
- GA4 en tiempo real muestra la visita consentida de comprobación y `page_view=1`, `pricing_viewed=1`. No son visitantes comerciales: es la prueba de esta sesión. No se creó ninguna cuenta ni pago ficticio para generar una conversión.
- Nueve pruebas locales: consentimiento, filtrado de datos y rutas, conteo, continuidad sin etiqueta y Google nuevo/existente/fallido.
- Evidencia local: `C:/dev/artifacts/profefranciscopancho-20261021/ga4-tiempo-real.jpg`.
- Panel: <https://analytics.google.com/analytics/web/#/a361737299p559976412/reports/realtime>.
