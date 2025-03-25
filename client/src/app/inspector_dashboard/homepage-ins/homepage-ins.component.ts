import { Component,OnInit} from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
// import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { DataService } from 'src/app/data.service';
import { ApicallService } from 'src/app/apicall.service';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-homepage-ins',
  templateUrl: './homepage-ins.component.html',
  styleUrls: ['./homepage-ins.component.scss']
})
export class HomepageInsComponent implements OnInit {
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
scheduleBool:boolean=false;
recordCount: number = 0;
  records:any[]=[];
name: string = '';
isLoading: boolean = true;
items: any[] = [];



// Cards Data - Only for Number Animation
cardNumbers = [3, 85, 40, 48, 40, 42]; // Target numbers for each card
animatedNumbers = [0, 0, 0, 0, 0, 0]; // Initial values

speed: number = 50; // Speed of animation (lower = faster)
  cdr: any;

  constructor(private route: ActivatedRoute,private dataService: ApicallService,private http :HttpClient,private router:Router,private datePipe: DatePipe,private cd: ChangeDetectorRef){
  }

ngOnInit(){
  // this.fetchTotalCount();
  ///////manage account//////////
  this.getTotalUnitsCount();
  this.getInfCounts();
  this.getClientAdminData();
  window.addEventListener('click', this.closeDropdown.bind(this));
  /////////end///////////

  
   this.scheduleBool=false
   this.name = sessionStorage.getItem('UserName') as string;
   console.log('------', this.name);
   this.getRecordCount(this.name);
   this.getRecordCount1(this.name);
  /////////end///////////
   // Simulate API delay
   setTimeout(() => {
    this.items = [
      { title: 'SCHEDULED JOBS', number: 10, icon: '/assets/jobs.png' },
      { title: 'INSPECTION IN PROGRESS', number: 5, icon: '/assets/deal (1).png' },
      { title: 'REPORT HUB', number: 20, icon: '/assets/Outline.png' },
      { title: 'SUPPORTING DOCUMENT', number: 15, icon: '/assets/office-material.png' },
      { title: 'CERTIFICATE QR', number: 8, icon: '/assets/qr-code (1).png' },
    ];
    this.isLoading = false;
  }, 3000); // Simulating a 3-second loading time

}

// redirect1(){
//   this.router.navigate(['afterlogin','ReportHome']);
// }

redirect1(){
  this.router.navigate(['afterlogin','inspectorHome']);
}

redirect2(){
  this.router.navigate(['afterlogin','mail_automation']);
}
redirect3(){
  this.router.navigate(['afterlogin','report_hubb']);
}
redirect4(){
  this.router.navigate(['afterlogin','more_options']);
}
redirect5(){
  this.router.navigate(['afterlogin','qrcode']);
}






animateNumbers(): void {
  this.cardNumbers.forEach((target, index) => {
    let interval = setInterval(() => {
      if (this.animatedNumbers[index] < target) {
        this.animatedNumbers[index]++;
      } else {
        clearInterval(interval);
      }
    }, this.speed);
  });
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

/////////////////////////////////////////////////////////////////////////



  redirectSchedule(){
    this.scheduleBool=true;
    this.router.navigate(['../schedule_page'], { relativeTo: this.route });
    
   
  }
  
  getRecordCount(name: string) {
    const params = new HttpParams().set('name', name);

    this.http.get<number>(`${environment.serverUrl}api/countRecords`, { params })      .subscribe(
        count => {
          this.recordCount = count;
         
        },
        error => {
          console.error('Error fetching record count:', error);
        }
      );
  }

  getRecordCount1(name: string) {
    const params = new HttpParams().set('name', name);

    this.http.get<any>(`${environment.serverUrl}api/countRecords2`, { params })      .subscribe(
        count => {
            this.records = count;
            console.log("IIIIIIIiiiiiiiiiii",count)
            setTimeout(() => {
              this.isLoading = false;
              this.cdr.detectChanges(); // Trigger change detection manually if needed
            }, 1000);
        },
        error => {
          console.error('Error fetching record count:', error);
        }
      );
  }


}
