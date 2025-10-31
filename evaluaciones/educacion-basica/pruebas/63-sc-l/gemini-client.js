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
