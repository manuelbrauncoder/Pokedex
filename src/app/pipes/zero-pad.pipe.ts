import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zeroPad',
  standalone: true
})
export class ZeroPadPipe implements PipeTransform {

  transform(value: number, length: number = 4): string {
    let strValue = value.toString();
    while (strValue.length < length) {
      strValue = '0' + strValue;
    }
    return strValue;
  }

}
