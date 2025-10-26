import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
})
export class AutoFocusDirective implements AfterViewInit {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  ngAfterViewInit() {
    // Esperamos un pequeño delay para asegurar que el input está renderizado
    setTimeout(() => {
      this.el.nativeElement.focus();
    }, 10);
  }
}
