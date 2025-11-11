#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generador del Test de Historia Media ECEP 2025
50 preguntas distribuidas en 4 dominios
"""

contenido = """---
layout: layout-evaluaciones.njk
title: "Test Historia, Geografía y Ciencias Sociales - Educación Media ECEP 2025"
description: "Evaluación completa con 50 preguntas para preparar la ECEP 2025 en Historia."
---

<div class="container-fluid py-4" style="max-width: 1400px;">
  
  <!-- Header del Test -->
  <div class="text-center mb-4">
    <h1 class="display-5 fw-bold mb-3">
      <i class="bi bi-clock-history text-warning"></i>
      Test Historia Media ECEP 2025
    </h1>
    <p class="lead text-muted">50 preguntas · 4 Dominios · Retroalimentación pedagógica</p>
    
    <div class="d-flex justify-content-center gap-3 mb-3 flex-wrap">
      <a href="/evaluaciones/educacion-media/estudio/dossier-historia-media/" class="btn btn-outline-primary btn-sm">
        <i class="bi bi-book"></i> Ver Dossier de Estudio
      </a>
      <a href="/evaluaciones/" class="btn btn-outline-secondary btn-sm">
        <i class="bi bi-arrow-left"></i> Volver
      </a>
    </div>
  </div>

  <!-- Instrucciones -->
  <div class="alert alert-info">
    <h5><i class="bi bi-info-circle"></i> Instrucciones</h5>
    <ul class="mb-0">
      <li>Este test tiene <strong>50 preguntas</strong> de opción múltiple</li>
      <li>Cada pregunta tiene <strong>4 alternativas</strong> (solo una correcta)</li>
      <li>Al finalizar obtendrás <strong>retroalimentación pedagógica</strong> detallada</li>
      <li>Puedes consultar el <strong>Dossier de Historia</strong> en cualquier momento</li>
    </ul>
  </div>

  <!-- Contenedor del Quiz -->
  <div id="quiz-container" class="bg-white rounded shadow-sm p-4 mb-4"></div>
  
  <!-- Botones de navegación -->
  <div class="d-flex justify-content-between mb-4">
    <button id="prev-btn" class="btn btn-outline-secondary" disabled>
      <i class="bi bi-arrow-left"></i> Anterior
    </button>
    <div id="question-counter" class="fw-bold"></div>
    <button id="next-btn" class="btn btn-primary">
      Siguiente <i class="bi bi-arrow-right"></i>
    </button>
  </div>

  <!-- Botón finalizar -->
  <div id="finish-container" class="text-center mb-4" style="display: none;">
    <button id="finish-btn" class="btn btn-success btn-lg">
      <i class="bi bi-check-circle"></i> Finalizar Test
    </button>
  </div>

  <!-- Resultados -->
  <div id="results-container" style="display: none;" class="bg-light rounded p-4 mb-4"></div>

</div>

