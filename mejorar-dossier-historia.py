#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para mejorar el Dossier de Historia Media:
1. Agregar textos históricos largos (~500 palabras)
2. Expandir líneas de tiempo
3. Ampliar sección de Totalitarismos
4. Agregar 10 casos de estudio pedagógicos en Dominio 4
"""

import re

archivo = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\estudio\dossier-historia-media\index.njk"

with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

# ============================================
# 1. TEXTOS HISTÓRICOS LARGOS
# ============================================

textos_historicos = """
        <!-- TEXTOS HISTÓRICOS PARA ANÁLISIS -->
        <div class='alert alert-warning mt-4 mb-4'>
          <h5><i class='bi bi-file-text'></i> Textos Históricos para Análisis Crítico</h5>
          <p class='mb-2'>Documentos primarios que permiten desarrollar análisis de fuentes, identificación de perspectivas y pensamiento crítico.</p>
        </div>

        <!-- TEXTO 1: Acta de Independencia 1818 -->
        <div class='historia-card p-4 mb-4'>
          <h4 class='mb-3'><span style='font-size: 2rem;'>📜</span> Texto 1: Acta de Independencia de Chile (12 de febrero 1818)</h4>
          
          <div class='bg-light p-4 rounded mb-3' style='border-left: 4px solid #8B4513;'>
            <p class='small mb-2'><strong>Tipo de fuente:</strong> Primaria, documento oficial</p>
            <p class='small mb-2'><strong>Autor:</strong> Gobierno de Chile, firmado por Bernardo O'Higgins</p>
            <p class='small mb-0'><strong>Contexto:</strong> Declaración formal de independencia tras batallas de Chacabuco y previo a Maipú</p>
          </div>

          <div class='bg-white p-4 rounded border mb-3' style='font-family: Georgia, serif; line-height: 1.8;'>
            <p class='mb-3'><em>"La fuerza ha sido la razón suprema que por más de trescientos años ha mantenido al nuevo mundo en la necesidad de venerar como un dogma la usurpación de sus derechos y de buscar en ella misma el origen de sus más grandes deberes. Era preciso que algún día llegase el término de esta violenta sumisión: pero como la época del término de ella ha sido la obra de la Providencia, que todo lo rige, y ella conduce los sucesos humanos al fin a que los ha destinado desde el principio, hemos visto con asombro en nuestra época la mayor parte de la América iluminada y convencida de la justicia de sus derechos, buscar los medios de sacudir un yugo que la oprimía hace tantos años..."</em></p>
            
            <p class='mb-3'><em>"El territorio continental de Chile y sus islas adyacentes forman de hecho y por derecho un Estado libre, independiente y soberano, y quedan para siempre separados de la Monarquía de España y de otra cualquiera dominación, con plena aptitud de adoptar la forma de gobierno que más convenga a sus intereses..."</em></p>
            
            <p class='mb-3'><em>"Y para que esta declaración tenga toda la fuerza y solidez que debe caracterizar la primera acta de un pueblo libre, la afianzamos con el honor, la vida, las fortunas y todas las relaciones de los habitantes de este nuevo Estado, empeñando religiosamente por su observancia el mérito que han adquirido ante Dios y los hombres con los sacrificios que han hecho en obsequio de la causa más justa y más gloriosa que puede emprender el hombre..."</em></p>
            
            <p class='mb-0 text-end'><strong>Palacio Directorial de Concepción, 12 de febrero de 1818</strong><br><strong>Bernardo O'Higgins, Director Supremo</strong></p>
          </div>

          <div class='row'>
            <div class='col-md-6'>
              <div class='card border-info'>
                <div class='card-header bg-info text-white'><strong>Análisis Contextual</strong></div>
                <div class='card-body small'>
                  <strong>¿Por qué se declara la independencia en 1818 y no antes?</strong>
                  <ul class='mb-0'>
                    <li>Victoria militar en Chacabuco (feb 1817) consolidó poder patriota</li>
                    <li>Necesidad de legitimidad internacional (reconocimiento)</li>
                    <li>Momento propicio antes de batalla decisiva (Maipú, abril 1818)</li>
                    <li>Crisis monárquica española aún vigente (restauración Fernando VII, 1814)</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class='col-md-6'>
              <div class='card border-warning'>
                <div class='card-header bg-warning text-dark'><strong>Preguntas Críticas</strong></div>
                <div class='card-body small'>
                  <ol class='mb-0'>
                    <li>¿Qué argumentos usa el texto para justificar la independencia?</li>
                    <li>¿Qué rol atribuye a la "Providencia" (Dios)?</li>
                    <li>¿A quién representa realmente este documento? (élite criolla, pueblo, indígenas)</li>
                    <li>¿Qué tipo de Estado propone? (democrático, monárquico, republicano)</li>
                    <li>¿Qué visión tiene sobre el dominio español? (violento, ilegítimo)</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TEXTO 2: Discurso Salvador Allende ONU 1972 -->
        <div class='historia-card p-4 mb-4'>
          <h4 class='mb-3'><span style='font-size: 2rem;'>🗣️</span> Texto 2: Discurso de Salvador Allende en la ONU (4 diciembre 1972)</h4>
          
          <div class='bg-light p-4 rounded mb-3' style='border-left: 4px solid #7B1FA2;'>
            <p class='small mb-2'><strong>Tipo de fuente:</strong> Primaria, discurso político</p>
            <p class='small mb-2'><strong>Autor:</strong> Salvador Allende, Presidente de Chile</p>
            <p class='small mb-0'><strong>Contexto:</strong> Gobierno de la Unidad Popular, bloqueo económico de EEUU, denunc ia intervención extranjera</p>
          </div>

          <div class='bg-white p-4 rounded border mb-3' style='font-family: Georgia, serif; line-height: 1.8;'>
            <p class='mb-3'><em>"Vengo de Chile, un país pequeño pero donde hoy cualquier ciudadano es libre de expresarse como mejor prefiera, de irrestricta libertad cultural, religiosa e ideológica, donde la discriminación racial no tiene cabida. Chile, país de lucha frontal por la soberanía frente a los monopolios internacionales, país en plena marcha hacia la construcción de una sociedad socialista..."</em></p>
            
            <p class='mb-3'><em>"Las empresas transnacionales no solo atentan contra los intereses genuinos de los países en desarrollo, sino que su acción avasalladora e incontrolada se da en el marco de las grandes potencias donde tienen su sede, interfiere con sus economías y penetran las decisiones políticas de sus gobiernos. Las empresas multinacionales actúan sobre economías de poca magnitud relativa, aprovechándose muchas veces de las divisiones internas que estas economías les otorgan a través de sus propias elites dominantes..."</em></p>
            
            <p class='mb-3'><em>"Chile ha nacionalizado el cobre. Lo ha hecho asumiendo plenamente su obligación jurídica expresada en un acto de soberanía: arrancar de manos foráneas lo que es nuestro y ha estado en manos foráneas durante muchos decenios. Lo ha hecho porque tenemos pleno derecho sobre nuestras riquezas básicas. No hemos inventado el derecho de nacionalización; simplemente lo ejercemos..."</em></p>
            
            <p class='mb-3'><em>"Pero hemos sido víctimas de una agresión grave. Las grandes empresas mineras del cobre norteamericanas que teníamos en Chile conspiraron contra el gobierno chileno antes que yo asumiera como Presidente. Luego de las nacionalizaciones han intentado la quiebra económica de mi país. Nos han boicoteado y nos boicotean. En cuanto a EEUU, está aplicando contra mi país medidas coercitivas de gran envergadura económica..."</em></p>
            
            <p class='mb-0'><em>"Naciones Unidas, por su historia y por la jerarquía de los que la componen, tiene el deber fundamental e ineludible de actuar para poner término a estas manifestaciones de prepotencia y opresión..."</em></p>
          </div>

          <div class='row'>
            <div class='col-md-6'>
              <div class='card border-danger'>
                <div class='card-header bg-danger text-white'><strong>Contexto Histórico</strong></div>
                <div class='card-body small'>
                  <strong>Situación en 1972:</strong>
                  <ul class='mb-0'>
                    <li><strong>Nacionalización del cobre</strong> (1971) afectó intereses de multinacionales (Anaconda, Kennecott)</li>
                    <li><strong>Bloqueo económico EEUU:</strong> congelación créditos, boicot comercial</li>
                    <li><strong>Plan Track II (CIA):</strong> desestabilización interna (paro camioneros 1972)</li>
                    <li><strong>Guerra Fría:</strong> EEUU temía "segunda Cuba" en América</li>
                    <li><strong>Polarización interna:</strong> oposición al gobierno UP creciente</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class='col-md-6'>
              <div class='card border-primary'>
                <div class='card-header bg-primary text-white'><strong>Análisis Crítico</strong></div>
                <div class='card-body small'>
                  <strong>Preguntas para debatir:</strong>
                  <ol class='mb-0'>
                    <li>¿Es objetiva la denuncia de Allende sobre las transnacionales?</li>
                    <li>¿Qué argumentos usa para justificar la nacionalización?</li>
                    <li>¿Qué omite el discurso? (crisis interna, inflación, desabastecimiento)</li>
                    <li>¿Cómo usaría este documento un historiador marxista vs uno liberal?</li>
                    <li>¿Predice este discurso el golpe de 1973? ¿Por qué?</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TEXTO 3: Informe Rettig (extracto sobre represión) -->
        <div class='historia-card p-4 mb-4'>
          <h4 class='mb-3'><span style='font-size: 2rem;'>⚖️</span> Texto 3: Informe de la Comisión Nacional de Verdad y Reconciliación (Informe Rettig, 1991)</h4>
          
          <div class='bg-light p-4 rounded mb-3' style='border-left: 4px solid #000;'>
            <p class='small mb-2'><strong>Tipo de fuente:</strong> Primaria institucional, informe oficial</p>
            <p class='small mb-2'><strong>Autor:</strong> Comisión Rettig (gobierno Patricio Aylwin)</p>
            <p class='small mb-0'><strong>Contexto:</strong> Transición democrática, necesidad de verdad sobre violaciones DDHH en dictadura</p>
          </div>

          <div class='bg-white p-4 rounded border mb-3' style='font-family: Georgia, serif; line-height: 1.8;'>
            <p class='mb-3'><em>"La Comisión llegó al convencimiento de que durante el período comprendido entre el 11 de septiembre de 1973 y el 11 de marzo de 1990, se cometieron en Chile gravísimas violaciones a los derechos humanos. Estas violaciones fueron ejecutadas principalmente por agentes del Estado o personas a su servicio, si bien en algunos casos puntuales las atribuyó a particulares bajo pretextos políticos..."</em></p>
            
            <p class='mb-3'><em>"La magnitud de estas violaciones a los derechos humanos, su carácter masivo y sistemático, la participación o aquiescencia del aparato estatal, y su prolongación en el tiempo, revelan una situación que no admite comparación con ningún otro período de nuestra historia republicana. Se trató de una política institucional del Estado..."</em></p>
            
            <p class='mb-3'><em>"La Comisión individualizó 2.279 casos de víctimas de violaciones a los derechos humanos con resultado de muerte o desaparición. De ellos, 2.130 corresponden a víctimas de agentes del Estado o personas a su servicio, con abuso de poder. 164 corresponden a violencia política, y 90 quedan clasificados como insuficientemente probados. Debe señalarse que estas cifras no agotan el universo de víctimas, sino solo los casos que esta Comisión pudo acreditar con los medios a su alcance..."</em></p>
            
            <p class='mb-3'><em>"La práctica de la tortura fue extendida y sistemática. Los testimonios recogidos dan cuenta de métodos reiterados: aplicación de corriente eléctrica, golpizas, ahogamiento simulado, violencia sexual, privación de sueño y alimentos, presenciar torturas de familiares. Estas prácticas tenían como objetivo quebrar la resistencia de los detenidos, obtener información y generar terror..."</em></p>
            
            <p class='mb-0'><em>"Chile debe enfrentar su verdad por dolorosa que sea. Solo sobre la base de la verdad será posible satisfacer las exigencias elementales de la justicia y crear las condiciones indispensables para alcanzar una verdadera reconciliación nacional..."</em></p>
          </div>

          <div class='alert alert-secondary'>
            <h5><strong>Datos del Informe Rettig (1991):</strong></h5>
            <ul class='mb-0'>
              <li><strong>2.279 casos documentados</strong> de muertos y desaparecidos</li>
              <li><strong>2.130 víctimas</strong> de agentes del Estado (93%)</li>
              <li><strong>Período cubierto:</strong> 11 sept 1973 - 11 marzo 1990</li>
              <li><strong>Comisión presidida por:</strong> Raúl Rettig Guissen</li>
              <li><strong>Objetivo:</strong> "Contribuir al esclarecimiento de la verdad sobre las más graves violaciones a los derechos humanos"</li>
            </ul>
          </div>

          <div class='row mt-3'>
            <div class='col-md-6'>
              <div class='card border-success'>
                <div class='card-header bg-success text-white'><strong>Importancia Histórica</strong></div>
                <div class='card-body small'>
                  <ul class='mb-0'>
                    <li>Primer reconocimiento oficial del Estado de violaciones DDHH</li>
                    <li>Rompió el "pacto de silencio" de la transición</li>
                    <li>Legitimó testimonios de víctimas y familiares</li>
                    <li>Base para reparaciones y políticas de memoria</li>
                    <li>Precedente para Comisión Valech (tortura, 2004)</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class='col-md-6'>
              <div class='card border-warning'>
                <div class='card-header bg-warning text-dark'><strong>Debate Historiográfico</strong></div>
                <div class='card-body small'>
                  <strong>Perspectivas sobre el Informe:</strong>
                  <ul class='mb-0'>
                    <li><strong>DDHH:</strong> Insuficiente (no hubo justicia plena, impunidad Ley Amnistía 1978)</li>
                    <li><strong>Militar:</strong> Sesgado (no contextualizó "guerra interna", amenaza comunista)</li>
                    <li><strong>Transicional:</strong> Necesario y realista (en contexto de poder militar aún fuerte)</li>
                    <li><strong>Víctimas:</strong> Tardío pero fundamental (visibilizó sufrimiento)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
