import 'zone.js/dist/zone-node';
import 'reflect-metadata';

// Because we want to use --bundle-dependencies=all, we export the SSR
// APIs we want to invoke so they can be called from outside this bundle
export { AppServerModule } from './app/app.server.module';
export { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
export { renderModule, renderModuleFactory } from '@angular/platform-server';
export { enableProdMode } from '@angular/core';
