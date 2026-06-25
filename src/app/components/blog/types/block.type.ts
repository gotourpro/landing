import { IBlogGalleryBlock, IBlogQuoteBlock, IBlogSectionBlock } from "../interfaces/blog-section-block.interface";
import { IBlogFaqBlock } from "../interfaces/blog-faq.interface"

export type BlogBlockType =
    | 'hero'
    | 'section'
    | 'quote'
    | 'gallery'
    | 'tips'
    | 'faq'
    | 'cta'
    | 'map';


export type IBlogContentBlock =
    | IBlogSectionBlock
    | IBlogQuoteBlock
    | IBlogGalleryBlock
    | IBlogFaqBlock;