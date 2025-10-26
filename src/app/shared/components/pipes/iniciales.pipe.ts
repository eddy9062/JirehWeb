// src/app/shared/pipes/iniciales.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iniciales',
  standalone: true
})
export class InicialesPipe implements PipeTransform {
  transform(nombre?: string | null): string {
    if (!nombre) return '';
    const partes = nombre.trim().split(/\s+/);
    return partes.slice(0, 2).map(p => p[0].toUpperCase()).join('');
  }
}
