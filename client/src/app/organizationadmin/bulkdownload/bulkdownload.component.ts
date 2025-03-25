import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-bulkdownload',
  templateUrl: './bulkdownload.component.html',
  styleUrls: ['./bulkdownload.component.scss']
})
export class BulkdownloadComponent {
  unitDetails: any[]|null = []; // Array to store fetched data
  filteredUnitDetails: any[] = []; // Data to display (filtered)

  searchTerm: string = ''; // Add this line
  isLoading: boolean = false;  // Flag to track loading state
  selectedUnit: string = ''; // Selected unit
  selectedOption: string = ''; // Selected radio option
    // Select All functionality
  selectAll: boolean = false;
  selectedUnits: { [key: string]: boolean } = {}; // Object to track selected units
  
  unit_no:any;
  document_id:string='';
  building_name :string='';
  project_name : string='';
  contract_number :string='';
  inspector_name : string = '';
  from_date: string = '';
  ins_end_date:any;
   // Flag to control the visibility of the modal
   isModalOpen = false;

   // Model variables for the checkboxes
   checkbox1 = false;
   checkbox2 = false;
   checkbox3 = false;
   checkbox4 = false;
   checkbox5 = false;
   private baseUrl = environment.serverUrl; // Replace with your actual backend URL


  constructor(private http: HttpClient,private cdr :ChangeDetectorRef) {}

  ngOnInit() {
    this.get_unit_details(); // Fetch inspection data when component loads
  }

  // downloadDocuments(documentId: string): void {
  //     if (documentId) {
  //       const url = `${environment.serverUrl}download-documents/${documentId}`;
  //       window.open(url, '_blank');
  //     } else {
  //       console.error('Invalid document ID:', documentId);
  //     }
    