<script>
// Base de datos de preguntas
const quizData = {
  preguntas: [
    
    // ========== DOMINIO 1: PENSAMIENTO GEOGRÁFICO (12 preguntas) ==========
    
    {
      id: 1,
      dominio: "Dominio 1.1 - Representaciones Espaciales",
      enunciado: "Un profesor muestra un mapa topográfico de la zona central de Chile y pide a sus estudiantes identificar áreas con pendiente pronunciada. ¿Qué elemento del mapa deben analizar?",
      alternativas: [
        "La escala numérica del mapa",
        "La separación entre las curvas de nivel",
        "La orientación del norte magnético",
        "Los símbolos de vegetación"
      ],
      correcta: 1,
      explicacion: "Las curvas de nivel cercanas indican pendiente pronunciada (terreno abrupto), mientras que curvas separadas indican pendiente suave. Este es un concepto clave del análisis topográfico."
    },
    
    {
      id: 2,
      dominio: "Dominio 1.1 - Representaciones Espaciales",
      enunciado: "¿Cuál es la principal diferencia entre un mapa político y un mapa físico de Chile?",
      alternativas: [
        "El mapa político muestra fronteras y divisiones administrativas; el físico muestra relieve y elementos naturales",
        "El mapa político usa colores cálidos; el físico usa colores fríos",
        "El mapa político tiene escala grande; el físico tiene escala pequeña",
        "El mapa político es más antiguo que el mapa físico"
      ],
      correcta: 0,
      explicacion: "Los mapas políticos representan organización territorial humana (regiones, comunas, fronteras), mientras los físicos muestran características naturales (cordilleras, ríos, climas)."
    },

    {
      id: 3,
      dominio: "Dominio 1.2 - Relación Ser Humano-Medio",
      enunciado: "La construcción de terrazas agrícolas en zonas de pendiente, como las utilizadas por culturas andinas precolombinas, es un ejemplo de:",
      alternativas: [
        "Determinismo geográfico absoluto",
        "Adaptación humana al medio natural",
        "Degradación ambiental irreversible",
        "Migración forzada por factores climáticos"
      ],
      correcta: 1,
      explicacion: "Las terrazas agrícolas (andenes) demuestran cómo las sociedades adaptan el territorio a sus necesidades, modificando el relieve para permitir agricultura en zonas montañosas."
    },

    {
      id: 4,
      dominio: "Dominio 1.2 - Clima y Zonas de Chile",
      enunciado: "¿Qué zona natural de Chile se caracteriza por tener clima mediterráneo con estación seca prolongada y concentración de lluvias en invierno?",
      alternativas: [
        "Norte Grande (Desierto de Atacama)",
        "Zona Central (Valparaíso, Santiago, Rancagua)",
        "Zona Sur (Temuco, Valdivia, Osorno)",
        "Zona Austral (Magallanes, Tierra del Fuego)"
      ],
      correcta: 1,
      explicacion: "La Zona Central tiene clima mediterráneo: veranos secos y calurosos, inviernos lluviosos y templados. Es la zona más poblada y con mayor desarrollo agrícola de Chile."
    },

    {
      id: 5,
      dominio: "Dominio 1.2 - Recursos Naturales",
      enunciado: "El salitre fue un recurso natural estratégico para Chile entre 1880 y 1930. ¿Qué acontecimiento histórico permitió a Chile controlar los principales yacimientos salitreros?",
      alternativas: [
        "La Independencia de Chile (1818)",
        "La Guerra contra la Confederación Perú-Boliviana (1836-1839)",
        "La Guerra del Pacífico (1879-1883)",
        "La firma del Tratado de Ancón (1929)"
      ],
      correcta: 2,
      explicacion: "La Guerra del Pacífico permitió a Chile anexar las regiones de Tarapacá y Antofagasta, ricas en salitre. Esto generó la 'bonanza salitrera' que impulsó la economía chilena hasta 1930."
    },

    {
      id: 6,
      dominio: "Dominio 1.2 - Riesgos Naturales",
      enunciado: "Chile es uno de los países más sísmicos del mundo debido a:",
      alternativas: [
        "La presencia del desierto de Atacama en el norte",
        "El contacto de múltiples zonas climáticas",
        "La subducción de la placa de Nazca bajo la placa Sudamericana",
        "La erosión glaciar de la zona austral"
      ],
      correcta: 2,
      explicacion: "Chile está en el Cinturón de Fuego del Pacífico. La placa de Nazca subduce bajo la Sudamericana, generando frecuente actividad sísmica y volcánica (megaterremotos 1960, 2010)."
    },

    {
      id: 7,
      dominio: "Dominio 1.1 - Escalas Geográficas",
      enunciado: "Un mapa con escala 1:50.000 significa que:",
      alternativas: [
        "Cada centímetro del mapa representa 50.000 centímetros (500 metros) en la realidad",
        "El mapa mide exactamente 50.000 cm²",
        "Solo muestra territorios mayores a 50.000 km²",
        "Fue elaborado hace 50.000 años"
      ],
      correcta: 0,
      explicacion: "La escala 1:50.000 indica que 1 cm en el mapa equivale a 50.000 cm reales (500 m). Es una escala grande, útil para mapas topográficos detallados de áreas pequeñas."
    },

    {
      id: 8,
      dominio: "Dominio 1.2 - Geografía de Chile",
      enunciado: "¿Cuál de las siguientes afirmaciones sobre la Cordillera de los Andes en Chile es CORRECTA?",
      alternativas: [
        "Alcanza su mayor altura en el extremo sur (Magallanes)",
        "Es más baja en el norte y aumenta su altura hacia el sur",
        "Presenta cumbres sobre 6.000 metros en el norte y centro, disminuyendo al sur",
        "Tiene alturas uniformes a lo largo de todo Chile"
      ],
      correcta: 2,
      explicacion: "Los Andes alcanzan máximas alturas en el norte (Ojos del Salado 6.893m) y centro (Aconcagua 6.962m en frontera). Al sur disminuyen progresivamente hasta sumergirse en el mar."
    },

    {
      id: 9,
      dominio: "Dominio 1.2 - Medio Ambiente",
      enunciado: "La sequía prolongada que afecta a la zona centro-norte de Chile desde 2010 ha generado múltiples consecuencias. ¿Cuál de las siguientes es una medida de ADAPTACIÓN (no mitigación) frente a este fenómeno?",
      alternativas: [
        "Reducir las emisiones de gases de efecto invernadero",
        "Implementar sistemas de riego tecnificado por goteo",
        "Plantar más árboles para capturar CO2",
        "Prohibir completamente el uso de combustibles fósiles"
      ],
      correcta: 1,
      explicacion: "Adaptación = ajustarse a las nuevas condiciones (riego eficiente, cultivos resistentes). Mitigación = reducir causas del cambio climático (menos emisiones). El riego tecnificado optimiza el uso del agua escasa."
    },

    {
      id: 10,
      dominio: "Dominio 1.2 - Población y Territorio",
      enunciado: "La alta concentración de población en Santiago (región Metropolitana concentra ~40% población nacional) genera desafíos como:",
      alternativas: [
        "Despoblamiento total de regiones extremas",
        "Sobrecarga de servicios urbanos, contaminación, segregación espacial",
        "Aumento de la ruralidad en la zona central",
        "Desaparición de ciudades intermedias"
      ],
      correcta: 1,
      explicacion: "La macrocefalia urbana (concentración excesiva en una ciudad) genera problemas: congestión vehicular, contaminación atmosférica, déficit habitacional, desigualdad territorial, colapso transporte."
    },

    {
      id: 11,
      dominio: "Dominio 1.2 - Desarrollo Sustentable",
      enunciado: "¿Cuál de las siguientes prácticas representa un desarrollo económico SUSTENTABLE en zonas costeras de Chile?",
      alternativas: [
        "Pesca industrial sin límites de captura para maximizar exportaciones",
        "Construcción masiva de edificios en playas sin planificación territorial",
        "Implementación de áreas marinas protegidas y cuotas de pesca científicas",
        "Extracción ilimitada de algas sin periodos de veda"
      ],
      correcta: 2,
      explicacion: "Desarrollo sustentable equilibra economía, sociedad y medio ambiente. Las áreas marinas protegidas y cuotas basadas en estudios científicos permiten conservar recursos para generaciones futuras."
    },

    {
      id: 12,
      dominio: "Dominio 1.1 - Cartografía Digital",
      enunciado: "Un profesor utiliza Google Earth para que sus estudiantes analicen el crecimiento urbano de Santiago entre 1990 y 2020. ¿Qué habilidad geográfica están desarrollando principalmente?",
      alternativas: [
        "Memorización de nombres de comunas",
        "Análisis de cambios territoriales en el tiempo (dimensión temporal del espacio)",
        "Cálculo de coordenadas geográficas exactas",
        "Identificación de símbolos cartográficos tradicionales"
      ],
      correcta: 1,
      explicacion: "El uso de imágenes satelitales históricas permite analizar transformaciones espaciales temporales: expansión urbana, pérdida de áreas agrícolas, cambios ambientales. Esto desarrolla pensamiento geográfico dinámico."
    },

    // ========== DOMINIO 2: PENSAMIENTO HISTÓRICO (15 preguntas) ==========

    {
      id: 13,
      dominio: "Dominio 2.1 - Pensamiento Temporal",
      enunciado: "Un estudiante afirma: 'La Independencia de Chile (1818) ocurrió mientras en Europa se desarrollaban las guerras napoleónicas y EEUU ya era independiente desde 1776'. Este estudiante está aplicando el concepto de:",
      alternativas: [
        "Anacronismo histórico",
        "Simultaneidad de procesos históricos",
        "Determinismo geográfico",
        "Empatía histórica"
      ],
      correcta: 1,
      explicacion: "La simultaneidad reconoce que diferentes procesos históricos ocurren al mismo tiempo en distintos lugares. Comprender estas conexiones temporales es clave del pensamiento histórico."
    },

    {
      id: 14,
      dominio: "Dominio 2.1 - Historiografía",
      enunciado: "¿Qué corriente historiográfica interpreta la Independencia de Chile como un conflicto entre la burguesía criolla y la aristocracia española, enfatizando factores económicos y lucha de clases?",
      alternativas: [
        "Positivismo (Diego Barros Arana)",
        "Materialismo histórico (Luis Vitale)",
        "Escuela de los Annales (Fernand Braudel)",
        "Historia cultural (Peter Burke)"
      ],
      correcta: 1,
      explicacion: "El materialismo histórico (marxista) analiza la historia desde la base económica y conflictos de clase. Luis Vitale interpretó la independencia como lucha de criollos (clase emergente) contra españoles (aristocracia colonial)."
    },

    {
      id: 15,
      dominio: "Dominio 2.2 - Independencia de Chile",
      enunciado: "¿Cuál fue la principal consecuencia geopolítica de la Batalla de Maipú (5 de abril de 1818)?",
      alternativas: [
        "Consolidó la independencia de Chile al derrotar definitivamente al ejército realista",
        "Declaró la guerra contra España peninsular",
        "Inició la Patria Vieja",
        "Provocó la renuncia de Bernardo O'Higgins"
      ],
      correcta: 0,
      explicacion: "La Batalla de Maipú fue decisiva: aseguró la independencia al destruir el poder militar español en Chile. Aunque la declaración formal fue el 12 de febrero 1818, Maipú la consolidó militarmente."
    },

    {
      id: 16,
      dominio: "Dominio 2.2 - República de Chile",
      enunciado: "La Constitución de 1833 (Portaliana) estableció en Chile:",
      alternativas: [
        "Un sistema federal con autonomía regional",
        "Sufragio universal para todos los ciudadanos",
        "Un régimen presidencialista autoritario con ejecutivo fuerte",
        "Separación total entre Iglesia y Estado"
      ],
      correcta: 2,
      explicacion: "La Constitución 1833 creó un régimen presidencialista fuerte: presidente reelegible, veto, facultades extraordinarias, voto censitario, Estado confesional católico. Rigió hasta 1925."
    },

    {
      id: 17,
      dominio: "Dominio 2.2 - Guerra del Pacífico",
      enunciado: "Como resultado de la Guerra del Pacífico (1879-1883), Chile:",
      alternativas: [
        "Perdió la provincia de Tarapacá ante Perú",
        "Anexó las regiones de Tarapacá y Antofagasta, ricas en salitre",
        "Devolvió Arica a Bolivia en el Tratado de 1904",
        "Se alió permanentemente con Perú contra Bolivia"
      ],
      correcta: 1,
      explicacion: "Chile ganó: Tarapacá (Perú) y Antofagasta (Bolivia), controlando yacimientos de salitre. Bolivia perdió su salida al mar. Tratado Ancón (1883) con Perú, Tratado 1904 con Bolivia."
    },

    {
      id: 18,
      dominio: "Dominio 2.2 - Cuestión Social",
      enunciado: "La 'Cuestión Social' en Chile (1880-1920) se refiere a:",
      alternativas: [
        "El debate sobre el sufragio femenino",
        "Los problemas sociales de obreros: vivienda insalubre, explotación laboral, falta de derechos",
        "La guerra civil de 1891",
        "La discusión sobre la separación Iglesia-Estado"
      ],
      correcta: 1,
      explicacion: "La Cuestión Social abarca los problemas de la clase trabajadora durante la bonanza salitrera: hacinamiento, trabajo infantil, salarios bajos, enfermedades. Generó movimiento obrero y huelgas (Escuela Santa María 1907)."
    },

    {
      id: 19,
      dominio: "Dominio 2.2 - Chile Siglo XX",
      enunciado: "El gobierno de la Unidad Popular (1970-1973) liderado por Salvador Allende se caracterizó por:",
      alternativas: [
        "Implementar un modelo económico neoliberal",
        "Nacionalizar el cobre y profundizar la reforma agraria (Vía Chilena al Socialismo)",
        "Prohibir todos los partidos políticos",
        "Firmar el Tratado de Libre Comercio con EEUU"
      ],
      correcta: 1,
      explicacion: "La UP buscó transitar al socialismo por vía democrática: nacionalizó cobre (1971), aceleró reforma agraria, creó área social de economía. Generó polarización que culminó en golpe 1973."
    },

    {
      id: 20,
      dominio: "Dominio 2.2 - Dictadura Militar",
      enunciado: "¿Cuál fue una de las principales consecuencias del golpe de Estado del 11 de septiembre de 1973 en Chile?",
      alternativas: [
        "Restauración inmediata de la democracia parlamentaria",
        "Violaciones sistemáticas de derechos humanos y 17 años de dictadura",
        "Nacionalización de todas las empresas extranjeras",
        "Implementación del socialismo de Estado"
      ],
      correcta: 1,
      explicacion: "El golpe militar inició una dictadura (1973-1990) con graves violaciones DDHH: ~3.000 ejecutados/desaparecidos, tortura, exilio. Implementó modelo neoliberal y Constitución 1980."
    },

    {
      id: 21,
      dominio: "Dominio 2.2 - Retorno Democracia",
      enunciado: "El plebiscito del 5 de octubre de 1988 en Chile determinó:",
      alternativas: [
        "La aprobación de la Constitución de 1980",
        "El rechazo a la continuidad de Pinochet, abriendo paso a elecciones democráticas",
        "La anexión de nuevos territorios",
        "La separación de la Iglesia y el Estado"
      ],
      correcta: 1,
      explicacion: "El plebiscito preguntó si Pinochet continuaba 8 años más. El 'NO' ganó (55%), forzando elecciones democráticas 1989. Patricio Aylwin asumió en 1990, iniciando la transición."
    },

    {
      id: 22,
      dominio: "Dominio 2.3 - Revolución Industrial",
      enunciado: "¿Cuál fue una consecuencia SOCIAL de la Primera Revolución Industrial en Inglaterra (1760-1840)?",
      alternativas: [
        "Desaparición total de las ciudades",
        "Surgimiento del proletariado industrial y explotación laboral masiva",
        "Eliminación del comercio internacional",
        "Retorno a la agricultura medieval"
      ],
      correcta: 1,
      explicacion: "La industrialización creó nueva clase social: proletariado urbano (obreros asalariados). Sufrieron explotación: jornadas 14-16 hrs, trabajo infantil, salarios míseros, hacinamiento, sin derechos laborales."
    },

    {
      id: 23,
      dominio: "Dominio 2.3 - Imperialismo",
      enunciado: "La Conferencia de Berlín (1884-1885) tuvo como objetivo:",
      alternativas: [
        "Dividir África entre potencias europeas sin consultar a los africanos",
        "Abolir la esclavitud en América",
        "Crear la Organización de Naciones Unidas",
        "Firmar la paz tras la Primera Guerra Mundial"
      ],
      correcta: 0,
      explicacion: "La Conferencia de Berlín repartió África entre potencias europeas (Alemania, Francia, Reino Unido, Bélgica). Creó fronteras artificiales que ignoraron etnias, causando conflictos que perduran hoy."
    },

    {
      id: 24,
      dominio: "Dominio 2.3 - Primera Guerra Mundial",
      enunciado: "El asesinato del archiduque Francisco Fernando en Sarajevo (28 junio 1914) fue:",
      alternativas: [
        "La única causa de la Primera Guerra Mundial",
        "El detonante inmediato de la guerra, aunque existían causas estructurales previas",
        "Un evento sin relación con la guerra",
        "El final de la Primera Guerra Mundial"
      ],
      correcta: 1,
      explicacion: "El asesinato fue el DETONANTE, pero había causas profundas: rivalidades imperialistas, nacionalismos, carrera armamentista, alianzas militares (Triple Entente vs Triple Alianza). El asesinato activó las alianzas."
    },

    {
      id: 25,
      dominio: "Dominio 2.3 - Totalitarismos",
      enunciado: "¿Qué característica comparten el fascismo italiano, el nazismo alemán y el estalinismo soviético?",
      alternativas: [
        "Todos promovían democracias liberales pluralistas",
        "Control total del Estado, partido único, culto al líder y represión violenta",
        "Defendían el libre mercado sin intervención estatal",
        "Rechazaban el uso de propaganda masiva"
      ],
      correcta: 1,
      explicacion: "Los totalitarismos (fascismo, nazismo, estalinismo) comparten: Estado omnipresente, partido único, líder carismático (Duce/Führer/Stalin), propaganda, policía secreta, represión sistemática, control ideológico total."
    },

    {
      id: 26,
      dominio: "Dominio 2.3 - Segunda Guerra Mundial",
      enunciado: "El Holocausto (Shoah) durante la Segunda Guerra Mundial consistió en:",
      alternativas: [
        "Una batalla naval decisiva en el Pacífico",
        "El genocidio sistemático de 6 millones de judíos por el régimen nazi",
        "La bomba atómica lanzada sobre Hiroshima",
        "El desembarco aliado en Normandía"
      ],
      correcta: 1,
      explicacion: "El Holocausto fue el genocidio planificado y sistemático de judíos europeos por el nazismo (también romaníes, homosexuales, discapacitados). Usó campos de exterminio (Auschwitz, Treblinka). Crimen contra la humanidad."
    },

    {
      id: 27,
      dominio: "Dominio 2.3 - Guerra Fría",
      enunciado: "Durante la Guerra Fría (1947-1991), el mundo se dividió en dos bloques antagónicos:",
      alternativas: [
        "Monárquico vs Republicano",
        "Capitalista (OTAN, liderado por EEUU) vs Comunista (Pacto Varsovia, liderado por URSS)",
        "Católico vs Protestante",
        "Agrario vs Industrial"
      ],
      correcta: 1,
      explicacion: "La Guerra Fría fue confrontación ideológica EEUU-URSS sin guerra directa: capitalismo/democracia vs comunismo/planificación. Generó conflictos indirectos (Corea, Vietnam), carrera armamentista, espacial."
    },

    // ========== DOMINIO 3: FORMACIÓN CIUDADANA (13 preguntas) ==========

    {
      id: 28,
      dominio: "Dominio 3.1 - Estado de Derecho",
      enunciado: "¿Cuál de los siguientes principios es fundamental en un Estado de Derecho?",
      alternativas: [
        "La voluntad del gobernante está por sobre la ley",
        "Todos (ciudadanos y autoridades) están sujetos a la ley",
        "Solo los ciudadanos deben respetar las leyes",
        "Las leyes pueden ignorarse en situaciones de crisis"
      ],
      correcta: 1,
      explicacion: "Estado de Derecho implica imperio de la ley: NADIE está por encima de ella (ni presidente ni jueces). La ley limita el poder y garantiza derechos. Se opone al autoritarismo y la arbitrariedad."
    },

    {
      id: 29,
      dominio: "Dominio 3.1 - Democracia",
      enunciado: "En una democracia representativa como la chilena, la soberanía reside en:",
      alternativas: [
        "El Presidente de la República exclusivamente",
        "Los partidos políticos",
        "El pueblo, que delega poder en autoridades electas",
        "Las Fuerzas Armadas"
      ],
      correcta: 2,
      explicacion: "En democracia representativa, el pueblo es soberano pero delega poder mediante elecciones. Autoridades (presidente, diputados, senadores) ejercen poder temporalmente, rindiendo cuentas a ciudadanos."
    },

    {
      id: 30,
      dominio: "Dominio 3.1 - Separación de Poderes",
      enunciado: "¿Cuál es la función principal del Poder Legislativo en Chile?",
      alternativas: [
        "Aplicar las leyes a casos concretos",
        "Crear, modificar y aprobar leyes, y fiscalizar al gobierno",
        "Administrar el Estado y ejecutar políticas públicas",
        "Juzgar delitos y resolver conflictos jurídicos"
      ],
      correcta: 1,
      explicacion: "El Poder Legislativo (Congreso: Cámara Diputados + Senado) crea leyes, aprueba presupuesto, fiscaliza gobierno (interpelaciones, comisiones), aprueba tratados. Control sobre Ejecutivo."
    },

    {
      id: 31,
      dominio: "Dominio 3.1 - Derechos Humanos",
      enunciado: "Los derechos humanos se caracterizan por ser:",
      alternativas: [
        "Universales, inalienables e indivisibles",
        "Otorgados por el Estado según conveniencia",
        "Aplicables solo en países desarrollados",
        "Revocables en tiempos de paz"
      ],
      correcta: 0,
      explicacion: "Derechos Humanos son: UNIVERSALES (todas las personas), INALIENABLES (no se pueden quitar), INDIVISIBLES (todos igual importantes: civiles, políticos, económicos, sociales, culturales). Inherentes a la dignidad humana."
    },

    {
      id: 32,
      dominio: "Dominio 3.1 - Participación Ciudadana",
      enunciado: "¿Cuál de las siguientes es una forma de participación ciudadana NO electoral en democracia?",
      alternativas: [
        "Votar en elecciones presidenciales",
        "Participar en plebiscitos",
        "Organizarse en juntas de vecinos, sindicatos o movimientos sociales",
        "Emitir el voto en elecciones municipales"
      ],
      correcta: 2,
      explicacion: "Participación NO electoral incluye: organizaciones sociales (juntas vecinos, sindicatos), manifestaciones, cabildos, peticiones, control ciudadano. Complementa la participación electoral (votar)."
    },

    {
      id: 33,
      dominio: "Dominio 3.1 - Constitución",
      enunciado: "La Constitución Política de un país es:",
      alternativas: [
        "Un conjunto de leyes ordinarias modificables por decreto",
        "La norma jurídica suprema que organiza el Estado y garantiza derechos fundamentales",
        "Una recomendación sin valor legal vinculante",
        "Un documento histórico sin aplicación actual"
      ],
      correcta: 1,
      explicacion: "La Constitución es la ley fundamental: superior a todas las demás. Establece organización del Estado (poderes, atribuciones), derechos/deberes ciudadanos, mecanismos reforma. Base del ordenamiento jurídico."
    },

    {
      id: 34,
      dominio: "Dominio 3.2 - Sistemas Económicos",
      enunciado: "¿Cuál es la principal diferencia entre economía de mercado y economía planificada?",
      alternativas: [
        "En economía de mercado el Estado controla precios y producción; en planificada, el mercado regula",
        "En economía de mercado la oferta/demanda determina precios; en planificada, el Estado planifica producción",
        "Ambas son idénticas en funcionamiento",
        "En economía planificada no existe ninguna regulación estatal"
      ],
      correcta: 1,
      explicacion: "Economía de MERCADO: oferta-demanda, propiedad privada, competencia (ej: Chile, EEUU). Economía PLANIFICADA: Estado decide qué/cuánto producir, precios fijados centralmente (ej: URSS, Cuba socialista)."
    },

    {
      id: 35,
      dominio: "Dominio 3.2 - Derechos Laborales",
      enunciado: "El derecho a sindicalización y negociación colectiva de los trabajadores está garantizado para:",
      alternativas: [
        "Proteger a los trabajadores y equilibrar el poder con los empleadores",
        "Aumentar las ganancias de las empresas",
        "Eliminar todos los conflictos laborales",
        "Reducir los salarios de los trabajadores"
      ],
      correcta: 0,
      explicacion: "El derecho a sindicalizarse y negociar colectivamente permite a trabajadores organizarse, defender sus intereses, negociar mejores condiciones laborales (salario, jornada, seguridad). Es un derecho fundamental laboral."
    },

    {
      id: 36,
      dominio: "Dominio 3.1 - Instituciones Chilenas",
      enunciado: "¿Qué institución en Chile es responsable de fiscalizar el uso de fondos públicos y la gestión financiera del Estado?",
      alternativas: [
        "El Tribunal Constitucional",
        "La Contraloría General de la República",
        "El Ministerio del Interior",
        "El Banco Central"
      ],
      correcta: 1,
      explicacion: "La Contraloría General fiscaliza legalidad de actos administrativos, controla ingresos/gastos públicos, audita servicios públicos. Es órgano autónomo que previene corrupción y mal uso de recursos."
    },

    {
      id: 37,
      dominio: "Dominio 3.1 - Partidos Políticos",
      enunciado: "En un sistema democrático, los partidos políticos cumplen la función de:",
      alternativas: [
        "Eliminar la diversidad de opiniones",
        "Concentrar todo el poder en una sola organización",
        "Representar diferentes ideologías y canalizar participación ciudadana",
        "Imponer una ideología única a toda la población"
      ],
      correcta: 2,
      explicacion: "Los partidos políticos agrupan ciudadanos con ideas afines, representan ideologías (izquierda, centro, derecha), presentan candidatos, proponen programas. Son canales de participación y pluralismo en democracia."
    },

    {
      id: 38,
      dominio: "Dominio 3.2 - Trabajo y Sociedad",
      enunciado: "El Código del Trabajo en Chile regula:",
      alternativas: [
        "Solo las relaciones comerciales entre empresas",
        "Las relaciones laborales entre empleadores y trabajadores (contratos, jornada, derechos)",
        "Únicamente los impuestos empresariales",
        "Las políticas de exportación"
      ],
      correcta: 1,
      explicacion: "El Código del Trabajo establece: tipos de contrato, jornada laboral máxima, descansos, vacaciones, salario mínimo, protección maternidad, causales despido, negociación colectiva, derechos/deberes laborales."
    },

    {
      id: 39,
      dominio: "Dominio 3.1 - Elecciones",
      enunciado: "Para que una elección sea considerada democrática, debe cumplir con:",
      alternativas: [
        "Participación obligatoria de toda la población",
        "Sufragio universal, secreto, informado y periódico",
        "Victoria del partido más antiguo",
        "Prohibición de fiscalización internacional"
      ],
      correcta: 1,
      explicacion: "Elecciones democráticas requieren: sufragio UNIVERSAL (todos ciudadanos), SECRETO (sin coacción), INFORMADO (acceso información), PERIÓDICO (renovación regular), COMPETITIVO (múltiples opciones), TRANSPARENTE (fiscalización)."
    },

    {
      id: 40,
      dominio: "Dominio 3.2 - Economía y Desigualdad",
      enunciado: "¿Cuál de las siguientes políticas públicas busca reducir la desigualdad económica en Chile?",
      alternativas: [
        "Eliminar todos los impuestos a las grandes fortunas",
        "Implementar subsidios y transferencias monetarias a sectores vulnerables (ej: Ingreso Familiar de Emergencia)",
        "Concentrar la inversión solo en regiones ricas",
        "Reducir el gasto en educación y salud pública"
      ],
      correcta: 1,
      explicacion: "Políticas redistributivas buscan reducir desigualdad: transferencias monetarias (subsidios, pensiones), impuestos progresivos, educación/salud pública gratuita, vivienda social. Objetivo: mayor equidad social."
    },

    // ========== DOMINIO 4: ENSEÑANZA-APRENDIZAJE (10 preguntas) ==========

    {
      id: 41,
      dominio: "Dominio 4.1 - Estrategias Enseñanza",
      enunciado: "Un profesor pide a sus estudiantes analizar DOS fuentes primarias contradictorias sobre la Guerra del Pacífico (una chilena y una peruana). ¿Qué habilidad histórica busca desarrollar principalmente?",
      alternativas: [
        "Memorización de fechas",
        "Pensamiento crítico y análisis de perspectivas múltiples",
        "Copia textual de documentos",
        "Rechazo de toda fuente histórica"
      ],
      correcta: 1,
      explicacion: "Contrastar fuentes con diferentes perspectivas desarrolla pensamiento crítico: identificar sesgos, reconocer que la historia tiene múltiples interpretaciones, construir visión equilibrada. No hay 'una sola verdad'."
    },

    {
      id: 42,
      dominio: "Dominio 4.1 - Pensamiento Temporal",
      enunciado: "¿Cuál de las siguientes actividades desarrolla mejor el pensamiento temporal en Historia?",
      alternativas: [
        "Memorizar todas las fechas de batallas sin contexto",
        "Crear líneas de tiempo comparativas que muestren simultaneidad de procesos",
        "Copiar definiciones del libro de texto",
        "Escuchar pasivamente una clase magistral"
      ],
      correcta: 1,
      explicacion: "Las líneas de tiempo comparativas permiten visualizar: simultaneidad (qué pasaba en diferentes lugares), duración de procesos, relaciones causa-efecto temporales, periodización. Desarrolla comprensión dinámica del tiempo histórico."
    },

    {
      id: 43,
      dominio: "Dominio 4.1 - Empatía Histórica",
      enunciado: "Al enseñar sobre pueblos originarios, un profesor organiza un debate donde estudiantes representan diferentes actores del siglo XVI (españoles, mapuches, mestizos). Esta estrategia busca desarrollar:",
      alternativas: [
        "Justificación de la conquista",
        "Empatía histórica: comprender motivaciones de actores desde su contexto temporal",
        "Rechazo total a la historia",
        "Anacronismo (juzgar el pasado con valores actuales)"
      ],
      correcta: 1,
      explicacion: "Empatía histórica NO es estar de acuerdo, sino COMPRENDER por qué personas actuaron así en su contexto (valores, creencias, condiciones de época). Evita anacronismo (juzgar pasado con presente)."
    },

    {
      id: 44,
      dominio: "Dominio 4.2 - Recursos Didácticos",
      enunciado: "¿Cuál de los siguientes es un recurso didáctico apropiado para enseñar sobre la Revolución Industrial?",
      alternativas: [
        "Solo lectura silenciosa individual de un libro",
        "Análisis de fotografías de fábricas del siglo XIX, testimonios de obreros, comparación con trabajo actual",
        "Prohibir cualquier imagen o documento",
        "Dictado de definiciones sin discusión"
      ],
      correcta: 1,
      explicacion: "Recursos variados enriquecen aprendizaje: fuentes visuales (fotos, pinturas), testimonios (voces de época), comparaciones presente-pasado. Aprendizaje activo supera memorización pasiva."
    },

    {
      id: 45,
      dominio: "Dominio 4.3 - Evaluación",
      enunciado: "¿Cuál de las siguientes preguntas evalúa habilidades de pensamiento histórico de ORDEN SUPERIOR (no solo memorización)?",
      alternativas: [
        "¿En qué año ocurrió la Batalla de Chacabuco?",
        "Analiza las causas del golpe de 1973 considerando factores políticos, económicos y sociales",
        "¿Cómo se llamaba el primer presidente de Chile?",
        "Enumera los presidentes de Chile en orden cronológico"
      ],
      correcta: 1,
      explicacion: "Taxonomía de Bloom: memorización (nivel bajo) vs análisis/evaluación/síntesis (orden superior). Analizar multicausalidad requiere relacionar, argumentar, evaluar evidencia. Es más complejo que recordar datos."
    },

    {
      id: 46,
      dominio: "Dominio 4.1 - Análisis Fuentes",
      enunciado: "Al trabajar con una fuente primaria (ej: carta de O'Higgins), los estudiantes deben preguntarse:",
      alternativas: [
        "Solo si les gusta o no el documento",
        "¿Quién escribió? ¿Cuándo? ¿Para quién? ¿Con qué propósito? ¿Qué contexto histórico?",
        "Si el documento es verdadero o falso absoluto",
        "Únicamente cuántas páginas tiene"
      ],
      correcta: 1,
      explicacion: "Análisis crítico de fuentes requiere: identificar autor, fecha, audiencia, intención, contexto. Reconocer que toda fuente tiene un punto de vista (sesgo), no es 'verdad absoluta'. Herramienta clave del historiador."
    },

    {
      id: 47,
      dominio: "Dominio 4.2 - Aprendizaje Significativo",
      enunciado: "Para que el aprendizaje de Historia sea significativo, el profesor debe:",
      alternativas: [
        "Enfocarse solo en memorizar fechas sin contexto",
        "Conectar contenidos históricos con experiencias y preguntas relevantes de los estudiantes",
        "Evitar cualquier pregunta de los estudiantes",
        "Prohibir el uso de ejemplos actuales"
      ],
      correcta: 1,
      explicacion: "Aprendizaje significativo (Ausubel) conecta conocimientos nuevos con previos, relaciona pasado con presente, responde preguntas relevantes. Historia cobra sentido cuando ayuda a comprender el mundo actual."
    },

    {
      id: 48,
      dominio: "Dominio 4.3 - Retroalimentación",
      enunciado: "Una retroalimentación efectiva en Historia debe:",
      alternativas: [
        "Solo indicar si la respuesta está correcta o incorrecta",
        "Explicar POR QUÉ una respuesta es correcta, señalar errores conceptuales y guiar mejora",
        "Nunca mencionar los errores",
        "Descalificar al estudiante"
      ],
      correcta: 1,
      explicacion: "Retroalimentación formativa: identifica logros, explica errores conceptuales (no solo 'está mal'), ofrece estrategias de mejora, orienta aprendizaje. Es descriptiva, específica y constructiva."
    },

    {
      id: 49,
      dominio: "Dominio 4.1 - Mapas Históricos",
      enunciado: "Al utilizar mapas históricos en clase, el profesor puede desarrollar en sus estudiantes:",
      alternativas: [
        "Solo habilidades de dibujo artístico",
        "Comprensión de cambios territoriales, relaciones espacio-tiempo, geopolítica",
        "Rechazo a la geografía",
        "Ninguna habilidad relevante"
      ],
      correcta: 1,
      explicacion: "Los mapas históricos muestran: cambios de fronteras (Chile antes/después Guerra Pacífico), expansión imperios, migraciones, rutas comerciales. Integran geografía e historia, visualizan transformaciones espaciales."
    },

    {
      id: 50,
      dominio: "Dominio 4.2 - Inclusión Educativa",
      enunciado: "Para atender la diversidad en el aula de Historia, un profesor puede:",
      alternativas: [
        "Usar solo un método de enseñanza para todos por igual",
        "Ofrecer múltiples formas de representación (textos, videos, mapas), expresión y participación (DUA)",
        "Ignorar las necesidades educativas especiales",
        "Enseñar solo a los estudiantes más aventajados"
      ],
      correcta: 1,
      explicacion: "El Diseño Universal de Aprendizaje (DUA) propone: múltiples formas de representar información, múltiples formas de expresión (oral, escrita, visual), múltiples formas de motivación. Atiende diversidad y equidad."
    }

  ]
};

