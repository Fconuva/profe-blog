# Integración con Google Gemini

## Configuración

1. Crear una clave API gratuita en Google AI Studio y almacenarla como variable de entorno.

  ```powershell
  setx GEMINI_API_KEY "<tu_clave>"
  ```

  Reinicia la terminal para que la variable quede disponible.

1. Instalar dependencias (requiere Node 18+).

  ```powershell
  npm install @google/generative-ai cross-fetch
  ```

## Cliente básico

```javascript
// evaluaciones/educacion-basica/pruebas/63-sc-l/gemini-client.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "cross-fetch";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Falta GEMINI_API_KEY en las variables de entorno");
}

const genAI = new GoogleGenerativeAI(apiKey, { fetch });
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generarRetroalimentacion({ pregunta, respuestaDocente, tema }) {
  const prompt = `Actúa como tutor pedagógico para profesores de Lenguaje.\n` +
    `Pregunta evaluada: ${pregunta}\n` +
    `Respuesta del docente: ${respuestaDocente}\n` +
    `Tema vinculado: ${tema}\n` +
    `1. Refuerza aciertos.\n2. Corrige errores con claridad.\n3. Sugiere profundización con referencia al temario.\n`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

## Uso sugerido

```javascript
import { generarRetroalimentacion } from "./gemini-client.js";

const feedback = await generarRetroalimentacion({
  pregunta: "Identifique el tipo de narrador presente en el fragmento.",
  respuestaDocente: "Narrador omnisciente por conocer pensamientos.",
  tema: "Tipos de narrador"
});

console.log(feedback);
```

Alinea el prompt y el formato de salida con `exam.ia_feedback` definido en `plan.json` para mantener consistencia entre la información que recibe la IA y la retroalimentación que se muestra al docente.
