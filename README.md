# Spectral Solutions Atlas

**Geospatial Intelligence × Global Problems**

An interactive atlas that maps 50+ Earth-observation and spectral data sources against 20 of the most urgent planetary-scale problems, then surfaces 50 creative, cross-sensor solutions that live at their intersection.

Live explorer for the question: *what becomes possible when we fuse hyperspectral, SAR, LiDAR, thermal, gravimetric, and atmospheric sensing in ways no one has operationalized yet?*

## What's inside

The app opens on three views:

- **◆ Creative Solutions** — 50 proposed solutions, each scored for novelty (1–10), linked to the problems it addresses, and grounded in a specific stack of data sources. Examples: a planetary methane prosecution engine, a hyperspectral soil-carbon futures market, a zoonotic spillover early-warning network, an invisible-aquifer observatory built from three-physics fusion.
- **◫ Data Atlas** — the full sensor catalog, grouped by modality: multispectral optical, hyperspectral, SAR/radar, LiDAR/elevation, atmospheric/GHG, thermal/nighttime, ocean/water, gravity/geodetic, and derived fusion products. Each entry lists band count, resolution, revisit, provider, whether it's free, and whether it's in the Google Earth Engine catalog.
- **▲ Global Problems** — 20 problems tagged by domain (Environment / Human / Resource) and severity (1–10), from climate acceleration to forced displacement to critical-mineral scarcity. Each problem is cross-linked to the solutions that attack it.

Everything is client-side and cross-linked: clicking a problem jumps to the solutions that target it; clicking a solution reveals the sensor stack it depends on.

## Tech

- React 19 + Vite 8
- Single-file component ([spectral-solutions-atlas.jsx](spectral-solutions-atlas.jsx)) wrapped by [src/App.jsx](src/App.jsx)
- No backend — all data is static, defined inline in the component

## Getting started

```bash
npm install
npm run dev      # start the Vite dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
npm run lint     # run ESLint
```

## Sources

Sensor metadata is drawn from the Google Earth Engine Catalog, ESA Copernicus, NASA EarthData, Planet Labs, Pixxel, Kuva Space, and the EnMAP mission page. Problem framing draws on the WEF Global Risks Report 2026 and the IRC Emergency Watchlist 2026.
