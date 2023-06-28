import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hyphen',
  standalone: true,
})
export class HyphenPipe implements PipeTransform {
  transform(value: any): any {
    return value !== null && value !== undefined && value !== '' ? value : '-';
  }
}
