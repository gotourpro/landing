import { BlogBlockType } from "../types/block.type";

export interface IBlogBlock {
    id?: string;
    type: BlogBlockType;
    background?: 'default' | 'surface' | 'primary';
    size?: 'normal' | 'wide';
}