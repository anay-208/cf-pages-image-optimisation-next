import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

// Here we use the @cloudflare/next-on-pages next-dev module to allow us to use bindings during local development
// (when running the application with `next dev`), for more information see:
// https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {


};

if(process.env.NODE_ENV !== 'development') {
  // On Loca, its not expected to work as `cdn-cgi` won't be available(its provided by cloudflare)
  nextConfig["images"] =   {
    loader: 'custom',
    loaderFile: 'src/image/loader.ts',
  }
}


export default nextConfig;
