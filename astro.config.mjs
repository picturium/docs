import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// github-dark's comment grey (#6a737d) is 4.0:1 on the code-block background,
// under WCAG AA. GitHub's own newer comment colour clears it at 6.0:1 and
// leaves the rest of the theme alone.
const AA_COMMENT = { '#6a737d': '#8b949e' };

export default defineConfig({
  site: 'https://picturium.cc',
  // PORT lets a second dev server run alongside one already on 4321.
  server: { port: Number(process.env.PORT) || 4321 },
  integrations: [mdx(), sitemap()],
  // Self-hosted: Astro downloads these at build time and serves them from our
  // own origin, so no render-blocking request to fonts.googleapis.com and no
  // third-party connection before first paint.
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: 'Space Grotesk',
        cssVariable: '--font-display',
        weights: [400, 500, 600, 700],
        fallbacks: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      {
        provider: fontProviders.google(),
        name: 'Inter',
        cssVariable: '--font-body',
        weights: [400, 500, 600],
        fallbacks: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      {
        provider: fontProviders.google(),
        name: 'JetBrains Mono',
        cssVariable: '--font-mono',
        weights: [400, 500, 600],
        fallbacks: ['ui-monospace', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      {
        provider: fontProviders.google(),
        name: 'VT323',
        cssVariable: '--font-pixel',
        weights: [400],
        fallbacks: ['ui-monospace', 'monospace'],
      },
    ],
  },
  markdown: {
    shikiConfig: {
      transformers: [
        {
          span(node) {
            const style = node.properties?.style;
            if (typeof style !== 'string') return;
            for (const [from, to] of Object.entries(AA_COMMENT)) {
              if (style.toLowerCase().includes(from)) {
                node.properties.style = style.replace(new RegExp(from, 'gi'), to);
              }
            }
          },
        },
      ],
    },
  },
});
