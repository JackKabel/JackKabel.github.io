import {Component} from '@angular/core';
import {Client, ID, Storage} from "appwrite";
import {AuthService} from "../auth/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  selectedFile: File | null = null;
  uploadedFile: File | null = null;
  private client: Client;
  private storage: Storage;

  constructor() {
    this.client = new Client();
    this.storage = new Storage(this.client);

    this.client
      .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
      .setProject('67935c27000be545cecf'); // Replace with your Appwrite project ID
  }

  uploadFile(event: Event): void {
    event.preventDefault(); // <-- Add this
    event.stopPropagation(); // <-- Optional but helpful

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.uploadedFile = file
      this.storage.createFile(
        '679c7995001d789e10e3',
        ID.unique(),
        file
      ).then(r => {
        console.log('Response:', r);
      });
    }
  }
}
