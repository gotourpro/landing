import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ImageService {

    private readonly defaultSizes = [400, 800, 1200, 1600, 1920];

    public getImage(
        path: string,
        size = 800,
    ): string {

        const normalizedPath = path
            .replace(/\.(jpg|jpeg|png|webp)$/i, '');

        const index = normalizedPath.lastIndexOf('/');

        // Если путь без директорий (например "photo")
        if (index === -1) {
            return `assets/images/${size}/${normalizedPath}.webp`;
        }

        const directory = normalizedPath.substring(0, index);
        const filename = normalizedPath.substring(index + 1);

        return `assets/images/${directory}/${size}/${filename}.webp`;
    }

    public getSrcSet(
        path: string,
        sizes: readonly number[] = this.defaultSizes,
    ): string {

        return sizes
            .map(size => `${this.getImage(path, size)} ${size}w`)
            .join(', ');
    }

}