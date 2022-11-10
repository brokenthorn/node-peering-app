# Client

Command line client application.

## Initial base project setup

```bash
npm install typescript --save-dev
npm install @types/node --save-dev
npx tsc --init --rootDir src --outDir build --esModuleInterop --resolveJsonModule --lib es6 --module commonjs --allowJs true --noImplicitAny true --noUncheckedIndexedAccess true
```

## Compiling TS code

Just run `npx tsc`. Output will be in the `build` folder.
