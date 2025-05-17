import {Component} from '@angular/core';
import {Client, ID, Storage} from "appwrite";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  selectedFile: string = '';
  uploadedFile: File | null = null;
  private readonly client: Client;
  private storage: Storage;

  constructor() {
    this.client = new Client();
    this.storage = new Storage(this.client);

    this.client
      .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
      .setProject('67935c27000be545cecf'); // Replace with your Appwrite project ID
  }

  uploadFile(event: Event): void {
    this.selectedFile = 'start'
    event.preventDefault(); // <-- Add this
    event.stopPropagation(); // <-- Optional but helpful
    this.selectedFile = 'events n shit'

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.selectedFile = 'before if'

    if (file) {
      this.selectedFile = 'in if'

      this.uploadedFile = file
      this.storage.createFile(
        '679c7995001d789e10e3',
        ID.unique(),
        file
      ).then(r => {
        this.selectedFile = 'in then'
        console.log('Response:', r);
      });
    }
  }
}
