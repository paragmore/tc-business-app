import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'absValue',
  standalone: true,
})
export class AbsValuePipe implements PipeTransform {
  transform(value: number): number {
    return Math.abs(value);
  }
}
