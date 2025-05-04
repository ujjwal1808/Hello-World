import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [daisyui],
	daisyui: {
		themes: [
			{
				linkedin: {
					primary: "#6C63FF",       // Soft Indigo (Brand color - elegant & modern)
					secondary: "#FFFFFF",     // White (Clean secondary elements)
					accent: "#62C370",        // Fresh Green (Subtle & positive accent)
					neutral: "#1F2937",        // Dark Gray (Rich, deep text color)
					"base-100": "#F9FAFB",    // Off-white / light gray (Clean background)
					info: "#3B82F6",          // Blue (For informational texts and icons)
					success: "#10B981",       // Emerald green (Positive & modern)
					warning: "#FBBF24",       // Amber (Bright and accessible warnings)
					error: "#EF4444",         // Strong Red (Clear and readable errors)
				},
			},
		],
	}	
};
