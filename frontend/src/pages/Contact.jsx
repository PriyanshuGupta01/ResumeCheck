import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-24 space-y-10">
      <PageMeta
        title="Contact & Support"
        description="Get in touch with the ResumeCheck team for questions, feedback, or feature suggestions."
      />
      <div className="text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F1F1F]">
          Contact &amp; Support
        </h1>
        <p className="mt-2 text-base text-[#5F5F5F]">
          Have questions, feature suggestions, or feedback? Get in touch with us.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact info card */}
        <div className="bg-white border border-[#E3DFD8] rounded-xl p-6 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-lg bg-[#EAF3F0] border border-[#1F6F5C]/30 flex items-center justify-center text-[#1F6F5C]">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-[#1F1F1F]">
              Direct Email
            </h3>
            <p className="text-xs text-[#5F5F5F] mt-1 leading-relaxed">
              For support inquiries or general questions:
            </p>
            <a
              href="mailto:support@resumecheck.local"
              className="text-xs font-semibold text-[#1F6F5C] hover:underline mt-2 block"
            >
              support@resumecheck.local
            </a>
          </div>

          <div className="pt-4 border-t border-[#E3DFD8] text-xs text-[#5F5F5F]">
            We typically respond within 24 business hours.
          </div>
        </div>

        {/* Message form */}
        <div className="md:col-span-2 bg-white border border-[#E3DFD8] rounded-xl p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#EEF6F1] border border-[#166534]/30 flex items-center justify-center text-[#166534] mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#1F1F1F]">
                Thank you for your message!
              </h3>
              <p className="text-xs text-[#5F5F5F] max-w-sm mx-auto leading-relaxed">
                We've received your note and will get back to you shortly. In the meantime, you can analyze your resume anytime.
              </p>
              <div className="pt-4">
                <Link
                  to="/analyze"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-[#1F6F5C] hover:bg-[#185849] text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Check my resume
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-serif font-bold text-[#1F1F1F]">
                Send a Message
              </h3>

              <div>
                <label htmlFor="contact-name" className="block text-xs font-semibold text-[#1F1F1F] mb-1">
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E3DFD8] rounded-lg text-xs text-[#1F1F1F] placeholder-[#5F5F5F]/70 focus:outline-none focus:border-[#1F6F5C] focus:ring-1 focus:ring-[#1F6F5C]"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-semibold text-[#1F1F1F] mb-1">
                  Email Address <span className="text-[#991B1B]">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aarav.sharma@gmail.com"
                  className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E3DFD8] rounded-lg text-xs text-[#1F1F1F] placeholder-[#5F5F5F]/70 focus:outline-none focus:border-[#1F6F5C] focus:ring-1 focus:ring-[#1F6F5C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1F1F] mb-1">
                  Message <span className="text-[#991B1B]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help or improve ResumeCheck?"
                  className="w-full p-3 bg-[#FAF8F5] border border-[#E3DFD8] rounded-lg text-xs text-[#1F1F1F] placeholder-[#5F5F5F]/70 focus:outline-none focus:border-[#1F6F5C] focus:ring-1 focus:ring-[#1F6F5C] leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1F6F5C] hover:bg-[#185849] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
