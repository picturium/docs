# picturium docs

Source for the picturium documentation site at <https://picturium.cc>.

Built with [Astro](https://astro.build/) and MDX. The site is fully static;
the live homepage and playground talk to a separately-running picturium
instance.

## Develop

Requires Node 20+ (or 18.20.8+ / 22+).

```bash
npm install
npm run dev      # http://localhost:4321
```

| Command           | Action                                   |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the dev server                     |
| `npm run build`   | Build the static site to `dist/`         |
| `npm run preview` | Serve the built site locally             |

By default the dev site points its image URLs at `http://127.0.0.1:20048`.
Set `PUBLIC_PICTURIUM_URL` to point elsewhere, or run `./dev-picturium.sh` to
serve `public/` through a local picturium container (needs a picturium source
checkout — see the script header).

## Layout

| Path                     | What lives there                                         |
| ------------------------ | ------------------------------------------------------- |
| `src/content/docs/*.mdx` | The documentation pages themselves                       |
| `src/docs-nav.ts`        | Docs information architecture (groups, categories, order)|
| `src/pages/`             | Homepage, `/docs` index, and the `[...slug]` doc route   |
| `src/components/`        | Reusable `.astro` components used inside MDX             |
| `src/data/`              | Table data for the reference pages                       |
| `src/layouts/`           | Page shells (`Base`, `DocPage`)                          |
| `public/`                | Static assets and sample images                          |

See [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

The picturium server itself lives at <https://github.com/picturium/picturium>.
