import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'document'
})
export class DocumentPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    else return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9, 11)}`;
  }
}