const COURSE_KEY = 'docente_creador';
const COURSE_SLUG = 'docente-creador';
const COURSE_PRICE = 30000;
const MAX_CAPACITY = 150;
const HOLD_MINUTES = 30;

const DATE_OPTIONS = Object.freeze({
  'proxima-cohorte': 'Próxima cohorte (fecha por confirmar)'
});

const LEGACY_DATE_OPTIONS = Object.freeze({
  '2026-06-06': 'Sábado 6 de junio',
  '2026-06-20': 'Sábado 20 de junio'
});

const ALL_DATE_OPTIONS = Object.freeze({
  ...LEGACY_DATE_OPTIONS,
  ...DATE_OPTIONS
});

const MEET_LINKS = Object.freeze({
  '2026-06-06': 'https://meet.google.com/tji-qart-iqd',
  '2026-06-20': 'https://meet.google.com/rzj-ortp-gmx',
  'proxima-cohorte': process.env.DOCENTE_CREADOR_MEET_URL || ''
});

function buildReceiptNumber(registrationId, selectedDate) {
  const safeId = String(registrationId || '').replace(/[^a-z0-9]/gi, '').toUpperCase();
  const suffix = safeId.slice(-8).padStart(8, '0');
  const yearMatch = String(selectedDate || '').match(/^(20\d{2})-/);
  const year = yearMatch ? yearMatch[1] : '2026';
  return `IA-${year}-${suffix}`;
}

module.exports = {
  COURSE_KEY,
  COURSE_SLUG,
  COURSE_PRICE,
  MAX_CAPACITY,
  HOLD_MINUTES,
  DATE_OPTIONS,
  ALL_DATE_OPTIONS,
  MEET_LINKS,
  buildReceiptNumber
};