// ============================================
// LÓGICA DEL QUIZ (igual a Lengua)
// ============================================

let currentQuestion = 0;
let userAnswers = new Array(quizData.preguntas.length).fill(null);
let quizFinished = false;

function renderQuestion() {
  const container = document.getElementById('quiz-container');
  const pregunta = quizData.preguntas[currentQuestion];
  
  let html = `
    <div class="mb-3">
      <span class="badge bg-secondary">${pregunta.dominio}</span>
    </div>
    <h4 class="mb-4">Pregunta ${currentQuestion + 1} de ${quizData.preguntas.length}</h4>
    <p class="lead mb-4">${pregunta.enunciado}</p>
    <div class="alternativas-container">
  `;
  
  pregunta.alternativas.forEach((alt, index) => {
    const isSelected = userAnswers[currentQuestion] === index;
    html += `
      <div class="form-check alternativa-item ${isSelected ? 'selected' : ''}" onclick="selectAnswer(${index})">
        <input class="form-check-input" type="radio" name="respuesta" id="alt${index}" 
               ${isSelected ? 'checked' : ''}>
        <label class="form-check-label w-100" for="alt${index}">
          ${String.fromCharCode(65 + index)}. ${alt}
        </label>
      </div>
    `;
  });
  
  html += `</div>`;
  container.innerHTML = html;
  
  updateNavigation();
}

