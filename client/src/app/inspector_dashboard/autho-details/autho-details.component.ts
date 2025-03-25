import { Component, QueryList, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { SignaturePad } from 'angular2-signaturepad';

interface Row {
  name: string;
  designation: string;
  company: string;
  contact_number: string;
  signature: string; 
  role: string;
}

@Component({
  selector: 'app-autho-details',
  templateUrl: './autho-details.component.html',
  styleUrls: ['./autho-details.component.scss']
})
export class AuthoDetailsComponent {
  @ViewChild(SignaturePad) signaturePad!: SignaturePad;
  @ViewChildren(SignaturePad) signaturePads!: QueryList<SignaturePad>;

  val: string | null = '';
  isDialogVisible = false;
  currentRowIndex: number | null = null;
  signature: string = '';
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
  
  rows: Row[] = [
    { name: '', designation: '', role: '', company: '', contact_number: '', signature: '' },
  ];

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    this.route.paramMap.subscribe(params => {
      this.val = params.get('c_no');
      if (this.val) {
        sessionStorage.setItem('document_id', this.val); 
      }
    });
    const storedRows = sessionStorage.getItem('rows');
    if (storedRows) {
      this.rows = JSON.parse(storedRows);
      console.log('rows',this.rows);
     
      
    } else {
      this.rows = [
        { name: '', designation: '', role: '', company: '', contact_number: '', signature: '' },
      ];
    }
  }

  addRow() {
    this.rows.push({ name: '', designation: '', role: '', company: '', contact_number: '', signature: '' });
    this.saveDataToSession()
  }
  ngAfterViewInit(): void {
    // Now it's safe to access this.signaturePads
    console.log(this.signaturePads);
    this.name=sessionStorage.getItem('UserName') as String;
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




  show() {
    sessionStorage.removeItem('rows');

    const currentDate = new Date().toISOString(); // Get the current date in ISO format
  
    const store_values = {
      witness_details: this.rows,
      document_id: this.val,
      ins_start_date: currentDate // Add the current date to the payload
    };
  
    this.http.put(`${environment.serverUrl}api/update_data_w`, store_values).subscribe(
      (response) => {
        console.log('Data stored successfully', response);
        this.router.navigate(['afterlogin', 'risk', this.val]);
      },
      (error) => {
        console.error('Error storing data', error);
      }
    );
  }





  allFieldsFilled(): boolean {
    return this.rows.every(row =>
      row.name.trim() !== '' &&
      row.designation.trim() !== '' &&
      row.role.trim() !== '' &&
      row.company.trim() !== '' &&
      row.contact_number.trim() !== '' &&
      row.signature.trim() !== '' 
    );
  }

  deleteLastRow() {
    if (this.rows.length > 1) {
      this.rows.pop();
    }
  }

  openDialog(rowIndex: number): void {
    this.currentRowIndex = rowIndex;
    this.isDialogVisible = true;
  }

  signaturePadOptions: Object = { 
    'minWidth': 1.0,   // Minimum width for finer lines
    'maxWidth': 1.5, 
        'canvasWidth': 200,
      'canvasHeight': 100,
      'penColor': 'black' 
    };
  
    drawComplete(rowIndex: number) {
      if (this.signaturePad) {
        this.signature = this.signaturePad.toDataURL();
        console.log('Signature captured for row', rowIndex, ':', this.signature);
      }
    }
  
    // Method to clear the signature
    clearSignature(rowIndex: number) {
      const signaturePad = this.signaturePads.toArray()[rowIndex]; // Get the specific signature pad
      if (signaturePad) {
        signaturePad.clear();
        // Optionally, reset any related signature value if you are tracking it
      }
    }
  
    // Method to capture and save the signature in the correct row
    captureSignature(rowIndex: number) {
      this.saveDataToSession();

      if (this.signaturePad && !this.signaturePad.isEmpty()) {
        this.signature = this.signaturePad.toDataURL(); // Capture signature as base64
        this.rows[rowIndex].signature = this.signature; // Save signature in the corresponding row
        console.log('Captured Signature for row', rowIndex, ':', this.signature);
        window.alert('Signature saved successfully!');
      } else {
        console.log('No signature detected!');
      }
    }
    
    validatePhoneNumber(event: any, index: number): void {
      const input = event.target.value;
    
      // Remove any non-digit characters
      const sanitizedInput = input.replace(/\D/g, '');
    
      // Check if the sanitized input has exactly 10 digits
      if (sanitizedInput.length === 10) {
        // Update the specific row's contact number with the sanitized input
        this.rows[index].contact_number = sanitizedInput;
      } else {
        // If the input is not exactly 10 digits, display an error or handle accordingly
        this.rows[index].contact_number = ''; // Clear the input (optional)
        console.error('Phone number must contain exactly 10 digits');
      }
    }
    
  
    allowOnlyNumbers(event: KeyboardEvent): void {
      // Allow only digits (0-9) and prevent typing anything else
      const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Tab'];
  
      if (!allowedKeys.includes(event.key)) {
        event.preventDefault();
      }
    }

    saveDataToSession() {
      sessionStorage.setItem('rows', JSON.stringify(this.rows));
    }
  
}

  