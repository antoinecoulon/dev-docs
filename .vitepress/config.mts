import { defineConfig } from "vitepress";

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
            text: "Technologies",
            items: [
              {
                text: "Nuxt 4",
                link: "/technologies/nuxt-4",
                items: [
                  {
                    text: "Fondamentaux",
                    link: "/technologies/nuxt-4/fondamentaux",
                  },
                  {
                    text: "Setup et Configuration",
                    link: "/technologies/nuxt-4/setup-config",
                  },
                  {
                    text: "Structure de base",
                    link: "/technologies/nuxt-4/structure-base",
                  },
                  {
                    text: "SSR vs. SPA",
                    link: "/technologies/nuxt-4/ssr-spa",
                  },
                  {
                    text: "Architecture fullstack",
                    items: [
                      {
                        text: "Data",
                        link: "/technologies/nuxt-4/fullstack-data",
                        items: [
                          {
                            text: "Configuration SQLite + Drizzle",
                            link: "/technologies/nuxt-4/fullstack-data/sqlite-drizzle",
                          },
                          {
                            text: "Typage SQLite + Drizzle",
                            link: "/technologies/nuxt-4/fullstack-data/sqlite-drizzle-typage",
                          },
                          {
                            text: "Flux de données",
                            link: "/technologies/nuxt-4/fullstack-data/flux-data",
                          },
                        ],
                      },
                      {
                        text: "Authentification",
                        link: "/technologies/nuxt-4/authentification",
                      },
                    ],
                  },
                  {
                    text: "Architecture BFF",
                    items: [
                      {
                        text: "Fondamentaux",
                        link: "/technologies/nuxt-4/bff",
                      },
                      {
                        text: "Data",
                        link: "/technologies/nuxt-4/bff-data",
                      },
                    ],
                  },
                  {
                    text: "UI",
                    items: [
                      {
                        text: "Layouts",
                        link: "/technologies/nuxt-4/layouts",
                      },
                      {
                        text: "NuxtUI",
                        link: "/technologies/nuxt-4/nuxt-ui",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          { text: "About", link: "/about" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/antoinecoulon" }],
  },

  srcDir: "src",
  base: '/antoinecoulon/'
});
