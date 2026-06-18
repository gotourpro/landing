import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name: 'colorToRgba',
  standalone: true,
})
@Injectable({ providedIn: 'root' }) // ✅ обязательно!
export class ColorToRgbaPipe implements PipeTransform {
    transform(hex: string, alpha: number = 1): number[] {
        if (!hex || typeof hex !== 'string') return [0, 0, 0, 255];
      
        let clean = hex.trim().replace(/^#/, '');
      
        if (clean.length === 3) {
          clean = clean.split('').map(ch => ch + ch).join('');
        }
      
        if (clean.length === 6) {
          clean += 'ff';
        }
      
        if (clean.length !== 8) return [0, 0, 0, 255];
      
        try {
          const rgba = [
            parseInt(clean.slice(0, 2), 16),
            parseInt(clean.slice(2, 4), 16),
            parseInt(clean.slice(4, 6), 16),
            Math.round(alpha * 255) // 🔹 игнорируем alpha из HEX, используем аргумент
          ];
          return rgba;
        } catch {
          return [0, 0, 0, 255];
        }
      }
      
}