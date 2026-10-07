import React from 'react';
import { AlertTriangle, RotateCcw, ArrowLeft, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleAnalyzeAnother = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/analyze';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return typeof this.props.fallback === 'function'
          ? this.props.fallback({ error: this.state.error, reset: this.handleReset })
          : this.props.fallback;
      }

      const title = this.props.title || 'Something went wrong showing your results';
      const message =
        this.props.message ||
        'We encountered an unexpected error while preparing this view. You can retry the current action or start a fresh evaluation.';

      return (
        <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-sm">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold text-[#1F1F1F]">
              {title}
            </h2>
            <p className="text-sm text-[#5F5F5F] max-w-md mx-auto leading-relaxed">
              {message}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1F6F5C] hover:bg-[#185849] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try again</span>
            </button>
            <button
              type="button"
              onClick={this.handleAnalyzeAnother}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-[#FAF8F5] border border-[#E3DFD8] text-[#1F1F1F] text-xs font-semibold rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#5F5F5F]" />
              <span>Analyze another resume</span>
            </button>
          </div>

          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <div className="mt-8 text-left p-4 rounded-xl bg-red-50/50 border border-red-200 text-xs text-red-900 font-mono overflow-auto max-h-48">
              <p className="font-bold mb-1">{this.state.error.toString()}</p>
              <pre className="text-[11px] whitespace-pre-wrap">{this.state.error.stack}</pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
