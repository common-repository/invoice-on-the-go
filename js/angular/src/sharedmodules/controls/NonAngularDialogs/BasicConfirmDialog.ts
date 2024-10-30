
declare let JQuery:any;
declare let jQuery:any;
export class BasicConfirmDialog{

    private static _confirmDialog:BasicConfirmDialog=null;
    private static $dialog:any;
    private currentResolve:(boolean)=>void=null;
    constructor(){
        BasicConfirmDialog.$dialog=jQuery(`
        <div class="rnbt4">
            <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">
                        <div class="icon" style="display: inline-block;margin-right: 5px;">
                        
                        </div>
                        <span class="title"></span>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal"><span class="cancelText">Save changes</span></button>
                    <button type="button" class="btn acceptButton" ><div style="display: inline-block;margin-right: 5px;" class="acceptIcon"></div><span class="acceptText">Save changes</span></button>
                  </div>
                </div>
              </div>
            </div>
        </div>
        `);

        jQuery('body').append(BasicConfirmDialog.$dialog);
        BasicConfirmDialog.$dialog.on('hidden.bs.modal',()=>{
            if(this._onCancel!=null)
                this._onCancel(this);
        });
        BasicConfirmDialog.$dialog.find('.acceptButton').click(()=>{
           if(this._onAccept!=null)
               this._onAccept(this);
        });
        BasicConfirmDialog.$dialog=BasicConfirmDialog.$dialog.find('.modal');
        (BasicConfirmDialog.$dialog as any).modal('hide');
    }

    private ShowInternal(){

    }

    public ExecuteResolver(value){
        if(this.currentResolve!=null)
            this.currentResolve(value);
        this.currentResolve=null;
    }

    private _onAccept:(dialog:BasicConfirmDialog)=>void;
    public SetOnAccept(callback:(dialog:BasicConfirmDialog)=>void)
    {
        this._onAccept=callback;
        return this;
    }

    private _onCancel:(dialog:BasicConfirmDialog)=>void;
    public SetOnCancel(callback:(dialog:BasicConfirmDialog)=>void)
    {
        this._onCancel=callback;
        return this;
    }


    private _title:string;
    public SetTitle(title:string)
    {
        this._title=title;
        return this;
    }

    private _content:string;
    public SetContent(content:string)
    {
       this._content=content;
       return this;
    }

    private _icon:string;
    public SetIcon(icon:string)
    {
        this._icon=icon;
        return this;
    }

    private _acceptClass='btn-primary';
    public SetAcceptClass(sClass:string)
    {
        this._acceptClass=sClass;
        return this;
    }

    private _acceptText='Save Changes';
    public SetAcceptText(text:string)
    {
        this._acceptText=text;
        return this;
    }

    private _acceptIcon;
    public SetAcceptIcon(icon:string)
    {
        this._acceptIcon=icon;
        return this;
    }

    private _cancelText='Cancel';
    public SetCancelText(text:string)
    {
        this._cancelText=text;
        return this;
    }
    public static async Show(title:string,content:string,icon=''){
        return BasicConfirmDialog.ShowWithOptions(title,content,icon).ExecuteAsync();

    }

    public static ShowWithOptions(title:string,content:string,icon=''){
        if(BasicConfirmDialog._confirmDialog==null)
            BasicConfirmDialog._confirmDialog=new BasicConfirmDialog();
        let dialog=BasicConfirmDialog._confirmDialog;

        return dialog.SetTitle(title)
            .SetContent(content)
            .SetIcon(icon);


    }

    public Close(){
        (BasicConfirmDialog.$dialog as any).modal('hide');
    }

    public async ExecuteAsync(){
        return new Promise((resolve)=>{
            this.currentResolve=resolve;
            BasicConfirmDialog.$dialog.find('.icon').empty().append(this._icon);
            BasicConfirmDialog.$dialog.find('.title').text(this._title);
            BasicConfirmDialog.$dialog.find('.modal-body').empty().append(this._content);

            BasicConfirmDialog.$dialog.find('.acceptIcon').empty().append(this._acceptIcon);
            BasicConfirmDialog.$dialog.find('.acceptText').text(this._acceptText);
            BasicConfirmDialog.$dialog.find('.acceptButton').attr('class','btn '+this._acceptClass);
            BasicConfirmDialog.$dialog.find('.cancelText').text(this._cancelText);
            (BasicConfirmDialog.$dialog as any).modal('show');
        });

    }
}
