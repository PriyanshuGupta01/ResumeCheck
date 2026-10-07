/**
 * API client helper for AI Resume Analyzer (ResumeCheck).
 * Uses Vite proxy during development and direct /api in production.
 */

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || '';

/**
 * Check backend health status.
 * @returns {Promise<{ ok: boolean, data?: any, error?: string, latency?: number }>}
 */
export async function getHealthStatus() {
  const startTime = performance.now();
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);

    if (!res.ok) {
      return {
        ok: false,
        error: `Server responded with HTTP ${res.status}`,
        latency,
      };
    }

    const data = await res.json();
    return {
      ok: true,
      data,
      latency,
    };
  } catch (err) {
    const endTime = performance.now();
    return {
      ok: false,
      error: err.message || 'Failed to reach API server',
      latency: Math.round(endTime - startTime),
    };
  }
}

/**
 * Submit resume and job description for full analysis.
 * Works completely without logging in.
 * @param {FormData} formData
 * @returns {Promise<{ ok: boolean, data?: any, error?: string }>}
 */
export async function analyzeResume(formData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        ok: false,
        error: data.detail || data.message || `Analysis failed with HTTP ${res.status}`,
      };
    }

    return {
      ok: true,
      data,
    };
  } catch (err) {
    return {
      ok: false,
      error: err.message || 'Failed to connect to analysis server.',
    };
  }
}

/**
 * Request PDF report download from analysis JSON data.
 * @param {object} analysisData
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function downloadReport(analysisData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(analysisData),
      credentials: 'include',
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      return {
        ok: false,
        error: errJson.detail || `Report generation failed (HTTP ${res.status})`,
      };
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const baseName = analysisData.filename ? analysisData.filename.replace(/\.[^/.]+$/, '') : 'resume';
    a.download = `ResumeCheck_Report_${baseName}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err.message || 'Error initiating report download.',
    };
  }
}

// -------------------------------------------------------------
// Authentication Endpoints (Optional User Accounts)
// -------------------------------------------------------------

/**
 * Register a new user account.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ ok: boolean, data?: any, error?: string }>}
 */
export async function authSignUp(email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        ok: false,
        error: data.detail || 'Sign up failed. Please check your credentials.',
      };
    }

    return { ok: true, data: data.user };
  } catch (err) {
    return { ok: false, error: err.message || 'Unable to connect to server.' };
  }
}

/**
 * Authenticate existing user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ ok: boolean, data?: any, error?: string }>}
 */
export async function authLogin(email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        ok: false,
        error: data.detail || 'Invalid email or password.',
      };
    }

    return { ok: true, data: data.user };
  } catch (err) {
    return { ok: false, error: err.message || 'Unable to connect to server.' };
  }
}

/**
 * Log out user and clear cookie session.
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function authLogout() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      credentials: 'include',
    });
    return { ok: res.ok };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/**
 * Retrieve current signed-in user session.
 * @returns {Promise<{ ok: boolean, user?: any }>}
 */
export async function authGetMe() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      return { ok: false, user: null };
    }
    const data = await res.json();
    return { ok: true, user: data.user };
  } catch {
    return { ok: false, user: null };
  }
}

// -------------------------------------------------------------
// Saved Analyses Endpoints (Signed-in Users)
// -------------------------------------------------------------

/**
 * List all saved analyses for currently logged-in user.
 * @returns {Promise<{ ok: boolean, analyses?: Array<any>, error?: string }>}
 */
export async function getSavedAnalyses() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/analyses`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      credentials: 'include',
    });

    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: data.detail || 'Failed to fetch saved analyses.' };
    }

    return { ok: true, analyses: data.analyses || [] };
  } catch (err) {
    return { ok: false, error: err.message || 'Network error fetching analyses.' };
  }
}

/**
 * Save an analysis to the user's account.
 * @param {object} payload - { job_title, score, result_data }
 * @returns {Promise<{ ok: boolean, analysis?: any, error?: string }>}
 */
export async function saveAnalysis(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/analyses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    });

    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: data.detail || 'Failed to save analysis.' };
    }

    return { ok: true, analysis: data.analysis };
  } catch (err) {
    return { ok: false, error: err.message || 'Network error saving analysis.' };
  }
}

/**
 * Retrieve a specific saved analysis details.
 * @param {number|string} id
 * @returns {Promise<{ ok: boolean, analysis?: any, error?: string }>}
 */
export async function getAnalysisDetail(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/analyses/${id}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      credentials: 'include',
    });

    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: data.detail || 'Analysis not found.' };
    }

    return { ok: true, analysis: data.analysis };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/**
 * Delete a saved analysis.
 * @param {number|string} id
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function deleteSavedAnalysis(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/analyses/${id}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' },
      credentials: 'include',
    });

    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: data.detail || 'Failed to delete analysis.' };
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
