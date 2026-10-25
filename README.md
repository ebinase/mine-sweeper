# Mine Sweeper 
Simple Minesweeper app built with React, TypeScript, and Vite.

You can play here: https://mine-sweeper.ebinas.dev/

<img width="1440" alt="playground_screenshot" src="https://github.com/ebinase/mine-sweeper/assets/54468945/da4a609c-8213-47c9-86c9-90fbae6f5103">


## Getting Started

Use Node.js 20.19+, 22.13+, or 24+ locally and in the deployment environment.

install dependencies

```
npm install
```

run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build and checks

- `npm run lint`: check React Hooks rules and source syntax.
- `npm run build`: type-check and build static files into `dist/`.
- `npm run preview`: preview the production build locally (not a production server).

`npm test` checks tap, long press, and canceled pointer interactions without extra test dependencies.
After changes, check opening cells, flags,
difficulty selection, restart, and the guide in a browser, including mobile layouts.

## Deployment

Vercel settings are defined in `vercel.json`: Vite, `npm run build`, and `dist/`.
Keep the existing Vercel project and domain. Check a Preview Deployment before
promoting the migration to production. No server functions or SPA rewrites are needed.

Site metadata lives in `index.html`; robots, sitemap, images, and the self-hosted
font live in `public/`. The font license is at `public/fonts/OFL.txt`.

## Assets
### Lib
- [ebinase/react-use-minesweeper](https://github.com/ebinase/react-use-minesweeper)
  - マインスイーパのメインロジックを実装しているライブラリ(本リポジトリから派生)

### Images
- [DOT-ILLUST](https://dot-illust.net/)
  - 爆弾の画像
- [DOTOWN](https://dotown.maeda-design-room.net/)
  - フラグの画像

### Fonts
- [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P)
