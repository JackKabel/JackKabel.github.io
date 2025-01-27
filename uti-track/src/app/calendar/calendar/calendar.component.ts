import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CalendarService} from "../calendar.service";
import {AuthService} from "../../auth/auth.service";
import {RealtimeResponseEvent} from "appwrite";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  private calendarCollectionId = '67965aa7000d0bef581d';
  currentDate: Date = new Date();
  week: { $id: string; date: Date; dayOfWeek: string; isHoliday: boolean; requests: any[];}[] = [];
  currentWeekRange: string = '';

  constructor(private calendarService: CalendarService,
              private authService: AuthService,
              private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.getCalendarRecords();
    this.realtimeConnect();
  }

  realtimeConnect() {
    this.authService.client.subscribe(`databases.67935fe8002425d5d665.collections.67965aa7000d0bef581d.documents`, (response: RealtimeResponseEvent<any>) => {
      const updatedId = response.payload.$id;
      console.log(response)
      this.week = this.week.map(item =>
        item.$id === updatedId ? { ...item, ...response.payload } : item
      );
    });

    this.authService.client.subscribe(`databases.67935fe8002425d5d665.collections.67965b8d0013eea83d4c.documents`, (response: RealtimeResponseEvent<any>) => {
      const updatedId = response.payload.calendar_id;
      this.week = this.week.map(item =>
        item.$id === updatedId ? { ...item, ...response.payload } : item
      );
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

  revokeFreeDay(id: string) {
    void this.calendarService.revokeFreeDay(id)
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

  checkRequests(dayToCheck: any) {
    return dayToCheck.requests.length > 0
  }
}
