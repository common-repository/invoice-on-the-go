import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import {ServicesModule} from "./services/ServicesModule";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(ServicesModule)
  .catch(err => console.log(err));
