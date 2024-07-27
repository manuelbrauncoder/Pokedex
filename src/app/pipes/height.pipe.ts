import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'height',
  standalone: true
})
export class HeightPipe implements PipeTransform {

  transform(value: number): string {
    if (!value && value !== 0) {
      return '';
    }
    const formattedValue = (value * 10).toLocaleString('de-DE');
    return `${formattedValue} cm`;
  }

}
