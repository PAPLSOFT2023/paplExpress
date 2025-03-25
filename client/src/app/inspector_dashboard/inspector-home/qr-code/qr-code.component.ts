import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient for HTTP requests
import QRCode from 'qrcode'; // Import QRCode library
import html2canvas from 'html2canvas'; // Import html2canvas library
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
// import { Router } from 'express';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent {
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
name:string|null ='';
imageSrc: string = '/assets/Zoom-out.png';
///////end///////
  showModal = false;
  qrCodeImageUrl: string | null = null; // Store the generated QR code image URL
  clientData: any = null; // Variable to store fetched data
  certificates: any[] = []; // Array to store the fetched certificate data
  isLoading = false; // Flag to show loading spinner during data fetch
  
  filteredCertificates: any[] = [];
  searchTerm: string = ''; // Variable for search term

 loading: boolean = true; // Initially true


  constructor(private http: HttpClient , private router : Router) {}

  ngOnInit(): void {
    this.getCertificates(); // Fetch certificates on component load
    this.fetchCertificates();

      ///////manage account//////////
   this.getTotalUnitsCount();
   this.getInfCounts();
   this.getClientAdminData();
   window.addEventListener('click', this.closeDropdown.bind(this));
   this.name = sessionStorage.getItem('UserName') as string;
   /////////end///////////
  }

  generateQRCode(unit_name: string, document_id: string): void {
  if (!unit_name || !document_id) {
    console.error('Unit Name or Document ID is missing.');
    return; // Ensure both unit_name and document_id are available
  }

  this.showModal = true; // Show the modal

  // Construct the URL for the QR code
  const qrCodeUrl = `https://paplexpress.com/pdf_c/${document_id}/${unit_name}`;
  
  this.isLoading = true; // Set loading flag to true

  QRCode.toDataURL(qrCodeUrl, { width: 200 })
    .then((qrCodeDataUrl) => {
      // Create an HTML canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('Canvas context not available.');
        this.isLoading = false;
        return;
      }

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the saffron half
        ctx.fillStyle = '#FF9933'; // Saffron color
        ctx.fillRect(0, 0, canvas.width / 2, canvas.height);

        // Draw the blue half
        ctx.fillStyle = '#0000FF'; // Blue color
        ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height);

        // Set blend mode to overlay the QR code
        ctx.globalCompositeOperation = 'source-atop';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert the final canvas to a data URL
        this.qrCodeImageUrl = canvas.toDataURL();
        console.log('QR code with saffron and blue colors generated successfully.');
        this.isLoading = false;
      };

      img.src = qrCodeDataUrl; // Set the QR code image as the source
    })
    .catch((error: any) => {
      console.error('Error generating QR code:', error);
      this.isLoading = false;
    });
}

 // Watch for changes in the searchTerm and filter certificates
 ngOnChanges(): void {
  this.filterCertificates();
}


filterCertificates(): void {
  const search = this.searchTerm.toLowerCase();
  this.filteredCertificates = this.certificates.filter((certificate) => {
    return (
      certificate.inspector_name?.toLowerCase().includes(search) ||
      certificate.building_name?.toLowerCase().includes(search) ||
      certificate.project_name?.toLowerCase().includes(search) ||
      certificate.unit_name?.toLowerCase().includes(search) ||
      certificate.contract?.toLowerCase().includes(search) ||
      certificate.document_id?.toLowerCase().includes(search)
    );
  });
}
  

  // getCertificates(): void {
  //   this.isLoading = true; // Set loading flag to true when starting the HTTP request

  //   this.http.get<any[]>(`${environment.serverUrl}api/fetch_certificate?inspe`).subscribe(
  //     (response) => {
  //       this.certificates = response; // Store the fetched data in the certificates array
  //       this.filteredCertificates = response; // Initialize filtered list
  //       console.log('Fetched certificates:', this.certificates);
  //       this.isLoading = false; // Set loading flag to false after data is fetched
  //     },
  //     (error) => {
  //       console.error('Error fetching certificates:', error);
  //       this.isLoading = false; // Set loading flag to false if error occurs
  //     }
  //   );
  // }

  getCertificates(): void {
    this.isLoading = true; // Set loading flag to true when starting the HTTP request
    const name = sessionStorage.getItem('UserName');
    console.log('name',name);
    
    // Construct the URL with the inspector_name query parameter
    const url = `${environment.serverUrl}api/fetch_certificate?inspector_name=${name}`;
  
    this.http.get<any[]>(url).subscribe(
      (response) => {
        this.certificates = response; // Store the fetched data in the certificates array
        this.filteredCertificates = response; // Initialize filtered list
        // console.log('Fetched certificates for inspector:', inspector_name, this.certificates);
        this.isLoading = false; // Set loading flag to false after data is fetched
      },
      (error) => {
        console.error('Error fetching certificates:', error);
        this.isLoading = false; // Set loading flag to false if error occurs
      }
    );
  }

  async downloadQRCode(): Promise<void> {
    const qrContainer = document.querySelector('.qr-code-container') as HTMLElement;
    if (!qrContainer) return;
  
    this.isLoading = true; // Set loading flag to true during image generation
  
    try {
      const canvas = await html2canvas(qrContainer); // Capture the container as an image
      const imageData = canvas.toDataURL('image/png');
  
      const link = document.createElement('a');
      link.href = imageData;
      link.download = 'QRCodeWithText.png';
      link.click();
      console.log('QR code with text downloaded successfully.');
  
      this.closeModal(); // Automatically close the modal after download
    } catch (error) {
      console.error('Error downloading QR code with text:', error);
    } finally {
      this.isLoading = false; // Reset loading flag after download
    }
  }
  
  closeModal(): void {
    this.showModal = false; // Hide the modal
    this.qrCodeImageUrl = null; // Clear the QR code image URL
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

fetchCertificates() {
  setTimeout(() => {
    // Simulate data fetching
    this.loading = false; 
  }, 3000); // Mock API delay
}

}
