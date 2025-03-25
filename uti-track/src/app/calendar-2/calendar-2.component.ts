import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-calendar-2',
  templateUrl: './calendar-2.component.html',
  styleUrl: './calendar-2.component.scss'
})
export class Calendar2Component {
    month: any = [
      { day: 1, date: new Date() },
      { day: 2, date: new Date() },
      { day: 3, date: new Date() },
      { day: 4, date: new Date() },
      { day: 5, date: new Date() },
      { day: 6, date: new Date() },
      { day: 7, date: new Date() },
      { day: 8, date: new Date() },
      { day: 9, date: new Date() },
      { day: 10, date: new Date() },
      { day: 11, date: new Date() },
      { day: 12, date: new Date() },
      { day: 13, date: new Date() },
      { day: 14, date: new Date() },
      { day: 15, date: new Date() },
      { day: 16, date: new Date() },
      { day: 17, date: new Date() },
      { day: 18, date: new Date() },
      { day: 19, date: new Date() },
      { day: 20, date: new Date() },
      { day: 21, date: new Date() },
      { day: 22, date: new Date() },
      { day: 23, date: new Date() },
      { day: 24, date: new Date() },
      { day: 25, date: new Date() },
      { day: 26, date: new Date() },
      { day: 27, date: new Date() },
      { day: 28, date: new Date() },
      { day: 29, date: new Date() },
      { day: 30, date: new Date() },
      { day: 31, date: new Date() },
      { day: 32, date: new Date() },
      { day: 33, date: new Date() },
      { day: 34, date: new Date() },
      { day: 35, date: new Date() },
    ]
  @ViewChild('monthSelector', { static: false }) monthSelector!: ElementRef;

  months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  scrollLeft() {
    this.monthSelector.nativeElement.scrollLeft -= 150; // Adjust scroll distance
  }

  scrollRight() {
    this.monthSelector.nativeElement.scrollLeft += 150;
  }
}
