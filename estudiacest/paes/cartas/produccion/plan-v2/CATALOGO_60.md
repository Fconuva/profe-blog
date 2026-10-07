# Catálogo completo: 60 cartas

Diseño cerrado umbral-diseno-2.0. Estas fichas describen la ampliación; no son el catálogo operativo publicado. No reemplazar automáticamente cartas de duelos v1.

Los límites globales y el orden de resolución están en [plan completo](../PLAN_COLECCION_2_COMPLETO.md). Todas las cifras son valores de diseño sujetos al protocolo de calibración antes de liberar un motor nuevo.

## 01. Guardiana del umbral

- ID estable: `guardian`. Familia: Aliado. Rareza: Común, color #9BA5B0. Máximo por mazo: 2.
- Coste: 2 maná. Fuerza 2; vida 5; palabras clave: custodia.
- Texto visible: «Custodia. Fuerza 2, vida 5.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Defensa. Respuesta rival o límite: Daño de área o un atacante de fuerza alta..
- Ilustración: sujeto original «adult woman with bronze armor and a broad shield»; archivo público previsto `assets/guardian.webp`.
- Prueba obligatoria: `CARD-01`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[]
```

## 02. Exploradora del paso

- ID estable: `exploradora`. Familia: Aliado. Rareza: Común, color #9BA5B0. Máximo por mazo: 2.
- Coste: 1 maná. Fuerza 2; vida 3; palabras clave: ninguna.
- Texto visible: «Fuerza 2, vida 3. Ataca desde tu siguiente turno.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Presión temprana. Respuesta rival o límite: Llama reveladora o un defensor de mayor vida..
- Ilustración: sujeto original «adult woman with a green cloak and a brass compass»; archivo público previsto `assets/exploradora.webp`.
- Prueba obligatoria: `CARD-02`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[]
```

## 03. Centinela de bronce

- ID estable: `centinela`. Familia: Aliado. Rareza: Común, color #9BA5B0. Máximo por mazo: 2.
- Coste: 3 maná. Fuerza 4; vida 7; palabras clave: ninguna.
- Texto visible: «Fuerza 4, vida 7. Ataca desde tu siguiente turno.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Amenaza resistente. Respuesta rival o límite: Congelación, equipo rival o daño combinado..
- Ilustración: sujeto original «adult man in weathered bronze armor»; archivo público previsto `assets/centinela.webp`.
- Prueba obligatoria: `CARD-03`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[]
```

## 04. Testigo del sendero

- ID estable: `testigo`. Familia: Aliado. Rareza: Común, color #9BA5B0. Máximo por mazo: 2.
- Coste: 2 maná. Fuerza 3; vida 5; palabras clave: ninguna.
- Texto visible: «Fuerza 3, vida 5. Si ya citaste este turno, entra con 1 fuerza adicional.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Sinergia de lectura. Respuesta rival o límite: Custodia o daño antes de que ataque..
- Ilustración: sujeto original «adult man carrying a covered lantern on a forest path»; archivo público previsto `assets/testigo.webp`.
- Prueba obligatoria: `CARD-04`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "attackBonus",
    "value": 1,
    "scope": "summoned",
    "trigger": "enter",
    "condition": "citedThisTurn"
  }
]
```

## 05. Llama reveladora

- ID estable: `fuego`. Familia: Hechizo. Rareza: Común, color #9BA5B0. Máximo por mazo: 2.
- Coste: 1 maná.
- Texto visible: «Inflige 3 de daño a un objetivo rival. Respeta Custodia.»
- Objetivo de selección: `enemyGuarded`; se valida antes de consumir carta o maná.
- Papel: Daño eficiente. Respuesta rival o límite: Escudo o Custodia..
- Ilustración: sujeto original «one curling amber flame»; archivo público previsto `assets/llama.webp`.
- Prueba obligatoria: `CARD-05`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "directDamage",
    "value": 3,
    "scope": "enemyGuarded",
    "trigger": "play"
  }
]
```

## 06. Sello protector

- ID estable: `escudo`. Familia: Hechizo. Rareza: Común, color #9BA5B0. Máximo por mazo: 2.
- Coste: 1 maná.
- Texto visible: «Tu refugio obtiene 5 de escudo hasta el inicio de tu próximo turno.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Protección. Respuesta rival o límite: Esperar su expiración o usar daño superior al escudo..
- Ilustración: sujeto original «a round teal magical seal»; archivo público previsto `assets/sello.webp`.
- Prueba obligatoria: `CARD-06`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "shield",
    "value": 5,
    "scope": "self",
    "trigger": "play"
  }
]
```

## 07. Luz reparadora

- ID estable: `cura`. Familia: Hechizo. Rareza: Común, color #9BA5B0. Máximo por mazo: 2.
- Coste: 1 maná.
- Texto visible: «Recupera 4 de vida de tu refugio, sin superar 32.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Recuperación. Respuesta rival o límite: Presión sostenida; no protege aliados..
- Ilustración: sujeto original «a turquoise healing orb»; archivo público previsto `assets/cura.webp`.
- Prueba obligatoria: `CARD-07`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "heal",
    "value": 4,
    "scope": "self",
    "trigger": "play"
  }
]
```

## 08. Consulta las fuentes

- ID estable: `fuente`. Familia: Hechizo. Rareza: Común, color #9BA5B0. Máximo por mazo: 2.
- Coste: 1 maná.
- Texto visible: «Roba 2 cartas. Tu mano admite hasta 8.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Selección de recursos. Respuesta rival o límite: No aporta vida, protección ni daño inmediato..
- Ilustración: sujeto original «a closed book with two floating sheets»; archivo público previsto `assets/fuentes.webp`.
- Prueba obligatoria: `CARD-08`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "draw",
    "value": 2,
    "scope": "self",
    "trigger": "play"
  }
]
```

## 09. Armadura de argumentos

