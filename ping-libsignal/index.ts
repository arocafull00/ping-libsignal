// Reexport the native module. On web, it will be resolved to PingLibsignalModule.web.ts
// and on native platforms to PingLibsignalModule.ts
export { default } from './src/PingLibsignalModule';
export * from  './src/PingLibsignal.types';
