import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'seperate',
  standalone: true,
})
export class VariantSeperatorPipe implements PipeTransform {
  transform(value: any): string {
    if (typeof value !== 'object') {
      return value;
    }
    return Object.values(value).join(' | ');
  }
}