- ID estable: `armadura`. Familia: Reliquia. Rareza: Común, color #9BA5B0. Máximo por mazo: 2.
- Coste: 1 maná.
- Texto visible: «Equipa un aliado: obtiene 1 de fuerza y 2 de vida. Máximo 2 reliquias por aliado.»
- Objetivo de selección: `ownAlly`; se valida antes de consumir carta o maná.
- Papel: Mejora equilibrada. Respuesta rival o límite: Eliminar o congelar al aliado equipado..
- Ilustración: sujeto original «bronze chest armor with teal inlays»; archivo público previsto `assets/armadura.webp`.
- Prueba obligatoria: `CARD-09`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "equip",
    "value": 0,
    "scope": "ownAlly",
    "trigger": "play",
    "attack": 1,
    "hp": 2
  }
]
```

## 10. Cita viva

- ID estable: `cita`. Familia: Lectura. Rareza: Común, color #9BA5B0. Máximo por mazo: 2.
- Coste: 0 maná.
- Texto visible: «Cita un fragmento y explica su relación: gana 1 maná, 1 de escudo y roba 1 carta. Una lectura por turno.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Preparación de combinaciones. Respuesta rival o límite: Su límite por turno y la mano máxima impiden cadenas ilimitadas..
- Ilustración: sujeto original «a parchment connected to a luminous thread»; archivo público previsto `assets/cita.webp`.
- Prueba obligatoria: `CARD-10`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "mana",
    "value": 1,
    "scope": "self",
    "trigger": "play"
  },
  {
    "op": "shield",
    "value": 1,
    "scope": "self",
    "trigger": "play"
  },
  {
    "op": "draw",
    "value": 1,
    "scope": "self",
    "trigger": "play"
  }
]
```

## 11. Mensajera del alba

- ID estable: `mensajera`. Familia: Aliado. Rareza: Común, color #9BA5B0. Máximo por mazo: 2.
- Coste: 1 maná. Fuerza 1; vida 2; palabras clave: ninguna.
- Texto visible: «Fuerza 1, vida 2. Al entrar, roba 1 carta.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Reemplazo de mano. Respuesta rival o límite: Daño de área; resistencia reducida..
- Ilustración: sujeto original «young adult woman with short auburn hair and copper satchel»; archivo público previsto `assets/mensajera.webp`.
- Prueba obligatoria: `CARD-11`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "draw",
    "value": 1,
    "scope": "self",
    "trigger": "enter"
  }
]
```

## 12. Vigía de la muralla

- ID estable: `vigia`. Familia: Aliado. Rareza: Común, color #9BA5B0. Máximo por mazo: 2.
- Coste: 1 maná. Fuerza 1; vida 4; palabras clave: custodia.
- Texto visible: «Custodia. Fuerza 1, vida 4.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Defensa temprana. Respuesta rival o límite: Daño dirigido de 4 o un ataque fuerte..
- Ilustración: sujeto original «older dark-skinned man with wooden round shield»; archivo público previsto `assets/vigia.webp`.
- Prueba obligatoria: `CARD-12`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[]
```

## 13. Aprendiz de runas

- ID estable: `aprendiz`. Familia: Aliado. Rareza: Común, color #9BA5B0. Máximo por mazo: 2.
- Coste: 1 maná. Fuerza 3; vida 2; palabras clave: ninguna.
- Texto visible: «Fuerza 3, vida 2. Ataca desde tu siguiente turno.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Ataque frágil. Respuesta rival o límite: Chispa combinada o un defensor..
- Ilustración: sujeto original «young adult man with curly black hair holding a violet rune»; archivo público previsto `assets/aprendiz.webp`.
- Prueba obligatoria: `CARD-13`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[]
```

## 14. Cartógrafa del valle

- ID estable: `cartografa`. Familia: Aliado. Rareza: Común, color #9BA5B0. Máximo por mazo: 2.
- Coste: 2 maná. Fuerza 2; vida 4; palabras clave: ninguna.
- Texto visible: «Fuerza 2, vida 4. Al entrar, obtén 2 de escudo.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Desarrollo con defensa. Respuesta rival o límite: Estadísticas moderadas; el escudo no la protege..
- Ilustración: sujeto original «woman with silver braid, parchment map and brass compass»; archivo público previsto `assets/cartografa.webp`.
- Prueba obligatoria: `CARD-14`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "shield",
    "value": 2,
    "scope": "self",
    "trigger": "enter"
  }
]
```

## 15. Lancero del puente

- ID estable: `lancero`. Familia: Aliado. Rareza: Común, color #9BA5B0. Máximo por mazo: 2.
- Coste: 2 maná. Fuerza 5; vida 2; palabras clave: ninguna.
- Texto visible: «Fuerza 5, vida 2. Ataca desde tu siguiente turno.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Eliminar unidades resistentes. Respuesta rival o límite: Daño pequeño antes de que ataque..
- Ilustración: sujeto original «armored man with a long silver spear on mossy bridge»; archivo público previsto `assets/lancero.webp`.
- Prueba obligatoria: `CARD-15`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[]
```

## 16. Médica del bosque

- ID estable: `medica`. Familia: Aliado. Rareza: Común, color #9BA5B0. Máximo por mazo: 2.
- Coste: 2 maná. Fuerza 2; vida 4; palabras clave: ninguna.
- Texto visible: «Fuerza 2, vida 4. Al entrar, recupera 2 de vida de tu refugio.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Recuperación con presencia. Respuesta rival o límite: Ataque sostenido; curación limitada..
- Ilustración: sujeto original «adult woman with dark curly hair and medicinal herb satchel»; archivo público previsto `assets/medica.webp`.
- Prueba obligatoria: `CARD-16`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "heal",
    "value": 2,
    "scope": "self",
    "trigger": "enter"
  }
]
```

## 17. Destello del alba

- ID estable: `destello`. Familia: Hechizo. Rareza: Común, color #9BA5B0. Máximo por mazo: 2.
- Coste: 1 maná.
- Texto visible: «Inflige 2 de daño a un objetivo rival y obtén 1 de escudo. Respeta Custodia.»
- Objetivo de selección: `enemyGuarded`; se valida antes de consumir carta o maná.
- Papel: Intercambio defensivo. Respuesta rival o límite: Objetivos de vida superior a 2..
- Ilustración: sujeto original «white sunburst over dark valley»; archivo público previsto `assets/destello.webp`.
- Prueba obligatoria: `CARD-17`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "directDamage",
    "value": 2,
    "scope": "enemyGuarded",
    "trigger": "play"
  },
  {
    "op": "shield",
    "value": 1,
    "scope": "self",
    "trigger": "play"
  }
]
```

## 18. Brisa del archivo

- ID estable: `brisa`. Familia: Hechizo. Rareza: Común, color #9BA5B0. Máximo por mazo: 2.
- Coste: 1 maná.
- Texto visible: «Roba 1 carta y obtén 2 de escudo.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Preparación defensiva. Respuesta rival o límite: No desarrolla aliados ni inflige daño..
- Ilustración: sujeto original «teal wind around a closed leather book»; archivo público previsto `assets/brisa.webp`.
- Prueba obligatoria: `CARD-18`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "draw",
    "value": 1,
    "scope": "self",
    "trigger": "play"
  },
  {
    "op": "shield",
    "value": 2,
    "scope": "self",
    "trigger": "play"
  }
]
```

