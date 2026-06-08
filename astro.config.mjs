import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [mdx(), react()],
  output: 'static',
  site: process.env.PUBLIC_SITE_URL ?? 'https://macondo-atlas.netlify.app',
  markdown: {
    shikiConfig: {
      theme: 'github-light'
    }
  }
});
