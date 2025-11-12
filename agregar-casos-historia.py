#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Agregar 10 casos de estudio pedagógicos en Dominio 4 de Historia
"""

archivo = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\estudio\dossier-historia-media\index.njk"

with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

casos_pedagogicos = """
        <!-- 10 CASOS DE ESTUDIO PEDAGÓGICOS -->
        <div class='alert alert-success mt-5 mb-4'>
          <h4><i class='bi bi-lightbulb'></i> 10 Casos de Estudio Pedagógicos ECEP 2025</h4>
          <p class='mb-0'>Ejercicios basados en situaciones reales de aula para evaluar toma de decisiones didácticas en Historia y Ciencias Sociales.</p>
        </div>

        <!-- CASO 1 -->
        <div class='historia-card p-4 mb-4' style='border-left: 5px solid #1976D2;'>
          <h5><strong>📚 Caso 1: Fuentes Contradictorias sobre Independencia</strong></h5>
          
          <div class='bg-light p-3 rounded mb-3'>
            <p class='mb-2'><strong>Contexto:</strong> Clase 2° Medio sobre Independencia de Chile</p>
            <p class='mb-0'><strong>Situación:</strong> Un docente presenta dos fuentes: una carta de O'Higgins describiendo el proceso independentista como unánime y popular, y un documento de la época que muestra resistencias y divisiones internas entre chilenos.</p>
          </div>

          <p class='mb-3'><strong>Pregunta:</strong> ¿Qué estrategia didáctica es más apropiada para trabajar fuentes contradictorias?</p>

          <div class='row'>
            <div class='col-md-6'>
              <div class='card border-success mb-3'>
                <div class='card-header bg-success text-white'><strong>✅ Respuesta Correcta</strong></div>
                <div class='card-body small'>
                  <p class='mb-2'><strong>C) Organizar debate analítico donde estudiantes identifiquen perspectivas, contexto de producción y sesgos de cada fuente</strong></p>
                  <p class='mb-0'><em>Justificación:</em> Desarrolla pensamiento histórico crítico, reconoce multiperspectividad y enseña análisis de fuentes primarias con rigor.</p>
                </div>
              </div>
            </div>
            <div class='col-md-6'>
              <div class='card border-danger'>
                <div class='card-header bg-danger text-white'><strong>❌ Errores Comunes</strong></div>
                <div class='card-body small'>
                  <p class='mb-1'><strong>A)</strong> Eliminar una fuente (censura, no enseña complejidad histórica)</p>
                  <p class='mb-1'><strong>B)</strong> Decir cuál es "la verdadera" (imposición, no análisis)</p>
                  <p class='mb-0'><strong>D)</strong> Dejar que estudiantes elijan sin análisis (relativismo acrítico)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CASO 2 -->
        <div class='historia-card p-4 mb-4' style='border-left: 5px solid #388E3C;'>
          <h5><strong>🗺️ Caso 2: Mapas Históricos Anacrónicos</strong></h5>
          
          <div class='bg-light p-3 rounded mb-3'>
            <p class='mb-2'><strong>Contexto:</strong> Clase 7° Básico sobre conquista española de América</p>
            <p class='mb-0'><strong>Situación:</strong> Un docente utiliza un mapa actual de América con fronteras contemporáneas para explicar rutas de conquista del siglo XVI. Estudiantes se confunden sobre territorios.</p>
          </div>

          <p class='mb-3'><strong>Pregunta:</strong> ¿Qué error pedagógico está cometiendo y cómo corregirlo?</p>

          <div class='alert alert-warning'>
            <h6><strong>Análisis Didáctico:</strong></h6>
            <p class='mb-2'><strong>Error:</strong> Anacronismo cartográfico (usar mapas actuales para época distinta)</p>
            <p class='mb-2'><strong>Consecuencia:</strong> Estudiantes proyectan realidades presentes al pasado, no comprenden procesos históricos</p>
            <p class='mb-0'><strong>Solución:</strong> Usar mapas históricos de época (siglo XVI) que muestren territorios como eran concebidos entonces. Comparar con mapa actual para evidenciar cambios temporales.</p>
          </div>
        </div>

        <!-- CASO 3 -->
        <div class='historia-card p-4 mb-4' style='border-left: 5px solid #7B1FA2;'>
          <h5><strong>📊 Caso 3: Evaluación de Línea de Tiempo</strong></h5>
          
          <div class='bg-light p-3 rounded mb-3'>
            <p class='mb-2'><strong>Contexto:</strong> Evaluación 1° Medio sobre Siglo XX chileno</p>
            <p class='mb-0'><strong>Situación:</strong> Docente pide crear línea de tiempo con 10 eventos. Estudiante entrega cronología correcta pero sin análisis de causas, consecuencias o relaciones entre eventos.</p>
          </div>

          <p class='mb-3'><strong>Pregunta:</strong> ¿Cómo mejorar la consigna evaluativa?</p>

          <div class='card border-primary'>
            <div class='card-header bg-primary text-white'><strong>Mejora Pedagógica</strong></div>
            <div class='card-body'>
              <p class='mb-2'><strong>Consigna Original (insuficiente):</strong> "Elabora línea de tiempo con 10 eventos del siglo XX chileno"</p>
              
              <p class='mb-2'><strong>Consigna Mejorada:</strong></p>
              <ol class='mb-0 small'>
                <li>Elabora línea de tiempo con 10 eventos clave siglo XX</li>
                <li>Para cada evento: explicar <strong>causa inmediata</strong> y <strong>consecuencia principal</strong></li>
                <li>Identificar <strong>relaciones entre 3 eventos</strong> (causa-efecto)</li>
                <li>Señalar <strong>un punto de inflexión</strong> (cambio histórico profundo) y justificar</li>
              </ol>
              <p class='small text-muted mt-2 mb-0'><em>Evalúa: pensamiento temporal, causalidad, cambio/continuidad (habilidades ECEP)</em></p>
            </div>
          </div>
        </div>

        <!-- CASO 4 -->
        <div class='historia-card p-4 mb-4' style='border-left: 5px solid #D32F2F;'>
          <h5><strong>🎭 Caso 4: Simulación Golpe de Estado 1973</strong></h5>
          
          <div class='bg-light p-3 rounded mb-3'>
            <p class='mb-2'><strong>Contexto:</strong> Clase 4° Medio sobre quiebre democrático 1973</p>
            <p class='mb-0'><strong>Situación:</strong> Docente propone simulación donde estudiantes representen roles (Allende, Pinochet, partidos políticos) y "decidan" si hacer golpe o no.</p>
          </div>

          <p class='mb-3'><strong>Pregunta:</strong> ¿Es apropiada esta estrategia? ¿Qué riesgos tiene?</p>

          <div class='row'>
            <div class='col-md-6'>
              <div class='card border-danger'>
                <div class='card-header bg-danger text-white'><strong>⚠️ Riesgos Pedagógicos</strong></div>
                <div class='card-body small'>
                  <ul class='mb-0'>
                    <li><strong>Banalización:</strong> Golpe como "juego", minimiza violencia y trauma histórico</li>
                    <li><strong>Falso dilema:</strong> Sugiere que golpe era "opción debatible" (viola DDHH)</li>
                    <li><strong>Sesgo político:</strong> Puede polarizar aula según posturas familiares</li>
                    <li><strong>Re-traumatización:</strong> Estudiantes con familiares víctimas pueden sentirse afectados</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class='col-md-6'>
              <div class='card border-success'>
                <div class='card-header bg-success text-white'><strong>✅ Alternativa Responsable</strong></div>
                <div class='card-body small'>
                  <p class='mb-2'><strong>Estrategia sugerida:</strong></p>
                  <ul class='mb-0'>
                    <li>Analizar <strong>fuentes documentales</strong> de actores de época (sin simular)</li>
                    <li>Estudiar <strong>múltiples perspectivas históricas</strong> con distancia crítica</li>
                    <li>Enfatizar <strong>consecuencias DDHH</strong> (Informe Rettig, testimonios)</li>
                    <li>Contextualizar en <strong>Guerra Fría</strong> sin justificar violaciones DDHH</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CASO 5 -->
        <div class='historia-card p-4 mb-4' style='border-left: 5px solid #F57C00;'>
          <h5><strong>🌍 Caso 5: Eurocentrismo en Guerra Fría</strong></h5>
          
          <div class='bg-light p-3 rounded mb-3'>
            <p class='mb-2'><strong>Contexto:</strong> Clase 3° Medio sobre Guerra Fría</p>
            <p class='mb-0'><strong>Situación:</strong> Docente enseña Guerra Fría solo con eventos europeos y estadounidenses (Muro Berlín, Cuba). Estudiante pregunta: "¿Y en Chile qué pasaba?"</p>
          </div>

          <p class='mb-3'><strong>Pregunta:</strong> ¿Cómo incorporar perspectiva latinoamericana sin perder contexto global?</p>

          <div class='card border-info'>
            <div class='card-header bg-info text-white'><strong>Estrategia Multicultural</strong></div>
            <div class='card-body small'>
              <p class='mb-2'><strong>1. Estructura paralela:</strong></p>
              <ul class='mb-3'>
                <li>Eje global: EEUU vs URSS, Muro Berlín, carrera espacial</li>
                <li>Eje latinoamericano: Revolución Cubana (1959), golpes militares (Brasil 64, Argentina 76, Chile 73), Plan Cóndor</li>
                <li><strong>Conexión:</strong> Doctrina Seguridad Nacional, intervención CIA, apoyo URSS a movimientos izquierda</li>
              </ul>
              
              <p class='mb-2'><strong>2. Casos de estudio comparados:</strong></p>
              <ul class='mb-0'>
                <li>Crisis Misiles Cuba (1962) <strong>↔</strong> Impacto en políticas latinoamericanas</li>
                <li>Vietnam (1964-75) <strong>↔</strong> Guerrillas latinoamericanas (inspiración, apoyo)</li>
                <li>Caída Muro Berlín (1989) <strong>↔</strong> Transiciones democráticas América Latina (1980s-90s)</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- CASO 6 -->
        <div class='historia-card p-4 mb-4' style='border-left: 5px solid #0097A7;'>
          <h5><strong>📖 Caso 6: Texto Escolar Desactualizado</strong></h5>
          
          <div class='bg-light p-3 rounded mb-3'>
            <p class='mb-2'><strong>Contexto:</strong> Colegio entrega texto MINEDUC 2010 para clase 2025</p>
            <p class='mb-0'><strong>Situación:</strong> Texto termina historia Chile en 2006 (gobierno Bachelet I). Estudiantes preguntan por estallido social 2019, pandemia 2020, proceso constituyente 2020-2023.</p>
          </div>

          <p class='mb-3'><strong>Pregunta:</strong> ¿Cómo actualizar contenidos con recursos limitados?</p>

          <div class='alert alert-success'>
            <h6><strong>Soluciones Prácticas:</strong></h6>
            <ol class='mb-0 small'>
              <li><strong>Actualización digital:</strong> Crear módulo digital con eventos 2006-2025 (timeline interactiva, videos educativos)</li>
              <li><strong>Fuentes periodísticas:</strong> Usar artículos prensa (La Tercera, El Mostrador, BBC Mundo) con análisis crítico de fuentes</li>
              <li><strong>Testimonios orales:</strong> Entrevistas a familiares sobre estallido social (historia oral, metodología histórica)</li>
              <li><strong>Debate historiográfico:</strong> Trabajar con estudiantes la idea de "historia reciente" (¿cuándo algo se vuelve "historia"?)</li>
              <li><strong>Pensamiento crítico:</strong> Comparar cómo texto 2010 analiza gobierno Bachelet I vs cómo hoy se analiza (cambio perspectiva temporal)</li>
            </ol>
          </div>
        </div>

        <!-- CASO 7 -->
        <div class='historia-card p-4 mb-4' style='border-left: 5px solid #5D4037;'>
          <h5><strong>🗳️ Caso 7: Formación Ciudadana vs Adoctrinamiento</strong></h5>
          
          <div class='bg-light p-3 rounded mb-3'>
            <p class='mb-2'><strong>Contexto:</strong> Clase Formación Ciudadana sobre democracia</p>
            <p class='mb-0'><strong>Situación:</strong> Apoderado acusa a docente de "adoctrinar" porque enseña que democracia es mejor sistema que dictadura. Dirección solicita explicación pedagógica.</p>
          </div>

          <p class='mb-3'><strong>Pregunta:</strong> ¿Cómo fundamentar enseñanza democrática sin caer en adoctrinamiento?</p>

          <div class='card border-primary'>
            <div class='card-header bg-primary text-white'><strong>Argumentación Pedagógica</strong></div>
            <div class='card-body small'>
              <p class='mb-2'><strong>Diferencia clave:</strong></p>
              <ul class='mb-3'>
                <li><strong>Adoctrinamiento:</strong> Imponer creencia sin crítica, censurar alternativas, apelar a autoridad no cuestionable</li>
                <li><strong>Educación cívica:</strong> Enseñar valores democráticos basados en DDHH (universales), análisis comparado sistemas políticos, pensamiento crítico</li>
              </ul>
              
              <p class='mb-2'><strong>Fundamentos legales:</strong></p>
              <ul class='mb-3'>
                <li>Ley 20.911 (2016): "Formación ciudadana" obligatoria (respeto DDHH, cultura democrática)</li>
                <li>Constitución Chile: Estado democrático de derecho (Art. 4°)</li>
                <li>Declaración Universal DDHH (1948): democracia como sistema compatible con derechos humanos</li>
              </ul>
              
              <p class='mb-2'><strong>Estrategia didáctica:</strong></p>
              <ol class='mb-0'>
                <li>Comparar sistemas (democracia, dictadura, monarquía) con <strong>criterios objetivos</strong>: libertades, participación, DDHH, rendición de cuentas</li>
                <li>Estudiar <strong>evidencia histórica</strong>: violaciones DDHH en dictaduras (Informes Rettig, Valech, casos internacionales)</li>
                <li>Analizar <strong>límites democracia</strong> (populismo, corrupción, desigualdad) → pensamiento crítico, no idealización</li>
                <li>Fomentar <strong>debate informado</strong> sobre mejoras democráticas, no imposición</li>
              </ol>
            </div>
          </div>
        </div>

        <!-- CASO 8 -->
        <div class='historia-card p-4 mb-4' style='border-left: 5px solid #AD1457;'>
          <h5><strong>🎥 Caso 8: Película Histórica con Errores</strong></h5>
          
          <div class='bg-light p-3 rounded mb-3'>
            <p class='mb-2'><strong>Contexto:</strong> Clase 1° Medio sobre Guerra del Pacífico</p>
            <p class='mb-0'><strong>Situación:</strong> Docente muestra película comercial que contiene anacronismos, simplificaciones y glorificación nacionalista. No hace análisis crítico post-visionado.</p>
          </div>

          <p class='mb-3'><strong>Pregunta:</strong> ¿Cómo usar cine histórico pedagógicamente sin reproducir errores?</p>

          <div class='row'>
            <div class='col-md-6'>
              <div class='card border-warning'>
                <div class='card-header bg-warning text-dark'><strong>⚠️ Riesgos del Cine</strong></div>
                <div class='card-body small'>
                  <ul class='mb-0'>
                    <li>Anacronismos (diálogos, vestuario, valores actuales proyectados)</li>
                    <li>Simplificación (héroes vs villanos, buenos vs malos)</li>
                    <li>Nacionalismo acrítico (glorificación bélica sin contexto)</li>
                    <li>Omisiones (no mostrar complejidad, múltiples actores)</li>
                    <li>Confusión ficción/historia (estudiantes asumen todo es real)</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class='col-md-6'>
              <div class='card border-success'>
                <div class='card-header bg-success text-white'><strong>✅ Uso Pedagógico</strong></div>
                <div class='card-body small'>
                  <p class='mb-2'><strong>Antes de ver:</strong></p>
                  <ul class='mb-2'>
                    <li>Explicar que cine es <strong>interpretación</strong>, no documento histórico</li>
                    <li>Entregar pauta observación: identificar anacronismos, sesgos</li>
                  </ul>
                  <p class='mb-2'><strong>Después de ver:</strong></p>
                  <ul class='mb-0'>
                    <li>Comparar película con fuentes históricas (documentos época, historiografía)</li>
                    <li>Analizar <strong>perspectiva director</strong>: ¿Qué mensaje busca? ¿A quién representa?</li>
                    <li>Discutir <strong>usos públicos historia</strong>: cine como constructor memoria/identidad nacional</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CASO 9 -->
        <div class='historia-card p-4 mb-4' style='border-left: 5px solid #00796B;'>
          <h5><strong>📝 Caso 9: Evaluación Memorística vs Comprensiva</strong></h5>
          
          <div class='bg-light p-3 rounded mb-3'>
            <p class='mb-2'><strong>Contexto:</strong> Prueba 8° Básico sobre Revolución Francesa</p>
            <p class='mb-0'><strong>Situación:</strong> Prueba tiene 30 preguntas de memorización (fechas, nombres) y 0 preguntas de análisis, causalidad o perspectivas históricas.</p>
          </div>

          <p class='mb-3'><strong>Pregunta:</strong> ¿Cómo rediseñar evaluación para medir pensamiento histórico?</p>

          <div class='card border-info'>
            <div class='card-header bg-info text-white'><strong>Taxonomía de Bloom en Historia</strong></div>
            <div class='card-body'>
              <table class='table table-sm table-bordered mb-0'>
                <thead>
                  <tr class='table-primary'>
                    <th>Nivel</th>
                    <th>Habilidad</th>
                    <th>Ejemplo Pregunta</th>
                  </tr>
                </thead>
                <tbody class='small'>
                  <tr>
                    <td><strong>Recordar</strong></td>
                    <td>Memorizar datos</td>
                    <td>¿En qué año fue la toma de la Bastilla? (1789) ✓ Necesario pero insuficiente</td>
                  </tr>
                  <tr>
                    <td><strong>Comprender</strong></td>
                    <td>Explicar conceptos</td>
                    <td>Explica qué significa "Tercer Estado" en Francia pre-revolucionaria</td>
                  </tr>
                  <tr>
                    <td><strong>Aplicar</strong></td>
                    <td>Usar conocimiento</td>
                    <td>Compara sistema estamental francés con colonial americano: similitudes/diferencias</td>
                  </tr>
                  <tr>
                    <td><strong>Analizar</strong></td>
                    <td>Identificar causas</td>
                    <td>Lee Declaración DDHH del Hombre (1789): ¿Qué ideas Ilustración identifica? Fundamenta</td>
                  </tr>
                  <tr>
                    <td><strong>Evaluar</strong></td>
                    <td>Juzgar con criterios</td>
                    <td>¿Fue el Terror (1793-94) necesario para defender revolución? Argumenta con evidencia</td>
                  </tr>
                  <tr>
                    <td><strong>Crear</strong></td>
                    <td>Sintetizar nuevo</td>
                    <td>Diseña afiche revolucionario 1789 que refleje demandas Tercer Estado (incluye símbolos, lemas, justificación histórica)</td>
                  </tr>
                </tbody>
              </table>
              <p class='small text-muted mt-3 mb-0'><strong>Proporción sugerida ECEP:</strong> 30% Recordar/Comprender | 40% Aplicar/Analizar | 30% Evaluar/Crear</p>
            </div>
          </div>
        </div>

        <!-- CASO 10 -->
        <div class='historia-card p-4 mb-4' style='border-left: 5px solid #6A1B9A;'>
          <h5><strong>🌐 Caso 10: Uso de Wikipedia en Trabajos</strong></h5>
          
          <div class='bg-light p-3 rounded mb-3'>
            <p class='mb-2'><strong>Contexto:</strong> Investigación 3° Medio sobre pueblos originarios chilenos</p>
            <p class='mb-0'><strong>Situación:</strong> Estudiante cita Wikipedia como única fuente. Docente debe decidir si aceptarla o rechazarla.</p>
          </div>

          <p class='mb-3'><strong>Pregunta:</strong> ¿Cuál es el uso pedagógicamente apropiado de Wikipedia?</p>

          <div class='row'>
            <div class='col-md-6'>
              <div class='card border-danger'>
                <div class='card-header bg-danger text-white'><strong>❌ Prohibición Total (error)</strong></div>
                <div class='card-body small'>
                  <p class='mb-2'><strong>Problema:</strong> No enseña alfabetización digital ni pensamiento crítico</p>
                  <ul class='mb-0'>
                    <li>Wikipedia es realidad (estudiantes la usan fuera de aula)</li>
                    <li>Prohibir sin explicar no desarrolla criterios evaluación fuentes</li>
                    <li>Pierde oportunidad pedagógica: ¿cómo se construye conocimiento enciclopédico?</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class='col-md-6'>
              <div class='card border-success'>
                <div class='card-header bg-success text-white'><strong>✅ Uso Crítico (apropiado)</strong></div>
                <div class='card-body small'>
                  <p class='mb-2'><strong>Estrategia:</strong> Wikipedia como <strong>punto de partida</strong>, no llegada</p>
                  <ol class='mb-0'>
                    <li><strong>Enseñar evaluación:</strong> Revisar historial ediciones, discusión, referencias al pie</li>
                    <li><strong>Verificación cruzada:</strong> Contrastar con <strong>fuentes citadas en Wikipedia</strong> (artículos académicos, libros)</li>
                    <li><strong>Ir a fuentes primarias:</strong> Wikipedia → Referencias → Documento original</li>
                    <li><strong>Comparar versiones:</strong> Wikipedia español vs inglés vs mapuche (perspectivas diferentes)</li>
                    <li><strong>No citar Wikipedia directamente:</strong> Citar las fuentes que Wikipedia usa</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div class='alert alert-info mt-3 mb-0'>
            <h6><strong>Actividad Pedagógica:</strong></h6>
            <p class='mb-0 small'>Comparar artículo Wikipedia sobre "Pueblo Mapuche" con entrada en enciclopedia académica (Bengoa, "Historia del Pueblo Mapuche"). Identificar diferencias en: profundidad, perspectiva, fuentes usadas, actualización. Reflexionar sobre <strong>ventajas y limitaciones</strong> cada tipo de fuente.</p>
          </div>
        </div>
"""

# Buscar donde insertar (al final de Dominio 4)
pos_dominio_4 = contenido.find("<!-- 4. DIDÁCTICA Y ENSEÑANZA-APRENDIZAJE EN HISTORIA -->")
if pos_dominio_4 != -1:
    # Buscar el final de la sección de estrategias didácticas
    pos_insercion = contenido.find("</div>\n      </section>\n\n      <!-- FOOTER -->", pos_dominio_4)
    if pos_insercion != -1:
        contenido = contenido[:pos_insercion] + casos_pedagogicos + "\n\n        " + contenido[pos_insercion:]
        print("✅ 10 casos de estudio pedagógicos agregados al Dominio 4")
    else:
        print("❌ No se encontró punto de inserción en Dominio 4")
else:
    print("❌ No se encontró Dominio 4")

# Guardar
with open(archivo, 'w', encoding='utf-8') as f:
    f.write(contenido)

print("\n🎉 Casos pedagógicos agregados exitosamente")