## 19. Velo de piedra

- ID estable: `velo`. Familia: Hechizo. Rareza: Común, color #9BA5B0. Máximo por mazo: 2.
- Coste: 2 maná.
- Texto visible: «Obtén 10 de escudo hasta el inicio de tu próximo turno.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Resistir un ataque intenso. Respuesta rival o límite: Esperar; desaparece al comenzar el turno propio..
- Ilustración: sujeto original «floating stone fragments forming an arc»; archivo público previsto `assets/velo.webp`.
- Prueba obligatoria: `CARD-19`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "shield",
    "value": 10,
    "scope": "self",
    "trigger": "play"
  }
]
```

## 20. Chispa del debate

- ID estable: `chispa`. Familia: Hechizo. Rareza: Común, color #9BA5B0. Máximo por mazo: 2.
- Coste: 1 maná.
- Texto visible: «Inflige 1 de daño a cada aliado rival. Atraviesa Custodia.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Limpiar aliados debilitados. Respuesta rival o límite: Aliados resistentes y fila vacía..
- Ilustración: sujeto original «golden sparks over dark stone»; archivo público previsto `assets/chispa.webp`.
- Prueba obligatoria: `CARD-20`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "areaDamage",
    "value": 1,
    "scope": "enemyAllies",
    "trigger": "play"
  }
]
```

## 21. Brazales del camino

- ID estable: `braceros`. Familia: Reliquia. Rareza: Común, color #9BA5B0. Máximo por mazo: 2.
- Coste: 1 maná.
- Texto visible: «Equipa un aliado: obtiene 4 de vida, sin aumentar su fuerza.»
- Objetivo de selección: `ownAlly`; se valida antes de consumir carta o maná.
- Papel: Resistencia. Respuesta rival o límite: Congelación; el aliado mantiene su fuerza original..
- Ilustración: sujeto original «steel bracers with emerald inlays»; archivo público previsto `assets/braceros.webp`.
- Prueba obligatoria: `CARD-21`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "equip",
    "value": 0,
    "scope": "ownAlly",
    "trigger": "play",
    "attack": 0,
    "hp": 4
  }
]
```

## 22. Botas del viajero

- ID estable: `botas`. Familia: Reliquia. Rareza: Común, color #9BA5B0. Máximo por mazo: 2.
- Coste: 1 maná.
- Texto visible: «Equipa un aliado: obtiene 2 de fuerza y 1 de vida. No concede Prontitud.»
- Objetivo de selección: `ownAlly`; se valida antes de consumir carta o maná.
- Papel: Presión. Respuesta rival o límite: Daño de área o eliminación del portador..
- Ilustración: sujeto original «dark leather traveling boots»; archivo público previsto `assets/botas.webp`.
- Prueba obligatoria: `CARD-22`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "equip",
    "value": 0,
    "scope": "ownAlly",
    "trigger": "play",
    "attack": 2,
    "hp": 1
  }
]
```

## 23. Cotejo de fuentes

- ID estable: `cotejo`. Familia: Lectura. Rareza: Común, color #9BA5B0. Máximo por mazo: 2.
- Coste: 0 maná.
- Texto visible: «Cita y explica un fragmento: gana 1 maná y 3 de escudo. Comparte el límite de una lectura por turno.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Preparación defensiva. Respuesta rival o límite: No roba cartas y comparte límite con Cita viva..
- Ilustración: sujeto original «two parchment fragments joined by teal thread»; archivo público previsto `assets/cotejo.webp`.
- Prueba obligatoria: `CARD-23`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "mana",
    "value": 1,
    "scope": "self",
    "trigger": "play"
  },
  {
    "op": "shield",
    "value": 3,
    "scope": "self",
    "trigger": "play"
  }
]
```

## 24. Pregunta del lector

- ID estable: `pregunta`. Familia: Lectura. Rareza: Común, color #9BA5B0. Máximo por mazo: 2.
- Coste: 0 maná.
- Texto visible: «Cita y explica un fragmento: roba 2 cartas. Comparte el límite de una lectura por turno.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Selección. Respuesta rival o límite: No concede maná; la mano sigue limitada a 8..
- Ilustración: sujeto original «crystal prism over open book»; archivo público previsto `assets/pregunta.webp`.
- Prueba obligatoria: `CARD-24`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "draw",
    "value": 2,
    "scope": "self",
    "trigger": "play"
  }
]
```

## 25. Cronista de las mareas

- ID estable: `cronista`. Familia: Aliado. Rareza: Poco común, color #60CF89. Máximo por mazo: 2.
- Coste: 2 maná. Fuerza 2; vida 3; palabras clave: ninguna.
- Texto visible: «Fuerza 2, vida 3. Al entrar, roba 1 carta.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Desarrollo y robo. Respuesta rival o límite: Resistencia inferior a aliados sin robo del mismo coste..
- Ilustración: sujeto original «adult man in blue cloak with covered scroll»; archivo público previsto `assets/cronista.webp`.
- Prueba obligatoria: `CARD-25`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "draw",
    "value": 1,
    "scope": "self",
    "trigger": "enter"
  }
]
```

## 26. Custodio del archivo

- ID estable: `bibliotecario`. Familia: Aliado. Rareza: Poco común, color #60CF89. Máximo por mazo: 2.
- Coste: 3 maná. Fuerza 1; vida 6; palabras clave: custodia.
- Texto visible: «Custodia. Fuerza 1, vida 6. Al entrar, roba 1 carta.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Defensa con robo. Respuesta rival o límite: Fuerza baja y mayor coste..
- Ilustración: sujeto original «older woman with silver hair holding a closed book»; archivo público previsto `assets/bibliotecario.webp`.
- Prueba obligatoria: `CARD-26`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "draw",
    "value": 1,
    "scope": "self",
    "trigger": "enter"
  }
]
```

