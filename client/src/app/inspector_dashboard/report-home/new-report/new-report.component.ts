import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApicallService } from 'src/app/apicall.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-report',
  templateUrl: './new-report.component.html',
  styleUrls: ['./new-report.component.scss']
})
export class NewReportComponent {
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
name:string='';
imageSrc: string = '/assets/Zoom-out.png';
///////end///////
  containerVisible: boolean = false;
  incompleteReports: any[] = [];
  navigate_flag: boolean = false;
  contract: string = '';
  doc: string = '';
  unit_array:string[]=[];
  inspector_name:string|null='';
  isLoading:boolean = true; // Control loading state

  // Define the type for checkbox states
  checkboxStates: { [key: string]: boolean } = {  };


  unit_array_checker:string[]=[]

  constructor(private apicallservice: ApicallService, private router: Router,private http:HttpClient,private cdr :ChangeDetectorRef) {
    this.inspector_name=sessionStorage.getItem('UserName') || "";

    this.apicallservice.getUnit_details(this.inspector_name).subscribe(
      (responses: any[]) => {
        responses.forEach((response) => {
          if (response && !response.ReportComplete) {
            try {
              const unitNos = JSON.parse(response.unit_no);
              const modifiedResponse = {
                ...response,
                parsedUnitNos: unitNos
              };
              this.incompleteReports.push(modifiedResponse);
              console.log("incomplete",this.incompleteReports)
            } catch (error) {
              console.error("Error parsing unit_no:", error);
            }
          }
        });
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges(); // Trigger change detection manually if necessary
        });
      },
      (error: any) => {
        console.error('Error fetching unit details:', error);
        this.isLoading=false;
      }
    );
  }

  formatUnits(units: string[]): string {
    if (!units || units.length === 0) return ''; // Handle empty or undefined arrays
    if (units.length === 1) return units[0]; // If only one unit, display it
  
    return `${units[0]},..., ${units[units.length - 1]}`; // First and Last with a dash in between
  }
  

  handleCheckpoint(event: any, index: number, unit_name: string): void {
    if (event.target.checked) {
      if (this.unit_array_checker.length >= 4) {
        event.target.checked = false;
        alert("You can only select up to 4 units.");
      } else {
        this.unit_array_checker.push(unit_name);
        console.log('checks array', this.unit_array_checker);
      }
    } else {
      const indexToRemove = this.unit_array_checker.indexOf(unit_name);
      if (indexToRemove !== -1) {
        this.unit_array_checker.splice(indexToRemove, 1);
      }
    }
  }
  

  get isAnyCheckboxChecked(): boolean {
    return Object.values(this.unit_array_checker).some(state => state);
  }

  cancel() {
    this.containerVisible = false;
  }

  replaceHyphenWithSlash(contractNumber: string): string {
    return contractNumber.replace('-', '/');
  }

  navigateToNavigateComponent() {
    // this.router.navigate(['/navigate-component']);
    // console.log("",this.unit_array_checker)
    console.log('document id is',this.doc);
    
    sessionStorage.setItem("unit_array1", JSON.stringify(this.unit_array_checker));
    // this.router.navigate(['/afterlogin/Report_unitSelection',this.contract,this.doc]);
    const requestData = {
      unitArray: this.unit_array_checker,
      contract: this.contract,
      doc: this.doc
  };
  

  this.http.post<any>(`${environment.serverUrl}addUnitDetails`, requestData)
        .subscribe(response => {
          console.log('Response from backend:', response);
          // Handle response if needed
          const reportId = response.reportId;
          this.router.navigate(['/afterlogin/Report_unitSelection', this.contract, this.doc,reportId]);
      }, error => {
          console.error('Error:', error);
          // Handle error if needed
      });
  }

  navigateToReportDetail(contractNumber: string, documentid_For_Url: string,unit_array:string[]) {

    this.isLoading = true;
    this.apicallservice.checkContract_Avai_INF(contractNumber).subscribe(
      (result: any) => {
        
        setTimeout(() => {
          this.isLoading = false;

          this.cdr.detectChanges();
        

        if (result && result.length > 0) {
          this.contract = contractNumber;
          this.doc = documentid_For_Url;
          this.unit_array=unit_array;
         
          this.containerVisible = !this.containerVisible;
        } else {
          alert(this.replaceHyphenWithSlash(contractNumber) + " Contract Number is not Available");
        }
      },1000);
    },
    (error: any) => {
      setTimeout(() => {
        this.isLoading = false;
        console.error('error when checking contract:',error);
        this.cdr.detectChanges();
      },1000);
    }
  );

      }
    
     
  toggleContainer() {
    this.containerVisible = !this.containerVisible;
  }

  ngOnInit(){
  ///////manage account//////////
  this.getTotalUnitsCount();
  this.getInfCounts();
  this.getClientAdminData();
  this.name = sessionStorage.getItem('UserName') as string;
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