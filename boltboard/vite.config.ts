import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import ConditionalCompile from 'vite-plugin-conditional-compiler';

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
    const env = loadEnv(mode, process.cwd())

    if (env.VITE_TAURI !== undefined) {
        return {
            base: "./",
            build: {outDir: '../src-tauri/dist/dashboard'},
            plugins: [react(), viteTsconfigPaths(), svgrPlugin(), ConditionalCompile()],
            preview: {cors: true}
        }
    } else {
        return {
            base: "./",
            plugins: [react(), viteTsconfigPaths(), svgrPlugin(), ConditionalCompile()],
            preview: {cors: true}
        }
    }
});
