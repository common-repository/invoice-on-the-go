import {BasicConfirmDialog} from "./BasicConfirmDialog";

export class DeleteDialog {
    public static async  Show(itemText='',title:string='Are you sure?',content:string='The item <strong>{text}</strong> will be deleted, do you want to continue?',icon='<i class="fas fa-trash"></i>'){
        itemText=itemText.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
        content=content.replace('{text}',itemText);

        return BasicConfirmDialog.ShowWithOptions(title,content,icon)
            .SetAcceptClass('btn-danger')
            .SetTitle(title)
            .SetContent(content)
            .SetAcceptText('Yes, Delete it')
            .SetAcceptIcon('<i class="fas fa-trash"></i>')
            .SetCancelText('Cancel')
            .SetOnCancel((confirmDialog:BasicConfirmDialog)=>{
                confirmDialog.ExecuteResolver(false);
            })
            .SetOnAccept((confirmDialog:BasicConfirmDialog)=>{
                confirmDialog.Close();
                confirmDialog.ExecuteResolver(true);
            })
            .ExecuteAsync();
    }
}

