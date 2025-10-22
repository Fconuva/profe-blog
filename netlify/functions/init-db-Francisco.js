const { neon } = require('@neondatabase/serverless');
exports.handler = async (event) => {
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`CREATE TABLE IF NOT EXISTS paseo_docentes_reservas (id SERIAL PRIMARY KEY, nombre VARCHAR(100) NOT NULL, apellido VARCHAR(100) NOT NULL, email VARCHAR(255) NOT NULL, telefono VARCHAR(20) NOT NULL, asistira VARCHAR(10) NOT NULL CHECK (asistira IN ('si', 'no')), transporte VARCHAR(10) CHECK (transporte IN ('bus', 'propio')), asiento INTEGER CHECK (asiento >= 1 AND asiento <= 46), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, CONSTRAINT unique_seat_per_bus UNIQUE (asiento, transporte))`;
    await sql`CREATE INDEX IF NOT EXISTS idx_email ON paseo_docentes_reservas(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_asiento ON paseo_docentes_reservas(asiento)`;
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
