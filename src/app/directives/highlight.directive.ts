import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[highlight]'
})
export class HighlightDirective implements OnChanges {
  @Input('highlight') bgColor = '';
  defaultColor = 'pink';

  constructor(private readonly element: ElementRef) {
    this.element.nativeElement.style.backgroundColor = this.defaultColor;
  }

  ngOnChanges() {
    this.element.nativeElement.style.backgroundColor = this.bgColor || this.defaultColor;
  }
}
