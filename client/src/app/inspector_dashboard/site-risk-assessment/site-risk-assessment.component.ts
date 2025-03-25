import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ApicallService } from 'src/app/apicall.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-site-risk-assessment',
  templateUrl: './site-risk-assessment.component.html',
  styleUrls: ['./site-risk-assessment.component.scss']
})
export class SiteRiskAssessmentComponent {
  val:string |null='';
  riskAssessments: any[] = [];
  jsonData: any[] = [];
  contract_no: string | null = '';
  isFormValid: boolean = false; // Declaration of isFormValid property
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
name:any;
///////end///////

  constructor(private route: ActivatedRoute, private dataService: ApicallService, private http: HttpClient, private router: Router) { 
    this.route.paramMap.subscribe(params => {
      this.val = params.get('c_no');
      console.log(this.val);
      if(this.val){
        sessionStorage.setItem('document_id', this.val); 
      }
      
    });
  }

  ngOnInit(): void {
    this.http.get<any[]>(`${environment.serverUrl}api/risk-assessments`).subscribe(data => {
            this.riskAssessments = data.map(assessment => ({ ...assessment, selectedValue: '' }));
    });
    this.name=sessionStorage.getItem('UserName')
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


  generateJSON(): void {
    this.jsonData = this.riskAssessments.map(assessment => ({
      description: assessment.description,
      selectedValue: assessment.selectedValue
    }));
    const document_id = sessionStorage.getItem('document_id');
    this.contract_no = sessionStorage.getItem('contract_no');

    const store_values = {
      risk: this.jsonData,
      document_id: this.val
    };

    console.log(this.jsonData);
    // Here you can send this.jsonData to your server or use it as needed
    this.http.put(`${environment.serverUrl}api/update_data_s`, store_values).subscribe(      (response) => {
        this.router.navigate(['afterlogin', 'basic_data', this.contract_no]);
      },
      (error) => {
        console.error('Error storing data', error);
      }
    );
  }

  updateSelectedValue(assessment: any, value: string): void {
    assessment.selectedValue = value;
    this.validateForm();
  }

  private validateForm(): void {
    let isFormValid = true;
    const isAssessment6or7SelectedYes = this.riskAssessments.some(assessment => [5, 6].includes(assessment.id) && assessment.selectedValue === 'Yes');
  
    if (isAssessment6or7SelectedYes) {
      isFormValid = false;
    } else {
    
      const isAnyAssessmentNotSelectedYes = Array.from({ length: 13 }, (_, i) =>
        ![5, 6].includes(i + 1) && !this.riskAssessments.some(assessment => assessment.id === i + 1 && assessment.selectedValue === 'Yes')
      );
    
      
      if (isAnyAssessmentNotSelectedYes.some(isSelected => isSelected)) {
        isFormValid = false;
      }
    }
    this.isFormValid = isFormValid;
  }
  

}
