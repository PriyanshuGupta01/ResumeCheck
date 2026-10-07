/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FAF8F5',
        surface: '#FFFFFF',
        border: '#E3DFD8',
        'border-strong': '#D1CCC2',
        ink: {
          DEFAULT: '#1F1F1F',
          body: '#3A3A3A',
          muted: '#5F5F5F',
          faint: '#5F5F5F',
        },
        accent: {
          DEFAULT: '#1F6F5C',
          hover: '#185849',
          faint: '#EAF3F0',
        },
        matched: {
          DEFAULT: '#166534',
          faint: '#EEF6F1',
        },
        missing: {
          DEFAULT: '#991B1B',
          faint: '#FDF1F0',
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '10px',
        xl: '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
}
