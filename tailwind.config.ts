/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Includes all files in src directory
    './content/**/*.{mdx,md}', // Example for a dedicated content directory
    // Add paths for any other MDX locations, e.g.,
    // "./mdx-components.tsx",
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
