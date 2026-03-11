import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-inter)"],
                outfit: ["var(--font-outfit)"],
            },
            colors: {
                slate: {
                    750: "#1e293b", // Custom intermediate slate
                }
            }
        },
    },
    plugins: [],
};
export default config;
迫于篇幅，我将把其他页面代码放在后面
