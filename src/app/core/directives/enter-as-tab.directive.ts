import { Directive, HostListener, Renderer2, ElementRef } from '@angular/core';

@Directive({
  selector: '[enterAsTab]',
  standalone: true,
})
export class EnterAsTabDirective {
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  @HostListener('keydown.enter', ['$event'])
  onEnterKeyDown(event: KeyboardEvent): void {
    event.preventDefault();
    const focusableElements = this.getFocusableElements();
    const currentIndex = focusableElements.indexOf(this.el.nativeElement);
    const nextIndex = (currentIndex + 1) % focusableElements.length;
    const nextElement = focusableElements[nextIndex];

    if (nextElement) {
      this.renderer.selectRootElement(nextElement).focus();
    }
  }

  private getFocusableElements(): HTMLElement[] {
    const focusableSelectors =
      'input, select, textarea, button, [tabindex]:not([tabindex="-1"])';
    return Array.from(
      document.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];
  }
}
