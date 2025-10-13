-- Script para inicializar la base de datos del Paseo de Docentes
-- Ejecutar este script en la consola de Neon Database

-- Crear la tabla de reservas
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
  
  -- Restricción para asegurar que un asiento no se reserve dos veces
  CONSTRAINT unique_seat_per_bus UNIQUE (asiento, transporte)
);

-- Crear índice para búsquedas rápidas por email
CREATE INDEX IF NOT EXISTS idx_email ON paseo_docentes_reservas(email);

-- Crear índice para búsquedas rápidas por asiento
CREATE INDEX IF NOT EXISTS idx_asiento ON paseo_docentes_reservas(asiento);

-- Crear índice para búsquedas rápidas por fecha de creación
CREATE INDEX IF NOT EXISTS idx_created_at ON paseo_docentes_reservas(created_at);

-- Comentarios para documentación
COMMENT ON TABLE paseo_docentes_reservas IS 'Tabla para almacenar las inscripciones al paseo de docentes';
COMMENT ON COLUMN paseo_docentes_reservas.nombre IS 'Nombre del docente';
COMMENT ON COLUMN paseo_docentes_reservas.apellido IS 'Apellido del docente';
COMMENT ON COLUMN paseo_docentes_reservas.email IS 'Email de contacto';
COMMENT ON COLUMN paseo_docentes_reservas.telefono IS 'Teléfono de contacto';
COMMENT ON COLUMN paseo_docentes_reservas.asistira IS 'Si asistirá o no (si/no)';
COMMENT ON COLUMN paseo_docentes_reservas.transporte IS 'Tipo de transporte (bus/propio)';
COMMENT ON COLUMN paseo_docentes_reservas.asiento IS 'Número de asiento en el bus (1-46)';
COMMENT ON COLUMN paseo_docentes_reservas.created_at IS 'Fecha y hora de la inscripción';