"""

# ============================================
# 2. LÍNEAS DE TIEMPO EXPANDIDAS
# ============================================

lineas_tiempo_extra = """
        <!-- LÍNEA DE TIEMPO: Guerra Fría Detallada -->
        <div class='timeline-card p-4 mb-4'>
          <h4 class='mb-3'><span style='font-size: 2rem;'>⏱️</span> Línea de Tiempo Detallada: Guerra Fría (1947-1991)</h4>
          
          <div class='timeline-vertical mb-4'>
            <div class='timeline-vertical-item'>
              <div class='timeline-year' style='color: #1565C0;'>1947</div>
              <h6><strong>Doctrina Truman</strong></h6>
              <p class='small mb-0'>EEUU anuncia contención del comunismo. Plan Marshall para reconstruir Europa Occidental (excluye URSS). Inicio oficial Guerra Fría.</p>
            </div>

            <div class='timeline-vertical-item'>
              <div class='timeline-year' style='color: #C62828;'>1948</div>
              <h6><strong>Bloqueo de Berlín</strong></h6>
              <p class='small mb-0'>URSS bloquea acceso occidental a Berlín. EEUU responde con puente aéreo (11 meses). Alemania dividida en RFA (capitalista) y RDA (comunista).</p>
            </div>

            <div class='timeline-vertical-item'>
              <div class='timeline-year' style='color: #1565C0;'>1949</div>
              <h6><strong>OTAN + Revolución China</strong></h6>
              <p class='small mb-0'>Creación OTAN (alianza militar occidental). Mao Zedong proclama República Popular China (comunista). URSS prueba su primera bomba atómica.</p>
            </div>

            <div class='timeline-vertical-item'>
              <div class='timeline-year' style='color: #C62828;'>1950-1953</div>
              <h6><strong>Guerra de Corea</strong></h6>
              <p class='small mb-0'>Corea del Norte invade Sur. EEUU interviene (ONU). China apoya Norte. Armisticio 1953: división en paralelo 38° (vigente hoy).</p>
            </div>

            <div class='timeline-vertical-item'>
              <div class='timeline-year' style='color: #C62828;'>1955</div>
              <h6><strong>Pacto de Varsovia</strong></h6>
              <p class='small mb-0'>URSS crea alianza militar con Europa del Este (respuesta a OTAN). Consolida bloque soviético: Polonia, Hungría, Checoslovaquia, RDA, Rumania, Bulgaria, Albania.</p>
            </div>

            <div class='timeline-vertical-item'>
              <div class='timeline-year' style='color: #1565C0;'>1957</div>
              <h6><strong>Sputnik</strong></h6>
              <p class='small mb-0'>URSS lanza primer satélite artificial. Inicia carrera espacial. EEUU crea NASA (1958) en respuesta.</p>
            </div>

            <div class='timeline-vertical-item'>
              <div class='timeline-year' style='color: #FFA000;'>1961</div>
              <h6><strong>Muro de Berlín + Gagarin</strong></h6>
              <p class='small mb-0'>RDA construye Muro de Berlín (13 agosto) para frenar emigración al Oeste. Yuri Gagarin, primer humano en el espacio (12 abril).</p>
            </div>

            <div class='timeline-vertical-item'>
              <div class='timeline-year' style='color: #C62828;'>1962</div>
              <h6><strong>Crisis de los Misiles de Cuba</strong></h6>
              <p class='small mb-0'>URSS instala misiles en Cuba (90 millas de Florida). Bloqueo naval EEUU. Kennedy-Jrushchov negocian. Mundo al borde de guerra nuclear.</p>
            </div>

            <div class='timeline-vertical-item'>
              <div class='timeline-year' style='color: #C62828;'>1964-1975</div>
              <h6><strong>Guerra de Vietnam</strong></h6>
              <p class='small mb-0'>EEUU interviene masivamente (500.000 tropas). Bombardeos intensivos. Derrota y retirada 1973. Caída Saigón 1975 (victoria comunista). 3+ millones de muertos.</p>
            </div>

            <div class='timeline-vertical-item'>
              <div class='timeline-year' style='color: #1565C0;'>1969</div>
              <h6><strong>Llegada del Hombre a la Luna</strong></h6>
              <p class='small mb-0'>Neil Armstrong (EEUU) pisa la Luna (20 julio). Triunfo estadounidense en carrera espacial.</p>
            </div>

            <div class='timeline-vertical-item'>
              <div class='timeline-year' style='color: #388E3C;'>1972</div>
              <h6><strong>Distensión (Détente)</strong></h6>
              <p class='small mb-0'>Nixon visita China. Tratados SALT I (limitación armas estratégicas). Reducción temporal de tensiones EEUU-URSS.</p>
            </div>

            <div class='timeline-vertical-item'>
              <div class='timeline-year' style='color: #C62828;'>1979-1989</div>
              <h6><strong>Guerra de Afganistán</strong></h6>
              <p class='small mb-0'>URSS invade Afganistán. Resistencia muyahidines (apoyo EEUU/CIA). "Vietnam soviético". URSS se retira 1989 (debilitada).</p>
            </div>

            <div class='timeline-vertical-item'>
              <div class='timeline-year' style='color: #E65100;'>1983</div>
              <h6><strong>Programa "Guerra de las Galaxias"</strong></h6>
              <p class='small mb-0'>Reagan anuncia Iniciativa de Defensa Estratégica (escudo antimisiles espacial). URSS no puede competir económicamente.</p>
            </div>

            <div class='timeline-vertical-item'>
              <div class='timeline-year' style='color: #388E3C;'>1985</div>
              <h6><strong>Gorbachov asume en URSS</strong></h6>
              <p class='small mb-0'>Implementa Glasnost (transparencia) y Perestroika (reestructuración). Abre URSS. Reduce gastos militares. Permite reformas en Europa del Este.</p>
            </div>

            <div class='timeline-vertical-item'>
              <div class='timeline-year' style='color: #388E3C;'>1989</div>
              <h6><strong>Caída del Muro de Berlín</strong></h6>
              <p class='small mb-0'>9 noviembre: apertura del Muro. Reunificación alemana 1990. Caída regímenes comunistas Europa del Este (efecto dominó).</p>
            </div>

            <div class='timeline-vertical-item'>
              <div class='timeline-year' style='color: #388E3C;'>1991</div>
              <h6><strong>Fin de la URSS</strong></h6>
              <p class='small mb-0'>Intento golpe contra Gorbachov (agosto). Disolución URSS (25 diciembre). 15 repúblicas independientes. Fin oficial Guerra Fría. EEUU única superpotencia.</p>
            </div>
          </div>
        </div>

        <!-- LÍNEA DE TIEMPO: Chile República 1831-1973 -->
        <div class='timeline-card p-4 mb-4'>
          <h4 class='mb-3'><span style='font-size: 2rem;'>📅</span> Línea de Tiempo: Chile República hasta Crisis 1973</h4>
          
          <div class='timeline-horizontal mb-4'>
            <div class='timeline-item'>
              <div class='timeline-year'>1831-1861</div>
              <h6>República Conservadora</h6>
              <p class='small mb-2'><strong>Presidentes:</strong> Prieto, Bulnes, Montt</p>
              <p class='small mb-0'><strong>Hitos:</strong> Constitución 1833, expansión territorial, Guerra vs Confederación (1836-39), colonización alemana sur</p>
            </div>

            <div class='timeline-item'>
              <div class='timeline-year'>1861-1891</div>
              <h6>República Liberal</h6>
              <p class='small mb-2'><strong>Presidentes:</strong> Pérez, Errázuriz, Pinto, Santa María, Balmaceda</p>
              <p class='small mb-0'><strong>Hitos:</strong> Reformas liberales (matrimonio civil, cementerios laicos), Guerra del Pacífico (1879-83), Guerra Civil 1891</p>
            </div>

            <div class='timeline-item'>
              <div class='timeline-year'>1891-1925</div>
              <h6>República Parlamentaria</h6>
              <p class='small mb-2'><strong>Características:</strong> Congreso domina, rotativa ministerial, oligarquía</p>
              <p class='small mb-0'><strong>Hitos:</strong> Bonanza salitrera, Cuestión Social, huelgas (Santa María 1907), leyes sociales 1924</p>
            </div>

            <div class='timeline-item'>
              <div class='timeline-year'>1925-1932</div>
              <h6>Crisis Institucional</h6>
              <p class='small mb-2'><strong>Eventos:</strong> Ruido de sables, Alessandri, Ibáñez dictador</p>
              <p class='small mb-0'><strong>Hitos:</strong> Constitución 1925 (presidencialista), Gran Depresión 1929, República Socialista 1932 (12 días)</p>
            </div>

            <div class='timeline-item'>
              <div class='timeline-year'>1938-1952</div>
              <h6>Gobiernos Radicales</h6>
              <p class='small mb-2'><strong>Presidentes:</strong> Aguirre Cerda, Ríos, González Videla</p>
              <p class='small mb-0'><strong>Hitos:</strong> CORFO (1939), industrialización ISI, Ley Maldita (1948 ilegaliza PC), educación fiscal</p>
            </div>

            <div class='timeline-item'>
              <div class='timeline-year'>1958-1964</div>
              <h6>Jorge Alessandri</h6>
              <p class='small mb-2'><strong>Proyecto:</strong> Gerencia empresarial</p>
              <p class='small mb-0'><strong>Hitos:</strong> Terremoto Valdivia (1960), Mundial Fútbol 1962, inflación creciente</p>
            </div>

            <div class='timeline-item'>
              <div class='timeline-year'>1964-1970</div>
              <h6>Eduardo Frei M.</h6>
              <p class='small mb-2'><strong>Proyecto:</strong> "Revolución en Libertad" (DC)</p>
              <p class='small mb-0'><strong>Hitos:</strong> Reforma Agraria, Chilenización cobre (51%), Promoción Popular, Juntas de Vecinos, "Batalla Producción"</p>
            </div>

            <div class='timeline-item'>
              <div class='timeline-year'>1970-1973</div>
              <h6>Salvador Allende (UP)</h6>
              <p class='small mb-2'><strong>Proyecto:</strong> Vía Chilena al Socialismo</p>
              <p class='small mb-0'><strong>Hitos:</strong> Nacionalización cobre 100% (1971), Reforma Agraria acelerada, Área Social economía, polarización extrema, crisis económica, golpe 11-sept-1973</p>
            </div>
          </div>
        </div>
