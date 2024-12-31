/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}"
  ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#4c1d95", // Purple
                    hover: "#6b21a8", // Darker Purple
                    light: "#8b5cf6", // Lighter Purple
                },
                background: {
                    light: "#ffffff",
                    DEFAULT: "#0a0a0a", // Dark
                    card: "#171717", // Card background
                },
                text: {
                    light: "#ededed", // Light text
                    dark: "#171717", // Dark text
                },
                success: "#4caf50",
                error: "#f44336",
                info: "#2196f3",
            },
        },
    },
    plugins: [],
};
