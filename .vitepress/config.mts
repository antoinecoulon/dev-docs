import { defineConfig } from "vitepress";
import { VitePWA } from 'vite-plugin-pwa'
import taskLists from 'markdown-it-task-lists'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Dev Docs",
  description: "Documentation pour le développement par Antoine Coulon",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    
    nav: [
      { text: "Home", link: "/" },
      { text: "Documentations", link: "/docs-index" },
    ],

    sidebar: [
      {
        text: "Navigation",
        items: [
          { text: "Index", link: "/docs-index" },
          {
            text: "Architecture",
            link: "/architecture/architecture"
          },
          {
            text: "Design Patterns",
            link: "/design-patterns/design-patterns"
          },
          {
            text: "Technologies",
            items: [
              {
                text: "Nuxt 4",
                link: "/technologies/nuxt-4/nuxt-4",
              },
              {
                text: "C# / .NET",
                link: "/technologies/csharp-dotnet/csharp-dotnet"
              },
              {
                text: "React Native",
                link: "/technologies/react-native/react-native"
              },
              {
                text: "React / Next.js",
                link: "/technologies/react-next/react-next"
              },
              {
                text: "Tailwind CSS",
                link: "/technologies/tailwind-css/tailwind-css"
              }
            ]
          },
          {
            text: "Sécurité",
            link: "/security/security"
          },
          {
            text: "Déploiement",
            link: "/deploy/deploy"
          },
          {
            text: "Automatisation",
            link: "/automatisation/automatisation"
          },
          {
            text: "Gestion de projet",
            link: "/gestion-projet/gestion-projet"
          },
          {
            text: "Git",
            link: "/git/git"
          },
          {
            text: "Infra",
            link: "/infrastructure/infrastructure"
          },
          { text: "Ressources", link: "/resources/resources"},
          { text: "About", link: "/about" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/antoinecoulon" }],
  },

  srcDir: "src",
  base: '/dev-docs/',

  head: [
    ['link', { rel: 'manifest', href: '/dev-docs/manifest.json' }],
    ['link', { rel: 'icon', href: '/dev-docs/favicon.ico', sizes: '48x48' }],
    ['link', { rel: 'icon', href: '/dev-docs/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#646cff' }]
  ],

  vite: {
    plugins: [
      VitePWA({
        base: '/dev-docs/',
        scope: '/dev-docs/',
        manifestFilename: 'manifest.json',
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true,
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          cleanupOutdatedCaches: true
        },
        manifest: {
          name: 'Dev Docs',
          short_name: 'DevDocs',
          description: 'Documentation technique et guides. Antoine Coulon',
          theme_color: '#646cff',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/dev-docs/',
          icons: [
            {
              src: '/dev-docs/icon-192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/dev-docs/icon-512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ]
  },

  markdown: {
    config: (md) => {
      md.use(taskLists)
    }
  }
});
