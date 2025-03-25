import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-send-whats-app',
  templateUrl: './send-whats-app.component.html',
  styleUrls: ['./send-whats-app.component.scss']
})
export class SendWhatsAppComponent {
  reports: any[] = []; // Array to hold the reports
  isLoading:boolean=false;
  ccEmails: string[] = [];  // Array to hold default CC email addresses
  allCcEmails: string[] = [];

  isPopupOpen: boolean = false; // Controls popup visibility
  emailInput: string = ''; // Stores user input


  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCombinedData();
    this.fetchReports();

  }

  fetchReports(): void {
    this.isLoading=true
    const value = sessionStorage.getItem('UserName') as string;
    console.log('name is',value); 
    this.http.get<any[]>(`${environment.serverUrl}api/reports_fetch?name=${value}`).subscribe(
      (data) => {
        console.log('send mail',data);
        this.reports = data; // Set the reports from the response
        this.isLoading=false;
      },
      (error) => {
        console.error('Error fetching reports:', error);
      }
    );
  
  
  }

fetchCombinedData(): void {
  this.isLoading = true;

  const value = sessionStorage.getItem('UserName') as string;
  console.log('Inspector Name:', value);

  if (!value) {
    console.error('No username found in session storage.');
    this.isLoading = false;
    return;
  }

  const [name, code] = value.split(' - '); // Split into name and code
  const inspectorData = { name, code };

  // Parallel API calls using forkJoin
  forkJoin({
    ccEmails: this.http.get<any>(`${environment.serverUrl}api/get-cc`),
    inspectorEmails: this.http.post<any>(`${environment.serverUrl}api/get-email-addresses-inspectors1`, inspectorData),
    reports: this.http.get<any[]>(`${environment.serverUrl}api/reports_fetch?name=${name}`)
  }).subscribe(
    ({ ccEmails, inspectorEmails, reports }) => {
      // Handle CC emails
      if (ccEmails.success) {
        const ccEmailList = ccEmails.ccEmails || [];
        console.log('Fetched CC Emails:', ccEmailList);
      } else {
        console.error('Error fetching CC emails:', ccEmails.error);
      }

      // Handle Inspector Emails
      const inspectorEmailList = inspectorEmails.map((inspector: { email: string }) => inspector.email);
      console.log('Inspector Emails:', inspectorEmailList);

      // Combine both email lists
      this.allCcEmails = [...(ccEmails.ccEmails || []), ...inspectorEmailList];
      console.log('Combined CC Emails:', this.allCcEmails);

      // Handle Reports
      // this.reports = reports;
      console.log('Fetched Reports:', this.reports);
      
      this.isLoading = false;
    },
    (error) => {
      console.error('Error in combined data fetch:', error);
      this.isLoading = false;
    }
  );
}

openEmailPopup() {
  this.isPopupOpen = true;
  this.emailInput = this.allCcEmails.join(', '); // Pre-fill with existing emails
}

closePopup() {
  this.isPopupOpen = false;
}

saveEmails() {
  this.allCcEmails = this.emailInput.split(',').map(email => email.trim()); // Convert input to array
  console.log('Updated CC Emails:', this.allCcEmails);
  this.closePopup();
}

  
  sendEmail(documentId: string, customerName: string, projectName: string,report_id:string,building_name:string,unit_name:string) {
    this.isLoading=true;
    
    this.http.post<{ message: string }>(`${environment.serverUrl}send-email`, { 
        documentId, 
        clientContactName: customerName, 
        projectName,
        report_id,
        building_name,
        unit_name,
        cc:this.allCcEmails
      }).subscribe(
        (response) => {
          console.log('Response:', response);
          if (response.message.includes('File size exceeds')) {
            alert('File size exceeds 20MB. Email not sent.');
          } else {
            alert('Email sent successfully!');
            this.isLoading=false;
            window.location.reload();
          }
        },
        (error) => {
          console.error('Error sending email:', error);
          alert(error.error?.message || 'Error sending email.');
        }
      );
  }
  
}
