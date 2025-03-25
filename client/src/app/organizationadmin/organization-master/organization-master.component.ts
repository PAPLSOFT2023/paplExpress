import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-organization-master',
  templateUrl: './organization-master.component.html',
  styleUrls: ['./organization-master.component.scss']
})
export class OrganizationMasterComponent implements OnInit {
    updateOrganizationName: string = '';

  organizations: any[] = [];
  organizationName: string = '';
  currentOrgName: string = '';  // Used for the edit form
  selectedOrganizationId: number | null = null;  // Selected organization ID for edit
  isUpdating: boolean = false;
  currentOrgId: number | null = null; // To hold the current organization ID being updated
  isPopupVisible: boolean = false; // Controls visibility of the add popup
  isEditPopupVisible: boolean = false; // Controls visibility of the edit popup

  private baseUrl = `${environment.serverUrl}api`; // Base API URL

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadOrganizations();
  }

  // Load organizations from the server
  loadOrganizations() {
    this.http.get(`${this.baseUrl}/organization`).subscribe((data: any) => {
      this.organizations = data;
    });
  }

  // Open the popup for adding a new organization
  openPopup(): void {
    this.resetForm();
    this.isPopupVisible = true;
  }

// Set organization name when editing an organization
openEditPopup(org: any) {
  this.isEditPopupVisible = true; // Show the edit popup
  this.isPopupVisible = true; // Show the main popup (if applicable)
  
  // Assign the selected organization's name to the input field
  this.organizationName = org.organization_name;
  this.currentOrgId = org.id; // Set the organization ID
}

// Reset values when closing the popup
closePopup() {
  this.isEditPopupVisible = false;
  this.isPopupVisible = false;
  this.organizationName = ''; // Reset the organization name
  this.currentOrgId = null;  // Reset the current organization ID
}
  

addOrganization() {
  const newOrg = { organization_name: this.organizationName };

  this.http.post(`${this.baseUrl}/organization`, newOrg).subscribe({
    next: () => {
      this.loadOrganizations();
      this.closePopup(); // Close the popup after adding
    },
    error: (err) => {
      console.error('Error adding organization:', err);
      alert('Error adding organization.');
    }
  });
}

