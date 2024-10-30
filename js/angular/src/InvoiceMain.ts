import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import {InvoiceModule} from "./invoice_list/InvoiceModule";



if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(InvoiceModule)
  .catch(err => console.log(err));