## 27. Réplica fundada

- ID estable: `replica`. Familia: Hechizo. Rareza: Poco común, color #60CF89. Máximo por mazo: 2.
- Coste: 1 maná.
- Texto visible: «Inflige 1 de daño; si ya citaste este turno, inflige 4. Respeta Custodia.»
- Objetivo de selección: `enemyGuarded`; se valida antes de consumir carta o maná.
- Papel: Daño condicionado. Respuesta rival o límite: Sin cita tiene poco daño; Custodia limita objetivos..
- Ilustración: sujeto original «two narrow opposing beams of light»; archivo público previsto `assets/replica.webp`.
- Prueba obligatoria: `CARD-27`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "directDamage",
    "value": 1,
    "scope": "enemyGuarded",
    "trigger": "play",
    "citedBonus": 3
  }
]
```

## 28. Faro del criterio

- ID estable: `faro`. Familia: Hechizo. Rareza: Poco común, color #60CF89. Máximo por mazo: 2.
- Coste: 2 maná.
- Texto visible: «Obtén 6 de escudo y roba 1 carta.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Defensa y selección. Respuesta rival o límite: El escudo expira y no protege aliados..
- Ilustración: sujeto original «amber lighthouse over dark sea»; archivo público previsto `assets/faro.webp`.
- Prueba obligatoria: `CARD-28`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "shield",
    "value": 6,
    "scope": "self",
    "trigger": "play"
  },
  {
    "op": "draw",
    "value": 1,
    "scope": "self",
    "trigger": "play"
  }
]
```

## 29. Rastreador de huellas

- ID estable: `rastreador`. Familia: Aliado. Rareza: Poco común, color #60CF89. Máximo por mazo: 2.
- Coste: 2 maná. Fuerza 3; vida 2; palabras clave: prontitud.
- Texto visible: «Prontitud. Fuerza 3, vida 2. Puede atacar al entrar.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Ataque inmediato. Respuesta rival o límite: Custodia y daño de respuesta; baja vida..
- Ilustración: sujeto original «adult ranger by glowing tracks»; archivo público previsto `assets/rastreador.webp`.
- Prueba obligatoria: `CARD-29`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[]
```

## 30. Ballestera del paso

- ID estable: `ballestera`. Familia: Aliado. Rareza: Poco común, color #60CF89. Máximo por mazo: 2.
- Coste: 2 maná. Fuerza 4; vida 4; palabras clave: ninguna.
- Texto visible: «Fuerza 4, vida 4. Ataca desde tu siguiente turno.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Ataque equilibrado. Respuesta rival o límite: Daño combinado antes de su turno..
- Ilustración: sujeto original «adult woman with wooden crossbow in mountain pass»; archivo público previsto `assets/ballestera.webp`.
- Prueba obligatoria: `CARD-30`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[]
```

## 31. Alquimista del rocío

- ID estable: `alquimista`. Familia: Aliado. Rareza: Poco común, color #60CF89. Máximo por mazo: 2.
- Coste: 2 maná. Fuerza 2; vida 3; palabras clave: ninguna.
- Texto visible: «Fuerza 2, vida 3. Al entrar, recupera 2 de vida y obtén 1 de escudo.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Recuperación mixta. Respuesta rival o límite: Menor resistencia que un aliado sin beneficios..
- Ilustración: sujeto original «older woman holding a turquoise flask»; archivo público previsto `assets/alquimista.webp`.
- Prueba obligatoria: `CARD-31`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "heal",
    "value": 2,
    "scope": "self",
    "trigger": "enter"
  },
  {
    "op": "shield",
    "value": 1,
    "scope": "self",
    "trigger": "enter"
  }
]
```

## 32. Lector de estrellas

- ID estable: `lector`. Familia: Aliado. Rareza: Poco común, color #60CF89. Máximo por mazo: 2.
- Coste: 3 maná. Fuerza 3; vida 4; palabras clave: ninguna.
- Texto visible: «Fuerza 3, vida 4. Al entrar, roba 1 carta.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Robo con ataque. Respuesta rival o límite: Coste 3 y vida 4 permiten intercambio..
- Ilustración: sujeto original «adult man with brass astrolabe under stars»; archivo público previsto `assets/lector.webp`.
- Prueba obligatoria: `CARD-32`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "draw",
    "value": 1,
    "scope": "self",
    "trigger": "enter"
  }
]
```

## 33. Defensora del archivo

- ID estable: `defensora`. Familia: Aliado. Rareza: Poco común, color #60CF89. Máximo por mazo: 2.
- Coste: 3 maná. Fuerza 3; vida 7; palabras clave: custodia.
- Texto visible: «Custodia. Fuerza 3, vida 7.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Defensa robusta. Respuesta rival o límite: Lanza, congelación o daño combinado..
- Ilustración: sujeto original «strong woman with silver rectangular shield»; archivo público previsto `assets/defensora.webp`.
- Prueba obligatoria: `CARD-33`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[]
```

## 34. Herbolaria de la ribera

- ID estable: `herbolaria`. Familia: Aliado. Rareza: Poco común, color #60CF89. Máximo por mazo: 2.
- Coste: 3 maná. Fuerza 3; vida 4; palabras clave: vinculoVital.
- Texto visible: «Fuerza 3, vida 4. Vínculo vital: al atacar, cura el daño efectivo que inflige.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Recuperación mediante combate. Respuesta rival o límite: Destruirla antes de atacar o absorber con escudo..
- Ilustración: sujeto original «woman in green cloak with luminous plants»; archivo público previsto `assets/herbolaria.webp`.
- Prueba obligatoria: `CARD-34`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[]
```

## 35. Espíritu del farol

- ID estable: `espiritu`. Familia: Aliado. Rareza: Poco común, color #60CF89. Máximo por mazo: 2.
- Coste: 1 maná. Fuerza 2; vida 1; palabras clave: ninguna.
- Texto visible: «Fuerza 2, vida 1. Al caer, tu refugio obtiene 3 de escudo.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Defensa diferida. Respuesta rival o límite: Solo deja escudo temporal; poca vida..
- Ilustración: sujeto original «small amber flame spirit inside glass lantern»; archivo público previsto `assets/espiritu.webp`.
- Prueba obligatoria: `CARD-35`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "shield",
    "value": 3,
    "scope": "self",
    "trigger": "death"
  }
]
```

## 36. Artesana de cristal

- ID estable: `artesana`. Familia: Aliado. Rareza: Poco común, color #60CF89. Máximo por mazo: 2.
- Coste: 2 maná. Fuerza 2; vida 3; palabras clave: ninguna.
- Texto visible: «Fuerza 2, vida 3. Al caer, roba 1 carta.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Recuperación de mano diferida. Respuesta rival o límite: Robo limitado por mano máxima; no activa al entrar..
- Ilustración: sujeto original «adult woman with red braid carving teal crystal»; archivo público previsto `assets/artesana.webp`.
- Prueba obligatoria: `CARD-36`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "draw",
    "value": 1,
    "scope": "self",
    "trigger": "death"
  }
]
```