// Update an existing organization
updateOrganization() {
  if (this.currentOrgId !== null) {
    const updatedOrg = { organization_name: this.organizationName };

    this.http.put(`${this.baseUrl}/organization/${this.currentOrgId}`, updatedOrg).subscribe({
      next: () => {
        this.loadOrganizations();
        this.closePopup(); // Close the popup after updating
      },
      error: (err) => {
        console.error('Error updating organization:', err);
        alert('Error updating organization.');
      }
    });
  }
}

  // updateType(orgId: number, orgName: string) {
  //   console.log('Update called for Organization ID:', orgId, 'with Name:', orgName);
  
  //   if (orgId !== null) {
  //     const updatedOrg = {
  //       organization_name: orgName
  //     };
  
  //     console.log('Sending PUT request with data:', updatedOrg);
  
  //     // Send the PUT request to update the organization
  //     this.http.put(`${this.baseUrl}/organization/${orgId}`, updatedOrg).subscribe({
  //       next: () => {
  //         console.log('Organization updated successfully.');
  //         alert('Data updated successfully!');
  //         this.loadOrganizations(); // Reload organizations list
  //         this.resetForm(); // Reset the form
  //         this.isEditPopupVisible = false; // Close the edit popup
  //         this.isPopupVisible = false; // Hide the main popup
  //       },
  //       error: (err) => {
  //         console.error('Error updating organization:', err);
  //         alert('Error updating organization. Please try again.');
  //       }
  //     });
  //   } else {
  //     console.log('Organization ID is null, cannot update');
  //   }
  // }
  
  // updateOrganization() {
  //   if (this.currentOrgId !== null) {
  //     const updatedOrg = { organization_name: this.currentOrgName };
  
  //     // Send the PUT request to update the organization
  //     this.http.put(`${this.baseUrl}/organization/${this.currentOrgId}`, updatedOrg).subscribe({
  //       next: () => {
  //         // Refresh the organizations list
  //         this.loadOrganizations();
          
  //         // Reset the form and close the popup
  //         this.cancelUpdate(); // Reset the update form
  //         this.isEditPopupVisible = false; // Hide the edit popup after success
  //         this.isPopupVisible = false; // Optionally hide the main popup as well
  //         alert('Organization updated successfully!'); // Optionally show a success alert
  //       },
  //       error: (err) => {
  //         console.error('Error updating organization:', err);
  //         alert('Error updating organization. Please try again.');
  //       }
  //     });
  //   }
  // }
  

  cancelUpdate() {
    this.isUpdating = false; // Hide the update form
    this.currentOrgId = null; // Reset the current organization ID
    this.updateOrganizationName = ''; // Reset the input field
  }



  // Delete an organization
  deleteOrganization(orgId: number) {
    this.http.delete(`${this.baseUrl}/organization/${orgId}`).subscribe({
      next: () => {
        alert('Organization deleted successfully!');
        this.loadOrganizations();
      },
      error: (err) => {
        console.error('Error deleting organization:', err);
        alert('Error deleting organization. Please try again.');
      }
    });
  }
  
  // deleteOrganization(orgId: number) {
  //   this.http.delete(`${this.baseUrl}/organization/${orgId}`).subscribe({
  //     next: () => this.loadOrganizations(),
  //     error: (err) => console.error('Error deleting organization:', err)
  //   });
  // }

  // Getter for ngModel binding
  get currentOrganizationName() {
    return this.isEditPopupVisible ? this.currentOrgName : this.organizationName;
  }
    setUpdateOrganization(org: any) {
    this.currentOrgId = org.id; // Set the current organization ID
    this.updateOrganizationName = org.organization_name; // Set the organization name to be updated
    this.isUpdating = true; // Show the update form
  }

  set currentOrganizationName(value: string) {
    if (this.isEditPopupVisible) {
      this.currentOrgName = value;
    } else {
      this.organizationName = value;
    }
  }

  // Reset the form fields
  resetForm(): void {
    this.organizationName = '';
    this.currentOrgName = '';
    this.selectedOrganizationId = null;
    this.currentOrgId = null;
  }
}


  
  // organizations: any[] = [];
  // organizationName: string = '';
  // updateOrganizationName: string = '';
  // isUpdating: boolean = false;
  // currentOrgId: number | null = null; // To hold the current organization ID being updated
  // private baseUrl = `${environment.serverUrl}api`;

  // constructor(private http: HttpClient) {}

  // ngOnInit() {
  //   this.loadOrganizations();
  // }

  // loadOrganizations() {
  //   this.http.get(`${this.baseUrl}/organization`).subscribe((data: any) => {
  //     this.organizations = data;
  //     console.log('organizations', this.organizations);
  //   });
  // }

  // addOrganization() {
  //   const newOrg = { organization_name: this.organizationName };
  //   this.http.post(`${this.baseUrl}/organization`, newOrg).subscribe({
  //     next: () => {
  //       this.loadOrganizations();
  //       this.organizationName = '';
  //     },
  //     error: (err) => console.error('Error adding organization:', err)
  //   });
  // }

  // setUpdateOrganization(org: any) {
  //   this.currentOrgId = org.id; // Set the current organization ID
  //   this.updateOrganizationName = org.organization_name; // Set the organization name to be updated
  //   this.isUpdating = true; // Show the update form
  // }

  // updateOrganization() {
  //   if (this.currentOrgId !== null) {
  //     const updatedOrg = { organization_name: this.updateOrganizationName };
  //     this.http.put(`${this.baseUrl}/organization/${this.currentOrgId}`, updatedOrg).subscribe({
  //       next: () => {
  //         this.loadOrganizations();
  //         this.cancelUpdate(); // Reset the update form
  //       },
  //       error: (err) => console.error('Error updating organization:', err)
  //     });
  //   }
  // }



  // deleteOrganization(orgId: number) {
  //   this.http.delete(`${this.baseUrl}/organization/${orgId}`).subscribe({
  //     next: () => this.loadOrganizations(),
  //     error: (err) => console.error('Error deleting organization:', err)
  //   });
  // }


