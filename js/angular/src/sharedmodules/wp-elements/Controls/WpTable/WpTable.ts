import {Component, ContentChildren, Input, QueryList} from "@angular/core";
import {WpTableColumn} from "./WpTableColumn";

@Component({
    selector:'wp-table',
    template:`
        <table class="wp-list-table widefat fixed striped" style="{padding:10px;}">
            <thead>
                <tr>
                    <th class="manage-column" *ngFor="let column of this.columns">{{column.Header}}</th>
                </tr>
            </thead>
            <tbody class="the-list">
                <tr *ngFor="let row of Data">
                    <td *ngFor="let column of columns">
                        <ng-container *ngIf="column.ColumnTemplate==null; else ColumnWithTemplate">
                            {{GenerateColumn(row,column)}}
                        </ng-container>
                        <ng-container  #ColumnWithTemplate *ngIf="column.ColumnTemplate!=null">
                            <ng-container *ngTemplateOutlet="column.ColumnTemplate.Template;context:{$implicit:row}" ></ng-container>
                        </ng-container>
                        
                        <ng-container *ngIf="column.Actions.length;">
                            <div class="row-actions">
                                <span class="edit" *ngFor="let action of column.Actions;let i=index">
                                    <a (click)="action.Click.emit(row)" href="#">{{action.Label}}</a> <span *ngIf="i<column.Actions.length-1"> |</span></span>
                            </div>
                        </ng-container>
                    </td>
                </tr>
            </tbody>
        </table>
    `
})
export class WpTable{
    @ContentChildren(WpTableColumn) columns: QueryList<WpTableColumn>;
    @Input() Data:any[];


    public GenerateColumn(row,column:WpTableColumn){
        if(column.ColumnTemplate!=null)
            return column.ColumnTemplate;
        if(row[column.DataField]==null)
            return '';
        return row[column.DataField];
    }

}
