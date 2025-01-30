import {Injectable} from '@angular/core';
import {Client, Databases, ID, Query} from 'appwrite';
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private client: Client;
  private databases: Databases;

  private databaseId = '67935fe8002425d5d665';
  private calendarCollectionId = '67965aa7000d0bef581d';
  private requestsCollectionId = '67965b8d0013eea83d4c';
  private summaryCollectionId = '679a0b57003ac00cbd94';

  constructor(private authService: AuthService) {
    this.client = new Client();
    this.databases = new Databases(this.client);

    this.client
      .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
      .setProject('67935c27000be545cecf'); // Replace with your Appwrite project ID
  }

  async prepopulateCalendar(year: number): Promise<void> {
    try {
      const dates = this.getAllDatesForYear(year);

      for (const dateInfo of dates) {
        const {date, dayOfWeek, isHoliday} = dateInfo;
        try {
          await this.databases.createDocument(
            this.databaseId,
            this.calendarCollectionId,
            ID.unique(), // Generate unique ID
            {
              date: date.toISOString().split('T')[0],
              day_of_week: dayOfWeek,
              is_holiday: isHoliday,
              note: isHoliday ? 'Weekend' : '',
            }
          );

          console.log(`Added: ${date.toISOString().split('T')[0]} - Holiday: ${isHoliday}`);
        } catch (error) {
          console.error(`Failed to add date ${date.toISOString().split('T')[0]}:`, error);
        }
      }

      console.log('Calendar prepopulation complete!');
    } catch (error) {
      console.error('Error while prepopulating calendar:', error);
    }
  }

  async getCalendarEvents(from: Date, to: Date): Promise<any> {
    try {
      const response = await this.databases.listDocuments(
        this.databaseId,
        this.calendarCollectionId,
        [
          Query.limit(31),
          Query.greaterThanEqual('date', from.toISOString()),
          Query.lessThanEqual('date', to.toISOString())
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  }

  async getUserSummary(): Promise<any> {
    try {
      return await this.databases.listDocuments(
        this.databaseId,
        this.requestsCollectionId,
        [
          Query.equal('user_id', this.authService.userInfo.$id)
        ]
      );
    } catch (error) {
      console.error('Error fetching user summary:', error);
      return null;
    }
  }

  async requestFreeDay(day: any): Promise<void> {
    try {
      const calendarDay = await this.databases.getDocument(
        this.databaseId,
        this.calendarCollectionId,
        day.$id,
      );

      await this.databases.updateDocument(
        this.databaseId,
        this.calendarCollectionId,
        day.$id,
        {
          requests: [
            ...calendarDay['requests'],
            {
              user_id: this.authService.userInfo.$id,
              user_name: this.authService.userInfo.name,
              date: day.date,
              calendar_id: day.$id,
            }
          ]
        }
      );
    } catch (error) {
      console.error('Error requesting free day:', error);
    }
  }

  async revokeFreeDay(documentId: string): Promise<void> {
    try {
      await this.databases.deleteDocument(
        this.databaseId,
        this.requestsCollectionId,
        documentId
      );
    } catch (error) {
      console.error('Error revoking free day:', error);
    }
  }

  private getAllDatesForYear(year: number): { date: Date; dayOfWeek: string; isHoliday: boolean }[] {
    const dates: { date: Date; dayOfWeek: string; isHoliday: boolean }[] = [];
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = daysOfWeek[date.getDay()];
        const isHoliday = dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';

        dates.push({date, dayOfWeek, isHoliday});
      }
    }

    return dates;
  }

}
