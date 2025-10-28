import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "cross-fetch";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Falta la variable de entorno GEMINI_API_KEY");
}

const genAI = new GoogleGenerativeAI(apiKey, { fetch });
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Genera retroalimentación personalizada para docentes de Lenguaje.
 * @param {Object} params
 * @param {string} params.pregunta - Ítem de la evaluación aplicado.
 * @param {string} params.respuestaDocente - Respuesta entregada por el docente.
 * @param {string} params.tema - Descriptor del contenido al que se vincula el ítem.
 */
export async function generarRetroalimentacion({ pregunta, respuestaDocente, tema }) {
  const prompt = [
    "Actúa como tutor pedagógico para profesores de Lenguaje.",
    `Pregunta evaluada: ${pregunta}`,
    `Respuesta del docente: ${respuestaDocente}`,
    `Tema vinculado: ${tema}`,
    "1. Refuerza los aciertos identificados.",
    "2. Corrige los errores con una explicación breve y clara.",
    "3. Sugiere una estrategia o recurso para profundizar, citando el temario cuando sea posible."
  ].join("\n");

  const result = await model.generateContent(prompt);
  return result.response.text();
}
