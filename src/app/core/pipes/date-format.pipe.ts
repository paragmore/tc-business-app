import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

@Pipe({
  name: 'dateFormat',
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  transform(dateString: string | undefined): string {
    if (dateString === undefined) return '-';
    return format(new Date(dateString), 'dd MMM yyyy');
  }
}