## 37. Tormenta de páginas

- ID estable: `tormenta`. Familia: Hechizo. Rareza: Poco común, color #60CF89. Máximo por mazo: 2.
- Coste: 3 maná.
- Texto visible: «Inflige 3 de daño a cada aliado rival. Atraviesa Custodia.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Respuesta a filas amplias. Respuesta rival o límite: Aliados de más de 3 de vida y juego de una sola unidad..
- Ilustración: sujeto original «blank parchment pages with violet lightning»; archivo público previsto `assets/tormenta.webp`.
- Prueba obligatoria: `CARD-37`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "areaDamage",
    "value": 3,
    "scope": "enemyAllies",
    "trigger": "play"
  }
]
```

## 38. Agua del manantial

- ID estable: `purificar`. Familia: Hechizo. Rareza: Poco común, color #60CF89. Máximo por mazo: 2.
- Coste: 2 maná.
- Texto visible: «Recupera 8 de vida de tu refugio, sin superar 32.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Recuperación concentrada. Respuesta rival o límite: No elimina amenazas ni protege aliados..
- Ilustración: sujeto original «turquoise waterfall into stone basin»; archivo público previsto `assets/purificar.webp`.
- Prueba obligatoria: `CARD-38`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "heal",
    "value": 8,
    "scope": "self",
    "trigger": "play"
  }
]
```

## 39. Lanza del testimonio

- ID estable: `lanza`. Familia: Reliquia. Rareza: Poco común, color #60CF89. Máximo por mazo: 2.
- Coste: 2 maná.
- Texto visible: «Equipa un aliado: obtiene 3 de fuerza y 3 de vida.»
- Objetivo de selección: `ownAlly`; se valida antes de consumir carta o maná.
- Papel: Mejora ofensiva. Respuesta rival o límite: Congelación y concentración de daño en el portador..
- Ilustración: sujeto original «silver spear with sapphire inlays»; archivo público previsto `assets/lanza.webp`.
- Prueba obligatoria: `CARD-39`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "equip",
    "value": 0,
    "scope": "ownAlly",
    "trigger": "play",
    "attack": 3,
    "hp": 3
  }
]
```

## 40. Tótem del roble

- ID estable: `totemroble`. Familia: Tótem. Rareza: Poco común, color #60CF89. Máximo por mazo: 2.
- Coste: 2 maná. Duración: 3 activaciones propias.
- Texto visible: «Al empezar tus próximos 3 turnos, obtén 2 de escudo. Ocupa un apoyo.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Protección sostenida. Respuesta rival o límite: Disolver el vínculo o presión que supere 2 de escudo..
- Ilustración: sujeto original «wooden owl totem with moss and emerald light»; archivo público previsto `assets/totemroble.webp`.
- Prueba obligatoria: `CARD-40`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "shield",
    "value": 2,
    "scope": "self",
    "trigger": "ownStart"
  }
]
```

## 41. Hilo de inferencia

- ID estable: `relacion`. Familia: Hechizo. Rareza: Rara, color #56AAFF. Máximo por mazo: 2.
- Coste: 2 maná.
- Texto visible: «Inflige 4 de daño; si ya citaste este turno, inflige 6. Respeta Custodia.»
- Objetivo de selección: `enemyGuarded`; se valida antes de consumir carta o maná.
- Papel: Daño condicionado. Respuesta rival o límite: Escudo y Custodia; cuesta más que daño pequeño..
- Ilustración: sujeto original «amber thread winding through teal mist»; archivo público previsto `assets/relacion.webp`.
- Prueba obligatoria: `CARD-41`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "directDamage",
    "value": 4,
    "scope": "enemyGuarded",
    "trigger": "play",
    "citedBonus": 2
  }
]
```

## 42. Contraste de voces

- ID estable: `contraste`. Familia: Hechizo. Rareza: Rara, color #56AAFF. Máximo por mazo: 2.
- Coste: 2 maná.
- Texto visible: «Inflige 2 de daño a cada aliado rival. Atraviesa Custodia.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Respuesta a grupos frágiles. Respuesta rival o límite: Aliados de vida alta..
- Ilustración: sujeto original «two spectral masks facing each other»; archivo público previsto `assets/contraste.webp`.
- Prueba obligatoria: `CARD-42`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "areaDamage",
    "value": 2,
    "scope": "enemyAllies",
    "trigger": "play"
  }
]
```

## 43. Arquero de la cumbre

- ID estable: `arquero`. Familia: Aliado. Rareza: Rara, color #56AAFF. Máximo por mazo: 2.
- Coste: 3 maná. Fuerza 4; vida 3; palabras clave: prontitud.
- Texto visible: «Prontitud. Fuerza 4, vida 3. Puede atacar al entrar.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Ataque inmediato fuerte. Respuesta rival o límite: Custodia con fuerza de respuesta y baja resistencia..
- Ilustración: sujeto original «adult archer with blue cloak on snowy ridge»; archivo público previsto `assets/arquero.webp`.
- Prueba obligatoria: `CARD-43`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[]
```

## 44. Sabia de los ecos

- ID estable: `sabia`. Familia: Aliado. Rareza: Rara, color #56AAFF. Máximo por mazo: 2.
- Coste: 4 maná. Fuerza 2; vida 7; palabras clave: custodia.
- Texto visible: «Custodia. Fuerza 2, vida 7. Al entrar, roba 2 cartas.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Defensa y mano de coste alto. Respuesta rival o límite: Fuerza baja y coste 4; mano llena reduce valor..
- Ilustración: sujeto original «elderly dark-skinned woman with silver curls and orb»; archivo público previsto `assets/sabia.webp`.
- Prueba obligatoria: `CARD-44`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "draw",
    "value": 2,
    "scope": "self",
    "trigger": "enter"
  }
]
```

