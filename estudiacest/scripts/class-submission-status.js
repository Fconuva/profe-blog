'use strict';

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function hasKeys(value) {
  return isObject(value) && Object.keys(value).length > 0;
}

function hasPositiveNumber(value) {
  return Number.isFinite(Number(value)) && Number(value) > 0;
}

function hasManualAttestation(response) {
  const attestation = isObject(response && response.attestation) ? response.attestation : {};
  return response && response.manualCompletion === true &&
    String(attestation.source || '').trim() !== '' &&
    hasPositiveNumber(attestation.recordedAt) &&
    String(attestation.reason || '').trim() !== '';
}

function hasSupportingEvidence(response, supporting = {}) {
  return [response.submittedAt, response.completadaAt, response.submitted_at]
    .some(hasPositiveNumber) ||
    hasKeys(supporting.result) ||
    hasPositiveNumber(supporting.telemetry && supporting.telemetry.submissionConfirmationCount);
}

function hasNonCanonicalEvidence(supporting = {}) {
  return hasKeys(supporting.result) || hasKeys(supporting.grade) || hasKeys(supporting.telemetry);
}

function classifySubmissionStatus(response, supporting = {}) {
  const attempt = isObject(response) ? response : null;
  const submitted = Boolean(attempt && attempt.submitted === true);
  const completed = Boolean(attempt && attempt.completada === true);

  if (submitted && completed && hasManualAttestation(attempt)) {
    return { status: 'manual_attestation', delivered: true, canonical: true, legacy: false };
  }
  if (submitted && completed) {
    return { status: 'confirmed', delivered: true, canonical: true, legacy: false };
  }
  if ((submitted || completed) && hasSupportingEvidence(attempt, supporting)) {
    return { status: 'legacy_confirmed', delivered: true, canonical: false, legacy: true };
  }
  if (submitted || completed || hasNonCanonicalEvidence(supporting)) {
    return { status: 'inconsistent', delivered: false, canonical: false, legacy: false };
  }
  if (attempt) {
    return { status: 'draft', delivered: false, canonical: false, legacy: false };
  }
  return { status: 'missing', delivered: false, canonical: false, legacy: false };
}

module.exports = {
  classifySubmissionStatus,
  hasManualAttestation,
  hasNonCanonicalEvidence,
  hasSupportingEvidence
};
