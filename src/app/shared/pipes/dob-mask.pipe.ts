import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dob'
})
export class DobPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    else return `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
  }
}