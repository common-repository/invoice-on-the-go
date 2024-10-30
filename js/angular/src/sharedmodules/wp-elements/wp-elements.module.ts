import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WpAjaxPost} from "./Services/WpAjaxPost";
import {ToastService} from "./Services/ToastService";
import {WpTab} from "./Controls/WpTabs/WpTab";
import {WpTabGroup} from "./Controls/WpTabs/WpTabGroup";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {WpTabBody} from "./Controls/WpTabs/WpTabBody";
import {WpImageHolder} from "./Controls/WpTabs/WpImageHolder";
import {WpTinyMCE} from "./Controls/WpTinyMCE/WpTinyMCE";
import {WpTinyItem} from "./Controls/WpTinyMCE/WpTinyItem";
import {HttpClientModule} from "@angular/common/http";
import {WpJsonApi} from "./Services/WpJsonApi";
import {WpTable} from "./Controls/WpTable/WpTable";
import {WpTableColumn} from "./Controls/WpTable/WpTableColumn";
import {WpTableColumnAction} from "./Controls/WpTable/WpTableColumnAction";
import {WpTableColumnTemplate} from "./Controls/WpTable/WpTableColumnTemplate";
import {WpPaginator} from "./Controls/WpTable/WpPaginator";
import {WpPanel} from "./Controls/WpPanel/WpPanel";


@NgModule({
  imports: [
    CommonModule,BrowserAnimationsModule,HttpClientModule
  ],
  declarations: [WpTab,WpTabGroup,WpTabBody,WpImageHolder,WpTinyMCE,WpTinyItem,WpTable,WpTableColumn,WpTableColumnAction,WpTableColumnTemplate,WpPaginator,WpPanel],
  exports: [WpTab,WpTabGroup,WpImageHolder,WpTinyMCE,WpTinyItem,WpTable,WpTableColumn,WpTableColumnAction,WpTableColumnTemplate,WpPaginator,WpPanel],
  providers:[WpAjaxPost,ToastService,WpJsonApi]
})
export class WpElementsModule { }
