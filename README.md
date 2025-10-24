# Mapa Polski - OpenLayers Demo

Aplikacja mapowa oparta na OpenLayers z frontendem w React TypeScript, przedstawiająca mapę Polski z różnymi warstwami danych.

## Struktura projektu

```
src/
├── components/          # Komponenty React
│   ├── Map.tsx         # Główny komponent mapy z kontekstem
│   ├── LoadingProgress.tsx # Komponent progress bar dla ładowania
│   └── layers/         # Komponenty warstw
│       ├── OSMLayer.tsx           # Warstwa bazowa OSM
│       ├── VoivodeshipsLayer.tsx  # Warstwa województw
│       ├── ChartsLayer.tsx        # Warstwa wykresów ol-ext
│       ├── MaskLayer.tsx          # Warstwa maski zakrywającej
│       ├── LinesLayer.tsx         # Warstwa linii (WebGL + batch loading)
│       └── index.ts              # Eksport warstw
├── contexts/           # Context API dla współdzielenia danych
│   └── DataContext.tsx # Context do zarządzania danymi GeoJSON
├── test/               # Testy jednostkowe
├── utils/              # Narzędzia pomocnicze
│   ├── batchLoader.ts  # Utility do batch loadingu GeoJSON
│   ├── useBatchLoader.ts # React hook dla batch loadingu
│   └── index.ts        # Eksport utilities
├── config/             # Konfiguracja aplikacji
│   └── poland.ts       # Konfiguracja granic i ustawień Polski
├── types/              # Definicje typów TypeScript
└── App.tsx             # Główny komponent aplikacji
```

## Funkcjonalności

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
  <ChartsLayer visible={true} chartType="pie" chartSize={60} />
  <MaskLayer />
</Map>
```

## Zarządzanie danymi

### Obecna implementacja - DataContext

Aplikacja wykorzystuje dedykowany Context API (`DataContext`) do efektywnego zarządzania danymi GeoJSON:

```tsx
// src/contexts/DataContext.tsx
export const DataProvider: React.FC = ({ children }) => {
  const [voivodeshipsFeatures, setVoivodeshipsFeatures] = useState<
    Feature[] | null
  >(null);
  // ...
};

// Wykorzystanie w komponentach
const VoivodeshipsLayer = () => {
  const { voivodeshipsFeatures, loading, error } = useData();
  // Używa współdzielonych danych zamiast duplikować zapytania HTTP
};

const ChartsLayer = () => {
  const { voivodeshipsFeatures } = useData();
  // Te same dane, zero dodatkowych zapytań
};
```

**Korzyści obecnego rozwiązania:**

- ✅ Eliminuje dublowanie zapytań HTTP
- ✅ Współdzielenie danych między warstwami
- ✅ Transformacje współrzędnych wykonywane raz

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

### Obecne rozwiązanie

Obecnie aplikacja używa własnego Context API do współdzielenia danych GeoJSON między warstwami (VoivodeshipsLayer i ChartsLayer), co eliminuje dublowanie zapytań HTTP.

### Przyszłe możliwości

#### 1. **TanStack Query (React Query)**

#### 2. **Zustand**

```

```
