import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Picturium",
  description: "Image delivery, reimagined",
  appearance: "force-dark",
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "Documentation", link: "/documentation" }],

    sidebar: [
      {
        text: "Getting Started",
        link: "/documentation",
        items: [
          { text: "Installation", link: "/documentation/installation" },
          { text: "Configuration", link: "/documentation/configuration" },
        ],
      },
    ],

    search: {
      provider: "local",
    },

    socialLinks: [{ icon: "github", link: "https://github.com/picturium/picturium" }],

    footer: {
      message:
        'Released under the <a href="https://github.com/picturium/picturium?tab=GPL-3.0-1-ov-file">GPL-3.0 License</a>.',
      copyright: 'Copyright © 2025-present <a href="https://github.com/lamka02sk">lamka02sk</a>',
    },
  },
  head: [["link", { rel: "icon", href: "/favicon.png" }]],
});
