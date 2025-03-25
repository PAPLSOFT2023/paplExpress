import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reshedule-after-start',
  templateUrl: './reshedule-after-start.component.html',
  styleUrls: ['./reshedule-after-start.component.scss']
})
export class ResheduleAfterStartComponent {
  reason: { reason: string; selected?: boolean; additionalInfo?: string }[] = []; // Include additionalInfo property
  selectedReasons: { reason: string; additionalInfo?: string }[] = []; // Store selected reasons with additional info
  name: string | null = '';
  isPopupVisible: boolean = false;
  val: string | null = '';
  total_units_schedule: number | null = null;
  unitCheckboxes: boolean[] = [];  // Array to hold the checkbox states (checked or not)
  isScheduledUnitsNotReady: boolean = false;  // Flag to track if Scheduled Units Not Ready is selected
  scheduledUnits: boolean[] = [];  // Array to track checkboxes for scheduled units


  //himal
   ////manage account////////
previewSrc: string | ArrayBuffer | null = null;
dropdownVisible = false;
isPasswordVisible: boolean = false;
showPopup = false;
isVisible: boolean = false;
errorMessage: string = '';
animatedCount: number = 0;
totalUnitsCount: number = 0;
targetCount: number = 0;
status1Count: number = 0;
status0Count: number = 0;
interval: any;
imageSrc: string = '/assets/Zoom-out.png';
///////end///////


  constructor(
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe(params => {
      this.val = params.get('c_no');
      this.total_units_schedule = +params.get('total_units_schedule')!; // Capture 'total_units_schedule' and convert to number

      console.log(this.val);
      this.unitCheckboxes = new Array(this.total_units_schedule).fill(false);

    });
  }

  ngOnInit() {
    this.fetchreason();
    this.name = sessionStorage.getItem('UserName');
     ///////manage account//////////
   this.getTotalUnitsCount();
   this.getInfCounts();
   this.getClientAdminData();
   window.addEventListener('click', this.closeDropdown.bind(this));
   /////////end///////////
  }



  /////manage account////
  toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }

  
  openLogoutPopup(): void {
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
  }

  confirmLogout(): void {
    this.router.navigate(['/login']);
  }
  navigateHome(): void {
    this.router.navigate(['afterlogin', 'homepage_ins']); // Replace '/home' with your actual home route
  }
  openManageAccountPopup() {
    this.isVisible = true;
  }

  closePopup3(): void {
    this.showPopup = false;
  }
  closePopup1() {
    this.isVisible = false;
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      this.formData.picture = file;
  
      // For preview, read the file as a data URL
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewSrc = e.target.result; // Update previewSrc with the file data URL
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('Username', this.formData.Username);
    formData.append('email', this.formData.email);
    formData.append('password', this.formData.password);
  
    // Append the picture file only if it's selected
    if (this.formData.picture) {
      formData.append('picture', this.formData.picture);  // Key 'picture' matches multer configuration
    }
  
    console.log('form data', formData);
  
    this.http.put(`${environment.serverUrl}api/update-client`, formData).subscribe(
      (response: any) => {
        console.log('Update successful:', response);
        alert('Data updated successfully'); // Show success alert
        this.closePopup1(); // Close the form or popup if it's open
      },
      (error) => {
        console.error('Update failed:', error);
        alert('Failed to update data'); // Show error alert
      }
    );
  }
  formData = {
    Username: '',
    email: '',
    password:'',
    picture: null as File | null  // Allow 'picture' to be either File or null
  };

  // Method to fetch data from the API and bind to the form
// Method to fetch data from the API and bind to the form
getClientAdminData(): void {
  const apiUrl = `${environment.serverUrl}api/clientadmin`;
  
  // Get username from sessionStorage
  const userName = sessionStorage.getItem('UserName');
  
  if (userName) {
    // Append the username as a query parameter to the API URL
    const urlWithParams = `${apiUrl}?username=${userName}`;

    // Make the HTTP GET request with the username
    this.http.get<any>(urlWithParams).subscribe(
      (data) => {
        console.log('Data fetched:', data);
        if (data) {
          // Set form data
          this.formData.Username = data.Username || '';
          this.formData.email = data.email || '';
          
          // Handle image preview if available
          this.previewSrc = data.Picture || ''; // Display image preview
        }
        console.log("Data from clientadmin", data.Username, data.email,data.Picture);
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.errorMessage = 'Failed to load clientadmin data';
      }
    );
  } else {
    console.error('No username found in sessionStorage');
    this.errorMessage = 'User not logged in';
  }
}

getTotalUnitsCount(): void {
  this.http.get<{ totalUnits: number }>(`${environment.serverUrl}api/get-total-units-counts`).subscribe(
    (data) => {
      this.totalUnitsCount = data.totalUnits;
      this.startCountAnimation(this.totalUnitsCount, (count) => this.totalUnitsCount = count);
    },
    (error) => {
      console.error('Error fetching total units count:', error);
    }
  );
}

