# Limpieza y reducción de solicitudes de Vercel · 22 de octubre de 2026

Francisco autoriza la ejecución del plan de limpieza y optimización. Equipo
`fconuvas-projects`, plan Hobby; proyecto académico `estudiacest` comprobado
contra `.vercel/project.json` y la API autenticada.

## Diagnóstico comprobado

- Aviso más reciente: 75 % del millón de solicitudes CDN incluidas. El panel
  de los últimos treinta días muestra 835.086 solicitudes; 637.907 corresponden
  a Estudia CEST y 186.525 a la web del profesor.
- El mismo panel muestra 6,05 GB de Deployment Storage y 539,7 MB de Functions
  Storage. Hay un aviso anterior de almacenamiento completo. Esas métricas
  históricas no son una medición del espacio liberado en esta operación.
- Se inventarían trece proyectos y veintiocho despliegues activos. Se cotejan
  los alias actuales por API: el campo `alias` de un despliegue antiguo conserva
  nombres históricos y no demuestra que todavía los atienda.

## Limpieza ejecutada

- Retirados siete despliegues antiguos sin alias activo, con `vercel remove`
  por identificadores explícitos y `--safe`.
- Retiradas cuatro vistas previas: tres de ramas de julio que ya no existen
  en el remoto y la copia de la portada cuya rama ya coincide con `main`.
  Se conservan el despliegue activo y dos respaldos de producción de cada web.
- Se conserva la vista previa `ecep-ortografia`: su rama remota sigue existiendo
  y no está integrada. Tampoco se eliminan despliegues nuevos de otros agentes.
- Eliminados los proyectos temporales
  `estudiacest-simce-scores-20260525-134813` y
  `profefconuva-homefix-deploy-1778683028`, sin tráfico en el desglose del período,
  sin variables de entorno, repositorio conectado ni dominio personalizado.
  Cada uno conservaba un despliegue antiguo.
- Eliminados cinco proyectos sin despliegues, variables ni repositorio:
  `v0-new-project-coauorkfkgz`, `2026`, `src-restored`,
  `v0-new-project-dtoyhyqokdq` y `v0-web`.
- Resultado: siete proyectos retirados y trece despliegues retirados en total.
  Quedan seis proyectos. La relectura inmediata muestra dieciséis despliegues:
  apareció uno nuevo de la web del profesor durante el trabajo y se preservó.
  Los ocho alias de dominios personalizados conservan sus destinos.

Inventario previo/posterior, selección de identificadores y copias de la
configuración de los proyectos retirados en
`C:/dev/profe-blog/scratch/vercel-clean-20261022/`, fuera de Git y del sitio.
Los once despliegues eliminados individualmente pueden buscarse en Vercel,
Settings → Security → Recently Deleted, durante el plazo de recuperación que
muestre el producto. Las copias de configuración de proyectos son antecedentes
para reconstrucción; no garantizan recuperar sus identificadores o URLs.

## Reducción de peticiones

- `estudiantes/js/mi-espacio.js`: estado de casas (cada quince segundos) e
  inventario (cada minuto) dejan de consultarse con la pestaña oculta. Al
  volver se actualizan, y una consulta pendiente se comparte para evitar
  superposición. Se conservan latido, presencia, movimiento y guardados.
  Potencial: evitar hasta trescientas peticiones por hora de pestaña oculta,
  antes de considerar las restricciones de temporizadores del navegador.
- `vercel.json`: imágenes y fuentes estáticas permiten caché del navegador
  durante una hora. No se aplica esa regla a HTML, JavaScript, JSON, PDF ni API.
  No se utiliza `immutable`: una sustitución con la misma ruta puede tardar
  hasta una hora en verse sin recarga forzada.

La limpieza no descuenta las solicitudes CDN ya consumidas. El ahorro total
deberá observarse en uso posterior; no se proyecta un porcentaje sin medición.
La política automática existente de treinta días permanece vigente.

## Validación

- Nueve comprobaciones nuevas en la auditoría existente de Mi Espacio: pausa,
  retorno, consultas pendientes, intervalos únicos y recuperación tras error.
- Auditorías de Mi Espacio, integración PAES y social aprobadas.
- Patrón de caché probado con imágenes y fuentes; HTML, JS y API excluidos.
- Build integral aprobado con 845 recursos críticos.
- Publicación mediante `npm run deploy:prod:safe`, proceso terminado con código
  cero: `dpl_F1C57XzQHwpSu4cMTbjqfrCjvPpD` READY y alias público al commit
  `8d6b57489672d6d94b99ee2c84e74ce7041e1982`.
- Encabezados públicos comprobados: imágenes/fuentes con `max-age=3600`,
  HTML/JS con revalidación y API anónima 401 con `no-store`. JS idéntico por SHA-256.
- Navegación normal: tres recursos repetidos se sirven del caché del navegador
  sin transferencia de red; no hay errores ni desbordes en 390/1440/3840.
- Sala compartida con Firebase/API reales y cuatro cuentas técnicas: tres
  participantes, reto/chat, aislamiento por curso y regreso a casa; cuatro
  recursos públicos coinciden con la fuente. 390/1200/3840 sin errores.
  Cuentas y registros de prueba retirados con relectura de limpieza.
- Cinco dominios personalizados responden HTTP 200. Capturas públicas y de las
  cuentas técnicas abiertas y revisadas. Cambios concurrentes de la portada
  integrados antes del cierre documental, sin otro despliegue académico.