## 45. Gólem del archivo

- ID estable: `golem`. Familia: Aliado. Rareza: Rara, color #56AAFF. Máximo por mazo: 2.
- Coste: 4 maná. Fuerza 4; vida 9; palabras clave: custodia.
- Texto visible: «Custodia. Fuerza 4, vida 9.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Defensa pesada. Respuesta rival o límite: Congelación, equipos o varios efectos de daño..
- Ilustración: sujeto original «stone golem with bronze joints and teal crystal chest»; archivo público previsto `assets/golem.webp`.
- Prueba obligatoria: `CARD-45`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[]
```

## 46. Duelista de las voces

- ID estable: `duelista`. Familia: Aliado. Rareza: Rara, color #56AAFF. Máximo por mazo: 2.
- Coste: 3 maná. Fuerza 4; vida 5; palabras clave: ninguna.
- Texto visible: «Fuerza 4, vida 5. Si ya citaste este turno, entra con 2 de fuerza adicional.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Presión condicionada. Respuesta rival o límite: Eliminar antes de que ataque; requiere cita previa..
- Ilustración: sujeto original «adult woman with two short silver blades»; archivo público previsto `assets/duelista.webp`.
- Prueba obligatoria: `CARD-46`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "attackBonus",
    "value": 2,
    "scope": "summoned",
    "trigger": "enter",
    "condition": "citedThisTurn"
  }
]
```

## 47. Disolver el vínculo

- ID estable: `desvincular`. Familia: Hechizo. Rareza: Rara, color #56AAFF. Máximo por mazo: 2.
- Coste: 2 maná.
- Texto visible: «Destruye un tótem, artefacto o héroe rival. No afecta aliados ni reliquias.»
- Objetivo de selección: `enemySupport`; se valida antes de consumir carta o maná.
- Papel: Respuesta a permanentes. Respuesta rival o límite: No tiene objetivo cuando el rival carece de apoyos..
- Ilustración: sujeto original «one broken golden chain with bright sparks»; archivo público previsto `assets/desvincular.webp`.
- Prueba obligatoria: `CARD-47`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "destroySupport",
    "value": 1,
    "scope": "enemySupport",
    "trigger": "play"
  }
]
```

## 48. Silencio del invierno

- ID estable: `silencio`. Familia: Hechizo. Rareza: Rara, color #56AAFF. Máximo por mazo: 2.
- Coste: 2 maná.
- Texto visible: «Un aliado rival pierde su próximo ataque de turno propio. Después tiene un turno de Deshielo. Respeta Custodia.»
- Objetivo de selección: `enemyGuardedAlly`; se valida antes de consumir carta o maná.
- Papel: Control temporal. Respuesta rival o límite: Deshielo impide congelación consecutiva; no elimina Custodia..
- Ilustración: sujeto original «icy blue crystal around a feather»; archivo público previsto `assets/silencio.webp`.
- Prueba obligatoria: `CARD-48`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "freeze",
    "value": 1,
    "scope": "enemyGuardedAlly",
    "trigger": "play"
  }
]
```

## 49. Lente de las fuentes

- ID estable: `lente`. Familia: Artefacto. Rareza: Rara, color #56AAFF. Máximo por mazo: 2.
- Coste: 2 maná. Duración: 3 activaciones propias.
- Texto visible: «Al empezar tus próximos 3 turnos, roba 1 carta. Ocupa un apoyo.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Robo diferido. Respuesta rival o límite: Disolver el vínculo; no da efecto al entrar..
- Ilustración: sujeto original «brass magnifying lens over blank parchment»; archivo público previsto `assets/lente.webp`.
- Prueba obligatoria: `CARD-49`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "draw",
    "value": 1,
    "scope": "self",
    "trigger": "ownStart"
  }
]
```

## 50. Tótem de las mareas

- ID estable: `mareas`. Familia: Tótem. Rareza: Rara, color #56AAFF. Máximo por mazo: 2.
- Coste: 2 maná. Duración: 3 activaciones propias.
- Texto visible: «Al empezar tus próximos 3 turnos, recupera 2 de vida. Ocupa un apoyo.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Recuperación diferida. Respuesta rival o límite: Disolver el vínculo y daño concentrado..
- Ilustración: sujeto original «blue stone dolphin totem with ocean spray»; archivo público previsto `assets/mareas.webp`.
- Prueba obligatoria: `CARD-50`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "heal",
    "value": 2,
    "scope": "self",
    "trigger": "ownStart"
  }
]
```

## 51. Oráculo de obsidiana

- ID estable: `oraculo`. Familia: Tótem. Rareza: Épica, color #BD7AFF. Máximo por mazo: 2.
- Coste: 3 maná. Duración: 3 activaciones propias.
- Texto visible: «Al empezar tus próximos 3 turnos, roba 1 carta y obtén 1 de escudo. Ocupa un apoyo.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Robo con protección diferidos. Respuesta rival o límite: Inversión inicial y destrucción de apoyo..
- Ilustración: sujeto original «obsidian raven statue on purple crystal pedestal»; archivo público previsto `assets/oraculo.webp`.
- Prueba obligatoria: `CARD-51`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "draw",
    "value": 1,
    "scope": "self",
    "trigger": "ownStart"
  },
  {
    "op": "shield",
    "value": 1,
    "scope": "self",
    "trigger": "ownStart"
  }
]
```

## 52. Eclipse de certezas

- ID estable: `eclipse`. Familia: Hechizo. Rareza: Épica, color #BD7AFF. Máximo por mazo: 2.
- Coste: 4 maná.
- Texto visible: «Inflige 4 de daño a cada aliado rival. Atraviesa Custodia.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Limpieza costosa de fila. Respuesta rival o límite: Una sola unidad resistente o fila vacía..
- Ilustración: sujeto original «violet solar eclipse over black mountains»; archivo público previsto `assets/eclipse.webp`.
- Prueba obligatoria: `CARD-52`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "areaDamage",
    "value": 4,
    "scope": "enemyAllies",
    "trigger": "play"
  }
]
```

## 53. Síntesis luminosa

