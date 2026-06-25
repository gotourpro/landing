import { ILocalizedText } from "../../../interfaces/localized-text.interface";
import { IBlogBlock } from "./blog-block.interface";

export interface IBlogFaqBlock extends IBlogBlock {
    type: 'faq';
    title?: ILocalizedText;
    items: IBlogFaqItem[];

}

export interface IBlogFaqItem {
    id?: string;
    title: ILocalizedText;
    description: ILocalizedText;
}