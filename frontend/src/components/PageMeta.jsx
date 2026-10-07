import { useEffect } from 'react';

/**
 * Updates document.title and meta[name="description"] for SEO and accessibility.
 */
export default function PageMeta({ title, description }) {
  useEffect(() => {
    if (title) {
      document.title = title.includes('ResumeCheck') ? title : `${title} — ResumeCheck`;
    }
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
}
