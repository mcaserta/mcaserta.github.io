# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog/website repository built as a static site using the **Krik** static site generator (a Rust-based tool developed by the repository owner). The site is deployed to GitHub Pages at `mirkocaserta.com`.

## Project Structure

- `content/` - Main content directory
  - `site.toml` - Site configuration (title, base URL)
  - `posts/` - Blog posts in Markdown format with frontmatter
  - `pages/` - Static pages (about, contacts, cv) in Markdown
  - `images/` - Image assets organized by type
  - `c64/` - Commodore 64 related files (.prg, .d64)
  - `CNAME` - GitHub Pages domain configuration
  - `keybase.txt` - Keybase verification file

- `themes/default/` - Theme files for the site
  - `templates/` - HTML templates using template syntax (index.html, post.html, page.html)
  - `assets/css/main.css` - Stylesheet with CSS custom properties for theming
  - `assets/js/` - JavaScript files for theme toggling and Prism.js initialization
  - `theme.toml` - Theme configuration

## Content Management

### Blog Posts
Posts are written in Markdown with YAML frontmatter including:
```yaml
---
title: "Post Title"
date: 2025-07-27T00:42:26Z
layout: post
tags: ["tag1", "tag2"]
---
```

### Pages
Static pages use similar frontmatter:
```yaml
---
layout: page
title: "Page Title"
---
```

## Theme Features

The default theme includes:
- Responsive design with sidebar navigation
- Dark/light theme toggle with system preference detection
- Mobile hamburger menu
- Syntax highlighting via Prism.js
- Table of contents generation for posts
- Multi-language support (detects translations)
- Scroll-to-top functionality

## Development Commands

Since this repository uses the external Krik static site generator:

- **Build site**: Run `krik` from repository root (requires Krik to be installed)
- **Output**: Generated site files go to `_site/` directory (gitignored)
- **Preview**: Serve the `_site/` directory with any static file server

## File Formatting

- `.prettierrc` configures Prettier with `proseWrap: always`
- Content files should maintain consistent Markdown formatting
- Template files use a custom template syntax with variables like `{{ title }}`, `{{ content | safe }}`

## Important Notes

- This is a content-focused repository - the Krik generator itself is a separate project
- Images should be placed in appropriate subdirectories under `content/images/`
- The site supports both Italian and English content (bilingual posts possible)
- CSS uses modern custom properties for consistent theming
- JavaScript is minimal and focuses on progressive enhancement