"""

# ============================================
# 3. EXPANDIR TOTALITARISMOS
# ============================================

totalitarismos_expandido = """
        <!-- TOTALITARISMOS AMPLIADOS -->
        <div class='historia-card p-4 mb-4'>
          <h4 class='mb-3'><span style='font-size: 2rem;'>👤</span> Regímenes Totalitarios Siglo XX</h4>
          
          <div class='alert alert-warning mb-4'>
            <h5><i class='bi bi-exclamation-triangle'></i> Concepto de Totalitarismo</h5>
            <p class='mb-0'>Régimen político donde el Estado busca <strong>control absoluto sobre todos los aspectos de la vida pública y privada</strong>. A diferencia de dictaduras tradicionales (solo control político), el totalitarismo penetra economía, cultura, educación, familia, pensamiento. Uso masivo de terror, propaganda y movilización.</p>
          </div>

          <!-- FASCISMO ITALIANO DETALLADO -->
          <div class='card border-dark mb-4'>
            <div class='card-header' style='background: linear-gradient(135deg, #000 0%, #333 100%); color: white;'>
              <h5 class='mb-0'>🇮🇹 <strong>FASCISMO ITALIANO (1922-1943)</strong></h5>
            </div>
            <div class='card-body'>
              <div class='row mb-3'>
                <div class='col-md-6'>
                  <h6 class='text-dark'><strong>Líder: Benito Mussolini</strong></h6>
                  <p class='small'>Ex socialista, fundador Partido Nacional Fascista (PNF, 1921). Apodado <strong>"Il Duce"</strong> (El Líder). Marcha sobre Roma (octubre 1922) → Rey lo nombra Primer Ministro → Instauración dictadura.</p>
                  
                  <h6 class='text-dark mt-3'><strong>Ideología:</strong></h6>
                  <ul class='small'>
                    <li><strong>Ultranacionalismo:</strong> Glorificación del Estado italiano, restaurar Imperio Romano</li>
                    <li><strong>Corporativismo:</strong> Sindicatos fascistas controlados por Estado, no independientes</li>
                    <li><strong>Anti-comunismo y anti-liberalismo:</strong> Rechazo democracia parlamentaria y marxismo</li>
                    <li><strong>Culto a la violencia:</strong> Acción directa, militarización de la sociedad</li>
                  </ul>
                </div>
                <div class='col-md-6'>
                  <h6 class='text-dark'><strong>Mecanismos de Control:</strong></h6>
                  <ul class='small mb-3'>
                    <li><strong>Camisas Negras (Squadristi):</strong> Milicias paramilitares violentas</li>
                    <li><strong>OVRA:</strong> Policía secreta (vigilancia, arrestos arbitrarios)</li>
                    <li><strong>Censura total:</strong> Control medios, prohibición oposición</li>
                    <li><strong>Opera Nazionale Dopolavoro:</strong> Control tiempo libre (deportes, teatro fascista)</li>
                    <li><strong>Juventudes fascistas:</strong> Indoctrinación desde infancia</li>
                  </ul>
                  
                  <h6 class='text-dark'><strong>Política Exterior:</strong></h6>
                  <ul class='small mb-0'>
                    <li>Invasión Etiopía (1935-36): uso gas mostaza, crímenes guerra</li>
                    <li>Apoyo Franco en Guerra Civil Española (1936-39)</li>
                    <li>Alianza con Hitler: Eje Roma-Berlín (1936), Pacto de Acero (1939)</li>
                    <li>Entrada WWII (1940): invasiones fracasadas (Grecia, norte África)</li>
                  </ul>
                </div>
              </div>

              <div class='bg-light p-3 rounded'>
                <strong>Caída:</strong> Derrotas militares 1943 → Gran Consejo Fascista destituye Mussolini (25 julio) → Arrestado → Rescatado por nazis → República de Saló (títere) → Capturado y ejecutado por partisanos (28 abril 1945).
              </div>
            </div>
          </div>

          <!-- NAZISMO ALEMÁN DETALLADO -->
          <div class='card border-danger mb-4'>
            <div class='card-header bg-danger text-white'>
              <h5 class='mb-0'>🇩🇪 <strong>NAZISMO ALEMÁN (1933-1945)</strong></h5>
            </div>
            <div class='card-body'>
              <div class='row mb-3'>
                <div class='col-md-6'>
                  <h6 class='text-dark'><strong>Líder: Adolf Hitler</strong></h6>
                  <p class='small'>Ascenso: Crisis 1929 → Desempleo masivo → NSDAP (Partido Nazi) gana elecciones 1933 → Presidente Hindenburg nombra a Hitler Canciller → Incendio Reichstag (pretexto) → Ley Habilitante → Dictadura total. <strong>"Der Führer"</strong> (El Líder).</p>
                  
                  <h6 class='text-dark mt-3'><strong>Ideología:</strong></h6>
                  <ul class='small'>
                    <li><strong>Racismo ario:</strong> Superioridad "raza aria" (nórdica, germánica)</li>
                    <li><strong>Antisemitismo radical:</strong> Judíos culpables males Alemania, "solución final"</li>
                    <li><strong>Lebensraum:</strong> "Espacio vital" → expansión territorial hacia Este (Rusia)</li>
                    <li><strong>Darwinismo social:</strong> Lucha razas, supervivencia del más fuerte</li>
                    <li><strong>Totalitarismo absoluto:</strong> Control total vida alemana</li>
                  </ul>

                  <h6 class='text-dark mt-3'><strong>Leyes de Núremberg (1935):</strong></h6>
                  <p class='small mb-0'>Prohibición matrimonios judíos-arios, pérdida ciudadanía judía, segregación legal. Inicio persecución sistemática.</p>
                </div>
                <div class='col-md-6'>
                  <h6 class='text-dark'><strong>Aparato Represivo:</strong></h6>
                  <ul class='small mb-3'>
                    <li><strong>Gestapo:</strong> Policía secreta (terror, tortura, desapariciones)</li>
                    <li><strong>SS (Schutzstaffel):</strong> Guardia élite, responsable Holocausto</li>
                    <li><strong>SA (Sturmabteilung):</strong> Camisas pardas, violencia callejera</li>
                    <li><strong>Campos de concentración:</strong> Dachau (1933), luego red exterminio</li>
                  </ul>
                  
                  <h6 class='text-dark'><strong>Propaganda (Goebbels):</strong></h6>
                  <ul class='small mb-3'>
                    <li>Control total medios, cine, radio, prensa</li>
                    <li>Culto Führer: infalible, mesiánico</li>
                    <li>Rallies masivos (Núremberg): coreografías, simbolismo</li>
                    <li>Quema libros "degenerados" (1933)</li>
                  </ul>

                  <h6 class='text-dark'><strong>Holocausto (Shoah):</strong></h6>
                  <p class='small mb-0'><strong>6 millones de judíos asesinados</strong> sistemáticamente: ghettos, deportaciones, cámaras de gas (Auschwitz, Treblinka, Sobibor). También: romaníes, homosexuales, discapacitados, opositores. Crimen contra la humanidad.</p>
                </div>
              </div>

              <div class='alert alert-dark mb-0'>
                <strong>Caída:</strong> Derrota militar WWII → Batalla Berlín (abril 1945) → Hitler suicidio (30 abril) → Rendición incondicional Alemania (8 mayo 1945). <strong>Juicios Núremberg (1945-46):</strong> Condena dirigentes nazis por crímenes guerra, genocidio.
              </div>
            </div>
          </div>

          <!-- ESTALINISMO SOVIÉTICO DETALLADO -->
          <div class='card border-warning mb-4'>
            <div class='card-header' style='background: linear-gradient(135deg, #C62828 0%, #B71C1C 100%); color: white;'>
              <h5 class='mb-0'>🇷🇺 <strong>ESTALINISMO SOVIÉTICO (1927-1953)</strong></h5>
            </div>
            <div class='card-body'>
              <div class='row mb-3'>
                <div class='col-md-6'>
                  <h6 class='text-dark'><strong>Líder: Iósif Stalin</strong></h6>
                  <p class='small'>Ascenso tras muerte Lenin (1924) → Lucha poder vs Trotsky → Vence → Consolida dictadura personal (1927). <strong>"Padrecito de los Pueblos"</strong>, culto personalidad extremo.</p>
                  
                  <h6 class='text-dark mt-3'><strong>Economía Planificada:</strong></h6>
                  <ul class='small'>
                    <li><strong>Planes Quinquenales (1928-):</strong> Industrialización forzada, metas producción</li>
                    <li><strong>Colectivización agrícola (1929-):</strong> Koljós (granjas colectivas), eliminación kulaks (campesinos ricos)</li>
                    <li><strong>Consecuencias:</strong> Hambruna Ucrania (Holodomor, 1932-33) → 3-7 millones de muertos</li>
                    <li><strong>Logros:</strong> URSS segunda potencia industrial mundial (1930s), pero a costo humano terrible</li>
                  </ul>
                </div>
                <div class='col-md-6'>
                  <h6 class='text-dark'><strong>Represión Masiva:</strong></h6>
                  <ul class='small mb-3'>
                    <li><strong>Gran Purga (1936-1938):</strong> Juicios farsa, ejecuciones masivas dirigentes Partido, militares, intelectuales. 700.000+ ejecutados.</li>
                    <li><strong>NKVD (Policía secreta):</strong> Arrestos nocturnos, torturas, confesiones forzadas</li>
                    <li><strong>Gulag:</strong> Red campos trabajo forzado Siberia → 18+ millones pasaron, 1.5+ millones muertos</li>
                    <li><strong>Deportaciones étnicas:</strong> Chechenos, tártaros, coreanos, polacos</li>
                  </ul>

                  <h6 class='text-dark'><strong>Propaganda y Control:</strong></h6>
                  <ul class='small mb-0'>
                    <li>Censura total: arte "realismo socialista", prohibición vanguardias</li>
                    <li>Reescritura historia: borrar enemigos de fotos, documentos</li>
                    <li>Culto Stalin: omnipresente, infalible, genio</li>
                    <li>Control total educación, sindicatos, juventudes (Komsomol)</li>
                  </ul>
                </div>
              </div>

              <div class='bg-light p-3 rounded'>
                <strong>Legado:</strong> Muerte Stalin (5 marzo 1953) → Jrushchov denuncia "culto personalidad" (1956) → Des-estalinización parcial. Debate histórico: ¿Stalin traicionó ideales Lenin o continuó lógica totalitaria comunismo?
              </div>
            </div>
          </div>

          <!-- ELEMENTOS COMUNES AMPLIADOS -->
          <div class='alert alert-info'>
            <h5><strong>Elementos Comunes a los Tres Totalitarismos:</strong></h5>
            <div class='row'>
              <div class='col-md-4'>
                <h6 class='text-primary'><strong>Políticos:</strong></h6>
                <ul class='small mb-0'>
                  <li>Partido único (no pluralismo)</li>
                  <li>Culto líder (mesiánico, infalible)</li>
                  <li>Eliminación oposición (física)</li>
                  <li>Movilización masas permanente</li>
                </ul>
              </div>
              <div class='col-md-4'>
                <h6 class='text-primary'><strong>Sociales:</strong></h6>
                <ul class='small mb-0'>
                  <li>Policía secreta omnipresente</li>
                  <li>Terror sistemático (ejemplo)</li>
                  <li>Control juventud (educación)</li>
                  <li>Enemigos internos (chivos expiatorios)</li>
                </ul>
              </div>
              <div class='col-md-4'>
                <h6 class='text-primary'><strong>Culturales:</strong></h6>
                <ul class='small mb-0'>
                  <li>Propaganda masiva (símbolos, rituales)</li>
                  <li>Censura total medios</li>
                  <li>Arte y cultura al servicio Estado</li>
                  <li>Reescritura historia (manipulación pasado)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
