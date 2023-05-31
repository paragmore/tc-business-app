import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-pagination-component',
  templateUrl: './pagination-component.component.html',
  styleUrls: ['./pagination-component.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class PaginationComponentComponent implements OnInit {
  @Input() currentPage!: number;
  @Input() totalPages!: number;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();
  constructor() {}

  ngOnInit() {}
  pageSize = 10;

  get previousPages(): number[] {
    const pages = [];
    for (let i = Math.max(1, this.currentPage - 2); i < this.currentPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  get nextPages(): number[] {
    const pages = [];
    for (
      let i = this.currentPage + 1;
      i <= Math.min(this.currentPage + 2, this.totalPages);
      i++
    ) {
      pages.push(i);
    }
    return pages;
  }

  previousPage() {
    this.pageChange.emit(this.currentPage - 1);
  }

  nextPage() {
    console.log('herrr');
    this.pageChange.emit(this.currentPage + 1);
  }

  goToPage(page: number) {
    this.pageChange.emit(page);
  }

  changePageSize(event: any) {
    console.log(event);
    this.pageSize = event.detail.value;
    this.pageSizeChange.emit(this.pageSize);
  }
}
