// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "VoceChat",
  tagline: "VoceChat Document Site",
  url: "https://doc.voce.chat.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "https://voce.chat/favicon.ico",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "privoce", // Usually your GitHub org/user name.
  projectName: "vocechat-server", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-cn".
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh-cn"],
  },

  presets: [
    [
      "docusaurus-preset-openapi",
      /** @type {import('docusaurus-preset-openapi').Options} */
      // /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        api: {
          path: "spec.json",
          routeBasePath: "/api",
        },
        docs: {
          routeBasePath: "/",
          showLastUpdateTime: true,
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: ({ versionDocsDirPath, docPath }) =>
          //   `https://github.com/privoce/vocechat-doc/tree/main/${versionDocsDirPath}/${docPath}`,
          editLocalizedFiles: true,
          editUrl: "https://github.com/privoce/vocechat-doc/tree/main/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
    // [
    //   "docusaurus-preset-openapi",
    //   /** @type {import('docusaurus-preset-openapi').Options} */
    //   {
    //     api: {
    //       path: "https://dev.voce.chat/api/spec",
    //       routeBasePath: "/api",
    //     },
    //     // docs: {
    //     //   sidebarPath: require.resolve("./sidebars.js"),
    //     //   routeBasePath: "/",
    //     // },
    //     // theme: {
    //     //   customCss: require.resolve("./src/css/custom.css"),
    //     // },
    //   },
    // ],
    // Redocusaurus config
    // [
    //   "redocusaurus",
    //   {
    //     // Plugin Options for loading OpenAPI files
    //     specs: [
    //       {
    //         spec: "https://dev.voce.chat/api/spec",
    //         route: "/api/",
    //       },
    //     ],
    //   },
    // ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      colorMode: {
        defaultMode: "light",
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: "VoceChat",
        logo: {
          alt: "VoceChat Logo",
          src: "https://voce.chat/favicon.ico",
        },
        items: [
          {
            type: "localeDropdown",
            position: "left",
          },
          {
            label: "APIs",
            to: "/api",
            position: "left",
          },
          // {
          //   type: 'doc',
          //   docId: 'intro',
          //   position: 'left',
          //   label: 'Tutorial',
          // },
          {
            href: "https://github.com/privoce",
            className: "header-github-link",
            position: "right",
            "aria-label": "GitHub repository",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: "https://discord.gg/Q49AVn6pHs",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/vocechat",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Website",
                to: "https://voce.chat",
              },
              {
                label: "Demo",
                href: "https://privoce.voce.chat",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Privoce, Inc.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["nginx", "java", "scala", "php"],
      },
      algolia: {
        // The application ID provided by Algolia
        appId: "QQ19MFT9P5",

        // Public API key: it is safe to commit it
        apiKey: "0139335cd424688080316ced5d7dbb51",

        indexName: "voce",

        // // Optional: see doc section below
        // contextualSearch: true,

        // // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: 'external\\.com|domain\\.com',

        // // Optional: Algolia search parameters
        // searchParameters: {},

        // // Optional: path for search page that enabled by default (`false` to disable it)
        // searchPagePath: 'search',
      },
    },
};

module.exports = config;
