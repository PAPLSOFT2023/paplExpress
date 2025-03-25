import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-type-master',
  templateUrl: './type-master.component.html',
  styleUrls: ['./type-master.component.scss']
})
export class TypeMasterComponent {
  organizations: any[] = []; // List of organizations
  types: any[] = []; // List of types
  selectedOrganizationId: number | null = null; // Selected organization for the form
  currentTypeName: string = ''; // Holds the type name for add/edit
  currentTypeId: number | null = null; // Holds the type ID for edit
  isPopupVisible: boolean = false; // Controls visibility of the add popup
  isEditPopupVisible: boolean = false; // Controls visibility of the edit popup

  private baseUrl = `${environment.serverUrl}api`; // Base API URL

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadOrganizations();
    this.loadTypes();
  }

  // Load organizations from the server
  loadOrganizations() {
    this.http.get(`${this.baseUrl}/organization`).subscribe((data: any) => {
      this.organizations = data;
    });
  }

  // Load types from the server
  loadTypes() {
    this.http.get(`${this.baseUrl}/type`).subscribe((data: any) => {
      this.types = data;
    });
  }

  // Open the popup for adding a new type
  openPopup(): void {
    this.resetForm();
    this.isPopupVisible = true;
  }

  // Close the popup
  closePopup(): void {
    this.isPopupVisible = false;
    this.isEditPopupVisible = false;
    this.resetForm();
  }

  // Open the popup for editing an existing type
  openEditPopup(type: any): void {
    this.currentTypeId = type.id;
    this.currentTypeName = type.type_name;
    this.selectedOrganizationId = type.organization_id;
    this.isEditPopupVisible = true;
  }

 // Add a new type
addType() {
  const newType = {
    type_name: this.currentTypeName,
    organization_id: this.selectedOrganizationId
  };

  this.http.post(`${this.baseUrl}/type`, newType).subscribe({
    next: () => {
      // Show success alert after adding the type
      alert('Data added successfully!');
      
      // Reload the types and reset the form
      this.loadTypes();
      this.resetForm();
      this.isPopupVisible = false;
    },
    error: (err) => {
      console.error('Error adding type:', err);
      alert('Error adding type. Please try again.');
    }
  });
}


 // Update an existing type
updateType() {
  if (this.currentTypeId !== null) {
    const updatedType = {
      type_name: this.currentTypeName,
      organization_id: this.selectedOrganizationId
    };

    this.http.put(`${this.baseUrl}/type/${this.currentTypeId}`, updatedType).subscribe({
      next: () => {
        // Show success alert after updating the type
        alert('Data updated successfully!');
        
        // Reload the types and reset the form
        this.loadTypes();
        this.resetForm();
        this.isEditPopupVisible = false;
      },
      error: (err) => {
        console.error('Error updating type:', err);
        alert('Error updating type. Please try again.');
      }
    });
  }
}


  // Delete a type by id
  deleteType(typeId: number) {
    if (confirm('Are you sure you want to delete this type?')) {
      this.http.delete(`${this.baseUrl}/type/${typeId}`).subscribe({
        next: () => {
          this.loadTypes(); // Reload the list of types
        },
        error: (err) => {
          console.error('Error deleting type:', err);
        }
      });
    }
  }

  // Reset the form fields
  resetForm(): void {
    this.currentTypeName = '';
    this.selectedOrganizationId = null;
    this.currentTypeId = null;
  }
}



// import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { environment } from 'src/environments/environment';


// @Component({
//   selector: 'app-type-master',
//   templateUrl: './type-master.component.html',
//   styleUrls: ['./type-master.component.scss']
// })
// export class TypeMasterComponent {
//   organizations: any[] = [];
//   types: any[] = [];
//   selectedOrganizationId: number | null = null;
//   typeName: string = '';
//   updateTypeName: string = '';
//   isUpdating: boolean = false;
//   currentTypeId: number | null = null; // Track the current type being updated

//   private baseUrl = ${environment.serverUrl}api;


//   constructor(private http: HttpClient) {}

//   ngOnInit() {
//     this.loadOrganizations();
//     this.loadTypes();
//   }

//   loadOrganizations() {
//     this.http.get(${this.baseUrl}/organization).subscribe((data: any) => {
//       this.organizations = data;
//     });
//   }

//   loadTypes() {
//     this.http.get(${this.baseUrl}/type).subscribe((data: any) => {
//       this.types = data;
//     });
//   }

//   addType() {
//     const newType = {
//       type_name: this.typeName,
//       organization_id: this.selectedOrganizationId
//     };

//     this.http.post(${this.baseUrl}/type, newType).subscribe({
//       next: () => {
//         this.loadTypes();
//         this.typeName = '';
//         this.selectedOrganizationId = null;
//       },
//       error: (err) => console.error('Error adding type:', err)
//     });
//   }

//   deleteType(typeId: number) {
//     this.http.delete(${this.baseUrl}/type/${typeId}).subscribe({
//       next: () => this.loadTypes(),
//       error: (err) => console.error('Error deleting type:', err)
//     });
//   }

//   setUpdateType(type: any) {
//     this.currentTypeId = type.id; // Set the current type ID
//     this.updateTypeName = type.type_name; // Set the type name to be updated
//     this.isUpdating = true; // Show the update form
//   }

//   updateType() {
//     if (this.currentTypeId !== null) {
//       const updatedType = {
//         type_name: this.updateTypeName,
//         organization_id: this.selectedOrganizationId
//       };
//       this.http.put(${this.baseUrl}/type/${this.currentTypeId}, updatedType).subscribe({
//         next: () => {
//           this.loadTypes();
//           this.cancelUpdate(); // Reset the update form
//         },
//         error: (err) => console.error('Error updating type:', err)
//       });
//     }
//   }

//   cancelUpdate() {
//     this.isUpdating = false; // Hide the update form
//     this.currentTypeId = null; // Reset the current type ID
//     this.updateTypeName = ''; // Reset the input field
//   }

// }