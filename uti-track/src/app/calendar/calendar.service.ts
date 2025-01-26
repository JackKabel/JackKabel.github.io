import {Injectable} from '@angular/core';
import {Client, Databases, ID, Query} from 'appwrite';
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private client: Client;
  private databases: Databases;
  private databaseId = '67935fe8002425d5d665'; // Replace with your Appwrite database ID
  private calendarCollectionId = '67965aa7000d0bef581d'; // Replace with your Calendar collection ID
  private freeDaysCollectionId = '67965b8d0013eea83d4c'

  constructor(private authService: AuthService) {
    // Use the same client as the AuthService
    this.client = new Client();
    this.databases = new Databases(this.client);

    this.client
      .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
      .setProject('67935c27000be545cecf'); // Replace with your Appwrite project ID
  }

  /**
   * Prepopulates the calendar for a given year.
   */
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

  /**
   * Fetches all dates from the calendar collection.
   */
  async getCalendar(): Promise<any[]> {
    try {
      const response = await this.databases.listDocuments(this.databaseId, this.calendarCollectionId);
      console.log('Calendar data:', response.documents);
      return response.documents;
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      return [];
    }
  }

  /**
   * Utility function to generate all dates for a year.
   */
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

  async requestFreeDay(date: Date): Promise<void> {
    try {
      const formattedDate = date.toISOString().split('T')[0];

      // Add the free day request to the database
      await this.databases.createDocument(
        this.databaseId,
        'free_days', // Replace with your free_days collection ID
        ID.unique(),
        { date: formattedDate, userId: this.authService.userInfo.$id }
      );

      console.log(`Free day requested successfully for ${formattedDate}`);
    } catch (error) {
      console.error('Error requesting free day:', error);
    }
  }

  /**
   * Fetches calendar events between two dates
   * @param from - start date
   * @param to - end date
   */
  async getCalendarEvents(from: Date, to: Date): Promise<any> {
    try {
      const response = await this.databases.listDocuments(
        this.databaseId,
        this.calendarCollectionId,
        [
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

  async getFreeDayRequests(): Promise<any> {
    try {
      const response = await this.databases.listDocuments(
        this.databaseId,
        this.freeDaysCollectionId
      );
      return response.documents;
    } catch (error) {
      console.error('Error fetching free day requests:', error);
      return [];
    }
  }

}
