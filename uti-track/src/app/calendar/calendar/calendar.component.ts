import {Component, OnInit} from '@angular/core';
import {CalendarService} from "../calendar.service";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  currentDate: Date = new Date();
  week: { date: Date; isHoliday: boolean; requested: boolean }[] = [];
  requests: any[] = [];
  currentWeekRange: string = '';

  constructor(private calendarService: CalendarService) {}

  ngOnInit(): void {
    this.getCalendarRecords();
    this.getRequests();
  }

  getPreviousAndNextWeekRange(currentDate: Date): { previousWeekStart: Date; nextWeekEnd: Date } {
    const currentDay = currentDate.getDay(); // Get current day of the week (0: Sunday, 6: Saturday)
    const diffToMonday = currentDay === 0 ? 6 : currentDay - 1; // Calculate days since Monday (Monday = 0)

    // Calculate the first day of the previous week (Monday)
    const previousWeekStart = new Date(currentDate);
    previousWeekStart.setDate(currentDate.getDate() - diffToMonday - 7); // Go back to the previous week's Monday
    previousWeekStart.setHours(0, 0, 0, 0); // Go back to the previous week's Monday

    // Calculate the last day of the next week (Sunday)
    const nextWeekEnd = new Date(currentDate);
    nextWeekEnd.setDate(currentDate.getDate() + (7 - diffToMonday) + 6); // Go forward to next week's Sunday
    nextWeekEnd.setHours(23, 59, 59, 999); // Go forward to next week's Sunday

    // Return both dates
    return { previousWeekStart, nextWeekEnd };
  }

  /**
   * Navigate to the previous week.
   */
  goToPreviousWeek(): void {
    const previousWeek = new Date(this.currentDate);
    previousWeek.setDate(this.currentDate.getDate() - 7);
    this.currentDate = previousWeek;
  }

  /**
   * Navigate to the next week.
   */
  goToNextWeek(): void {
    const nextWeek = new Date(this.currentDate);
    nextWeek.setDate(this.currentDate.getDate() + 7);
    this.currentDate = nextWeek;
  }

  /**
   * Request a free day by sending it to the CalendarService.
   */
  requestFreeDay(date: Date): void {
    this.calendarService.requestFreeDay(date).then(() => {
      console.log('Free day requested for', date);
      const day = this.week.find((d) => d.date.toDateString() === date.toDateString());
      if (day) {
        day.requested = true;
      }
    });
  }

  revokeFreeDay(date: Date) {
    // this.calendarService.revokeFreeDay().then(() => {
    //   console.log('Free day revoked');
    // });
  }

  /**
   * Get the start of the week for the given date.
   */
  private getStartOfWeek(date: Date): Date {
    const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(date.setDate(diff));
  }

  getCalendarRecords(): void {
    this.calendarService.getCalendarEvents(
      this.getPreviousAndNextWeekRange(new Date()).previousWeekStart,
      this.getPreviousAndNextWeekRange(new Date()).nextWeekEnd)
      .then((response) => {
      this.week = response
    })
  }

  getRequests(): void {
    this.calendarService.getFreeDayRequests()
      .then((response) => {
        this.requests = response;
      })
  }
}
