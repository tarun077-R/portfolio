/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: 'var(--accent, #ff630f)',
          light: 'var(--accent-light, #ff9347)',
        },
        'bg-main': 'var(--bg-main, #000000)',
        'muted-text': 'var(--muted-text, #949494)',
        'muted-mid': 'var(--muted-mid, #aaaaaa)',
        'muted-light': 'var(--muted-light, #b8b8b8)',
        'divider-dark': 'var(--divider-dark, #222222)',
        'divider-mid': 'var(--divider-mid, #333333)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        utility: ['var(--font-utility)', 'sans-serif'],
      },
      spacing: {
        'inset-standard': 'var(--inset-standard, 3%)',
        'inset-work': 'var(--inset-work, 4.5%)',
      },
    },
  },
  plugins: [],
};
