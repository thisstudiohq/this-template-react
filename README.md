## This Template (React)

Boilerplate for creative projects

### Installation & Setup

1. Install dependencies:

```bash
bun install
```

*(If you do not have bun installed, delete `bun.lock` and run `npm install`)*

2. Copy the environment variables:

```bash
cp .env.example .env
```

Set your Sanity and Cloudinary credentials in `.env` (the frontend will gracefully use default fallback content if Sanity is not yet configured).

3. Start development servers:

- **Web app**:
```bash
bun dev
```
Accessible at `http://localhost:3000/`.

- **Sanity Studio**:
```bash
bun run studio:dev
```
Accessible at `http://localhost:3333/studio/` (or proxied via `http://localhost:3000/studio`).

### Misc

Follow Ibrahim: [X](https://x.com/ibrahimraimi_), [Instagram](https://www.instagram.com/ibrahimraimi_), [GitHub](https://github.com/ibrahimraimi), [LinkedIn](https://www.linkedin.com/in/ibrahimraimi) 

### License
[MIT](LICENSE)

Made with :blue_heart: by [Ibrahim Raimi](https://www.ibrahimraimi.com)