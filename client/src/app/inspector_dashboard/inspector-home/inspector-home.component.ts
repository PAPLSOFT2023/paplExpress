import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { ApicallService } from 'src/app/apicall.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute,Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

// import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
// import { DatePipe } from '@angular/common';

import { response } from 'express';
import * as fs from 'fs';

import { trigger, state, style, transition, animate } from '@angular/animations';
interface InspectorInfo {
  units: number;
  fromDate: string;
  toDate: string;
}


@Component({
  selector: 'app-inspector-home',
  templateUrl: './inspector-home.component.html',
  styleUrls: ['./inspector-home.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(500)), // Adjust the duration as needed
    ])
  ]
})
export class InspectorHomeComponent implements OnInit {
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

[x: string]: any;
  name: string = '';
  recordCount: number = 0;
  records:any[]=[];
  scheduleBool:boolean=false;
  showSendMailPopup = false; // Track the state of the popup
  // Your other variables and methods
  isLoading = true;
  Error: string = "";
  open_popUp=false;
  isGetInfDataEnabled = false;
  isGetInspectorDataEnabled = false;
  isGetMailSetupEnabled = false;
  isSendingMailEnabled = false;
  isMailReportEnabled = false;
  request : any ;
 

  // location:string='/assets/logo1.png'
  parseInspectorArray(request: any): InspectorInfo {
    let inspectorInfo: InspectorInfo = {
      units: 0,
      fromDate: '',
      toDate: ''
    };
  
    const nameToFind = this.name; // Replace this with the name you want to find
  
    if (request && request.inspector_array) {
      const inspectorArray = JSON.parse(request.inspector_array);
  
      // Iterate through the inspector_array
      for (const inspector of inspectorArray) {
        if (inspector.name === nameToFind && inspector.units) {
          console.log('insp name array',inspector.name);
          
          inspectorInfo.units = inspector.units;
          inspectorInfo.fromDate = inspector.fromDate;
          inspectorInfo.toDate = inspector.toDate;
          break; // Break the loop once the desired inspector is found
        }
      }
    }
  
    return inspectorInfo;
  }
  
  getFromDate(request: any): string {
    const inspectorInfo = this.parseInspectorArray(request);
    return inspectorInfo.fromDate;
  }
  
  getToDate(request: any): string {
    const inspectorInfo = this.parseInspectorArray(request);
    return inspectorInfo.toDate;
  }

  getUnits(request:any) {
    const inspectorInfo = this.parseInspectorArray(request);
    return inspectorInfo.units;
  }
  

  constructor(private datePipe:DatePipe,private apicallservice: ApicallService, private http: HttpClient,private router:Router,private route: ActivatedRoute,private cdr: ChangeDetectorRef) {}

  ngOnInit() {
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
    
    
    
  }

