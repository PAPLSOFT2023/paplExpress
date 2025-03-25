import { Component } from '@angular/core';
import { ApicallService } from 'src/app/apicall.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute,Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/INF/dialog/dialog.component';
import { RejectionComponent } from '../rejection/rejection.component';
import { ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
interface InspectorInfo {
  units: number;
  fromDate: string;
  toDate: string;
}

@Component({
  selector: 'app-schedule-page',
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.scss']
})
export class SchedulePageComponent {
  name: string = '';
  records:any[]=[];
  scheduleBool:boolean=false;
  salesProcess:string='';
  selfAssigned:string='';
  isAcceptButtonDisabled: boolean = false;
  units: number | undefined; 

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


  constructor(private apicallservice: ApicallService, private http: HttpClient,private router:Router, private dialog:MatDialog, private route: ActivatedRoute) {}
 
  parseInspectorArray(request: any): InspectorInfo {
    let inspectorInfo: InspectorInfo = {
      units: 0,
      fromDate: '',
      toDate: ''
    };
  
    const nameToFind = this.name; // Replace this with the name you want to find
  
    if (request && request.inspector_array) {
      const inspectorArray = JSON.parse(request.inspector_array);
  
      // Iterate through the inspector_array
      for (const inspector of inspectorArray) {
        if (inspector.name === nameToFind && inspector.units) {
          console.log('insp name array',inspector.name);
          
          inspectorInfo.units = inspector.units;
          inspectorInfo.fromDate = inspector.fromDate;
          inspectorInfo.toDate = inspector.toDate;
          break; // Break the loop once the desired inspector is found
        }
      }
    }
  
    return inspectorInfo;
  }
  
  getFromDate(request: any): string {
    const inspectorInfo = this.parseInspectorArray(request);
    return inspectorInfo.fromDate;
  }
  
  getToDate(request: any): string {
    const inspectorInfo = this.parseInspectorArray(request);
    return inspectorInfo.toDate;
  }

  getUnits(request:any) {
    const inspectorInfo = this.parseInspectorArray(request);
    return inspectorInfo.units;
  }
  
 

  ngOnInit() {
    this.scheduleBool=false
    this.name = sessionStorage.getItem('UserName') as string;
    console.log('------', this.name);
    this.getRecordCount(this.name);
    this.get_Insp_Name_List();
     ///////manage account//////////
   this.getTotalUnitsCount();
   this.getInfCounts();
   this.getClientAdminData();
   window.addEventListener('click', this.closeDropdown.bind(this));
   /////////end///////////
  }
  openRejectDialog(request: any){
    const dialogRef = this.dialog.open(RejectionComponent, {
      width: '300px',
      data: { request }, // Pass data to the dialog if needed
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        // Handle the rejected request with the reason selected (result)
        console.log('Rejected with reason:', result);
        this.router.navigate(['../inspectorHome'], { relativeTo: this.route });
        // Call your rejectRequest() function passing the reason or handle accordingly
      }
    });
  
 
    
    }

  




  redirectSchedule(){
    this.scheduleBool=true;
    this.router.navigate(['/afterlogin/inspectorHome/schedule_page']);
   
  }

  getRecordCount(name: string) {
    const params = new HttpParams().set('name', name);

    this.http.get<any>(`${environment.serverUrl}api/countRecords1`, { params })      .subscribe(
        count => {
            this.records = count;
        },
        error => {
          console.error('Error fetching record count:', error);
        }
      );
  }
  
  approveRequest(id: number) {
    const params = new HttpParams().set('id', id.toString()).set('name',this.name.toString());
    console.log(id);
  
    this.http.put<any>(`${environment.serverUrl}api/approveRecords`, {}, { params }) // Include empty object as body    
      .subscribe(
        count => {
          // this.records = count;
          console.log('successful');
          alert('Successful...!');
          this.router.navigate(['../inspectorHome'], { relativeTo: this.route });
        },
        error => {
          console.error('Error approving record:', error);
        }
      );
  }
  
  get_Insp_Name_List() {
    this.apicallservice.get_Insp_Name_List().subscribe(
      (response: any[]) => {
        if (response) {
          console.log('@@@', response);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  
  validateRadioButtons(request: any): boolean {
    // Enable button only if both salesProcess and selfAssigned are "no"
    return request.salesProcess === 'no' && request.selfAssigned === 'no';
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

  






}

