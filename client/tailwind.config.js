/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                neon: {
                    green: '#39FF14',
                    pink: '#FF00FF',
                    blue: '#00FFFF',
                    purple: '#BC13FE'
                },
                dark: {
                    bg: '#0a0a0a',
                    card: '#121212',
                    border: '#2a2a2a'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            },
            boxShadow: {
                neon: '0 0 10px rgba(57, 255, 20, 0.5)',
                'neon-hover': '0 0 20px rgba(57, 255, 20, 0.8)',
            }
        },
    },
    plugins: [],
}
