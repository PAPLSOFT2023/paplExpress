
import { Component,ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { inspector } from 'src/app/sidenav/nav-data';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss']
})
export class ApprovalComponent {
  ccEmails: string[] = [];  // Array to hold default CC email addresses

  inspector_list:string[]=[];
  name:string|null ='';
  isLoading = true
  unitDetails: any;
    // Your existing variables
    searchTerm: string = '';  // This will hold the search term input by the user
   
  rejections: { itemId: string, isTextBoxVisible: boolean, reason: string }[] = [];
  isRejectModalVisible: boolean = false;
  isApproveModalVisible:boolean = false;
  isCommandModalVisible: boolean = false;
  commandText: string = '';
  document_id:string='';
  unit_name:string='';

  constructor(private router: Router,private http: HttpClient,private cdr:ChangeDetectorRef) {}
  ngOnInit() {
    this.fetchCCEmails();

    this.loadUnitDetails();
    console.log('pending',this.unitDetails);
    this.name = sessionStorage.getItem('UserName') as string;
    
    
  }
  fetchCCEmails(): void {
    this.http.get<any>(`${environment.serverUrl}api/get-default-cc`)
      .subscribe(
        response => {
          if (response.success) {
            this.ccEmails = response.ccEmails;  // Store the fetched CC emails
            console.log('Fetched CC emails:', this.ccEmails);
          } else {
            console.error('Error fetching CC emails:', response.error);
          }
        },
        error => {
          console.error('Error fetching CC emails:', error);
        }
      );
  }
  loadUnitDetails() {
    const value = sessionStorage.getItem('UserName') as string;
    console.log('inspector name is',value);
    
    const inspector = `${environment.serverUrl}api/approval`;
        this.http.get<any[]>(inspector) // Replace with your server endpoint
      .subscribe(data => {

        this.unitDetails = data;
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges(); // Trigger change detection manually if needed
        }, 1000);
        console.log('unit details',this.unitDetails);
        
      });
  }
  proceed(document_id:string,contract_number:string,building_name:string){
    sessionStorage.setItem('contract',contract_number);
    sessionStorage.setItem('building_name',building_name);
    
    this.router.navigate(['afterlogin', 'upload_report',document_id]);

    

  }
  displayPDF(document_id:string,unit_name:string,id:number){
    if (id) {
      // this.router.navigate(['pdf_r', document_id,unit_name]).then(
      //   () => console.log('Navigation successful'),
      //   (error) => console.error('Navigation failed:', error)
      // );
      const url = `${environment.serverUrl}api/reportapprovalpdf/${id}`;
    window.open(url, '_blank');
    } else {
      console.error('Invalid unit value:', document_id);
    }
  }
  

  toggleTextBox(itemId: string) {
    const existingRejection = this.rejections.find(rejection => rejection.itemId === itemId);

    if (existingRejection) {
      existingRejection.isTextBoxVisible = !existingRejection.isTextBoxVisible;
    } else {
      this.rejections.push({ itemId, isTextBoxVisible: true, reason: '' });
    }
  }

  // submitReason(itemId: string,documentId:string,unitName:string) {
  //   const currentRejection = this.rejections.find(rejection => rejection.itemId === itemId);
    

  //   if (currentRejection) {
  //     console.log('Reason submitted for item', itemId, ':', currentRejection.reason);
  //     // currentRejection.reason = '';
  //     currentRejection.isTextBoxVisible = false;
  //   console.log('rejection reason is',this.rejections);

  //   }
  // }

  // submitReason(): void {
  //   const currentRejection = this.rejections.find(rejection => rejection.itemId === i);

  //   if (currentRejection) {
  //     // console.log('Reason submitted for item', itemId, ':', currentRejection.reason);
  //     currentRejection.isTextBoxVisible = false;

  //     // Send HTTP request to update reject_reason in SQL table
  //     this.http.put<any>(`${environment.serverUrl}api/update_reject_reason`, {
  //              documentId:this.document_id,
  //        unitName:this.unit_name,
  //       rejectReason: this.commandText
  //     }).subscribe(
  //       response => {
  //         console.log('Report approved successfully:', response);
  //         alert('Rejected successfully');
  //     window.location.reload(); // Refresh the current page
  //         console.log('Reject reason updated successfully:', response);
  //         // Handle success if needed
  //       },
  //       error => {
  //         console.error('Error updating reject reason:', error);
  //         // Handle error if needed
  //       }
  //     );
  //   }
  // }
  // approve(documentId: string, unitName: string,inspector_array:string): void {
  //   console.log('document id is', documentId);
  //   console.log('unit name is', unitName);
  //   const inspector_list=[inspector_array];
  //   const inspectorDetails = inspector_list.map((entry: string) => {
  //     const [name, code] = entry.split(" - ");
  //     return { name, code };
  //   });

  //   this.http.put<any>(`${environment.serverUrl}api/approve_report`, { documentId, unitName })      .subscribe(
  //       response => {
  //         console.log('Report approved successfully:', response);
  //         //loader
         
  //         alert('Report approved successfully');
  //         setTimeout(() => {
  //           this.isLoading = false;
  //           this.cdr.detectChanges(); // Trigger change detection manually if needed
  //         }, 1000);
  //     window.location.reload(); // Refresh the current page
  //         // Handle success if needed
  //       },
  //       error => {
  //         console.error('Error approving report:', error);
  //         // Handle error if needed
  //       }
  //     );
  // }
  approve(documentId: string, unitName: string, inspector_array: string): void {
    const userConfirmed = confirm('Are you sure you want to approve this report?');
    this.isLoading=true;
  
    if (!userConfirmed) {
      // If the user cancels, exit the function
      return;
    }
    console.log('document id is', documentId);
    console.log('unit name is', unitName);
  
    // Step 1: Prepare inspector details
    this.inspector_list = [inspector_array];
    const inspectorDetails = this.inspector_list.map((entry: string) => {
      const [name, code] = entry.split(" - ");
      return { name, code };
    });
  
    // Step 2: Fetch emails for inspectors
    this.http.post<any>(`${environment.serverUrl}api/get-email-addresses-inspectors`, inspectorDetails)
      .subscribe(
        (emailResponse) => {
          console.log('Inspector emails fetched:', emailResponse);
  
          // Extract email addresses
          const emailAddresses = emailResponse.map((inspector: { email: string }) => inspector.email);
  
          // Step 3: Approve the report
          this.http.put<any>(`${environment.serverUrl}api/approve_report`, { documentId, unitName })
            .subscribe(
              response => {
                console.log('Report approved successfully:', response);
                
                alert('Report approved successfully');
  
                // Step 4: Send email notifications
                this.http.post<any>(`${environment.serverUrl}api/send-email-notification`, {
                  to: emailAddresses,
                  subject: 'Inspection Report Approved',
                  message: `The inspection report for unit ${unitName} has been approved. Please review the details.`,
                  cc: this.ccEmails // Optionally, add CC addresses here if needed
                }).subscribe(
                  () => alert('Email notifications sent successfully'),
                  (emailError) => console.error('Error sending email notifications:', emailError)
                );
  
                // Optional: Handle post-approval actions
                setTimeout(() => {
                  this.isLoading = false;
                  this.cdr.detectChanges();
                }, 1000);
                window.location.reload();
              },
              error => {
                console.error('Error approving report:', error);
              }
            );
        },
        (error) => {
          console.error('Error fetching inspector emails:', error);
        }
      );
  }
  


  // Function to open reject modal
  openRejectModal(document_id:string,unit_name:string,inspector_array:string) {
    this.isRejectModalVisible = true;
    this.document_id=document_id;
    this.unit_name=unit_name;
    this.inspector_list = [inspector_array];
  }

  // Function to close reject modal
  closeRejectModal() {
    this.isRejectModalVisible = false;
  }

  // Function to confirm reject
  confirmReject() {
    this.closeRejectModal();  // Close the reject modal
    this.openCommandModal();  // Open the command modal
  }

  // Function to open command modal
  openCommandModal() {
    this.isCommandModalVisible = true;
  }

  // Function to close command modal
  closeCommandModal() {
    this.isCommandModalVisible = false;
  }

  // Function to submit the comment
