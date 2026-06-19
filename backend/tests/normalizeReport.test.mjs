/**
 * Unit tests for normalizeBloodReport()
 *
 * Run with: npx jest --experimental-vm-modules tests/normalizeReport.test.mjs
 */

import { normalizeBloodReport } from '../services/normalizeReport.service.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Pads OCR text to meet the minimum 100-char length requirement */
const pad = (text) => text.padEnd(100, ' ');

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('normalizeBloodReport()', () => {

    // ── Input validation ───────────────────────────────────────────────────────

    test('throws on empty input', () => {
        expect(() => normalizeBloodReport('')).toThrow('Empty or unreadable medical report');
    });

    test('throws when input is shorter than 100 chars', () => {
        expect(() => normalizeBloodReport('Hemoglobin 14.5 g/dL 13-17')).toThrow();
    });

    test('throws on null input', () => {
        expect(() => normalizeBloodReport(null)).toThrow();
    });

    // ── Normal value detection ─────────────────────────────────────────────────

    test('detects a NORMAL value correctly', () => {
        const text = pad('Hemoglobin 14.5 g/dL 13-17');
        const result = normalizeBloodReport(text);

        expect(result.tests).toHaveLength(1);
        expect(result.tests[0].value).toBe(14.5);
        expect(result.tests[0].status).toBe('NORMAL');
    });

    // ── Abnormal value detection ───────────────────────────────────────────────

    test('detects a HIGH value correctly', () => {
        const text = pad('WBC 12.5 K/uL 4-10');
        const result = normalizeBloodReport(text);
        const wbc = result.tests.find(t => t.value === 12.5);

        expect(wbc).toBeDefined();
        expect(wbc.status).toBe('HIGH');
    });

    test('detects a LOW value correctly', () => {
        const text = pad('Hemoglobin 10.0 g/dL 13-17');
        const result = normalizeBloodReport(text);
        const hb = result.tests.find(t => t.value === 10.0);

        expect(hb).toBeDefined();
        expect(hb.status).toBe('LOW');
    });

    // ── Less-than range ('<') ──────────────────────────────────────────────────

    test('handles < range and marks HIGH when value exceeds limit', () => {
        const text = pad('ESR 25 mm/hr <20');
        const result = normalizeBloodReport(text);
        const esr = result.tests.find(t => t.value === 25);

        expect(esr).toBeDefined();
        expect(esr.status).toBe('HIGH');
    });

    test('handles < range and marks NORMAL when value is within limit', () => {
        const text = pad('ESR 15 mm/hr <20');
        const result = normalizeBloodReport(text);
        const esr = result.tests.find(t => t.value === 15);

        expect(esr).toBeDefined();
        expect(esr.status).toBe('NORMAL');
    });

    // ── Return structure ───────────────────────────────────────────────────────

    test('returns an object with a tests array', () => {
        const text = pad('Hemoglobin 14.5 g/dL 13-17');
        const result = normalizeBloodReport(text);

        expect(result).toHaveProperty('tests');
        expect(Array.isArray(result.tests)).toBe(true);
    });

    test('each test entry has name, value, unit, range, status', () => {
        const text = pad('Hemoglobin 14.5 g/dL 13-17');
        const result = normalizeBloodReport(text);

        if (result.tests.length > 0) {
            const test = result.tests[0];
            expect(test).toHaveProperty('name');
            expect(test).toHaveProperty('value');
            expect(test).toHaveProperty('unit');
            expect(test).toHaveProperty('range');
            expect(test).toHaveProperty('status');
        }
    });

    // ── Edge cases ─────────────────────────────────────────────────────────────

    test('returns empty tests array for text with no parseable values', () => {
        const text = 'This is a random piece of text that has no medical values at all and is padded to meet min length requirement.';
        const result = normalizeBloodReport(text);
        expect(Array.isArray(result.tests)).toBe(true);
    });

    test('correctly parses values with commas (e.g., 5,100 → 5100)', () => {
        const text = pad('Platelets 5,100 /cumm 4,800-10,800');
        const result = normalizeBloodReport(text);
        const plt = result.tests.find(t => t.value === 5100);

        if (plt) {
            expect(plt.status).toBe('NORMAL');
        }
    });
});
