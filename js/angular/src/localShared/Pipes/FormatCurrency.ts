import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name:'formatCurrency'
})
export class FormatCurrency implements PipeTransform{
    transform(value: any, ...args: any[]): any {
        let symbol=rnparams.settings.GeneralOptions.Currency;
        let currencyPosition=rnparams.settings.GeneralOptions.CurrencyPosition;
        let decimalSeparator=rnparams.settings.GeneralOptions.DecimalSeparator;
        let thousandSeparator=rnparams.settings.GeneralOptions.ThousandSeparator;
        let numberOfDecimals= rnparams.settings.GeneralOptions.NumberOfDecimals;

        let amount=parseFloat(value);
        if(isNaN(amount))
            amount=0;

        let text=amount.toFixed(numberOfDecimals);

        let x = text.split('.');
        let x1 = x[0];
        let x2 = x.length > 1 ? '.' + x[1] : '';
        let rgx = /(\d+)(\d{3})/;
        if(thousandSeparator!='') {
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + thousandSeparator + '$2');
            }
        }

        if(x2.length>0)
        {
            x2=x2.slice(1);
            x2=decimalSeparator+x2;
        }
        text= x1 + x2;
        if(currencyPosition=='left')
            return symbol+text;
        if(currencyPosition=='left_space')
            return symbol+' '+text;
        if(currencyPosition=='right')
            return text+symbol;
        if(currencyPosition=='right_space')
            return text+' '+symbol;



    }

}