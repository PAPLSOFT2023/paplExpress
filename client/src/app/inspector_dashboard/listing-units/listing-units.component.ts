import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { ApicallService } from 'src/app/apicall.service';

@Component({
  selector: 'app-listing-units',
  templateUrl: './listing-units.component.html',
  styleUrls: ['./listing-units.component.scss'],
})
export class ListingUnitsComponent {
  val: string | null = '';
  units: string[] = []; // List of units
  editingIndex: number | null = null; // Index of the unit being edited
  editedValue: string = ''; // Temporary storage for the edited value
  inspectionMasterCount:number=0;
  recordsvaluesCount:number=0;
  breifspec:number=0;
  inspectionEndDate: string | null = null;
  isLoading: boolean = false; // Loader state
  loading:boolean=true;
  name:any;
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
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.route.paramMap.subscribe((params) => {
      this.val = params.get('c_no');
      console.log(this.val);
    });
  }

  ngOnInit() {


this.name=sessionStorage.getItem('UserName')

    const value = this.val;
    const inspector = `${environment.serverUrl}api/fetch_units?encodedValue=${value}`;
    this.http.get<string[]>(inspector).subscribe(
      (data: string[]) => {
        this.units = JSON.parse(data[0]); // Parse data into units
        console.log(this.units);
        console.log('unit array',this.units);
    console.log('my data is',data);
        // Simulate API call delay
        setTimeout(() => {
          this.loading = false;
        });
      
    
    console.log('1111',this.units.length);
    const total=this.units.length
    console.log('total',this.inspectionMasterCount);
      },
      (error) => {
        console.error(error);

      }
    );



    this.insmasterCounts();
    this.recordvaluesCounts();
    this.breifspecCounts();
     ///////manage account//////////
   this.getTotalUnitsCount();
   this.getInfCounts();
   this.getClientAdminData();
   window.addEventListener('click', this.closeDropdown.bind(this));
   /////////end///////////
  }

  redirect1(){
    this.router.navigate(['afterlogin','outbox']);
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


  executeAllFunctionsWithLoader() {
    this.isLoading=true;
    Promise.all([
      this.insmasterCounts(),
      this.recordvaluesCounts(),
      this.breifspecCounts()
    ]).finally(() => {
      this.isLoading = false; // Stop loader after all functions complete
    });
  }

  proceed(unit: string) {
    console.log('Clicked on unit:', unit);

    if (unit) {
      this.router.navigate(['afterlogin', 'section', unit]).then(
        () => console.log('Navigation successful'),
        (error) => console.error('Navigation failed:', error)
      );
    } else {
      console.error('Invalid unit value:', unit);
    }
  }

  // Open the modal pop-up for editing
  editUnit(index: number) {
    this.editingIndex = index; // Set the index being edited
    this.editedValue = this.units[index]; // Set the current unit value in the temp storage
    alert('Unit number can only be changed before the inspection is carried out. Once the inspection starts, changes will not be allowed.');
  }

  
  saveUnit() { 
    if (this.editingIndex !== null && this.val && this.editedValue) {
      const payload = {
        document_id: this.val, // Document ID
        index: this.editingIndex,
        new_unit_no: this.editedValue, // New unit_no to update
      };
  
      this.http.put(`${environment.serverUrl}api/update-unit-details`, payload).subscribe(
        (response: any) => {
          console.log('Unit updated successfully:', response);
          this.units[this.editingIndex!] = this.editedValue; // Update local list with new value
          this.editingIndex = null; // Reset the editing index
  
          // Show success message when update is successful
          alert('Unit number updated successfully.');
        },
        (error) => {
          // Display alert if the update fails due to the inspection already being carried out
          if (error.status === 403) {
            alert('Unit number can only be changed before the inspection is carried out. Once the inspection starts, changes will not be allowed.');
          } else {
            console.error('Update failed:', error);
          }
        }
      );
    }
  }
  
  

  // Close the modal without saving
  cancelEdit() {
    this.editingIndex = null; // Close the editing modal
  }


  recordvaluesCounts(): void {
    if (!this.val) {
      console.error('Document ID is not available.');
      return;
    }
  
    const apiUrl = `${environment.serverUrl}api/get-record-values-count?document_id=${this.val}`;
  
    this.http.get<{ totalPoints: string }>(apiUrl).subscribe(
      (data) => {
        console.log('Fetched record values count:', data);
        const total=this.units.length
  
        this.recordsvaluesCount = Number(data.totalPoints);  // Convert to number
        console.log('Record Values Count:', this.recordsvaluesCount);
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching record counts:', error);
      }
    );
  }
  
  
  breifspecCounts(): void {
    if (!this.val) {
      console.error('Document ID is not available.');
      return;
    }
  
    const apiUrl = `${environment.serverUrl}api/get-breif-spec-count?document_id=${this.val}`;
  
    this.http.get<{ totalPoints: string }>(apiUrl).subscribe(
      (data) => {
        console.log('Fetched breif spec count:', data);
        const total=this.units.length
  
        this.breifspec = Number(data.totalPoints);  // Convert to number
        console.log('breif spec Count:', this.breifspec);
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching record counts:', error);
      }
    );
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  insmasterCounts(): void {
    this.http.get<{ totalPoints: string }>(`${environment.serverUrl}api/get-insmaster-count`).subscribe(
      (data) => {
        console.log('Fetched master data:', data);
        this.inspectionMasterCount = Number(data.totalPoints);  // Convert to number
        console.log('Inspection Master Count:', this.inspectionMasterCount);
        const total=this.units.length
        console.log('111',total);
  
        
        this.inspectionMasterCount*=total;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching record counts:', error);
      }
    );
  }

  fetchAllCounts(): void {
    if (!this.val) {
      console.error('Document ID is not available.');
      this.isLoading = false;
      return;
    }
  
    this.isLoading = true;
  
    this.http.get<{ totalPoints: string }>(`${environment.serverUrl}api/get-insmaster-count`).subscribe(
      (masterData) => {
        this.inspectionMasterCount = Number(masterData.totalPoints) * this.units.length;
        console.log('Inspection Master Count:', this.inspectionMasterCount);
  
        this.http.get<{ totalPoints: string }>(`${environment.serverUrl}api/get-record-values-count?document_id=${this.val}&units=${JSON.stringify(this.units)}`).subscribe(
          (recordValuesData) => {
            this.recordsvaluesCount = Number(recordValuesData.totalPoints);
            console.log('Record Values Count:', this.recordsvaluesCount);
  
            this.http.get<{ totalPoints: string }>(`${environment.serverUrl}api/get-breif-spec-count?document_id=${this.val}`).subscribe(
              (breifSpecData) => {
                this.breifspec = Number(breifSpecData.totalPoints);
                console.log('Breif Spec Count:', this.breifspec);
  
                if (
                  this.inspectionMasterCount === this.recordsvaluesCount &&
                  this.breifspec === this.units.length
                ) {
                  this.concludeInspection();
                } else {
                  window.alert('Can’t conclude inspection, some checkpoints are left unchecked.');
                  this.isLoading = false;
                }
              },
              (error) => {
                console.error('Error fetching breif spec count:', error);
                this.isLoading = false;
              }
            );
          },
          (error) => {
            console.error('Error fetching record values count:', error);
            this.isLoading = false;
          }
        );
      },
      (error) => {
        console.error('Error fetching inspection master count:', error);
        this.isLoading = false;
      }
    );
  }
  
  
  
  
  
  
  
 
  
  
  // concludeInspection(): void {
  //   // Check if the inspection end date is already stored in the database
  //   if (this.inspectionEndDateAlreadyExists()) {
  //     window.alert('The inspection date has already been set. It cannot be changed.');
  //     return;  // Exit the method without making the update
  //   }
  
  //   const currentDate = new Date().toISOString(); // Format date to ISO string
  //   const unitId = this.val; // Assuming unitId is the current unitId
  
  //   const apiUrl = `${environment.serverUrl}api/update_unit_details`;
  
  //   const requestBody = {
  //     inspection_completed: 1,
  //     ins_end_date: currentDate,  // Store the current date only if it's not already set
  //     unitId: unitId
  //   };
  
  //   this.http.post(apiUrl, requestBody).subscribe(
  //     (response) => {
  //       console.log('Inspection concluded:', response);
  //       window.alert('The inspection was concluded successfully.');
  //       this.isLoading = false;

  //     },
  //     (error) => {
  //       console.error('Error updating inspection:', error);
  //       window.alert('Failed to conclude the inspection. Please try again.');
  //     }
  //   );
  // }
  concludeInspection(): void {
    this.isLoading = true; // Show loading indicator
    const unitId = this.val; // Assuming unitId is the current unitId
  
    // Check if the inspection end date is already stored in the database
    const inspectionEndDateApiUrl = `${environment.serverUrl}api/get-inspection-end-date?unitId=${unitId}`;
  
    this.http.get<{ inspection_end_date: string }>(inspectionEndDateApiUrl).subscribe(
      (inspectionData) => {
        if (inspectionData.inspection_end_date) {
          window.alert('The inspection end date has already been set and cannot be updated.');
          this.isLoading = false;
          return; // Exit the function if end date already exists
        }
  
        // Proceed with concluding the inspection if no end date is set
        const currentDate = new Date().toISOString(); // Format date to ISO string
        const apiUrl = `${environment.serverUrl}api/update_unit_details`;
  
        const requestBody = {
          inspection_completed: 1,
          ins_end_date: currentDate, // Store the current date only if it's not already set
          unitId: unitId
        };
  
        this.http.post(apiUrl, requestBody).subscribe(
          (response) => {
            console.log('Inspection concluded:', response);
            window.alert('The inspection was concluded successfully.');
            this.isLoading = false;
          },
          (error) => {
            console.error('Error updating inspection:', error);
            window.alert('Failed to conclude the inspection. Please try again.');
            this.isLoading = false;
          }
        );
      },
      (error) => {
        console.error('Error fetching inspection end date:', error);
        window.alert('Failed to check inspection end date. Please try again.');
        this.isLoading = false;
      }
    );
  }
  
  inspectionEndDateAlreadyExists(): void {
    const inspectionEndDateApiUrl = `${environment.serverUrl}api/get-inspection-end-date?unitId=${this.val}`;
  
    this.http.get<{ inspection_end_date: string }>(inspectionEndDateApiUrl).subscribe(
      (inspectionData) => {
        if (inspectionData.inspection_end_date) {
          this.inspectionEndDate=inspectionData.inspection_end_date;
          window.alert('The inspection end date has already been set and cannot be updated.');
          this.isLoading = false;
        }
      },
      (error) => {
        console.error('Error fetching inspection end date:', error);
        this.isLoading = false;
      }
    );
  }
  



 



}

