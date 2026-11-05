# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static, single-page personal portfolio for Sérgio C Castelani Jr. There is no build step, package manager, linter, or test suite: just `index.html`, `index.css`, and `images/`. To preview it, open `index.html` directly in a browser or serve the folder with any static server (for example `npx serve .` or `python -m http.server`).

## Architecture

- **Bootstrap 5.3 and Bootstrap Icons come from the jsDelivr CDN** (linked in `<head>`). Layout and spacing use Bootstrap utility classes (`row`, `col-*`, `p-*`, `mt-*`, `card`, and so on). Keep custom CSS small.
- **Theming**: `index.css` sets two CSS variables on `html`, `--my-primary` (green `#86af49`) and `--my-secondary`. It overrides Bootstrap's `.btn-primary` and `.border-primary` with `!important` so they use the theme green. New accent styling should use these variables instead of Bootstrap's default blue.
- **Page sections** (in order inside `<main>`): profile (`#profile`, with social buttons as inline SVGs), "Strongest Hard skills" (three image cards), "Objectives" (`#objectives-list`, which uses a custom `::before` bullet), and "Showcase" (project cards), followed by the footer. Each section heading uses the same left-border pattern: `border-start border-5 border-primary ps-3 fw-bold`.
- **Showcase project cards** are copy-pasted blocks inside `<div class="col-12 col-lg-6">`. To add a project, copy an existing block. The left image is a `div.project-card-img`: its screenshot is set with an inline `background-image: url(./images/projects/<name>.png)`, and clicking it opens the live demo through an inline `onclick="window.open(url,'_blank')"`. Inside that div, a `.project-img-overlay` shows a "View" button on hover. The right column holds the title, a description with source links, and a `<small class="text-body-secondary">` line listing the tech stack, separated by ` | `. Project screenshots go in `images/projects/`.
- Below 768px, a media query in `index.css` changes the project image's corner radius from left-side to top-side and gives it a minimum height.
