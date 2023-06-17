import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
    const env = loadEnv(mode, process.cwd())

    if (env.VITE_MODE !== undefined && env.VITE_MODE.toLowerCase() === 'tauri') {
        return {
            base: "./",
            build: {outDir: './tauri-dist'},
            plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
            preview: {cors: true}
        }
    } else {
        return {
            base: "./",
            plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
            preview: {cors: true}
        }
    }
});