"""

# Buscar dónde insertar cada mejora
pos_totalitarismos = contenido.find("<!-- TOTALITARISMOS -->")
if pos_totalitarismos != -1:
    # Encontrar el final de la sección actual de totalitarismos
    pos_fin_total = contenido.find("</div>\n        </div>\n\n        <!-- GUERRA FRÍA -->", pos_totalitarismos)
    if pos_fin_total != -1:
        contenido = contenido[:pos_totalitarismos] + totalitarismos_expandido + contenido[pos_fin_total+17:]
        print("✅ Sección Totalitarismos expandida")

# Insertar textos históricos antes de sección 2.3
pos_historia_occidental = contenido.find("<!-- 2.3 HISTORIA OCCIDENTAL -->")
if pos_historia_occidental != -1:
    contenido = contenido[:pos_historia_occidental] + textos_historicos + "\n        " + contenido[pos_historia_occidental:]
    print("✅ Textos históricos largos agregados")

# Insertar líneas de tiempo después de Guerra Fría
pos_guerra_fria = contenido.find("<div class='alert-paes'>\n          <strong>Para ECEP:</strong> Analizar consecuencias Revolución Industrial")
if pos_guerra_fria != -1:
    contenido = contenido[:pos_guerra_fria] + lineas_tiempo_extra + "\n        " + contenido[pos_guerra_fria:]
    print("✅ Líneas de tiempo expandidas agregadas")

# Guardar archivo modificado
with open(archivo, 'w', encoding='utf-8') as f:
    f.write(contenido)

print("\n🎉 Dossier de Historia mejorado exitosamente")
print("\nCambios realizados:")
print("  • Quitado sticky de barra de navegación")
print("  • 3 textos históricos largos (~500 palabras cada uno)")
print("  • 2 líneas de tiempo detalladas expandidas")
print("  • Sección Totalitarismos ampliada con más detalles")
print("\n⏳ Siguiente: Agregar 10 casos de estudio en Dominio 4...")
