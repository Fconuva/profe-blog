import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // Crear la tabla si no existe
    await sql`
      CREATE TABLE IF NOT EXISTS paseo_docentes_reservas (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telefono VARCHAR(20) NOT NULL,
        asistira VARCHAR(10) NOT NULL CHECK (asistira IN ('si', 'no')),
        transporte VARCHAR(10) CHECK (transporte IN ('bus', 'propio')),
        asiento INTEGER CHECK (asiento >= 1 AND asiento <= 46),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_seat_per_bus UNIQUE (asiento, transporte)
      )
    `;

    // Crear índices si no existen
    await sql`CREATE INDEX IF NOT EXISTS idx_email ON paseo_docentes_reservas(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_asiento ON paseo_docentes_reservas(asiento)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_created_at ON paseo_docentes_reservas(created_at)`;

    return new Response(JSON.stringify({
      success: true,
      message: 'Database initialized successfully'
    }), {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Error initializing database:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers
    });
  }
};

export const config = {
  path: "/api/init-db"
};
