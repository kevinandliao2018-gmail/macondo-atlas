import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [mdx(), react()],
  output: 'static',
  site: 'https://macondo-archive.local',
  markdown: {
    shikiConfig: {
      theme: 'github-light'
    }
  }
});
