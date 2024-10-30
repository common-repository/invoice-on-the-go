import {Pipe, PipeTransform} from "@angular/core";
import * as moment from 'moment';

@Pipe({
    name:'formatDate'
})
export  class FormatDatePipe implements PipeTransform{
    transform(value: any, ...args: any[]): any {
        if(value==null||value==0)
            return '';
        return moment(new Date(parseInt(value))).format('MMM/DD/YYYY');
    }

}