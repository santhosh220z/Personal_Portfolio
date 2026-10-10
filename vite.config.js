import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { ORIGIN, META, SITE } from './src/data/site.js'
import { SKILL_GROUPS } from './src/data/resume.js'

/**
 * Writes the <head> metadata into index.html at build time, from src/data/site.js.
 *
 * Why a plugin and not a runtime component: this is a single-page site with no
 * router and no SSR, so there is no render pass where a <meta> tag can be
 * emitted into the document head. Anything React renders lands in <body>, which
 * search engines and social scrapers ignore. index.html is a static template
 * sitting outside the module graph, so the only way to keep it honest is to
 * generate it from the same constants the components read.
 *
 * That is the whole point. src/data/site.js claims on its first line that
 * anything "the nav, the command palette, and the meta tags" share lives there
 * "so they cannot drift apart" — but until now the title and description were
 * hand-typed into index.html, which is exactly how the claim was false. One
 * source, one build step, no second place to update.
 */
const metaHtml = () => ({
  name: 'portfolio-meta',
  transformIndexHtml: {
    order: 'pre',
    handler(html) {
      const url = ORIGIN.replace(/\/$/, '')
      const image = `${url}${META.image}`
      const title = META.title
      const description = META.description

      // Escape for an HTML attribute value. The description carries an em dash
      // and the title an en dash; those are fine as UTF-8, but a future copy edit
      // containing a quote must not be able to close the attribute.
      const attr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;')

      // JSON-LD cannot live inside an HTML comment or be escaped with &quot; —
      // it must be valid JSON text inside a <script type="application/ld+json">.
      // The only sequence that can break out of that element is a literal
      // "</script", so neutralise just that.
      const jsonLd = JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: SITE.name,
          jobTitle: SITE.role,
          description,
          url,
          image: `${url}/icon-512.png`,
          email: `mailto:${SITE.email}`,
          address: {
            '@type': 'PostalAddress',
            addressLocality: SITE.location,
          },
          sameAs: [SITE.github, SITE.linkedin],
          knowsAbout: SKILL_GROUPS.flatMap((group) => group.items),
        },
        null,
        2,
      ).replace(/<\/script/gi, '<\\/script')

      const tags = `
    <link rel="canonical" href="${attr(url)}/" />

    <!-- Open Graph: how the link renders when pasted into Slack, LinkedIn, X or iMessage.
         og:image MUST be an absolute URL; a relative path renders as a blank card. -->
    <meta property="og:type" content="${attr(META.type)}" />
    <meta property="og:site_name" content="${attr(SITE.name)}" />
    <meta property="og:locale" content="${attr(META.locale)}" />
    <meta property="og:title" content="${attr(title)}" />
    <meta property="og:description" content="${attr(description)}" />
    <meta property="og:url" content="${attr(url)}/" />
    <meta property="og:image" content="${attr(image)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${attr(`${SITE.name} — ${SITE.role}`)}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${attr(title)}" />
    <meta name="twitter:description" content="${attr(description)}" />
    <meta name="twitter:image" content="${attr(image)}" />

    <meta name="author" content="${attr(SITE.name)}" />
    <script type="application/ld+json">${jsonLd}</script>
`

      return html
        // The <title> and <meta name="description"> in index.html are placeholders
        // that exist so the dev server shows something before the first transform.
        //
        // These patterns are deliberately anchored to the exact placeholder text.
        // A looser /content="[\s\S]*?"/ would stop at the first ">" it met, and
        // the description contains an em dash but the surrounding markup may grow
        // a ">" later — which silently truncates the tag and breaks the parse.
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${attr(title)}</title>`)
        .replace(
          /<meta\s+name="description"\s+content="Applied ML engineer[\s\S]*?"\s*\/?>/,
          `<meta name="description" content="${attr(description)}" />`,
        )
        .replace('</head>', `${tags}  </head>`)
    },
  },
})

export default defineConfig({
  plugins: [metaHtml(), react(), tailwindcss()],
  // jsdom, not the default node environment: every meaningful assertion here is
  // about rendered markup, and a document-less "node" environment cannot tell
  // you whether a component emitted its alt text or its aria attributes.
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    // The generated geometry is deterministic (seeded RNG at module load), so
    // snapshots would be stable but would mostly assert their own noise. The
    // tests below assert structure and behaviour instead.
    css: false,
  },
  build: {
    rolldownOptions: {
      output: {
        // Split the large, independently-cacheable vendors out of the app chunk.
        // Without this everything ships as one 530 KB file that must be
        // re-downloaded in full whenever any line of app code changes.
        //
        // Rolldown (Vite 8) requires groups here, not the Rollup object form —
        // an object throws "manualChunks is not a function".
        //
        // gsap is kept separate from framer-motion on purpose: they animate the
        // same surfaces by different means, and splitting them means a change to
        // one does not invalidate the other in the browser cache.
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/]react(-dom)?[\\/]/ },
            { name: 'gsap', test: /node_modules[\\/]gsap[\\/]/ },
            { name: 'motion', test: /node_modules[\\/]framer-motion[\\/]/ },
            { name: 'icons', test: /node_modules[\\/]lucide-react[\\/]/ },
          ],
        },
      },
    },
  },
})