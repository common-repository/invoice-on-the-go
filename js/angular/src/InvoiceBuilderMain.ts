import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import {InvoiceBuilderModule} from "./invoice_builder/InvoiceBuilderModule";




if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(InvoiceBuilderModule)
  .catch(err => console.log(err));


