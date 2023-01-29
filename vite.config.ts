import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { setDefaultResultOrder } from 'dns'
// import WindiCSS from 'vite-plugin-windicss';
// https://vitejs.dev/config/
setDefaultResultOrder('verbatim')
export default defineConfig({
    plugins: [
        react(),
        // 用于解决App主键热更新异常
        {
            name: "singleHMR",
            handleHotUpdate({ modules }) {
                modules.map((m) => {
                    m.importedModules = new Set();
                    m.importers = new Set();
                });
                return modules;
            },
        },
    ],
    server: {
        proxy: {
            '/api': {
                target: 'https://localhost:44399',
                changeOrigin: true,
                secure: false,
                // rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
        port: 3000,
    },
});
