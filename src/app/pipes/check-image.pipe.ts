import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';

@Pipe({
    name: 'checkImage',
    pure: true, 
    standalone: true,
})
export class CheckImagePipe implements PipeTransform {
    public transform(url: string): Observable<boolean> {
        return new Observable<boolean>((observer) => {
            const image = new Image();
            image.onload = () => {
                observer.next(true);
                observer.complete();
            };
            image.onerror = () => {
                observer.next(false);
                observer.complete();
            };

            image.src = url;
        });
    }
}