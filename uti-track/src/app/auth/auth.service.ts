import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Account, Client, ID} from 'appwrite';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  client = new Client();
  account = new Account(this.client);
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false); // Observable for login state
  private sessionCheckInterval: any; // Interval ID for periodic session check
  isLoggedIn$ = this._isLoggedIn$.asObservable(); // Expose the observable
  userInfo: any = null;

  constructor(private router: Router) {
    this.client
      .setEndpoint('https://cloud.appwrite.io/v1') // Set your Appwrite endpoint
      .setProject('67935c27000be545cecf'); // Set your Appwrite project ID

    // Initialize by checking the user's login state
    void this.checkSession();
  }

  /**
   * Checks if the user is logged in and updates the BehaviorSubject.
   */
  async checkSession(): Promise<void> {
    try {
      this.userInfo = await this.account.get();
      this._isLoggedIn$.next(true);
    } catch {
      this.userInfo = null;
      this._isLoggedIn$.next(false);
    }
  }

  /**
   * Login a user using email and password.
   * Starts a periodic session check on successful login.
   */
  async login(email: string, password: string): Promise<void> {
    try {
      await this.account.createEmailPasswordSession(email, password);
      this.userInfo = await this.account.get();
      this._isLoggedIn$.next(true);
      console.log('Login successful:', this.userInfo);

      // Start periodic session checking
      this.startSessionCheck();
      void this.router.navigate(['/']);
    } catch (error) {
      console.error('Login failed:', error);
      this._isLoggedIn$.next(false);
    }
  }

  /**
   * Registers a new user.
   */
  async register(name: string, email: string, password: string): Promise<void> {
    try {
      const user = await this.account.create(ID.unique(), email, password, name);
      console.log('Registration successful:', user);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      await this.login(email, password);
    }
  }

  /**
   * Logs out the current user and stops session checking.
   */
  async logout(): Promise<void> {
    try {
      await this.account.deleteSession('current');
      this._isLoggedIn$.next(false);
      this.userInfo = null;

      // Stop periodic session checking
      this.stopSessionCheck();
      console.log('Logout successful');
      void this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  /**
   * Periodically checks the user's session and logs out if it's invalid.
   */
  private startSessionCheck(): void {
    this.stopSessionCheck(); // Clear any previous intervals
    this.sessionCheckInterval = setInterval(async () => {
      await this.checkSession();
      if (!this._isLoggedIn$.value) {
        console.warn('Session expired. Logging out...');
        await this.logout();
      }
    }, 60000); // Check session every 60 seconds
  }

  /**
   * Stops the periodic session check.
   */
  private stopSessionCheck(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
  }
}