  navigateHome(): void {
    this.router.navigate(['../homepage_ins'], { relativeTo: this.route }); // Replace '/home' with your actual home route
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



  closeDialog(){
    this.open_popUp=!this.open_popUp;
  }

  Send_Mail_Client(id:string){
    this.open_popUp=!this.open_popUp;
    // console.log(id);
    // const sender=sessionStorage.getItem("Email") as string

    
    if(id){
      this.apicallservice.getinfdata_forMail(id).subscribe(
        (response: any) => {
        if (response && response.length !== 0) {

         this. isGetInfDataEnabled = true;
        //  const scheduleFrom: Date = new Date(response[0].schedule_from);
        //  const scheduleTo: Date = new Date(response[0].schedule_to);

        //  // Calculate the difference in milliseconds
        //  const differenceInMs: number = Math.abs(scheduleTo.getTime() - scheduleFrom.getTime());

        //  // Convert milliseconds to days
        //  const differenceInDays: number = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));

        
  

         
          console.log("INF====>",response,"\n")
         this.apicallservice.getInspectorData(response[0].inspector_list).subscribe((inspector_data:any)=>{
          if(inspector_data)
          {


          
               this.isGetInspectorDataEnabled = true;
  
            console.log("Inspector Data====>",inspector_data,"\n")
            const inspvalue = inspector_data.map((jsonObject: Record<string, any>) =>
            Object.entries(jsonObject).flat()
          );

          const getEmailFromData = (dataArray: any[]): string | undefined => {
            const emailIndex = dataArray.indexOf('email_id');
            if (emailIndex !== -1 && emailIndex < dataArray.length - 1) {
              return dataArray[emailIndex + 1];
            }
            return undefined;
          };
          
          const emailArray: string[] = [];
          
          for (const personData of inspvalue) {
            // Check if personData is an array before processing
            if (Array.isArray(personData)) {
              const email = getEmailFromData(personData);
              if (email) {
                emailArray.push(email);
              }
            }
          }
          this.http.get(this.apicallservice.apiURL+"getdefaultcc").subscribe((ccarray:any)=>{
            if(ccarray!=null)
              {
                for(let i of ccarray){
                  emailArray.push(i.mailid)
  
                }
                this.apicallservice.getMail_Setup("papl").subscribe((sender_Details:any)=>{
                  if(sender_Details)
                  {
                    
                    console.log("sender Data====>",sender_Details,"\n")
    
                   
                   this.isGetMailSetupEnabled = true;
    
      
                        const inspector_Data = inspector_data.map((jsonObject: Record<string, any>) =>
                        Object.entries(jsonObject).flat()
                      );
    
                        console.log("88", inspector_Data);
    
                        this.isSendingMailEnabled=true;
                       
                
                        this.apicallservice.send_mail_to_client(
                          response[0].id,
                          // response[0].master_customer_name,
                          response[0].customer_contact_name,
                          response[0].total_units_schedule,
                          response[0].project_name,
                          response[0].location,
                          response[0].contract_number,
                          response[0].customer_workorder_name+","+response[0].customer_workorder_date,
                          response[0].schedule_from,
                          response[0].schedule_to,
                          // response[0].no_of_mandays_as_per_work_order,
                          // differenceInDays,
                          // differenceInDays,
                          response[0].difference_in_days,
                          response[0].type_of_inspection,
                          response[0].inspection_time_ins,
                          response[0].customer_contact_mailid,
                          emailArray,
                          inspector_Data,
                          sender_Details[0].App_password,
                          sender_Details[0].Email,
                          response[0].inspector_list
                          ).subscribe((mailStatus: any) => {
                            if (mailStatus && mailStatus.success) {
                              console.log("Email sent successfully:", mailStatus.success,response[0].id);
                              this.isMailReportEnabled = true;
    
                              this.apicallservice.set_send_Mail_status(response[0].id).subscribe(
                                (response) => {
                                  setTimeout(() => {
                                    this.open_popUp=!this.open_popUp;
                                  }, 1500);
                                },
                                (error) => {
                                  setTimeout(() => {
                                    this.open_popUp=!this.open_popUp;
                                  }, 1500);
                                }
                              );
                              
    
                              
    
                              
                              
                            }
                             else {
                              console.log("Failed to send email:", mailStatus.error);
                              // Handle the failure case as needed
                              this.Error="Failed to send mail";
                              setTimeout(() => {
                                this.open_popUp=!this.open_popUp;
                              }, 2000);
                            }
                          },
                          (error: any) => {
                            console.error("The email was not sent correctly.");
                            // Handle the error case as needed
                            this.Error="The email was not sent correctly.";
                            setTimeout(() => {
                              this.open_popUp=!this.open_popUp;
                            }, 2000);
                          }
                        );
                      }
                },(error:any)=>{
                  this.Error="Mail setup Error";
                  setTimeout(() => {
                    this.open_popUp=!this.open_popUp;
                  }, 2000);
    
                })
              }
            })
         

          
          }

         },(error:any)=>{
          this.Error="Did not get Inspector Data.";
          setTimeout(() => {
            this.open_popUp=!this.open_popUp;
          }, 2000);

         })
        }
        else{
          this.Error="Did not get INF Data."
          setTimeout(() => {
            this.open_popUp=!this.open_popUp;
          }, 2000);
        }

       },
       (error:any)=>{
       this.Error="Did not get Inspector Data."
       setTimeout(() => {
        this.open_popUp=!this.open_popUp;
      }, 2000);

       }
      );
    }
    else{
      alert("Did not get Project ID.")
    }

  }

  public isSendMailEnabled(inspectorArrayString: string ,mailset_status:number): boolean {
    try {
      const inspectorArray: any[] = JSON.parse(inspectorArrayString);
      console.log('mail status',mailset_status);
      
      
      console.log('Parsed inspectorArray:', inspectorArray);
      
      if (Array.isArray(inspectorArray) && inspectorArray.length > 0) {
        const result = inspectorArray.every((inspector: any) => inspector.i_approved === 1);
        console.log('All i_approved values are 1:', result);
        
        // Check for name and headChecked condition
        const nameMatchesAndHeadChecked = inspectorArray.some((inspector: any) => {
          return inspector.name === this.name && inspector.headChecked === true  && mailset_status==0 ;
        });
  
        console.log('Name matches and headChecked is true:', nameMatchesAndHeadChecked);
        
        return result && nameMatchesAndHeadChecked;
      } else {
        console.log('Array is not valid or empty');
        return false; // If inspectorArray is not an array or empty, disable the button
      }
    } catch (error) {
      console.error('Error processing inspectorArray:', error);
      return false; // Return false in case of any errors
    }
  }

  public saveSendMailEnabledStatus(inspectorArrayString: string,mailset_status:number): void {
    const sendMailEnabled = this.isSendMailEnabled(inspectorArrayString,mailset_status);
    sessionStorage.setItem('sendMailEnabled', sendMailEnabled ? 'true' : 'false');
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

  pdf(no:string){
    
    // const successMessage = 'Click ok to view the document';
    // const userConfirmation = window.confirm(successMessage);
    // if(userConfirmation){
    //   console.log("Called..*******",no)
      this.router.navigate(['pdf',no]);
    // }
    // this.router.navigate(['pdf',no]);


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


start(no:string){
  this.router.navigate(['../agreement',no], { relativeTo: this.route });
}

abortyes(id:string,total_units_schedule: number){
  console.log(id,"id");
  console.log(total_units_schedule, "total_units_schedule");



  this.router.navigate(['afterlogin','reshedule_after_start',id,total_units_schedule]);

}
currentDate: Date = new Date();
isSendMailEnabled1(scheduleFrom: string,client_approval_status:string): boolean {
  // Convert the string to a Date object
  const scheduleDate = new Date(scheduleFrom);

  console.log('Current Date:', this.currentDate);
  console.log('Schedule From Date:', scheduleDate);

  // Check if the scheduleFrom date is after the current date
  // const isEnabled = (scheduleDate <= this.currentDate) && (client_approval_status===1);
  const isEnabled = (scheduleDate <= this.currentDate) && (client_approval_status == "1");


  console.log('Mail Sending Enabled:', isEnabled);
  return !isEnabled;
}

isButtonDisabled(scheduleFrom: string,client_approval_status:string): boolean {
  return this.isSendMailEnabled1(scheduleFrom,client_approval_status);
}
}

