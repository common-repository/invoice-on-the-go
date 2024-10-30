import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import {SettingsModule} from "./settings/SettingsModule";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(SettingsModule)
  .catch(err => console.log(err));
