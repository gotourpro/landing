import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'keys', standalone: true, })
export class KeysPipe implements PipeTransform {
    public transform(value): any {
        if (!value) return;
        const key = Object?.keys(value);
        return key;
    }
}