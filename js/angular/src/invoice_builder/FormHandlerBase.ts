import {Component, ViewChild} from "@angular/core";
import {NgForm} from "@angular/forms";


export class FormHandlerBase {
    @ViewChild('form') form:NgForm;

    public get IsValid(){
        return this.form.valid;
    }

    public MarkAllFieldsAsPristine(){
        for(let property in this.form.controls)
        {
            this.form.controls[property].markAsPristine();
        }
    }

    public MarkAllFieldsAsDirty() {
        for(let property in this.form.controls)
        {
            this.form.controls[property].markAsDirty();
        }
    }


}