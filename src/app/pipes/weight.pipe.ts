import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weight',
  standalone: true
})
export class WeightPipe implements PipeTransform {

  transform(value: number): string {
    if (!value && value !== 0) {
      return '';
    }
    const formattedValue = (value / 10).toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    return `${formattedValue} kg`;
  }

}
