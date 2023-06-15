import {
  Directive,
  ElementRef,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[clickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter();

  private componentVisible = false;

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: any): void {
    if (this.componentVisible) {
      const clickedInside =
        this.elementRef.nativeElement.contains(targetElement);

      if (!clickedInside) {
        this.clickOutside.emit();
      }
    } else {
      this.componentVisible = true;
    }
  }
}