- ID estable: `sintesis`. Familia: Hechizo. Rareza: Épica, color #BD7AFF. Máximo por mazo: 2.
- Coste: 3 maná.
- Texto visible: «Inflige 6 de daño; si ya citaste este turno, inflige 9. Respeta Custodia.»
- Objetivo de selección: `enemyGuarded`; se valida antes de consumir carta o maná.
- Papel: Daño condicionado de coste alto. Respuesta rival o límite: Custodia, escudo e inversión de maná..
- Ilustración: sujeto original «three light streams joining a single silver beam»; archivo público previsto `assets/sintesis.webp`.
- Prueba obligatoria: `CARD-53`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "directDamage",
    "value": 6,
    "scope": "enemyGuarded",
    "trigger": "play",
    "citedBonus": 3
  }
]
```

## 54. Estandarte del acuerdo

- ID estable: `estandarte`. Familia: Reliquia. Rareza: Épica, color #BD7AFF. Máximo por mazo: 2.
- Coste: 3 maná.
- Texto visible: «Equipa un aliado: obtiene 3 de fuerza y 6 de vida.»
- Objetivo de selección: `ownAlly`; se valida antes de consumir carta o maná.
- Papel: Mejora de resistencia de coste alto. Respuesta rival o límite: Congelación y daño de área; concentra recursos en un aliado..
- Ilustración: sujeto original «plain deep-purple banner on golden pole»; archivo público previsto `assets/estandarte.webp`.
- Prueba obligatoria: `CARD-54`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "equip",
    "value": 0,
    "scope": "ownAlly",
    "trigger": "play",
    "attack": 3,
    "hp": 6
  }
]
```

## 55. Cristal de memoria

- ID estable: `cristal`. Familia: Reliquia. Rareza: Épica, color #BD7AFF. Máximo por mazo: 2.
- Coste: 2 maná.
- Texto visible: «Equipa un aliado: obtiene 1 de fuerza, 1 de vida y Vínculo vital.»
- Objetivo de selección: `ownAlly`; se valida antes de consumir carta o maná.
- Papel: Recuperación ligada a ataques. Respuesta rival o límite: Escudo absorbe daño; congelación impide curación..
- Ilustración: sujeto original «violet crystal heart with golden veins»; archivo público previsto `assets/cristal.webp`.
- Prueba obligatoria: `CARD-55`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "equip",
    "value": 0,
    "scope": "ownAlly",
    "trigger": "play",
    "attack": 1,
    "hp": 1,
    "keyword": "vinculoVital"
  }
]
```

## 56. Reloj de las decisiones

- ID estable: `reloj`. Familia: Artefacto. Rareza: Épica, color #BD7AFF. Máximo por mazo: 2.
- Coste: 3 maná. Duración: 3 activaciones propias.
- Texto visible: «Al empezar tus próximos 3 turnos, gana 1 maná temporal y 1 de escudo. Ocupa un apoyo.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Recursos diferidos. Respuesta rival o límite: Coste inicial, tres usos y destrucción rival..
- Ilustración: sujeto original «brass hourglass with turquoise sand»; archivo público previsto `assets/reloj.webp`.
- Prueba obligatoria: `CARD-56`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "mana",
    "value": 1,
    "scope": "self",
    "trigger": "ownStart"
  },
  {
    "op": "shield",
    "value": 1,
    "scope": "self",
    "trigger": "ownStart"
  }
]
```

## 57. Aurelia, guardiana del umbral

- ID estable: `heroGuardiana`. Familia: Héroe. Rareza: Legendaria, color #FFBC46. Máximo por mazo: 1.
- Coste: 3 maná. Poder: 1 maná; una vez por turno.
- Texto visible: «Poder: paga 1 maná y obtén 3 de escudo, una vez por turno. Ocupa un apoyo. Un héroe por mazo.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Defensa recurrente. Respuesta rival o límite: Disolver el vínculo; cuesta 3 al entrar y no da efecto inmediato..
- Ilustración: sujeto original «regal adult woman with golden armor and radiant round shield»; archivo público previsto `assets/heroGuardiana.webp`.
- Prueba obligatoria: `CARD-57`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "shield",
    "value": 3,
    "scope": "self",
    "trigger": "power"
  }
]
```

## 58. Nereo, cronista del alba

- ID estable: `heroCronista`. Familia: Héroe. Rareza: Legendaria, color #FFBC46. Máximo por mazo: 1.
- Coste: 3 maná. Poder: 1 maná; una vez por turno.
- Texto visible: «Poder: paga 1 maná y roba 1 carta, una vez por turno. Ocupa un apoyo. Un héroe por mazo.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Selección recurrente. Respuesta rival o límite: Destrucción del apoyo y mano máxima..
- Ilustración: sujeto original «regal older man with silver hair, gold quill and closed blue book»; archivo público previsto `assets/heroCronista.webp`.
- Prueba obligatoria: `CARD-58`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "draw",
    "value": 1,
    "scope": "self",
    "trigger": "power"
  }
]
```

## 59. Iria, exploradora de ecos

