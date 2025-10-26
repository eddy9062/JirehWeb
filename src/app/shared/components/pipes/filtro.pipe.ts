import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro',
  standalone: true, // si estás usando Angular standalone
  pure: false // opcional si quieres que actualice en tiempo real
})

export class FiltroPipe implements PipeTransform {
  transform(arreglo: any[], texto: string = '', columnas: string[] = ['name']): any[] {
    if (!arreglo) return [];
    if (!texto.trim()) return arreglo;

    texto = texto.toLowerCase();
    return arreglo.filter(item =>
      columnas.some(col =>
        item[col]?.toLowerCase().includes(texto)
      )
    );
  }





}