getInfCounts(): void {
  // Make the GET request to the API endpoint
  this.http.get<{ status1Count: number, status0Count: number }>(`${environment.serverUrl}api/get-inf-counts`).subscribe(
    (data) => {
      // Assign the fetched data to component properties
      this.status1Count = data.status1Count;
      this.status0Count = data.status0Count;
      console.log('INF Counts:', data);
    },
    (error) => {
      console.error('Error fetching INF counts:', error);
      this.errorMessage = 'Failed to load INF counts';
    }
  );
}

startCountAnimation(target: number, update: (count: number) => void) {
  let currentCount = 0;
  const maxCount = target;
  const speed = 50;

  this.interval = setInterval(() => {
    currentCount += Math.ceil(maxCount / 100);
    if (currentCount >= maxCount) {
      clearInterval(this.interval);
      currentCount = maxCount;
    }
    update(currentCount);
  }, speed);
}

closeDropdown(event: Event): void {
  const target = event.target as HTMLElement;
  if (!target.closest('.dropdown')) {
    this.dropdownVisible = false;
  }
}
toggleFullScreen(): void {
  if (!document.fullscreenElement) {
    // Request fullscreen
    document.documentElement.requestFullscreen().then(() => {
      this.imageSrc = '/assets/Zoom-ins.png'; // Change to zoom-out image when fullscreen is active
    }).catch((err) => {
      console.error(`Error attempting to enable full-screen mode: ${err.message}`);
    });
  } else {
    // Exit fullscreen
    document.exitFullscreen().then(() => {
      this.imageSrc =  '/assets/Zoom-out.png'; // Change back to zoom-in image when exiting fullscreen
    }).catch((err) => {
      console.error(`Error attempting to exit full-screen mode: ${err.message}`);
    });
  }
}


  // Fetch reasons from API
  fetchreason(): void {
    const apiUrl = `${environment.serverUrl}api/reject-reason-after-start?encodedValue=${this.val}`;

    this.http.get<{ reason: string }[]>(apiUrl).subscribe(
      data => {
        this.reason = data.map(item => ({ ...item, selected: false, additionalInfo: '' }));
        console.log('Fetched reasons with selection:', this.reason);
      },
      error => {
        console.error('Error fetching reject reasons:', error);
      }
    );
  }

  onCheckboxChange(item: { reason: string; selected?: boolean; additionalInfo?: string }, index: number): void {
    if (item.selected) {
      if (!this.selectedReasons.find(r => r.reason === item.reason)) {
        this.selectedReasons.push({ reason: item.reason, additionalInfo: item.additionalInfo });
      }
    } else {
      this.selectedReasons = this.selectedReasons.filter(reason => reason.reason !== item.reason);
    }

    if (item.reason === 'INF Data Incompatible' && !item.selected) {
      item.additionalInfo = '';
    }



    console.log('Selected Reasons:', this.selectedReasons);
  }

  updateAdditionalInfo(item: { reason: string; additionalInfo?: string }): void {
    const reasonToUpdate = this.selectedReasons.find(r => r.reason === item.reason);
    if (reasonToUpdate) {
      reasonToUpdate.additionalInfo = item.additionalInfo;
    }
    console.log('Updated Selected Reasons:', this.selectedReasons);
  }


  isAnyCheckboxSelected(): boolean {
    return this.reason.some(item => item.selected);
  }

  // Open the confirmation popup
  openPopup(): void {
    if (this.isAnyCheckboxSelected())
    this.isPopupVisible = true;
  }


 

  // Close the popup


 

  confirmAbort(): void {
    // Format the selected reasons
    const formattedReasons = this.selectedReasons.map(reason => {
      if (reason.reason === "INF Data Incompatible") {
        // For "INF Data Incompatible", use a hyphen
        return `${reason.reason}-${reason.additionalInfo || ''}`;
      } else {
        // For all other reasons, just return the reason
        return reason.reason;
      }
    });



    const params = new HttpParams()
      .set('id', this.val || '')
      .set('reason', JSON.stringify(formattedReasons)) // Send as formatted strings
      .set('name', this.name || '');

    this.http.put<any>(`${environment.serverUrl}api/approveRecords3`, {}, { params })
      .subscribe(
        response => {
          console.log('Abort action successful:', response);
          alert('Action completed successfully!');
        },
        error => {
          console.error('Error during abort action:', error);
        }
      );

    this.closePopup();
    this.router.navigate(['afterlogin', 'scheduledWork']);

  }

  // proceed(): void {

  // }

  cancel(): void {
    this.router.navigate(['afterlogin', 'inspectorHome']);
  }



 


  onScheduledUnitsChange(): void {
    // Optionally, reset or modify behavior based on selection
    console.log('Scheduled Units Not Ready selected:', this.isScheduledUnitsNotReady);
  }



}
