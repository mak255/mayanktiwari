# Personal Portfolio Website

A minimal, dark-themed portfolio built with **vanilla HTML, CSS & JavaScript** — no frameworks, no build tools, zero dependencies.

## Features

- **Responsive** — mobile-first design with hamburger nav
- **Dark theme** — easy on the eyes with accent color highlights
- **Scroll animations** — Intersection Observer–based reveal effects
- **Sections** — Hero, About, Skills, Experience (timeline), Projects, Contact
- **Lightweight** — ~15 KB total (HTML + CSS + JS), loads instantly

## Hosting on GitHub Pages

The repo includes a GitHub Actions workflow at `.github/workflows/deploy.yml` that automatically deploys on every push to `main`.

### Setup

1. Push this repo to GitHub.
2. Go to **Settings → Pages → Source** and select **GitHub Actions**.
3. The site will deploy automatically and be available at `https://<username>.github.io/<repo-name>/`.

## Customization

| What | Where |
|------|-------|
| Name, bio, projects | `index.html` |
| Colors, fonts, spacing | `style.css` (CSS variables at `:root`) |
| Animations, form behavior | `script.js` |
| Contact form backend | Replace `YOUR_FORM_ID` in `index.html` with a [Formspree](https://formspree.io) endpoint (or remove the form) |
| Social links | Update `href` values in the contact section of `index.html` |

## Local Preview

Just open `index.html` in a browser, or:

```bash
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## License

MIT
