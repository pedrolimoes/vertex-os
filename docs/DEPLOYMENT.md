# Deployment Guide

There are two different things you might want to deploy:

1. **A website you exported from VertexOS** — the common case. ⬇️ [Jump to it](#1-deploy-an-exported-website)
2. **The VertexOS studio itself** — for self-hosting the app. ⬇️ [Jump to it](#2-self-host-the-vertexos-studio)

Both are standard Next.js projects, so any host that runs Next.js works.

---

## 1. Deploy an exported website

When you click **Export website → Download ZIP**, you get a complete, standalone Next.js project:

```
my-website.zip
├── package.json
├── data/site.json          # your content
├── components/site.tsx
├── public/images/
├── app/
├── tailwind.config.ts
└── README.md               # also included inside the ZIP
```

Unzip it, then:

```bash
cd my-website
npm install
npm run dev        # preview at http://localhost:3000
```

Edit copy directly in `data/site.json` — no code required.

### Deploy to Vercel (recommended)

1. Push the folder to a GitHub repo:
   ```bash
   git init && git add -A && git commit -m "My VertexOS site"
   git branch -M main
   git remote add origin https://github.com/you/my-website.git
   git push -u origin main
   ```
2. Go to **vercel.com → New Project → Import** your repo.
3. Framework preset auto-detects **Next.js**. Leave the defaults and click **Deploy**.
4. You get a live `*.vercel.app` URL in ~1 minute.

No environment variables are needed — an exported site has no server secrets.

### Deploy to Netlify

1. Push to GitHub (as above).
2. **netlify.com → Add new site → Import an existing project.**
3. Build command: `npm run build`. Netlify's Next.js runtime handles the rest.
4. Deploy.

### Custom domain

In Vercel or Netlify, open **Settings → Domains**, add your domain, and follow the DNS instructions (usually one `CNAME` or `A` record at your registrar). HTTPS is provisioned automatically.

### Static export (optional)

The exported site is a normal Next.js app and can run on any Node host. If you want a fully static bundle for object storage / GitHub Pages, add `output: "export"` to `next.config.mjs` and run `npm run build` — the static site lands in `out/`. (Confirm your site uses no server-only features before doing this.)

---

## 2. Self-host the VertexOS studio

VertexOS is **local-first** and needs **no environment variables** and **no database**. You can run it locally or host it for your team.

### Run locally

```bash
git clone https://github.com/your-org/VertexOS.git
cd VertexOS
npm install
npm run build
npm start            # http://localhost:3000
```

### Host on Vercel / Netlify

Import the repo the same way as an exported site — it's a standard Next.js 15 app. There's nothing to configure: provider keys are entered in the browser by each user and never touch the server.

### Run with Docker

An official image is on the [roadmap](ROADMAP.md). In the meantime, a minimal Dockerfile:

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t vertexos .
docker run -p 3000:3000 vertexos
```

### A note on privacy when self-hosting

Because keys and projects live in each visitor's **browser**, hosting the studio does not centralize anyone's API keys or generated content. The server only serves the app and proxies generation requests (keys are forwarded per-request and never stored server-side). If you host it publicly, every user still brings — and keeps — their own key.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `npm install` fails | Use Node **18.18+** (Node 20+ recommended): `node -v`. |
| Build fails on the host | Make sure the host uses Node 18.18+ and the **Next.js** preset. |
| Exported site shows no images | The ZIP includes `public/images/`; keep that folder when you push to git. |
| Generation does nothing | With no API key the deterministic engine still runs. For model output, add a key in **Provider & Keys**. |

Still stuck? Open an issue with your host, Node version, and the build log.
