import {Component, OnInit} from '@angular/core';
import {CalendarService} from "../calendar.service";
import {AuthService} from "../../auth/auth.service";
import {RealtimeResponseEvent} from "appwrite";

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
  week: CalendarDay[] = [];
  currentWeekRange: string = '';

  constructor(private calendarService: CalendarService,
              private authService: AuthService) {

  }

  ngOnInit(): void {
    this.getCalendarRecords();
    this.realtimeConnect();
  }

  realtimeConnect() {
    this.authService.client.subscribe(`databases.67935fe8002425d5d665.collections.67965aa7000d0bef581d.documents`, (response: RealtimeResponseEvent<any>) => {
      const updatedId = response.payload.$id;
      this.week = this.week.map(item =>
        item.$id === updatedId ? {...item, ...response.payload} : item
      );
    });

    this.authService.client.subscribe(`databases.67935fe8002425d5d665.collections.67965b8d0013eea83d4c.documents`, (response: RealtimeResponseEvent<any>) => {
      const requestToRemove = response.payload
      this.week.forEach(day => {
        if (day.$id === requestToRemove.calendar_id) {
          day.requests = day.requests.filter((request: any) => request.$id !== requestToRemove.$id);
        }
      })
    });
  }

  getDateRanges(currentDate: Date): { thisWeekMonday: Date; nextNextWeekSunday: Date } {
    const currentDay = currentDate.getDay(); // Get current day of the week (0: Sunday, 6: Saturday)
    const diffToMonday = currentDay === 0 ? 6 : currentDay - 1; // Calculate days since Monday (Monday = 0)

    // Calculate the first day of this week (Monday)
    const thisWeekMonday = new Date(currentDate);
    thisWeekMonday.setDate(currentDate.getDate() - diffToMonday); // Go back to this week's Monday
    thisWeekMonday.setHours(0, 0, 0, 0); // Reset time to the start of the day

    // Calculate the last day of the week after the following week (Sunday)
    const nextNextWeekSunday = new Date(currentDate);
    nextNextWeekSunday.setDate(currentDate.getDate() + (7 - diffToMonday) + 13); // Move forward to the Sunday after the next week
    nextNextWeekSunday.setHours(23, 59, 59, 999); // Set time to the end of the day

    // Return both dates
    return { thisWeekMonday, nextNextWeekSunday };
  }

  goToPreviousWeek(): void {
    const previousWeek = new Date(this.currentDate);
    previousWeek.setDate(this.currentDate.getDate() - 7);
    this.currentDate = previousWeek;
  }

  goToNextWeek(): void {
    const nextWeek = new Date(this.currentDate);
    nextWeek.setDate(this.currentDate.getDate() + 7);
    this.currentDate = nextWeek;
  }

  sendRequest(id: any): void {
    void this.calendarService.requestFreeDay(id)
  }

  revokeFreeDay(day: any) {
    const usersRequest = day.requests.find((req: any) => req.user_id === this.authService.userInfo.$id)
    void this.calendarService.revokeFreeDay(usersRequest.$id)
  }

  getCalendarRecords(): void {
    this.calendarService.getCalendarEvents(
      this.getDateRanges(new Date()).thisWeekMonday,
      this.getDateRanges(new Date()).nextNextWeekSunday)
      .then((response) => {
        this.week = response
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
}
