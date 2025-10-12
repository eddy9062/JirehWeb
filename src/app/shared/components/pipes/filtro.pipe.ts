import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(arreglo: any[], texto: string = '', column: string = 'name'): any[] {

    if (texto === '') {
      return arreglo
    }

    if (!arreglo) {
      return arreglo
    }

    return arreglo.filter(item => {
      return item[column].toLowerCase().includes(texto.toLocaleLowerCase())
    }
    )
  }






}
