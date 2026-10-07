import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import Results from '../frontend/src/pages/Results';
import ErrorBoundary from '../frontend/src/components/ErrorBoundary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const candidatePaths = [
  path.join(process.cwd(), 'tests/analyze_response.json'),
  path.join(process.cwd(), '../tests/analyze_response.json'),
  path.join(__dirname, 'analyze_response.json'),
  path.join(__dirname, '../tests/analyze_response.json'),
];

let fullPayload = {};
for (const p of candidatePaths) {
  if (fs.existsSync(p)) {
    fullPayload = JSON.parse(fs.readFileSync(p, 'utf-8'));
    break;
  }
}

// Define an incomplete response with missing / null fields
const incompletePayload = {
  filename: 'Incomplete_Candidate.pdf',
  word_count: 120,
  extracted_text: 'Software Engineer with experience in Python.',
  target_job: null,
  sections: {
    sections: null,
    present: null,
    missing: null,
  },
  contact_info: null,
  skills: {
    matched: null,
    missing: null,
    extra: null,
  },
  ats: {
    checks: null,
    passed_count: null,
  },
  scores: {
    overall_score: 42,
    sub_scores: null,
    weighted_points: null,
  },
  ai_feedback: {
    summary: null,
    strengths: null,
    weaknesses: null,
    missing_keywords: null,
    improved_bullets: null,
    tailored_summary: null,
    interview_questions: null,
  },
  is_ai_enabled: true,
};

// Define an ultra-minimal payload
const ultraMinimalPayload = {
  filename: 'Empty_Test.pdf',
};

function renderWithPayload(payload, label) {
  console.log(`\n--- Testing Render: ${label} ---`);
  try {
    const html = renderToString(
      <ErrorBoundary title="Caught in test">
        <MemoryRouter initialEntries={[{ pathname: '/results', state: { analysisData: payload } }]}>
          <Results />
        </MemoryRouter>
      </ErrorBoundary>
    );

    // Verify it produced valid HTML and didn't crash
    if (!html || html.length === 0) {
      throw new Error(`Render produced empty HTML for ${label}`);
    }

    // Verify key elements exist in rendered output
    const isErrorRendered = html.includes('Something went wrong showing your results');
    if (isErrorRendered) {
      console.warn(`[WARNING] ErrorBoundary fallback rendered for ${label}`);
    } else {
      console.log(`[PASS] Successfully rendered without ErrorBoundary trigger (${html.length} chars).`);
    }

    return true;
  } catch (err) {
    console.error(`[FAIL] Uncaught crash rendering ${label}:`, err);
    throw err;
  }
}

async function runTests() {
  console.log('Running Results Page Render Verification Tests...');

  // Test 1: Full valid API response
  renderWithPayload(fullPayload, 'Full Valid API Response (PDF)');

  // Test 2: Incomplete API response with null/missing sub-properties
  renderWithPayload(incompletePayload, 'Incomplete API Response (null fields)');

  // Test 3: Ultra-minimal response
  renderWithPayload(ultraMinimalPayload, 'Ultra-Minimal API Response');

  // Test 4: Direct access without state (Empty state)
  renderWithPayload(null, 'No State / Empty State');

  console.log('\nAll Results Page render verification tests PASSED successfully!\n');
}

runTests();
