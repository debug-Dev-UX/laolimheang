import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Only map valid JS identifier keys prefixed with REACT_APP_ or VITE_
  const processEnvDefines = Object.keys(env).reduce((acc, key) => {
    if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) && (key.startsWith('REACT_APP_') || key.startsWith('VITE_'))) {
      acc[`process.env.${key}`] = JSON.stringify(env[key]);
    }
    return acc;
  }, {
    'process.env.NODE_ENV': JSON.stringify(mode),
  });

  return {
    plugins: [
      react({
        include: /\.(jsx|js)$/,
      }),
    ],
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.[jt]sx?$/,
      exclude: [],
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      ...processEnvDefines,
    },
    envPrefix: ['VITE_', 'REACT_APP_'],
    server: {
      port: 3000,
      open: false,
    },
    build: {
      outDir: 'dist',
    },
  };
});
