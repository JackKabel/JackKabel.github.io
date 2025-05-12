import {Component} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  uploadFile(event: Event): void {
    event.preventDefault(); // <-- Add this
    event.stopPropagation(); // <-- Optional but helpful

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      // Upload logic here (e.g., call a service)
      console.log('Selected file:', file);
    }
  }
}
