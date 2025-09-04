/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#34D399',        // Soft emerald green
        'primary-light': '#D1FAE5', // Very light mint green
        'primary-dark': '#059669',  // Deeper emerald green

        accent: '#F59E0B',         
        'accent-light': '#FEF3C7',  
        background: '#F9FAFB',     
        card: '#FFFFFF',           
        header: '#FFFFFF',        
        text: '#1F2937',           
        subtext: '#6B7280',        
        border: '#E5E7EB',         
        input: '#F3F4F6',          
        success: '#10B981',         
        'success-light': '#D1FAE5', 
        warning: '#F59E0B',         
        'warning-light': '#FEF3C7', 
        error: '#EF4444',           
        'error-light': '#FEE2E2',  

        // --- Dark Mode Palette ---
        dark: {
          background: '#111827',   
          card: '#1F2937',         
          header: '#1F2937',       
          text: '#F9FAFB',         
          subtext: '#9CA3AF',      
          border: '#374151',       
          input: '#374151',        
          success: '#34D399',       
          warning: '#FBBF24',      
          error: '#F87171',        
        },
      },
      fontFamily: {
        poppins: ['Poppins-Regular'], 
        'poppins-semibold': ['Poppins-SemiBold'],
        'poppins-bold': ['Poppins-Bold'],
        lato: ['Lato-Regular'],
        'lato-bold': ['Lato-Bold'],
      },
    },
  },
  plugins: [],
};