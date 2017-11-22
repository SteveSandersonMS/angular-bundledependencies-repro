import * as express from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

// Our index.html we'll use as our template
const template = readFileSync(join(DIST_FOLDER, 'browser', 'index.html')).toString();

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {
  AppServerModule,
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP,
  provideModuleMap,
  renderModule,
  renderModuleFactory,
  enableProdMode
} = require('./dist/server/main.bundle');

enableProdMode();

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser'), {
  maxAge: '1y'
}));

// All regular routes use Angular SSR
app.get('*', (req, res) => {
  const renderOptions = {
    document: template,
    url: req.url,
    extraProviders: [provideModuleMap(LAZY_MODULE_MAP)]
  };

  const renderPromise = AppServerModuleNgFactory
    ? /* prod mode */ renderModuleFactory(AppServerModuleNgFactory, renderOptions)
    : /* dev mode */ renderModule(AppServerModule, renderOptions);

  renderPromise
    .then(html => res.send(html), err => res.send(err))
    .then(() => res.end());
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
