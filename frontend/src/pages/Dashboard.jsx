import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSavedAnalyses, getAnalysisDetail, deleteSavedAnalysis } from '../api';
import { FileText, Trash2, ExternalLink, PlusCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import Spinner from '../components/Spinner';
import PageMeta from '../components/PageMeta';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin', { state: { from: { pathname: '/dashboard' } } });
      return;
    }

    if (user) {
      loadAnalyses();
    }
  }, [user, authLoading]);

  const loadAnalyses = async () => {
    setLoading(true);
    setErrorMessage('');
    const res = await getSavedAnalyses();
    setLoading(false);
    if (res.ok) {
      setAnalyses(res.analyses);
    } else {
      setErrorMessage(res.error || 'Failed to load analyses.');
    }
  };

  const handleOpenAnalysis = async (id) => {
    setActionLoadingId(id);
    const res = await getAnalysisDetail(id);
    setActionLoadingId(null);

    if (res.ok && res.analysis?.result_data) {
      navigate('/results', {
        state: {
          analysisData: res.analysis.result_data,
          savedAnalysisId: id,
        },
      });
    } else {
      alert('Could not load analysis details: ' + (res.error || 'Unknown error'));
    }
  };

  const handleDeleteAnalysis = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the analysis for "${title}"?`)) {
      return;
    }

    setActionLoadingId(id);
    const res = await deleteSavedAnalysis(id);
    setActionLoadingId(null);

    if (res.ok) {
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
    } else {
      alert('Failed to delete analysis: ' + (res.error || 'Server error'));
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Spinner size="lg" message="Loading your saved analyses..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-24 space-y-8">
      <PageMeta
        title="My Saved Analyses"
        description="Review your past resume evaluations, track match score progression, and inspect saved ATS reports."
      />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3DFD8] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1F1F]">
            My Saved Analyses
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#5F5F5F]">
            Review your past resume evaluations and match scores.
          </p>
        </div>
        <Link
          to="/analyze"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1F6F5C] hover:bg-[#185849] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Analysis</span>
        </Link>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-[#FDF2F2] border border-[#C0392B]/30 text-xs text-[#C0392B] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={loadAnalyses}
            className="px-3 py-1 bg-[#C0392B] text-white rounded-lg font-semibold hover:bg-[#A93226] transition-colors cursor-pointer ml-4"
          >
            Try again
          </button>
        </div>
      )}

      {/* Analyses List */}
      {analyses.length === 0 ? (
        <div className="bg-white border border-[#E3DFD8] rounded-xl p-10 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#EAF3F0] text-[#1F6F5C] flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-[#1F1F1F]">No saved analyses yet</h2>
            <p className="text-xs text-[#5F5F5F] max-w-sm mx-auto">
              Run an analysis with your resume and a target job description, then click "Save to my account" on the results page.
            </p>
          </div>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1F6F5C] hover:bg-[#185849] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
          >
            <span>Run your first analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#E3DFD8] rounded-xl shadow-sm divide-y divide-[#E3DFD8] overflow-hidden">
          {analyses.map((item) => {
            const d = new Date(item.created_at);
            const formattedDate = !isNaN(d.getTime())
              ? `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
              : 'Recently';

            const isItemLoading = actionLoadingId === item.id;
            const scoreColor =
              item.score >= 80
                ? 'bg-[#EBF7EE] text-[#166534] border-[#166534]/30'
                : item.score >= 60
                ? 'bg-[#FEF6EE] text-[#B45309] border-[#B45309]/30'
                : 'bg-[#FDF2F2] text-[#C0392B] border-[#C0392B]/30';

            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-lg border flex flex-col items-center justify-center shrink-0 ${scoreColor}`}
                  >
                    <span className="text-base font-bold font-serif leading-none">{item.score}</span>
                    <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80">Score</span>
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-[#1F1F1F]">
                      {item.job_title || 'Target Job Analysis'}
                    </h2>
                    <p className="text-xs text-[#5F5F5F]">Analyzed on {formattedDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleOpenAnalysis(item.id)}
                    disabled={isItemLoading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#E3DFD8] bg-white text-[#1F1F1F] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                  >
                    {isItemLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ExternalLink className="w-3.5 h-3.5 text-[#1F6F5C]" />
                    )}
                    <span>Open Report</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteAnalysis(item.id, item.job_title)}
                    disabled={isItemLoading}
                    className="p-1.5 text-[#5F5F5F] hover:text-[#C0392B] hover:bg-[#FDF2F2] rounded-lg transition-colors cursor-pointer"
                    title="Delete saved analysis"
                    aria-label="Delete analysis"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
