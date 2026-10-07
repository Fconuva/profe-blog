# Acceso individual de revisión

El juego publicado conserva su colección inicial de 16 cartas. El diseño ampliado de 60 cartas sigue en planificación.

El ingreso de cartas usa Firebase Auth mediante `sesion.js` y el cliente común de PAES, pero su autorización procede del servidor de cartas. No usa como condición el roster ni la habilitación de Mi espacio. El resto del portal conserva su sesión original.

Una cuenta activa fuera de los cuatro cursos estudiantiles PAES puede recibir un permiso individual privado en `plataforma_paes/cartas_config/revisores/{uid}` con `enabled: true` y `curso` coincidente con su perfil canónico. El UID se obtiene del token autenticado; un cliente no puede elegir a quién corresponde el permiso. Una cuenta inactiva, permiso revocado o curso divergente se rechazan. No se modifica el curso del perfil para dar acceso.

El permiso permite entrar a la actividad y operar sobre su propio intento; no concede administración, claves, escritos de otras personas ni ingreso a salas de otro curso. La interfaz muestra «Revisión docente» y conserva el curso. Deshabilitar el permiso impide nuevo acceso fuera del alcance estudiantil normal, sin borrar sus respuestas.

Solo el principal aplica un permiso real solicitado por Francisco: identificar una única cuenta por RUN/UID, simular, respaldar la configuración previa en `backups/` privado, modificar ese nodo individual y releer. Ningún identificador real entra en este documento, pruebas, capturas o Git. No restablecer contraseña ni inventar respuestas para demostrar acceso.

Verificación de esta modificación: auditoría focalizada de 174 comprobaciones; UI y API locales con perfiles ficticios, revisor de 2.º HC, autoguardado y recuperación al recargar, controles de lecturas/colección y vistas de 390/3840 CSS px sin desborde. El acceso real exige la contraseña vigente del propietario; la prueba ficticia no se presenta como ingreso a su cuenta real.