  // }
  downloadDocuments(documentId: string): void {
    this.isLoading=true;
    if (documentId) {
      const url = `${environment.serverUrl}download-documents/${documentId}`;

      // Use fetch to download file and create a blob
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to download file.');
          }
          return response.blob();
        })
        .then(blob => {
          const blobUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = `documents_${documentId}.zip`;
          this.isLoading=false;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(blobUrl);
        })
        .catch(error => {
          console.error('Error downloading file:', error);
        });
    } else {
      console.error('Invalid document ID:', documentId);
    }
  }

  get_unit_details() {
    this.http.get<any[]>(`${environment.serverUrl}unit-details`).subscribe({
      next: (response) => {
        console.log('Unit details fetched successfully:', response);
        // Add formattedDateRange field to each unit
        this.unitDetails = response.map(unit => ({
          ...unit,
          formattedDateRange: `${new Date(unit.from_date).toLocaleDateString()} - ${new Date(unit.to_date).toLocaleDateString()}`,
        }));
        this.filteredUnitDetails = [...this.unitDetails]; // Initially set filtered data
      },
      error: (error) => {
        console.error('Error fetching unit-details data:', error);
      },
    });
  }
  
  filterUnits(searchTerm: string) {
    if (this.unitDetails) {  // Check if unitDetails is not null
      this.filteredUnitDetails = this.unitDetails.filter(unit =>
        unit.unit_no.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      this.filteredUnitDetails = []; // Or handle the case when unitDetails is null
    }
  }
  
  
  
 
 


  

  generateExcel(selected_units: any, document_id: string, contract_number: string, building_name: string, project_name: string,inspector_name: string): void {
    // Set loading to true when download starts
    this.isLoading = true;
  
    // Convert the selected_units object to an array of keys
    const selectedUnitsArray = Object.keys(selected_units);
  
    console.log('Selected units array:', selectedUnitsArray);
  
    // Construct the query parameters
    const params = new HttpParams()
      .set('document_id', document_id)
      .set('selected_units', JSON.stringify(selectedUnitsArray))  // Send the array as a string
      .set('contract_number', this.contract_number)  // Add contract number
      .set('building_name', building_name)  // Add building name
      .set('project_name', project_name)  // Add project name
      .set('inspector_name', inspector_name)  // Add project name
      .set('unit no', this.unit_no)  // Add project name
      .set('ins_end_date', this.ins_end_date)  // Add date_of_inspection
     

  
    // Make the GET request to download the file
    this.http.get(`${environment.serverUrl}download-excel`, { params, responseType: 'blob' })
      .subscribe({
        next: (response) => {
          const blob = new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
  
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'excel_images.xlsx'; // Set the download filename
          link.click(); // Simulate a click to trigger the download
  
          // Now send the file to the backend to store it
          const formData = new FormData();
          formData.append('file', blob, 'excel_images.xlsx');
          formData.append('document_id', document_id); // Add document ID for reference
          formData.append('selected_units', JSON.stringify(selectedUnitsArray)); // Send selected units
          formData.append('contract_number', contract_number); // Send contract number
          formData.append('building_name', building_name); // Send building name
          formData.append('project_name', project_name);
          formData.append('inspector_name', inspector_name);
          formData.append('unit_no', this.unit_no);
          // formData.append('ins_end_date', this.ins_end_date);
          const formattedDate = new Date(this.ins_end_date).toISOString();
          formData.append('ins_end_date', formattedDate);


          

          console.log("exceldata",contract_number);
          console.log("exceldata",building_name);
          console.log('date',this.ins_end_date);
          
  
          this.http.post(`${environment.serverUrl}report-excel`, formData).subscribe({
            next: (uploadResponse) => {
              console.log('File uploaded successfully to database:', uploadResponse);
              this.isLoading = false;
              alert('Data stored in the database successfully.');
              // Refresh the page after successful upload
              window.location.reload();
            },
            error: (error: HttpErrorResponse) => {
              console.error('Error uploading file to database:', error);
              this.isLoading = false;
              alert('Error uploading file to database.');
            }
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error downloading file:', error);
          this.isLoading = false;
        }
      });
  }
  
  

  
  

    // Toggle the "Select All" checkbox
    toggleSelectAll() {
      if (this.selectAll) {
        this.unit_no.forEach((unit: string) => {
          this.selectedUnits[unit] = true; // Mark all units as selected
        });
      } else {
        this.unit_no.forEach((unit: string) => {
          this.selectedUnits[unit] = false; // Unselect all units
        });
      }
    }
  


    onIconClick(
      unit_no: any,
      document_id: string,
      contract_number: string,
      building_name: string,
      project_name: string,
      inspector_name: string,
      ins_end_date:any
    ) {
      this.unit_no = JSON.parse(unit_no);
      console.log('unit no', unit_no);
      this.document_id = document_id;
      this.contract_number = contract_number;
      this.building_name = building_name;
      this.project_name = project_name;
      this.inspector_name = inspector_name;
      this.ins_end_date=ins_end_date;

  
      // Check if selectedUnits is initialized and contains data
      if (Object.keys(this.selectedUnits).length > 0) {
        const selectedUnitsStringified = JSON.stringify(this.selectedUnits);
        console.log('Selected Units Stringified:', selectedUnitsStringified);
      } else {
        console.log('selectedUnits is not defined or is empty.');
      }
  
      this.isModalOpen = true;
    }
  



  // Function to handle the checkbox change logic
  onCheckboxChange(selectedUnit: string) {
    // Only allow one unit to be selected at a time
    this.selectedUnit = selectedUnit;
    console.log('Selected Unit:', this.selectedUnit);
  }

  closeModal() {
    this.isModalOpen = false;
   
    this.cdr.detectChanges(); // Manually trigger change detection
  }
  

  submitSelection(selected_units: any, document_id: string) {
    // Gather all selected units (those where the value is true)
    const selectedUnits = Object.keys(this.selectedUnits).filter(unit => this.selectedUnits[unit]);
    
    console.log('Selected units:', selectedUnits);
  
    // Close the modal immediately after gathering selected units
    this.closeModal(); // Close the modal first
  
    // Now trigger the file download
    this.downloadFile(selectedUnits);
  }
  
  

// Example function for downloading a file (or any other action)
downloadFile(selectedUnits: string[]) {
  // Example: Generate a string based on selected units for download
  const data = `Selected Units: ${selectedUnits.join(', ')}`;
  const blob = new Blob([data], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'selected_units.txt'; // File name for download
  a.click();
  window.URL.revokeObjectURL(url); // Revoke the object URL after download
  this.closeModal(); // Close the modal first
}

}
