import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { DataService } from 'src/app/data.service';
import { ApicallService } from 'src/app/apicall.service';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { environment } from 'src/environments/environment';

interface InspectorInfo {
  units: number;
  fromDate: string;
  toDate: string;
}

@Component({
  selector: 'app-agreement-page',
  templateUrl: './agreement-page.component.html',
  styleUrls: ['./agreement-page.component.scss']
})
export class AgreementPageComponent {

  location1: string = 'assets/meeting.png';
  location: string = 'assets/voice1.png';
  showMessage: boolean = false;
  s_from: string | null = '';
  s_to: string | null = '';
  textRead: boolean = false;


  name:string='';
  check:boolean=true;
  val:string | null='';
  units:string[] | any=[];
  salesProcess:string='no';
  selfAssigned:string='no';
  // inf_26:string[]|any=[];
  inspectorArray: string[] = [];
  matchedInspector:boolean|any='';
  matchedInspector1:boolean|any='';

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
 
  inf_26:{id:number,contract_number:string,customer_workorder_name:string,customer_workorder_date:string,
    customer_name_as_per_work_order:string,type_of_inspection:string,job_type:string,project_name:string,
    building_name:string,location:string,type_of_building:string,site_address:string,customer_contact_name:string,
    ustomer_contact_number:string,customer_contact_number:string,customer_contact_mailid:string,oem_details:string,
    no_of_elevator:number,no_of_escalator:number,no_of_travelator:number,	no_of_mw:number, no_of_car_parking:number,
    travel_expenses_by:string,accomodation_by:string,no_of_stops_elevator:number,no_of_stops_dw:number,no_of_home_elevator:number,
    no_of_visits_as_per_work_order:number,no_of_mandays_as_per_work_order:number,	total_units_schedule:number,schedule_from:string,
    schedule_to:string,tpt6:number,	tpt7:number, load_test:number,pmt:number,rope_condition:number,callback:number,balance:number,inspector_list:string[],
    inspector_array:string,region:string}={id:0,contract_number:'',customer_workorder_name:'',customer_workorder_date:'',customer_name_as_per_work_order:'',type_of_inspection:'',job_type:'',project_name:'',building_name:'',location:'',type_of_building:'',site_address:'',customer_contact_name:'',ustomer_contact_number:'',customer_contact_number:'',customer_contact_mailid:'',oem_details:'',no_of_elevator:0,no_of_escalator:0,no_of_travelator:0,	no_of_mw:0,no_of_car_parking:0,travel_expenses_by:'',accomodation_by:'',no_of_stops_elevator:0,no_of_stops_dw:0,no_of_home_elevator:0,no_of_visits_as_per_work_order:0,no_of_mandays_as_per_work_order:0,	total_units_schedule:0,schedule_from:'',
    schedule_to:'',tpt6:0,	tpt7:0, load_test:0,pmt:0, rope_condition:0,callback:0,balance:0,inspector_list:[],inspector_array:'',region:''};