function selectAnswer(index) {
  userAnswers[currentQuestion] = index;
  renderQuestion();
}

function updateNavigation() {
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const counter = document.getElementById('question-counter');
  const finishContainer = document.getElementById('finish-container');
  
  prevBtn.disabled = currentQuestion === 0;
  
  counter.textContent = `Pregunta ${currentQuestion + 1} / ${quizData.preguntas.length}`;
  
  if (currentQuestion === quizData.preguntas.length - 1) {
    nextBtn.style.display = 'none';
    finishContainer.style.display = 'block';
  } else {
    nextBtn.style.display = 'block';
    finishContainer.style.display = 'none';
  }
}

document.getElementById('prev-btn').addEventListener('click', () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
});

document.getElementById('next-btn').addEventListener('click', () => {
  if (currentQuestion < quizData.preguntas.length - 1) {
    currentQuestion++;
    renderQuestion();
  }
});

document.getElementById('finish-btn').addEventListener('click', () => {
  showResults();
});

function showResults() {
  quizFinished = true;
  
  let correctas = 0;
  let incorrectas = 0;
  let sinResponder = 0;
  
  const dominios = {};
  
  quizData.preguntas.forEach((pregunta, index) => {
    const userAnswer = userAnswers[index];
    const isCorrect = userAnswer === pregunta.correcta;
    
    if (!dominios[pregunta.dominio]) {
      dominios[pregunta.dominio] = { total: 0, correctas: 0 };
    }
    dominios[pregunta.dominio].total++;
    
    if (userAnswer === null) {
      sinResponder++;
    } else if (isCorrect) {
      correctas++;
      dominios[pregunta.dominio].correctas++;
    } else {
      incorrectas++;
    }
  });
  
  const porcentaje = Math.round((correctas / quizData.preguntas.length) * 100);
  
  let resultadoHTML = `
    <h3 class="mb-4"><i class="bi bi-trophy"></i> Resultados del Test</h3>
    
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card text-center border-success">
          <div class="card-body">
            <h2 class="text-success">${correctas}</h2>
            <p class="mb-0">Correctas</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center border-danger">
          <div class="card-body">
            <h2 class="text-danger">${incorrectas}</h2>
            <p class="mb-0">Incorrectas</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center border-warning">
          <div class="card-body">
            <h2 class="text-warning">${sinResponder}</h2>
            <p class="mb-0">Sin responder</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center border-primary">
          <div class="card-body">
            <h2 class="text-primary">${porcentaje}%</h2>
            <p class="mb-0">Puntaje</p>
          </div>
        </div>
      </div>
    </div>
    
    <h4 class="mb-3">Rendimiento por Dominio</h4>
    <div class="row mb-4">
  `;
  
  for (const [dominio, stats] of Object.entries(dominios)) {
    const porcDominio = Math.round((stats.correctas / stats.total) * 100);
    resultadoHTML += `
      <div class="col-md-6 mb-3">
        <div class="card">
          <div class="card-body">
            <h6>${dominio}</h6>
            <div class="progress">
              <div class="progress-bar ${porcDominio >= 70 ? 'bg-success' : porcDominio >= 50 ? 'bg-warning' : 'bg-danger'}" 
                   style="width: ${porcDominio}%">${porcDominio}%</div>
            </div>
            <small class="text-muted">${stats.correctas}/${stats.total} correctas</small>
          </div>
        </div>
      </div>
    `;
  }
  
  resultadoHTML += `
    </div>
    
    <h4 class="mb-3">Revisión Detallada</h4>
  `;
  
  quizData.preguntas.forEach((pregunta, index) => {
    const userAnswer = userAnswers[index];
    const isCorrect = userAnswer === pregunta.correcta;
    const sinResp = userAnswer === null;
    
    resultadoHTML += `
      <div class="card mb-3 ${isCorrect ? 'border-success' : sinResp ? 'border-warning' : 'border-danger'}">
        <div class="card-header ${isCorrect ? 'bg-success text-white' : sinResp ? 'bg-warning' : 'bg-danger text-white'}">
          <strong>Pregunta ${index + 1}</strong> - ${pregunta.dominio}
          ${isCorrect ? '<i class="bi bi-check-circle float-end"></i>' : sinResp ? '<i class="bi bi-exclamation-circle float-end"></i>' : '<i class="bi bi-x-circle float-end"></i>'}
        </div>
        <div class="card-body">
          <p><strong>${pregunta.enunciado}</strong></p>
          <ul class="list-unstyled">
    `;
    
    pregunta.alternativas.forEach((alt, i) => {
      const esCorrecta = i === pregunta.correcta;
      const esSeleccionada = i === userAnswer;
      
      let claseItem = '';
      let icono = '';
      
      if (esCorrecta) {
        claseItem = 'text-success fw-bold';
        icono = '<i class="bi bi-check-circle-fill text-success"></i> ';
      } else if (esSeleccionada && !esCorrecta) {
        claseItem = 'text-danger fw-bold';
        icono = '<i class="bi bi-x-circle-fill text-danger"></i> ';
      }
      
      resultadoHTML += `<li class="${claseItem}">${icono}${String.fromCharCode(65 + i)}. ${alt}</li>`;
    });
    
    resultadoHTML += `
          </ul>
          <div class="alert alert-info mb-0 mt-3">
            <strong><i class="bi bi-lightbulb"></i> Explicación:</strong> ${pregunta.explicacion}
          </div>
        </div>
      </div>
    `;
  });
  
  resultadoHTML += `
    <div class="text-center mt-4">
      <a href="/evaluaciones/educacion-media/estudio/dossier-historia-media/" class="btn btn-primary btn-lg me-2">
        <i class="bi bi-book"></i> Ir al Dossier de Estudio
      </a>
      <button onclick="location.reload()" class="btn btn-outline-secondary btn-lg">
        <i class="bi bi-arrow-clockwise"></i> Reiniciar Test
      </button>
    </div>
  `;
  
  document.getElementById('results-container').innerHTML = resultadoHTML;
  document.getElementById('results-container').style.display = 'block';
  document.getElementById('quiz-container').style.display = 'none';
  document.querySelector('.d-flex.justify-content-between').style.display = 'none';
  document.getElementById('finish-container').style.display = 'none';
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Inicializar
renderQuestion();
</script>

<style>
.alternativa-item {
  padding: 15px;
  margin-bottom: 10px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.alternativa-item:hover {
  background-color: #f8f9fa;
  border-color: #0d6efd;
}

.alternativa-item.selected {
  background-color: #e7f3ff;
  border-color: #0d6efd;
  font-weight: 500;
}

.progress {
  height: 25px;
}

#quiz-container {
  min-height: 400px;
}
</style>
"""

# Escribir el archivo
ruta_salida = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\historia-media\index.njk"

with open(ruta_salida, 'w', encoding='utf-8') as f:
    f.write(contenido)

print("✅ Test de Historia Media ECEP 2025 creado exitosamente")
print(f"📍 Ubicación: {ruta_salida}")
print("📊 Contenido: 50 preguntas distribuidas en 4 dominios")
print("\nDistribución:")
print("  • Dominio 1 (Pensamiento Geográfico): 12 preguntas")
print("  • Dominio 2 (Pensamiento Histórico): 15 preguntas")
print("  • Dominio 3 (Formación Ciudadana): 13 preguntas")
print("  • Dominio 4 (Enseñanza-Aprendizaje): 10 preguntas")
