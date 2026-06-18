import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTime',
  standalone: true,
})
export class DateTimePipe implements PipeTransform {
  transform(value: Date | string | number | null): string {
    if (!value) {
      return ''; // или можно вернуть какое-то сообщение, например "Загрузка..."
    }
    const date = new Date(value);
    const time = date.toLocaleTimeString('ru-RU', { hour12: false });
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;
    return `${time}\n${formattedDate}`;
  }
}