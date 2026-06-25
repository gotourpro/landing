import { ILocalizedText } from "../../../interfaces/localized-text.interface";
import { IBlogImage } from "./block-image.interface";
import { IBlogBlock } from "./blog-block.interface";

export interface IBlogHeroBlock extends IBlogBlock {
    type: 'hero';

    image: string;
    imageAlt?: ILocalizedText;
}

export interface IBlogSectionBlock extends IBlogBlock {
    type: 'section';

    title?: ILocalizedText;
    paragraphs: ILocalizedText[];

    images?: IBlogImage[];
    imagePosition?: 'left' | 'right';
    imageCaption?: ILocalizedText;
}

export interface IBlogQuoteBlock extends IBlogBlock {
    type: 'quote';

    text: ILocalizedText;
    author: ILocalizedText;
}

export interface IBlogGalleryBlock extends IBlogBlock {
    type: 'gallery';

    images: string[];
}