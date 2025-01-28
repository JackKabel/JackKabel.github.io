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
  private calendarCollectionId = '67965aa7000d0bef581d';

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
    return {previousWeekStart, nextWeekEnd};
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
      this.getPreviousAndNextWeekRange(new Date()).previousWeekStart,
      this.getPreviousAndNextWeekRange(new Date()).nextWeekEnd)
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