- ID estable: `heroExploradora`. Familia: Héroe. Rareza: Legendaria, color #FFBC46. Máximo por mazo: 1.
- Coste: 3 maná. Poder: 1 maná; una vez por turno.
- Texto visible: «Poder: paga 1 maná e inflige 1 de daño a cada aliado rival, una vez por turno. Ocupa un apoyo. Un héroe por mazo.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Presión sobre grupos. Respuesta rival o límite: Aliados resistentes, fila vacía y destrucción de apoyo..
- Ilustración: sujeto original «regal adult woman with copper braids and amber crystal bow»; archivo público previsto `assets/heroExploradora.webp`.
- Prueba obligatoria: `CARD-59`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "areaDamage",
    "value": 1,
    "scope": "enemyAllies",
    "trigger": "power"
  }
]
```

## 60. Portal del primer relato

- ID estable: `umbral`. Familia: Artefacto. Rareza: Legendaria, color #FFBC46. Máximo por mazo: 1.
- Coste: 4 maná. Duración: 3 activaciones propias.
- Texto visible: «Al empezar tus próximos 3 turnos, recupera 1 de vida, obtén 2 de escudo y gana 1 maná temporal. Ocupa un apoyo.»
- Objetivo de selección: `none`; se valida antes de consumir carta o maná.
- Papel: Recuperación y recursos diferidos. Respuesta rival o límite: Coste 4, tres activaciones y Disolver el vínculo..
- Ilustración: sujeto original «golden circular portal above ancient stone threshold»; archivo público previsto `assets/umbral.webp`.
- Prueba obligatoria: `CARD-60`: efecto exacto, rechazo de objetivo/coste inválido sin mutación, evento visual y texto coincidentes.

Operaciones, en orden:

```json
[
  {
    "op": "heal",
    "value": 1,
    "scope": "self",
    "trigger": "ownStart"
  },
  {
    "op": "shield",
    "value": 2,
    "scope": "self",
    "trigger": "ownStart"
  },
  {
    "op": "mana",
    "value": 1,
    "scope": "self",
    "trigger": "ownStart"
  }
]
```

## Mazos iniciales de aula

Disponibles por préstamo en modo aula para todos, incluidos los héroes. El modo colección exige propiedad; puede usar los tres mazos v1 iniciales, que sí quedan cubiertos por los 30 IDs de bienvenida.

### La guardiana

Custodia, recuperación y equipos.

| Carta | Copias | Maná |
|---|---:|---:|
| Guardiana del umbral | 2 | 2 |
| Vigía de la muralla | 1 | 1 |
| Custodio del archivo | 1 | 3 |
| Centinela de bronce | 1 | 3 |
| Exploradora del paso | 1 | 1 |
| Médica del bosque | 1 | 2 |
| Aurelia, guardiana del umbral | 1 | 3 |
| Tótem del roble | 1 | 2 |
| Sello protector | 1 | 1 |
| Luz reparadora | 1 | 1 |
| Faro del criterio | 1 | 2 |
| Llama reveladora | 1 | 1 |
| Armadura de argumentos | 1 | 1 |
| Brazales del camino | 1 | 1 |
| Cita viva | 1 | 0 |
| Cotejo de fuentes | 1 | 0 |
| Consulta las fuentes | 1 | 1 |

18 cartas; 7 aliados; 2 lecturas; coste medio 1.50. Curva 0/1/2/3/4: 2/8/5/3/0.

### El cronista

Robo y daño condicionado por citas.

| Carta | Copias | Maná |
|---|---:|---:|
| Cronista de las mareas | 2 | 2 |
| Custodio del archivo | 1 | 3 |
| Guardiana del umbral | 1 | 2 |
| Testigo del sendero | 1 | 2 |
| Mensajera del alba | 1 | 1 |
| Nereo, cronista del alba | 1 | 3 |
| Lente de las fuentes | 1 | 2 |
| Llama reveladora | 1 | 1 |
| Réplica fundada | 1 | 1 |
| Hilo de inferencia | 1 | 2 |
| Contraste de voces | 1 | 2 |
| Consulta las fuentes | 1 | 1 |
| Brisa del archivo | 1 | 1 |
| Luz reparadora | 1 | 1 |
| Cita viva | 2 | 0 |
| Pregunta del lector | 1 | 0 |

18 cartas; 6 aliados; 3 lecturas; coste medio 1.44. Curva 0/1/2/3/4: 3/6/7/2/0.

### La exploradora

Presión y Prontitud.

| Carta | Copias | Maná |
|---|---:|---:|
| Exploradora del paso | 2 | 1 |
| Testigo del sendero | 1 | 2 |
| Centinela de bronce | 1 | 3 |
| Aprendiz de runas | 1 | 1 |
| Ballestera del paso | 1 | 2 |
| Rastreador de huellas | 1 | 2 |
| Arquero de la cumbre | 1 | 3 |
| Iria, exploradora de ecos | 1 | 3 |
| Llama reveladora | 1 | 1 |
| Réplica fundada | 1 | 1 |
| Chispa del debate | 1 | 1 |
| Botas del viajero | 1 | 1 |
| Armadura de argumentos | 1 | 1 |
| Sello protector | 1 | 1 |
| Luz reparadora | 1 | 1 |
| Cita viva | 1 | 0 |
| Cotejo de fuentes | 1 | 0 |

18 cartas; 8 aliados; 2 lecturas; coste medio 1.39. Curva 0/1/2/3/4: 2/10/3/3/0.

## Mazos iniciales de colección

Listas originales preservadas; valores de cartas v2 al crear una sala v2. Cada copia está cubierta por la bienvenida y cada lista valida los límites nuevos.

### La guardiana — colección

| Carta | Copias | Maná |
|---|---:|---:|
| Guardiana del umbral | 2 | 2 |
| Custodio del archivo | 2 | 3 |
| Centinela de bronce | 1 | 3 |
| Exploradora del paso | 1 | 1 |
| Sello protector | 2 | 1 |
| Luz reparadora | 1 | 1 |
| Llama reveladora | 2 | 1 |
| Armadura de argumentos | 2 | 1 |
| Cita viva | 2 | 0 |
| Consulta las fuentes | 1 | 1 |
| Réplica fundada | 1 | 1 |
| Faro del criterio | 1 | 2 |

18 cartas; 6 aliados; 2 lecturas; coste medio 1.39.

### El cronista — colección

| Carta | Copias | Maná |
|---|---:|---:|
| Cronista de las mareas | 2 | 2 |
| Custodio del archivo | 1 | 3 |
| Guardiana del umbral | 1 | 2 |
| Testigo del sendero | 1 | 2 |
| Exploradora del paso | 1 | 1 |
| Llama reveladora | 2 | 1 |
| Hilo de inferencia | 2 | 2 |
| Cita viva | 2 | 0 |
| Consulta las fuentes | 2 | 1 |
| Réplica fundada | 1 | 1 |
| Sello protector | 1 | 1 |
| Luz reparadora | 1 | 1 |
| Contraste de voces | 1 | 2 |

18 cartas; 6 aliados; 2 lecturas; coste medio 1.39.

### La exploradora — colección

| Carta | Copias | Maná |
|---|---:|---:|
| Exploradora del paso | 2 | 1 |
| Testigo del sendero | 2 | 2 |
| Centinela de bronce | 2 | 3 |
| Guardiana del umbral | 1 | 2 |
| Cronista de las mareas | 1 | 2 |
| Llama reveladora | 2 | 1 |
| Armadura de argumentos | 2 | 1 |
| Cita viva | 2 | 0 |
| Réplica fundada | 1 | 1 |
| Sello protector | 1 | 1 |
| Luz reparadora | 1 | 1 |
| Contraste de voces | 1 | 2 |

18 cartas; 8 aliados; 2 lecturas; coste medio 1.39.