//   submitCommand() {
//     this.http.put<any>(`${environment.serverUrl}api/update_reject_reason`, {
//       documentId:this.document_id,
// unitName:this.unit_name,
// rejectReason: this.commandText
// }).subscribe(
// response => {
//  console.log('Report approved successfully:', response);
//  //loader
//  setTimeout(() => {
//   this.isLoading = false;
//   this.cdr.detectChanges(); // Trigger change detection manually if needed
//        }, 1000);
//  alert('Rejected successfully');

// window.location.reload(); // Refresh the current page
//  console.log('Reject reason updated successfully:', response);
//  // Handle success if needed
// },
// error => {
//  console.error('Error updating reject reason:', error);
//  // Handle error if needed
// }
// );

//     console.log('Command submitted:', this.commandText);
//     this.closeCommandModal(); // Close the modal after submitting

//   }

  // submitCommand(): void {
  //   this.isLoading=true;
  //   console.log('Command submitted:', this.commandText);
  
  //   // Step 1: Prepare inspector details
    
  //   const inspectorDetails = this.inspector_list.map((entry: string) => {
  //     const [name, code] = entry.split(" - ");
  //     return { name, code };
  //   });
  
  //   // Step 2: Fetch emails for inspectors
  //   this.http.post<any>(`${environment.serverUrl}api/get-email-addresses-inspectors`, inspectorDetails)
  //     .subscribe(
  //       (emailResponse) => {
  //         console.log('Inspector emails fetched:', emailResponse);
  
  //         // Extract email addresses
  //         const emailAddresses = emailResponse.map((inspector: { email: string }) => inspector.email);
  
  //         // Step 3: Update reject reason
  //         this.http.put<any>(`${environment.serverUrl}api/update_reject_reason`, {
  //           documentId: this.document_id,
  //           unitName: this.unit_name,
  //           rejectReason: this.commandText
  //         }).subscribe(
  //           response => {
  //             console.log('Reject reason updated successfully:', response);
  //             alert('Rejected successfully');









  
  //             // Step 4: Send email notifications
  //             this.http.post<any>(`${environment.serverUrl}api/send-email-notification`, {
  //               to: emailAddresses,
  //               subject: 'Inspection Report Rejected',
  //               message: `The inspection report for unit ${this.unit_name} has been rejected. Reason: ${this.commandText}. Please review the details.`,
  //               cc: this.ccEmails // Optionally, add CC addresses here if needed
  //             }).subscribe(
  //               () => alert('Email notifications sent successfully'),
  //               (emailError) => console.error('Error sending email notifications:', emailError)
  //             );











  
  //             // Optional: Handle post-rejection actions
  //             setTimeout(() => {
  //               this.isLoading = false;
  //               this.cdr.detectChanges();
  //             }, 1000);
  //             window.location.reload();
  //           },
  //           error => {
  //             console.error('Error updating reject reason:', error);
  //           }
  //         );
  //       },
  //       (error) => {
  //         console.error('Error fetching inspector emails:', error);
  //       }
  //     );
  
  //   // Close the modal after submitting
  //   this.closeCommandModal();
  // }
  

  submitCommand(): void {
    this.isLoading = true;
    console.log('Command submitted:', this.commandText);
  
    // Step 1: Prepare inspector details
    const inspectorDetails = this.inspector_list.map((entry: string) => {
      const [name, code] = entry.split(" - ");
      return { name, code };
    });
  
    // Step 2: Fetch emails for inspectors
    this.http.post<any>(`${environment.serverUrl}api/get-email-addresses-inspectors`, inspectorDetails)
      .subscribe(
        (emailResponse) => {
          console.log('Inspector emails fetched:', emailResponse);
  
          // Extract email addresses
          const emailAddresses = emailResponse.map((inspector: { email: string }) => inspector.email);
  
          // Step 3: Update reject reason (PUT request)
          this.http.put<any>(`${environment.serverUrl}api/update_reject_reason`, {
            documentId: this.document_id,
            unitName: this.unit_name,
            rejectReason: this.commandText
          }).subscribe(
            response => {
              this.storeRejectReason();

              console.log('Reject reason updated successfully:', response);
              alert('Reject reason updated successfully');
  
              // // Step 4: Store reject reason (POST request)
              // this.http.post<any>(`${environment.serverUrl}api/reject_report_reason`, {
              //   documentId: this.document_id,
              //   unitName: this.unit_name,
              //   rejectReason: this.commandText,
              //   // inspector_name: this.inspector_name // Ensure this value is available in your component
              // }).subscribe(
              //   response => {
              //     console.log('Reject reason stored successfully:', response);
  
                  // Step 5: Send email notifications
                  this.http.post<any>(`${environment.serverUrl}api/send-email-notification`, {
                    to: emailAddresses,
                    subject: 'Inspection Report Rejected',
                    message: `The inspection report for unit ${this.unit_name} has been rejected. Reason: ${this.commandText}. Please review the details.`,
                    cc: this.ccEmails // Optionally, add CC addresses here if needed
                  }).subscribe(
                    () => alert('Email notifications sent successfully'),
                    (emailError) => console.error('Error sending email notifications:', emailError)
                  );
  
                  // Optional: Handle post-rejection actions
                  setTimeout(() => {
                    this.isLoading = false;
                    this.cdr.detectChanges();
                  }, 1000);
  
                  window.location.reload();
                },
                error => {
                  console.error('Error storing reject reason:', error);
                  alert('Error storing reject reason');
                }
              );
            },
        //     error => {
        //       console.error('Error updating reject reason:', error);
        //       alert('Error updating reject reason');
        //     }
        //   );
        // },
        (error) => {
          console.error('Error fetching inspector emails:', error);
          alert('Error fetching inspector emails');
        }
      );
  
    // Close the modal after submitting
    this.closeCommandModal();
  }
  

  // storeRejectReason(): Promise<any> {
  //   return new Promise((resolve, reject) => {

      

  //     const payload = {
  //       documentId: this.document_id,
  //       unitName: this.unit_name,
  //       rejectReason: this.commandText
       
            
  //     };
  
  //     console.log('Sending reject reason:', payload); // Log the data being sent
  
  //     this.http.post<any>(`${environment.serverUrl}api/reject_report_reason`, payload)
  //       .subscribe(
  //         response => {
  //           console.log('Reject reason stored successfully:', response);
  //           resolve(response);
  //         },
  //         error => {
  //           console.error('Error storing reject reason:', error);
  //           reject('Error storing reject reason');
  //         }
  //       );
  //   });
  // }
  
  storeRejectReason(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Find the unit details based on documentId
      const unitDetail = this.unitDetails.find((unit: { 
        id: number; 
        document_id: string; 
        unit_name: string; 
        contract: string; 
        building_name: string; 
        project_name: string; 
        inspector_name: string;
        report_id:string;

      }) => unit.document_id === this.document_id);
        
      if (!unitDetail) {
        console.error('No matching unit detail found for documentId:', this.document_id);
        reject('Unit details not found');
        return;
      }
  
      // Extract relevant fields
      const contract = unitDetail.contract;
      const project_name = unitDetail.project_name;
      const building_name = unitDetail.building_name;
      const inspector_name = unitDetail.inspector_name;
      const report_id = unitDetail.report_id;

      
  
      // Log extracted values
      console.log('Extracted contract:', contract);
      console.log('Extracted project name:', project_name);
      console.log('Extracted building name:', building_name);
      console.log('Extracted inspector name:', inspector_name);
  
      // Create payload with additional extracted fields
      const payload = {
        documentId: this.document_id,
        unitName: this.unit_name,
        rejectReason: this.commandText,
        contractNumber: contract,
        projectName: project_name,
        buildingName: building_name,
        inspectorName: inspector_name,
        reportid:report_id
      };
  
      console.log('Sending reject reason:', payload); // Log the data being sent
  
      this.http.post<any>(`${environment.serverUrl}api/reject_report_reason`, payload)
        .subscribe(
          response => {
            console.log('Reject reason stored successfully:', response);
            resolve(response);
          },
          error => {
            console.error('Error storing reject reason:', error);
            reject('Error storing reject reason');
          }
        );
    });
  }
  





  get filteredUnitDetails() {
    return this.unitDetails.filter((unitDetail: { id: number; document_id: string; unit_name: string,contract:string,building_name:string,project_name:string,inspector_name:string }) => {
      // You can modify this logic based on which fields you want to search
      return unitDetail.contract.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
             unitDetail.document_id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
             unitDetail.building_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
             unitDetail.unit_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
             unitDetail.project_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
             unitDetail.id ||

             unitDetail.inspector_name.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }
}


