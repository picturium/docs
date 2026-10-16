# Contributing

Thanks for helping improve the picturium docs. This repo is **only** the
documentation website. Bugs and features in picturium itself belong in
<https://github.com/picturium/picturium>.

## Before you start

- For anything larger than a typo or small clarification, open an issue first
  so we can agree on the shape of the change.
- Check that the behaviour you're documenting matches the current picturium
  release. When in doubt, test it against a running instance.

## Setup

```bash
npm install
npm run dev
```

Node 20+ is required. See the [README](README.md) for the full command list
and for pointing the dev site at a picturium instance.

## Editing or adding a page

Docs pages are MDX files in `src/content/docs/`. Each needs frontmatter:

```mdx
---
title: Page title
description: One sentence describing the page, used for SEO and search.
---
```

Optional frontmatter fields (see `src/content.config.ts`):

- `crumbs` — breadcrumb trail above the title.
- `monoHeadings` — set `true` for config-key style pages whose section
  headings are literal identifiers.

To add a **new** page:

1. Create `src/content/docs/<slug>.mdx`. It routes automatically at
   `/docs/<slug>`.
2. Add it to `src/docs-nav.ts` so it appears on the `/docs` index under the
   right group and category, and in the intended order.
3. Reference-table data lives in `src/data/`; extend those files rather than
   hard-coding tables in MDX.

Reuse the components in `src/components/` (`DataTable`, `Playground`,
`TransformFlow`, …) instead of adding new ones unless a page genuinely needs
something new.

## Style

- Prefer short sentences and concrete examples over prose.
- Link between pages with root-relative paths: `/docs/sizing`.
- Show URLs and config as fenced code blocks with a language tag
  (` ```text `, ` ```toml `, ` ```bash `).
- Use British spelling ("colour", "behaviour") to match existing pages.
- Wrap prose at roughly 100 columns.

## Before opening a PR

```bash
npm run build
```

The build must pass with no broken content-collection or link errors. Keep
each PR focused on one topic, and describe what changed and why. Fixup
commits are fine; we squash on merge.

## License / DCO

By contributing you agree your changes are licensed under the same terms as
this repository.
