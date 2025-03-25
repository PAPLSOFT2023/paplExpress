import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  
  selectedFile: File | null = null;
  isCompressing = false;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.errorMessage = null;  // Clear any previous errors
  }

  onUpload(): void {
    if (this.selectedFile) {
      this.isCompressing = true;
      const formData = new FormData();
      formData.append('pdf', this.selectedFile, this.selectedFile.name);

      // Send the file to the backend for compression
      this.http.post('http://localhost:3000/compress', formData, {
        headers: new HttpHeaders(),
        responseType: 'blob',
      }).subscribe(
        (response: Blob) => {
          this.isCompressing = false;
          // Create a download link for the compressed file
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'compressed.pdf';
          a.click();
        },
        (error) => {
          this.isCompressing = false;
          console.error('Error during PDF compression:', error);
          this.errorMessage = 'An error occurred during PDF compression. Please try again.';
        }
      );
    }
  }
}

