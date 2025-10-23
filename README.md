# Mapa Polski - OpenLayers Demo

Aplikacja mapowa oparta na OpenLayers z frontendem w React TypeScript, przedstawiająca mapę Polski z różnymi warstwami danych.

## Struktura projektu

```
src/
├── components/          # Komponenty React
│   └── MapComponent.tsx # Główny komponent mapy
├── layers/             # Definicje warstw OpenLayers
│   └── baseLayers.ts   # Warstwy bazowe (OSM, etc.)
├── config/             # Konfiguracja aplikacji
│   └── poland.ts       # Konfiguracja granic i ustawień Polski
├── types/              # Definicje typów TypeScript
└── App.tsx             # Główny komponent aplikacji
```

## Funkcjonalności

### Zrealizowane

- ✅ Podstawowa mapa OSM
- ✅ Widok ograniczony do granic Polski
- ✅ Automatyczne dopasowanie do ekstent Polski
- ✅ Modularna struktura kodu
- ✅ Warstwy zorganizowane w osobnym folderze

### Planowane

- 🔄 Warstwa wojewodztwa.geojson z wykresami
- 🔄 Warstwa linie.geojson
- 🔄 Maska zakrywająca obszary poza Polską
- 🔄 Panel kontroli warstw
- 🔄 Wizualizacje danych z ol-ext

## Instalacja i uruchomienie

```bash
npm install
npm run dev
```

## Technologie

- **Vite** - bundler i dev server
- **React 18** - framework UI
- **TypeScript** - typy statyczne
- **OpenLayers** - biblioteka mapowa
- **ESLint** - linting kodu
