import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import {LocalSharedModule} from "./localShared/LocalSharedModule";


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(LocalSharedModule)
  .catch(err => console.log(err));
