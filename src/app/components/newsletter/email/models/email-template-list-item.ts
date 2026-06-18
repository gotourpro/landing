export class EmailTemplateListItem {
    public id: number;
    public name?: string;
    constructor(obj?: Partial<EmailTemplateListItem>) {
        Object.assign(this, obj);
    }

}