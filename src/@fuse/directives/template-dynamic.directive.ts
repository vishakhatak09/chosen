import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[template-dynamic]',
})
export class TemplateDynamicDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
