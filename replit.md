# Jordan Ellis Portfolio

This is a server-rendered static HTML/CSS/JavaScript portfolio with an Express server.

## Run

```bash
npm run dev
```

The server listens on port 5000. The Replit workflow should use `npm run dev` with a webview on port 5000.

## Pages

- `index.html` — home page and contact form
- `media.html` — nine-card media archive
- `future.html` — five-year vision
- `creative-coding.html` — creative coding story
- `community.html` — community and collaboration story
- `admin.html` — protected contact dashboard

## Storage and authentication

Contact records are stored in Replit App Storage at `data/contactReceived.json`. The server initializes the object to `[]` when it does not exist. The admin password is read from the `ADMIN_PASSWORD` Replit Secret; when that secret is not configured, the existing `SESSION_SECRET` secret is used as a development fallback. Set `ADMIN_PASSWORD` before sharing the published site.