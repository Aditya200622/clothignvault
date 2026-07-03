import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'api-serverless-routes',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url && req.url.startsWith('/api/')) {
              let body = '';
              req.on('data', chunk => {
                body += chunk;
              });
              req.on('end', async () => {
                const parsedBody = body ? JSON.parse(body) : {};
                
                // Mock request and response objects for vercel serverless functions
                const mockReq = {
                  method: req.method,
                  body: parsedBody,
                };
                
                const mockRes = {
                  status(code: number) {
                    res.statusCode = code;
                    return this;
                  },
                  json(data: any) {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                  }
                };

                const urlPath = req.url?.split('?')[0];
                if (urlPath === '/api/razorpay-create') {
                  try {
                    const handlerModule = await server.ssrLoadModule('./api/razorpay-create.ts');
                    const handler = handlerModule.default;
                    await handler(mockReq, mockRes);
                  } catch (err: any) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ success: false, message: err.message }));
                  }
                } else if (urlPath === '/api/send-email') {
                  try {
                    const handlerModule = await server.ssrLoadModule('./api/send-email.ts');
                    const handler = handlerModule.default;
                    await handler(mockReq, mockRes);
                  } catch (err: any) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ success: false, message: err.message }));
                  }
                } else {
                  next();
                }
              });
            } else {
              next();
            }
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