  constructor(private route: ActivatedRoute,private dataService: ApicallService,private http :HttpClient,private router:Router,private datePipe: DatePipe,private cd: ChangeDetectorRef){
     this.route.paramMap.subscribe(params => {
      this.val = params.get('c_no');
      console.log(this.val);
      if (this.val) {
        sessionStorage.setItem('contract_no', this.val); 
      }
      
    });

  }
  ngOnInit(){
    this.name = sessionStorage.getItem('UserName') as string;
    setTimeout(() => {
      this.speakText();
    }, 1000);
    //api call
    this.dataService.getDetailsForContractName(this.val).subscribe((details: any) => {
      console.log('inf api is called');
      
       this.inf_26 = details;
      //  console.log("*****",details.id)
      // this.selectedDetails=details;
      console.log('date',this.inf_26.schedule_from);
      
      console.log('agreement page inf',this.inf_26);
      console.log('inspector array is',details.inspector_array);
      const Ins_array = JSON.parse(details.inspector_array);
      const se_from = new Date(this.inf_26.schedule_from);
      const se_to = new Date(this.inf_26.schedule_to);
      const s_from = this.datePipe.transform(se_from, 'dd-MM-yyyy');
      const s_to = this.datePipe.transform(se_to, 'dd-MM-yyyy');
      // this.s_from = this.datePipe.transform(se_from1, 'dd-MM-yyyy');
      // this.s_to = this.datePipe.transform(se_to1, 'dd-MM-yyyy');
        });

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
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'dd-MM-yyyy') || '';
  }
  public isSendMailEnabled(inspectorArrayString: string): boolean {
    try {
      const inspectorArray: any[] = JSON.parse(inspectorArrayString);
            // const inspectorArray: any[] =inspectorArrayString;

      
      console.log('Parsed inspectorArray:', typeof(inspectorArray));
      
      if (Array.isArray(inspectorArray) && inspectorArray.length>0) {
        const result = inspectorArray.every((inspector: any) => inspector.i_approved === 1);
        console.log('All i_approved values are 1:', result);
        
        // Check for name and headChecked condition
        const nameMatchesAndHeadChecked = inspectorArray.some((inspector: any) => {
          return inspector.name === this.name && inspector.headChecked === true;
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


  accept(){
    console.log('inspector name is',this.name);
    console.log('contract no is',this.val);
    console.log('agreement checked',this.check);
    console.log('inspector array from accept',this.inf_26.inspector_array);
    this.matchedInspector1 = this.isSendMailEnabled((this.inf_26.inspector_array));

    // const inspectorArray1:string[]| any[] = JSON.parse(this.inf_26.inspector_array);

    
    
    this.parseInspectorArray(this.inf_26);

    
    
    const store_values ={
      name:this.name,
      contract_no:this.val,
      check:this.check,
      selfAssigned:this.selfAssigned,
      salesProcess:this.salesProcess,
      head:this.matchedInspector1,
      no_of_units:this.getUnits(this.inf_26),
      from_date:this.getFromDate(this.inf_26),
      to_date:this.getToDate(this.inf_26),
      project_name:this.inf_26.project_name,
      location:this.inf_26.location,
      region:this.inf_26.region

    }
    this.http.post(`${environment.serverUrl}api/store_data_agreement`, store_values).subscribe(      (response) => {
        console.log('Data stored successfully', response);
   
    // this.router.navigate(['afterlogin', 'auth',response]);
    console.log('ans for matching records',this.matchedInspector);
    // const matchedInspector = this.isSendMailEnabled(this.inf_26.inspector_array);


    console.log("^^",typeof(this.inf_26.inspector_array))
    const matchedInspector = this.isSendMailEnabled((this.inf_26.inspector_array));
    // const matchedInspector = this.isSendMailEnabled(this.inf_26.inspector_array);

    console.log('mached inspector', matchedInspector);
    

     if (matchedInspector) {
        // Navigate to one URL if the condition is met
        this.router.navigate(['afterlogin', 'auth',response]);
      } else {
        // Navigate to another URL if the condition is not met
        this.router.navigate(['afterlogin', 'risk',response]);
      }
    
    

  
  
  },
      (error) => {
        console.error('Error storing data', error);
      }
    );
    

    
  }
  speakText(): void {
    const textToSpeak = `
      OPENING MEETING
      Greetings of the Day One and all present here!
      This inspection is categorized  as third-party Type 3 inspection - inspection for safety, performance & maintenance quality assessment, and it is a checklist-based assessment.
      During the course of the inspection, we will be collecting a lot of data about the elevator along with pictures as evidence of our findings. We assure you that the information gathered and pictures taken will be handled with confidentiality as we are bound by oath of secrecy. We are also bound by independence and impartiality requirements as an inspection body and if you find any issues with us or our conduct or inspection process you may write to info@paplcorp.com and your concerns will be addressed appropriately.
      This inspection will be conducted by Me/Us between ${this.formatDate(this.inf_26.schedule_from)} to ${this.formatDate(this.inf_26.schedule_to)}.
      Thank you!
      For inquiries, please contact us at info@paplcorp.com.
    `;
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.onend = () => {
      this.textRead = true;
      this.showMessage = false; // Set showMessage to false after the audio ends
      // Call change detection manually since onend event is outside Angular zone
      this.cd.detectChanges();
    };
    speechSynthesis.speak(utterance);
    this.showMessage=true;
  }
  

}