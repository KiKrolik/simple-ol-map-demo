# Mapa Polski - OpenLayers Demo

Aplikacja mapowa oparta na OpenLayers z frontendem w React TypeScript, przedstawiająca mapę Polski z różnymi warstwami danych.

## Struktura projektu

```
src/
├── components/          # Komponenty React
│   ├── Map.tsx         # Główny komponent mapy z kontekstem
│   ├── MapComponent.tsx # Stary komponent (do usunięcia)
│   ├── LoadingProgress.tsx # Komponent progress bar dla ładowania
│   └── layers/         # Komponenty warstw
│       ├── OSMLayer.tsx           # Warstwa bazowa OSM
│       ├── VoivodeshipsLayer.tsx  # Warstwa województw
│       ├── LinesLayer.tsx         # Warstwa linii (WebGL + batch loading)
│       └── index.ts              # Eksport warstw
├── utils/              # Narzędzia pomocnicze
│   ├── batchLoader.ts  # Utility do batch loadingu GeoJSON
│   ├── useBatchLoader.ts # React hook dla batch loadingu
│   └── index.ts        # Eksport utilities
├── layers/             # Fabryki warstw OpenLayers (stare - do refaktoryzacji)
│   ├── baseLayers.ts   # Warstwy bazowe
│   └── dataLayers.ts   # Warstwy danych
├── config/             # Konfiguracja aplikacji
│   └── poland.ts       # Konfiguracja granic i ustawień Polski
├── types/              # Definicje typów TypeScript
└── App.tsx             # Główny komponent aplikacji
```

## Funkcjonalności

### Zrealizowane

- ✅ Podstawowa mapa OSM
- ✅ Widok ograniczony do granic Polski z buforem 50km
- ✅ Automatyczne dopasowanie do ekstent Polski
- ✅ Modularna struktura kodu
- ✅ **Komponentowa architektura warstw** - `<Map><Layer1/><Layer2/></Map>`
- ✅ **Warstwa wojewodztwa.geojson** - z transformacją EPSG:4258 → EPSG:3857
- ✅ **Warstwa linie.geojson** - z transformacją EPSG:2180 → EPSG:3857 (WebGL dla wydajności)
- ✅ **Panel kontroli warstw** - możliwość włączania/wyłączania każdej warstwy
- ✅ **Transformacje układów współrzędnych** - proj4 + OpenLayers
- ✅ **Context API** - współdzielenie instancji mapy między komponentami
- ✅ **Obsługa stanów** - loading, error handling dla każdej warstwy
- ✅ **Konfiguracja stylów warstw** przez props
- ✅ **Optymalizacja wydajności** - WebGL rendering dla warstwy linii
- ✅ **Batch loading** - ładowanie dużych zbiorów danych w partiach (reusable utility)
- ✅ **Maska zakrywająca obszary poza Polską** (biały poligon)
- ✅ **Wizualizacje danych z ol-ext** - wykresy na podstawie danych1-4

## Instalacja i uruchomienie

```bash
npm install
npm run dev
```

## Architektura warstw

Aplikacja używa komponentowej architektury warstw:

```tsx
<Map>
  <OSMLayer visible={true} />
  <VoivodeshipsLayer
    visible={true}
    style={{
      fillColor: "rgba(0, 100, 200, 0.2)",
      strokeColor: "#0066cc",
      strokeWidth: 2,
    }}
  />
  <LinesLayer
    visible={true}
    style={{
      strokeColor: "#ff6600",
      strokeWidth: 1.5,
    }}
  />
</Map>
```

Każdy komponent warstwy:

- Zarządza własnym stanem (ładowanie, błędy)
- Dodaje/usuwa się automatycznie z mapy
- Obsługuje zmiany widoczności przez props
- Może być stylowany przez props
- Używa Context API do dostępu do mapy

## Układy współrzędnych

- **EPSG:4258** (ETRS89) - województwa.geojson
- **EPSG:2180** (Poland CS92) - linie.geojson
- **EPSG:3857** (Web Mercator) - docelowy układ mapy
- **Proj4** - biblioteka do transformacji współrzędnych

## Technologie

- **Vite** - bundler i dev server
- **React 18** - framework UI z Context API
- **TypeScript** - typy statyczne
- **OpenLayers 10.6** - biblioteka mapowa
- **Proj4** - transformacje układów współrzędnych
- **ESLint** - linting kodu
- **ol-ext** - rozszerzenia dla OpenLayers
