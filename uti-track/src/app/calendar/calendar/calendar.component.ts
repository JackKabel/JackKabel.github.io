import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CalendarService} from "../calendar.service";
import {AuthService} from "../../auth/auth.service";
import {RealtimeResponseEvent} from "appwrite";
import {isHandset} from "../../app.signals";

export interface CalendarDay {
  $id: string;
  date: Date;
  dayOfWeek: string;
  isHoliday: boolean;
  requests: any[];
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  currentDate: Date = new Date();
  firstDayOfMonth: number = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getDay();
  week: CalendarDay[] = [];
  totalDays?: number;
  usedDays?: number;
  availableDays?: number;
  singleSelectGroupValue = [];


  constructor(private calendarService: CalendarService,
              private authService: AuthService,
              private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.getCalendarRecords(this.getMonthRange);
    this.realtimeConnect();
    this.getUserSummary();
  }

  realtimeConnect() {
    this.requestRT();
    this.revokeRT()
  }

  requestRT() {
    this.authService.client.subscribe(`databases.67935fe8002425d5d665.collections.67965aa7000d0bef581d.documents`, (response: RealtimeResponseEvent<any>) => {
      const updatedId = response.payload.$id;
      this.week = this.week.map(item =>
        item.$id === updatedId ? {...item, ...response.payload} : item
      );
      --this.availableDays!;
      ++this.usedDays!;
    });
  }

  revokeRT() {
    this.authService.client.subscribe(`databases.67935fe8002425d5d665.collections.67965b8d0013eea83d4c.documents`, (response: RealtimeResponseEvent<any>) => {
      const requestToRemove = response.payload
      this.week.forEach(day => {
        if (day.$id === requestToRemove.calendar_id) {
          day.requests = day.requests.filter((request: any) => request.$id !== requestToRemove.$id);
        }
      })
      ++this.availableDays!;
      --this.usedDays!;
    });
  }

  getWeekRanges(): { start: Date; end: Date } {
    const currentDay = new Date().getDay(); // Get current day of the week (0: Sunday, 6: Saturday)
    const diffToMonday = currentDay === 0 ? 6 : currentDay - 1; // Calculate days since Monday (Monday = 0)
    const thisWeekStart = new Date();
    thisWeekStart.setDate(new Date().getDate() - diffToMonday); // Go back to this week's Monday
    thisWeekStart.setHours(0, 0, 0, 0); // Reset time to the start of the day

    const thisWeekEnd = new Date();
    thisWeekEnd.setDate(thisWeekStart.getDate() + 6); // Move forward to the Sunday after the next week
    thisWeekEnd.setHours(23, 59, 59, 999); // Set time to the end of the day

    // Return both dates
    return {start: thisWeekStart, end: thisWeekEnd};
  }

  getMonthRange(): { start: Date; end: Date } {
    // Get the first day of the current month
    const monthStart = new Date(); // First day of the month
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0); // Set time to the start of the day

    // Get the last day of the current month
    const monthEnd = new Date(); // Last day of the month
    monthEnd.setMonth(monthEnd.getMonth() + 1);
    monthEnd.setDate(0);
    monthEnd.setHours(23, 59, 59, 999); // Set time to the end of the day

    // Return both dates
    return {start: monthStart, end: monthEnd};
  }

  sendRequest(id: any): void {
    void this.calendarService.requestFreeDay(id)
  }

  revokeFreeDay(day: any) {
    const usersRequest = day.requests.find((req: any) => req.user_id === this.authService.userInfo.$id)
    void this.calendarService.revokeFreeDay(usersRequest.$id)
  }

  getCalendarRecords(func: Function): void {
    this.calendarService.getCalendarEvents(
      func().start,
      func().end)
      .then((response) => {
        this.week = response
      })
  }

  getUserSummary() {
    this.calendarService.getUserSummary().then((response) => {
      if (response == null) {
        return;
      }

      this.totalDays = 21;
      this.usedDays = response.total;
      this.availableDays = this.totalDays! - this.usedDays!;
    })
  }

  checkDay(requests: any[]) {
    const requestForThisDay = requests.find((req) => {
      return req.user_id === this.authService.userInfo.$id;
    });
    return !!requestForThisDay;
  }

  isToday(day: CalendarDay): boolean {
    const givenDate = new Date(day.date); // Convert to a Date object (if it's not already)
    const today = new Date(); // Current date

    // Strip the time portion from both dates
    givenDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Compare the stripped dates
    return givenDate.getTime() === today.getTime();
  }

  isWeekend(day: CalendarDay): boolean {
    const givenDate = new Date(day.date);
    return givenDate.getDay() === 0 || givenDate.getDay() === 6;
  }

  updateSingleSelectGroupValue(value: any): void {
    this.singleSelectGroupValue = value;
    this.cdr.markForCheck();
  }

  protected readonly isHandset = isHandset;
}
