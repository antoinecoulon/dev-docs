import { defineConfig } from "vitepress";
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
            text: "Admin Système",
            link: "/sys-admin/sys-admin"
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

  markdown: {
    config: (md) => {
      md.use(taskLists)
    }
  }
});
