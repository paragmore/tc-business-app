import { Directive, Output, EventEmitter, ElementRef, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone:true,
})
export class InfiniteScrollDirective implements OnDestroy {
  @Output() appInfiniteScroll: EventEmitter<any> = new EventEmitter();

  private scrollCallback: any;

  constructor(private elementRef: ElementRef) {
    this.scrollCallback = this.scroll.bind(this);
    this.elementRef.nativeElement.addEventListener('scroll', this.scrollCallback);
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.removeEventListener('scroll', this.scrollCallback);
  }

  scroll() {
    console.log('scroll')
    if (this.isScrollAtBottom()) {
      this.appInfiniteScroll.emit();
    }
  }

  private isScrollAtBottom(): boolean {
    const element = this.elementRef.nativeElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    return scrollTop + clientHeight >= scrollHeight;
  }
}
