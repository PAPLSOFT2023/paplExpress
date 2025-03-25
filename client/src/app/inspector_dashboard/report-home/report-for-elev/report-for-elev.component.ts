import { Component,ChangeDetectorRef,OnInit,ElementRef, ViewChild } from '@angular/core';
import { ApicallService } from '../../../apicall.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportDataService } from 'src/app/Data/report-data.service';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';






import autoTable, { CellHookData, CellInput, HAlignType } from 'jspdf-autotable';



interface ElevatorPerformance {
  elevatorNo: string;
  maintenancePercentage: number;
  adjustmentPercentage: number;
  ratingPercentage: string;
}
interface StartEndDate {
  startDate: string; // Adjust the types based on your actual data structure
  endDate: string;
}

interface Person {
  siNo: string;
  names: string;
  companyName: string;
  designation: string;
}

interface RatingData {
  header: string;
  address: string;
}


interface PitVariable {
  status: string;
  image: [any]; // Consider using a more specific type if possible, like string for URLs or Blob for binary data
  report_string: string;
  image_dropdown:string;
  has_image: boolean;
  actual_description: string;
}

type PreparedData = {
  [key: string]: {
    unit: string;
    actual_description: string;
    status: string;
    report_string: any;
  };
};


@Component({
  selector: 'app-report-for-elev',
  templateUrl: './report-for-elev.component.html',
  styleUrls: ['./report-for-elev.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportForElevComponent {
  public imageData: string | ArrayBuffer | null = null;
  toEmails: string[] = [];  
  ccEmails: string[] = [];  // Array to hold default CC email addresses


[x: string]: any;
// for database access

pdfId: number | undefined;
htmlContent: string = ''; // HTML content to convert to PDF
cssContent: string = '';   // CSS styles for PDF 
@ViewChild('contentToConvert') contentToConvert!: ElementRef;
// for pdf home

pdfBlob: Blob | null = null;
pdfSrc: string | null = null; // PDF URL for preview

startenddate: { startDate: string; endDate: string }[] = [];


report_id:string|null='';
name:any;

docid=0
current_visit_no=0;
inf_contract_number=''
machinenumber_withunit: { [key: string]: string; } = {};
 preparedData_pit: PreparedData = {};
 preparedData_cabin: PreparedData = {};
 preparedData_cartop: PreparedData = {};
 preparedData_machineroom: PreparedData = {};
 preparedData_floorlanding: PreparedData = {};
 popupvisible_for_Download=false;
 flag_for_sent_data_snapshot=true;
 isDialogOpen=false;

 uniqueSerialNumbers: string[] = [];
  tableData: any[] = [];
  selectedUnits: any[] = [];
  selectedDocumentNumbers: Set<string> = new Set();




  projectName:string="";
  buildingNO:string="";
  place:string="";
  contractNo:string="";
  Rep_From:string=""
  Rep_to:string=""
  inspectorNameandCode: string | null = sessionStorage.getItem("UserName");
   charactersAfterSecondSlash: string="";
  
  // approved Details
  approved_product="Elevators"
  inspectedBy:string="Inspected_By_Name";
  approvedBy:string="H.Amanullah";
  approvedPlace:string="Chennai";
  approvedDate:string="";

  // witness data
   witnessDetailsArray: any[] = [];


  // page side header data
  OEM:string=""
  customer_mail:string='';
  customer_mobile:string='';
  customer_name:string='';
  project_name:string='';
  
  headervalue:string=""

// page EXECUTIVE SUMMARY

nos_Product="";
BriefmultiDimArray_cunt:number=0;
Ordered_unit:string[]=[];
Ordered_unit_count:number;



isLoading:boolean=true
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




BriefmultiDimArray: {
   id: number, document_id: number, inspector_name: string,speed:string,capacity:string,unit_no:string,elevator_number:string, 	oem: string, year_of_manufacture: string,	machine_location:string,controller_driver_type:string,controller_name_as_per_oem:string,
  type_of_equipment:string,type_of_usage:string,type_of_operation:string,grouping_type:string,	name_of_the_group:string,floor_stops:string,floor_opening:string,floor_designation:string,front_opening_floors:string,	rear_opening_floors:string,
  service_floors:string,	emergency_stop_floors:string,rope_category:string,	number_of_rope_belt:string,	rope_size:string,no_of_drive_sheave_grooves:string,
  ropes_wrap_details:string,type_of_roping:string,	machine_type:string,	motor_kilo_watt:string,motor_voltage:string,motor_current_in_ampere:string,
  motor_frequency:string,motor_rpm:string,motor_insulation_class:string,motor_ingress_protection:string,	motor_no_of_poles:string,	motor_st_hr:string,
  motor_serial_number:string,	car_governor_rope_dia:string,car_governor_normal_speed:string,car_governor_electric_tripping_speed:string,car_governor_mechanical_tripping_speed:string,
  cwt_governor:any,cwt_governor_rope_dia:string,cwt_governor_normal_speed:string,cwt_governor_electrical_tripping_speed:string,cwt_governor_mechanical_tripping_speed:string,
  door_operator:string,entrance_height:string,entrance_width:string,entrance_type_of_opening:string,	cabin_height:string,cabin_width:string,no_of_cop:string,car_indicator_type:string,
  multimedia_display:string,	no_of_cabin_fans:string,type_of_cabin_fans:string,type_of_call_buttons:string,	car_stop_button:string,car_service_cabinet:string,
  car_voice_announcement:string,car_handrail:string,car_cabin_bumper:string,car_auto_attendant:string,car_auto_independent:string,	car_non_stop:string,car_fan_switch:string,
  hall_indicator_type:string,hall_lantems:string,hall_arrival_chime:string,	no_of_risers_at_main_lobby:string,no_of_risers_at_other_floors:string,
  hall_call_type_at_main_lobby:string,	hall_call_type_at_all_floors:string,	no_of_car_buffers:string,type_of_car_buffers:string,no_of_counter_weight_buffer:string,
  type_of_cwt_buffer:string,	e_light:any,e_alarm:any,e_intercom:any,	ard_operation:any,ard_audio:any,ard_visual:any,fireman_operation:any,
  fer:any,fireman_audio:any,fireman_visual:any,manual_rescue:any,passenger_overload_operation:any,passenger_overload_visual:any,passenger_overload_audio:any,
  seismic_sensor_operation:any,no_of_machine_room:string,machine_room:string,type_of_motor:string,cabin_depth:string,service_provider:string
}[] = [];




    // inspection master 
     inspectionMasterData:{ id: number;
      Product: string;
      Parts: string;
      Description: string;
      Reference: string[];
      Risklevel:string[];
      Dropdown:string[];
      Photo:string[];
      for_defect_flag:boolean;
      Defect_photo:string;
      Defect_multiple:string;
      image_Blob:any;
    }[]= []



      // Record Values


      Record_Values:{
        checked:boolean;
        description:string;
        document_id:number;
        dropdown_option:string;
        id:number;
        
        inspector_name:string;
        needforReport:boolean;
        section:string;
        unit_no:string,
        Customer_Scope:boolean,
        Emergency_Features:boolean,
        Negative_ADJ:number,
        Negative_MNT:number,
        Positive_ADJ:number,
        Positive_MNT:number,
        img: any; 
      
      }[]=[]

        val:number[]=[]


        emergency_Table_Data:{unit_no:string,Emergency_al:string,Emergency_Li:string,Intercom:string,ARd:string,Fireman:string,Manual_Res:string}[]=[]

  
   

    // unit id array
    unit_array: string[] = [];


    Error_API:string='';
    documentidForUrl: string="";


  




  people: Person[] = [
    {
      siNo: '1',
      names: 'Mr. Shreedhar.Naroskar.',
      companyName: 'CBRE',
      designation: 'Project Manager.'
    }
  ];

  Result_Of_pit_variables_pit :{[key: string]:{[key: string]: PitVariable  }}={}
  Result_Of_pit_variables_cabin :{[key: string]:{[key: string]: PitVariable  }}={}
  Result_Of_pit_variables_cartop :{[key: string]:{[key: string]: PitVariable  }}={}
  Result_Of_pit_variables_machineroom :{[key: string]:{[key: string]: PitVariable  }}={}
  Result_Of_pit_variables_floorlanding :{[key: string]:{[key: string]: PitVariable  }}={}
  
  Result_unit_status_pit_pit:{[key: string]:{}}={}

  Result_unit_status_cabin:{[key: string]:{}}={}

  Result_unit_status_cartop:{[key: string]:{}}={}
  Result_unit_status_machineroom:{[key: string]:{}}={}
 Result_unit_status_floorlanding:{[key: string]:{}}={}

  

  pit_Quality:{[key: string]:{per:number}}={}
  cabin_Quality:{[key: string]:{per:number}}={}
  cartop_Quality:{[key: string]:{per:number}}={}
  machineroom_Quality:{[key: string]:{per:number}}={}
  floorlanding_Quality:{[key: string]:{per:number}}={}
  // sixth_Quality_value:{[key: string]:{ADJ:number,MNT:number}}={}
  // seventh_Quality_value:{[key: string]:{ADJ:number,MNT:number}}={}
  Total_Quality:{[key: string]:{per:number}}={}
  // Avg_Quality:{[key: string]:{AVG:number}}={}
  

  Count_Description: any[] = [];
   Pit_ObservationPoints:{[key: string]: string[]}={};
   Cabin_ObservationPoints:{[key: string]: string[]}={};
   Cartop_ObservationPoints:{[key: string]: string[]}={};
   Machine_ObservationPoints:{[key: string]: string[]}={};
   Floor_ObservationPoints:{[key: string]: string[]}={};



  


  remark = 'All snags should be attended and completed to improve the ratings and performance of the units.';
     






  constructor(private apicallservice: ApicallService, private route: ActivatedRoute,public dataservice:ReportDataService,private cdr: ChangeDetectorRef,private http:HttpClient,private router:Router) {
    
    this.contractNo = this.route.snapshot.params['contractNumber'];
    this.report_id = this.route.snapshot.params['report_id'];

    this.documentidForUrl = decodeURIComponent(this.route.snapshot.params['documentid_For_Url']);
    // this.Ordered_unit=this.dataservice.Order_unit

    this.inspectorNameandCode=sessionStorage.getItem("UserName");
    const serializedItems = sessionStorage.getItem("Ordered_unit");
    this.Ordered_unit = serializedItems ? JSON.parse(serializedItems) : [];
    

    this.Ordered_unit_count=this.Ordered_unit.length
    this.initializeUnits();
   


    console.log("::",this.dataservice.Report_image_Value)



    this.apicallservice.get_getinspectionMaster_unique_for_quality().subscribe((result:any)=>{
      if(result)
        {
          this.dataservice.seventh_description=result;
        }
    });

    this.http.get(this.apicallservice.apiURL+"get_desccount").subscribe((result:any)=>{
     
      this.Count_Description=result
      console.log(")))(((",this.Count_Description);

      

    });
  

    
    

    // this is for pit report
    this.apicallservice.getinspectionmaster_description_for_Variable("pit").subscribe((result: any[]) => {
      if (result) {
        
        
        result.forEach((item: any, index: number) => {
          const description = item.Description.trim();
          const propertyName = `${description}`;
          for (let uni of this.Ordered_unit) {
              if (!this.Result_Of_pit_variables_pit[propertyName]) {
                  this.Result_Of_pit_variables_pit[propertyName] = {};
              }
              if (!this.Result_Of_pit_variables_pit[propertyName][uni]) {
                this.Result_Of_pit_variables_pit[propertyName][uni]={status: "",image: [null],report_string: "",has_image: false,actual_description: item.Description,image_dropdown:""};
              }
             
          }
          this.Result_unit_status_pit_pit[propertyName]=false;
      });
      
      }

      console.log("pit_variable",this.Result_Of_pit_variables_pit,this.Result_unit_status_pit_pit)

    });


    this.apicallservice.getinspectionmaster_description_for_Variable("cabin").subscribe((result: any[]) => {
      if (result) {
        
        
        result.forEach((item: any, index: number) => {
          const description = item.Description.trim();
          const propertyName = `${description}`;
          for (let uni of this.Ordered_unit) {
              if (!this.Result_Of_pit_variables_cabin[propertyName]) {
                  this.Result_Of_pit_variables_cabin[propertyName] = {};
              }
              if (!this.Result_Of_pit_variables_cabin[propertyName][uni]) {
                this.Result_Of_pit_variables_cabin[propertyName][uni]={status: "",image: [null],report_string: "",has_image: false,actual_description: item.Description,image_dropdown:""};
              }
             
          }
          this.Result_unit_status_cabin[propertyName]=false;
      });
      
      }

      console.log("Result_Of_pit_variables_cabin",this.Result_Of_pit_variables_cabin,this.Result_unit_status_cabin)

    });


    this.apicallservice.getinspectionmaster_description_for_Variable("car top").subscribe((result: any[]) => {
      if (result) {
        
        
        result.forEach((item: any, index: number) => {
          const description = item.Description.trim();
          const propertyName = `${description}`;
          for (let uni of this.Ordered_unit) {
              if (!this.Result_Of_pit_variables_cartop[propertyName]) {
                  this.Result_Of_pit_variables_cartop[propertyName] = {};
              }
              if (!this.Result_Of_pit_variables_cartop[propertyName][uni]) {
                this.Result_Of_pit_variables_cartop[propertyName][uni]={status: "",image: [null],report_string: "",has_image: false,actual_description: item.Description,image_dropdown:""};
              }
             
          }
          this.Result_unit_status_cartop[propertyName]=false;
      });
      
      }

      console.log("pit_variable",this.Result_Of_pit_variables_cartop,this.Result_unit_status_cartop)

    });


    this.apicallservice.getinspectionmaster_description_for_Variable("machine room").subscribe((result: any[]) => {
      if (result) {
        
        
        result.forEach((item: any, index: number) => {
          const description = item.Description.trim();
          const propertyName = `${description}`;
          for (let uni of this.Ordered_unit) {
              if (!this.Result_Of_pit_variables_machineroom[propertyName]) {
                  this.Result_Of_pit_variables_machineroom[propertyName] = {};
              }
              if (!this.Result_Of_pit_variables_machineroom[propertyName][uni]) {
                this.Result_Of_pit_variables_machineroom[propertyName][uni]={status: "",image: [null],report_string: "",has_image: false,actual_description: item.Description,image_dropdown:""};
              }
             
          }
          this.Result_unit_status_machineroom[propertyName]=false;
      });
      
      }

      console.log("pit_variable",this.Result_Of_pit_variables_machineroom,this.Result_unit_status_machineroom)

    });


    this.apicallservice.getinspectionmaster_description_for_Variable("floor landing").subscribe((result: any[]) => {
      if (result) {
        
        
        result.forEach((item: any, index: number) => {
          const description = item.Description.trim();
          const propertyName = `${description}`;
          for (let uni of this.Ordered_unit) {
              if (!this.Result_Of_pit_variables_floorlanding[propertyName]) {
                  this.Result_Of_pit_variables_floorlanding[propertyName] = {};
              }
              if (!this.Result_Of_pit_variables_floorlanding[propertyName][uni]) {
                this.Result_Of_pit_variables_floorlanding[propertyName][uni]={status: "",image: [null],report_string: "",has_image: false,actual_description: item.Description,image_dropdown:""};
              }
             
          }
          this.Result_unit_status_floorlanding[propertyName]=false;
      });
      
      }

      console.log("pit_variable",this.Result_Of_pit_variables_floorlanding,this.Result_unit_status_floorlanding)

    });
}

private initializeUnits() {
  this.Ordered_unit.forEach((unitName, index) => {
      this.pit_Quality[unitName] = {per:0 }; // Dynamically create properties p1, p2, etc.
      this.cabin_Quality[unitName] = {per:0 };
      this.cartop_Quality[unitName] = {per:0 }; 
      this.floorlanding_Quality[unitName] = {per:0 };
      this.machineroom_Quality[unitName] = {per:0 }; 
      // this.sixth_Quality_value[unitName] = { MNT: 0, ADJ: 0 }; 
      // this.seventh_Quality_value[unitName] = { MNT: 0, ADJ: 0 }; 
      this.Total_Quality[unitName]={ per: 0 };
      // this.Avg_Quality[unitName]={AVG:0}
      this.Pit_ObservationPoints[unitName]=[];
      this.Cabin_ObservationPoints[unitName]=[];
      this.Cartop_ObservationPoints[unitName]=[];
      this.Machine_ObservationPoints[unitName]=[];
      this.Floor_ObservationPoints[unitName]=[];

  });
}



getObjectKeys(obj: any): string[] {
  return Object.keys(obj);
}



  ngOnInit(): void {
    this.fetchEmailAddresses();
    this.fetchCCEmails();  // Fetch default CC emails
     ///////manage account//////////
   this.getTotalUnitsCount();
   this.getInfCounts();
   this.getClientAdminData();
   window.addEventListener('click', this.closeDropdown.bind(this));
   /////////end///////////

   this.name=sessionStorage.getItem("UserName") 


    const document_id = this.route.snapshot.paramMap.get('documentid_For_Url') ?? ''; 
    this.fetchunitDate(document_id);
    this.http.get(`${environment.serverUrl}getImage/${document_id}`, { responseType: 'arraybuffer' })
      .subscribe((data: ArrayBuffer) => {
        // Convert array buffer to base64
        const base64Image = btoa(String.fromCharCode(...new Uint8Array(data)));
        this.imageData = base64Image;
      }, error => {
        console.error('Error fetching image data:', error);
      });
  
    

    
      this.apicallservice.getinfdata_forReport(this.contractNo).subscribe((result:any)=>{
      if(result.length >0 && result){
        // console.log("INF",result)
        this.apicallservice.getUnit_details_Report(this.documentidForUrl,this.contractNo).subscribe((unit:any)=>{
          if(unit)
          {
            // console.log("Unit details",unit)
            // console.log("---->",this.contractNo, this.documentidForUrl,unit[0].unit_no);
            this.apicallservice.getBrief_spec_value(this.documentidForUrl,this.Ordered_unit).subscribe((brief:any)=>{
              if(brief.length>0) 
              {       
                //  console.log("Brief spec",brief);
              

                this.apicallservice.getinsectionmasterData().subscribe((inspectionMaster:any)=>{
                  if(inspectionMaster)
                  {
                    // console.log("inspecection master",inspectionMaster)
                    this.apicallservice.getChecklist_Record_Val_with_unit(this.documentidForUrl,this.Ordered_unit).subscribe((record_data:any)=>{
                      if(record_data)
                      {

                        console.log("%",record_data)
                        
                        // Record_Values
                        record_data.forEach((item: any) => {
                          if (item.img) {
                            const byteArray = new Uint8Array(item.img); // Convert LONGBLOB to Uint8Array
                            const blob = new Blob([byteArray], { type: 'image/jpeg' }); // Create a Blob (adjust type if needed)
                            const reader = new FileReader();
                        
                            reader.onload = () => {
                              // Set the base64 string as img value
                              item.img = reader.result ? (reader.result as string).split(',')[1] : null;
                            };
                        
                            reader.readAsDataURL(blob);
                          } else {
                            item.img = null; // No image data available
                          }

                          this.docid=item.document_id;
                          const recordValue = {
                            checked: item.checked,
                            description: item.description.trim(),
                            document_id: item.document_id,
                            dropdown_option: item.dropdown_option,
                            id: item.id,
                          
                            inspector_name: item.inspector_name,
                            needforReport: item.needforReport,
                            section: item.section,
                            unit_no: item.unit_no,
                            Customer_Scope:item.Customer_Scope,
                            Emergency_Features:item.Emergency_Features,
                            Negative_ADJ:item.Negative_ADJ,
                            Negative_MNT:item.Negative_MNT,
                            Positive_ADJ:item.Positive_ADJ,
                            Positive_MNT:item.Positive_MNT,
                            img: item.img// Convert LONGBLOB to base64 if available

                          };
                          this.Record_Values.push(recordValue);
                        });
                       
                        // inspectionMasterData
                        for (const item of inspectionMaster) {
                          const inspectionMasterData_single = {
                            id: item.id,
                            Product: item.Product,
                            Description: item.Description,
                            Parts: item.Parts,
                            Photo: item.Photo.split("~"),
                            Reference: item.Reference.split("~"),
                            Risklevel: item.Risklevel.split("~"),
                            Dropdown: item.Dropdown.split("~"),
                            for_defect_flag:false,
                            Defect_photo:"",
                            Defect_multiple:"",
                            image_Blob:""
                            
                          };
                          
                          this.inspectionMasterData.push(inspectionMasterData_single);
                        }
                        // BriefmultiDimArray
                        for (const item of brief) {
                          this.BriefmultiDimArray.push(item);
                        }
                        try {
                          this.Rep_From = formatDate(unit[0].ins_start_date);
                          this.Rep_to = formatDate(unit[0].ins_end_date);
                      } catch (error) {
                          console.error("Error while formatting dates:", error);
                      }
                      
                      // Helper function to format the date
                      function formatDate(dateString: string): string {
                          const date = new Date(dateString);
                          if (isNaN(date.getTime())) {
                              throw new Error(`Invalid date string: ${dateString}`);
                          }
                          const day = String(date.getDate()).padStart(2, '0');
                          const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                          const year = date.getFullYear();
                          return `${day}/${month}/${year}`;
                      }
                      
                        
                        console.log("unit details",unit)
                        console.log("+_+_+",result)


                        this.BriefmultiDimArray.sort((a: any, b: any) => {
                          return this.Ordered_unit.indexOf(a.unit_no) - this.Ordered_unit.indexOf(b.unit_no);
                        });
                       
                        this.BriefmultiDimArray.forEach((item) => {
                          if (item.unit_no && item.motor_serial_number) {
                            this.machinenumber_withunit![item.unit_no] = item.motor_serial_number;
                          }
                        });

                        console.log("brief",brief,this.BriefmultiDimArray,this.machinenumber_withunit);
                        console.log("inspectionMaster",this.inspectionMasterData);  
                        console.log("record_Val",this.Record_Values)
                       
                        
                           
                        this. popupvisible_for_Download=true;
                           
                             this.BriefmultiDimArray_cunt=this.BriefmultiDimArray.length;  
                          
                              this.current_visit_no=result[0].no_of_current_visit;
                             this.inf_contract_number =result[0].contract_number
                              this.projectName=result[0].project_name;
                              this.buildingNO=result[0].building_name;
                              this.place=result[0].location;
                              this.OEM=result[0].oem_details;
                              this.customer_mail=result[0].customer_contact_mailid;
                              this.customer_mobile=result[0].client_whatsapp_number;
                              this.customer_name=result[0].customer_contact_name;
                              
                              // console.log('customer mobile',this.customer_mobile);
                              
               
                             //  inspector array to key value pair
                       
                              




                      this.Generate_Date_and_Basic_data(result,unit);
                       this.checkEmergency();
                      this.get_unique_description_with_section();
                      // console.log("MM,m",this.Result_Of_pit_variables_pit,this.dataservice.Report_image_Value);
                       this.Report_Generate();
                      

                     

                      setTimeout(() => {
                        this.isLoading = false;
                        this.cdr.detectChanges(); // Trigger change detection manually
                      }, 2000);
                      
                       
                        
  
                      
                      }
                      
                      
                      
                      

                    
                      else{
                        console.log("Error_API Check list Record is Empty")
                        this.Error_API="Check list Record is Empty "

                      }
                    })




                  }
                  else{
                    console.log("Error_API Check List Data is Empty+")
                    this.Error_API=this.Error_API+"Check List Data is Empty "
                  }


                })
               
              }
              else{
                console.log("Error_API Check List Data is Empty-")
                
                this.Error_API=this.Error_API+"Brief Data is Empty"
              }



            },(brief_error:any)=>{});
          }
          else{
            console.log("Error_API Check List Data is Empty")
            this.Error_API=this.Error_API+"Unit Data is Empty "
          }


           
        
       },(error:any)=>{
          alert("Error: "+error)

        })
      }
      else{
        alert("Contract number Not Ava.")
      }
        })
  
   
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
  checkEndDateAndGeneratePDF() {
    // Check if any item in the startenddate array has an endDate
    const validEndDate = this.startenddate.some(date => date.endDate);
    this.isLoading=true
  
    if (!validEndDate) {
      alert('Not Allowed to generate report because inspection is not concluded yet');
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges(); // Trigger change detection manually if needed
      }, 1000);
    } else {
      // If endDate exists for any item, proceed with generating the WCC PDF
      this.uploadPDF();
    }
  }
  
  checkEndDateAndGeneratePDF1() {
    // Check if any item in the startenddate array has an endDate
    const validEndDate = this.startenddate.some(date => date.endDate);
    this.isLoading=true
  
    if (!validEndDate) {
      alert('Not Allowed to generate Excel report because inspection is not concluded yet');
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges(); // Trigger change detection manually if needed
      }, 1000);
    } else {
      // If endDate exists for any item, proceed with generating the WCC PDF
      this.generateXL();
    }
  }

  fetchunitDate(documentId: string): void {
    this.http.get<StartEndDate[]>(`${environment.serverUrl}api/startend-date?documentId=${documentId}`).subscribe(
      (data: StartEndDate[]) => {
        this.startenddate = data;
        console.log('Fetched Start and End Dates:', this.startenddate);
      },
      (error) => {
        console.error('Error fetching details:', error);
      }
    );
  }

  fetchEmailAddresses(): void {
    this.http.get<any>(`${environment.serverUrl}api/get-email-addresses`)
      .subscribe(
        response => {
          if (response.success) {
            this.toEmails = response.emails;  // Store the fetched emails
            console.log('Fetched emails:', this.toEmails);
          } else {
            console.error('Error fetching emails:', response.error);
          }
        },
        error => {
          console.error('Error fetching emails:', error);
        }
      );
  }




  



  generatePDF() {
    console.log('PDF generation triggered');
    window.print();
  }





generateXL() {
  console.log('XL generation triggered');


const data = [['OEM', 'TOWER', 'LIFT ID', 'PARAMETERS', 'CHECKPOINT', 'OBSERVATIONS', 'RISK LEVEL', 'ACTION BY', 'STATUS (OPEN/CLOSED)', 'REMARKS IF ANY']];



const parameters_value:string[]=["pit","cabin","car top","machine room","floor landing"]

for(const unit_individual of this.Ordered_unit)
{
  for (let element of this.BriefmultiDimArray) {
    if(element["unit_no"]== unit_individual)
      {
        for(let parameter_xl of parameters_value)
          {
            if(parameter_xl === "pit"){
            for (const key in this.Result_Of_pit_variables_pit) {
              if (Object.prototype.hasOwnProperty.call(this.Result_Of_pit_variables_pit, key)) {
              
          
                  // Access status for each p1, p2, etc.
                  for (const prop in this.Result_Of_pit_variables_pit[key]) {
                      if (Object.prototype.hasOwnProperty.call(this.Result_Of_pit_variables_pit[key], prop) && prop==unit_individual) {
                         
                        const status = this.Result_Of_pit_variables_pit[key][prop]["status"];  
                          console.log(`XL generation12  ${prop}: ${status}`,key);
                          
                          if(status.trim()==="N" || status.trim()==="NA")
                            {
                              let indexOfHyphen = this.Result_Of_pit_variables_pit[key][prop]["report_string"].indexOf('~ ');

                              console.log("XL generation11",this.Result_Of_pit_variables_pit[key][prop]["report_string"])
                         
                              // Check if "-" exists in the string
                              if (indexOfHyphen !== -1) {
                                console.log("XL generation>>>>>")
                                  // Extract substring starting from the character after the first "-"
                                  let substringAfterHyphen = this.Result_Of_pit_variables_pit[key][prop]["report_string"].substring(indexOfHyphen + 2).trim();
                                  let drop_down_values:string[]=substringAfterHyphen.split('~');
                                
                                  let RiskLevel_XL = '';
                                  let flag = 1;
                                  
                                  for (let inspe_Master of this.inspectionMasterData) {
                                      if (inspe_Master["Description"].trim() === key) {
                                          for (let drop_down_values_split of drop_down_values) {
                                              // Trim leading and trailing spaces from drop_down_values_split
                                              let trimmedValue = drop_down_values_split.trim();
                                              
                                              // Find the exact match index in inspe_Master["Dropdown"]
                                              let index = inspe_Master["Dropdown"].findIndex(item => item.trim() === trimmedValue);
                                  
                                              if (index !== -1) {
                                                  let Riskl = inspe_Master["Risklevel"][index];
                                                  console.log("!~!", trimmedValue, index, Riskl);
                                  
                                                  if (flag === 1) {
                                                      RiskLevel_XL = Riskl;
                                                      flag++;
                                                  } else {
                                                      RiskLevel_XL = RiskLevel_XL + '~' + Riskl;
                                                      flag++;
                                                  }
                                              }
                                          }
                                      }
                                  }
                                  

                                    if (RiskLevel_XL.endsWith('~')) {
                                      RiskLevel_XL = RiskLevel_XL.slice(0, -1);
                                  }


                                  data.push([element["oem"].toUpperCase(),this.buildingNO.toUpperCase(),unit_individual.toUpperCase(),parameter_xl.toUpperCase(),key.toUpperCase(),substringAfterHyphen,RiskLevel_XL,"","",""])

                                } 
                              
                            }
                            else{
                              data.push([element["oem"].toUpperCase(),this.buildingNO.toUpperCase(),unit_individual.toUpperCase(),parameter_xl.toUpperCase(),key.toUpperCase(),"Satisfactory","-","","",""])
         
                            }
                          
                      }
                  }
              }
             }
            }
            else if(parameter_xl === "cabin")
              {
                for (const key in this.Result_Of_pit_variables_cabin) {
                  if (Object.prototype.hasOwnProperty.call(this.Result_Of_pit_variables_cabin, key)) {
                      // console.log(Key:${key});
              
                      // Access status for each p1, p2, etc.
                      for (const prop in this.Result_Of_pit_variables_cabin[key]) {
                          if (Object.prototype.hasOwnProperty.call(this.Result_Of_pit_variables_cabin[key], prop) && prop==unit_individual) {
                             
                            const status = this.Result_Of_pit_variables_cabin[key][prop]["status"];  
                              console.log(`  ${prop}: ${status}`);
                              if(status.trim()=="N"  || status.trim()==="NA")
                                {
                                  let indexOfHyphen = this.Result_Of_pit_variables_cabin[key][prop]["report_string"].indexOf('~ ');
  
                                  // Check if "-" exists in the string
                                  if (indexOfHyphen !== -1) {
                                      // Extract substring starting from the character after the first "-"
                                      let substringAfterHyphen = this.Result_Of_pit_variables_cabin[key][prop]["report_string"].substring(indexOfHyphen + 2).trim();
                                      let drop_down_values:string[]=substringAfterHyphen.split('~');
                                    
                                      let RiskLevel_XL = '';
                                      let flag = 1;
                                      
                                      for (let inspe_Master of this.inspectionMasterData) {
                                          if (inspe_Master["Description"].trim() === key) {
                                              for (let drop_down_values_split of drop_down_values) {
                                                  // Trim leading and trailing spaces from drop_down_values_split
                                                  let trimmedValue = drop_down_values_split.trim();
                                                  
                                                  // Find the exact match index in inspe_Master["Dropdown"]
                                                  let index = inspe_Master["Dropdown"].findIndex(item => item.trim() === trimmedValue);
                                      
                                                  if (index !== -1) {
                                                      let Riskl = inspe_Master["Risklevel"][index];
                                                      console.log("!~!", trimmedValue, index, Riskl);
                                      
                                                      if (flag === 1) {
                                                          RiskLevel_XL = Riskl;
                                                          flag++;
                                                      } else {
                                                          RiskLevel_XL = RiskLevel_XL + '~' + Riskl;
                                                          flag++;
                                                      }
                                                  }
                                              }
                                          }
                                      }
                                      
  
                                        if (RiskLevel_XL.endsWith('~')) {
                                          RiskLevel_XL = RiskLevel_XL.slice(0, -1);
                                      }
  
  
                                      data.push([element["oem"].toUpperCase(),this.buildingNO.toUpperCase(),unit_individual.toUpperCase(),parameter_xl.toUpperCase(),key.toUpperCase(),substringAfterHyphen,RiskLevel_XL,"","",""])
  
                                    } 
                                  
                                }
                                else{
                                  data.push([element["oem"].toUpperCase(),this.buildingNO.toUpperCase(),unit_individual.toUpperCase(),parameter_xl.toUpperCase(),key.toUpperCase(),"Satisfactory","-","","",""])
             
                                }
                              
                          }
                      }
                  }
                 }
              }
              else if(parameter_xl === "car top")
                {
                  for (const key in this.Result_Of_pit_variables_cartop) {
                    if (Object.prototype.hasOwnProperty.call(this.Result_Of_pit_variables_cartop, key)) {
                        // console.log(Key:${key});
                
                        // Access status for each p1, p2, etc.
                        for (const prop in this.Result_Of_pit_variables_cartop[key]) {
                            if (Object.prototype.hasOwnProperty.call(this.Result_Of_pit_variables_cartop[key], prop) && prop==unit_individual) {
                               
                              const status = this.Result_Of_pit_variables_cartop[key][prop]["status"];  
                                console.log(`  ${prop}: ${status}`);
                                if(status.trim()=="N"  || status.trim()==="NA")
                                  {
                                    let indexOfHyphen = this.Result_Of_pit_variables_cartop[key][prop]["report_string"].indexOf('~ ');
    
                                    // Check if "-" exists in the string
                                    if (indexOfHyphen !== -1) {
                                        // Extract substring starting from the character after the first "-"
                                        let substringAfterHyphen = this.Result_Of_pit_variables_cartop[key][prop]["report_string"].substring(indexOfHyphen + 2).trim();
                                        let drop_down_values:string[]=substringAfterHyphen.split('~');
                                      
                                        let RiskLevel_XL = '';
                                        let flag = 1;
                                        
                                        for (let inspe_Master of this.inspectionMasterData) {
                                            if (inspe_Master["Description"].trim() === key) {
                                                for (let drop_down_values_split of drop_down_values) {
                                                    // Trim leading and trailing spaces from drop_down_values_split
                                                    let trimmedValue = drop_down_values_split.trim();
                                                    
                                                    // Find the exact match index in inspe_Master["Dropdown"]
                                                    let index = inspe_Master["Dropdown"].findIndex(item => item.trim() === trimmedValue);
                                        
                                                    if (index !== -1) {
                                                        let Riskl = inspe_Master["Risklevel"][index];
                                                        console.log("!~!", trimmedValue, index, Riskl);
                                        
                                                        if (flag === 1) {
                                                            RiskLevel_XL = Riskl;
                                                            flag++;
                                                        } else {
                                                            RiskLevel_XL = RiskLevel_XL + '~' + Riskl;
                                                            flag++;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        
    
                                          if (RiskLevel_XL.endsWith('~')) {
                                            RiskLevel_XL = RiskLevel_XL.slice(0, -1);
                                        }
    
    
                                        data.push([element["oem"].toUpperCase(),this.buildingNO.toUpperCase(),unit_individual.toUpperCase(),parameter_xl.toUpperCase(),key.toUpperCase(),substringAfterHyphen,RiskLevel_XL,"","",""])
    
                                      } 
                                    
                                  }
                                  else{
                                    data.push([element["oem"].toUpperCase(),this.buildingNO.toUpperCase(),unit_individual.toUpperCase(),parameter_xl.toUpperCase(),key.toUpperCase(),"Satisfactory","-","","",""])
               
                                  }
                                
                            }
                        }
                    }
                   }
                }
                else if(parameter_xl ==="machine room")
                  {
                    for (const key in this.Result_Of_pit_variables_machineroom) {
                      if (Object.prototype.hasOwnProperty.call(this.Result_Of_pit_variables_machineroom, key)) {
                          // console.log(Key:${key});
                  
                          // Access status for each p1, p2, etc.
                          for (const prop in this.Result_Of_pit_variables_machineroom[key]) {
                              if (Object.prototype.hasOwnProperty.call(this.Result_Of_pit_variables_machineroom[key], prop) && prop==unit_individual) {
                                 
                                const status = this.Result_Of_pit_variables_machineroom[key][prop]["status"];  
                                  console.log(`  ${prop}: ${status}`);
                                  if(status.trim()=="N"  || status.trim()==="NA")
                                    {
                                      let indexOfHyphen = this.Result_Of_pit_variables_machineroom[key][prop]["report_string"].indexOf('~ ');
      
                                      // Check if "-" exists in the string
                                      if (indexOfHyphen !== -1) {
                                          // Extract substring starting from the character after the first "-"
                                          let substringAfterHyphen = this.Result_Of_pit_variables_machineroom[key][prop]["report_string"].substring(indexOfHyphen + 2).trim();
                                          let drop_down_values:string[]=substringAfterHyphen.split('~');
                                        
                                          let RiskLevel_XL = '';
                                          let flag = 1;
                                          
                                          for (let inspe_Master of this.inspectionMasterData) {
                                              if (inspe_Master["Description"].trim() === key) {
                                                  for (let drop_down_values_split of drop_down_values) {
                                                      // Trim leading and trailing spaces from drop_down_values_split
                                                      let trimmedValue = drop_down_values_split.trim();
                                                      
                                                      // Find the exact match index in inspe_Master["Dropdown"]
                                                      let index = inspe_Master["Dropdown"].findIndex(item => item.trim() === trimmedValue);
                                          
                                                      if (index !== -1) {
                                                          let Riskl = inspe_Master["Risklevel"][index];
                                                          console.log("!~!", trimmedValue, index, Riskl);
                                          
                                                          if (flag === 1) {
                                                              RiskLevel_XL = Riskl;
                                                              flag++;
                                                          } else {
                                                              RiskLevel_XL = RiskLevel_XL + '~' + Riskl;
                                                              flag++;
                                                          }
                                                      }
                                                  }
                                              }
                                          }
                                          
      
                                            if (RiskLevel_XL.endsWith('~')) {
                                              RiskLevel_XL = RiskLevel_XL.slice(0, -1);
                                          }
      
      
                                          data.push([element["oem"].toUpperCase(),this.buildingNO.toUpperCase(),unit_individual.toUpperCase(),parameter_xl.toUpperCase(),key.toUpperCase(),substringAfterHyphen,RiskLevel_XL,"","",""])
      
                                        } 
                                      
                                    }
                                    else{
                                      data.push([element["oem"].toUpperCase(),this.buildingNO.toUpperCase(),unit_individual.toUpperCase(),parameter_xl.toUpperCase(),key.toUpperCase(),"Satisfactory","-","","",""])
                 
                                    }
                                  
                              }
                          }
                      }
                     }
                  }
                  else if(parameter_xl === "floor landing"){
                    for (const key in this.Result_Of_pit_variables_floorlanding) {
                      if (Object.prototype.hasOwnProperty.call(this.Result_Of_pit_variables_floorlanding, key)) {
                          // console.log(Key:${key});
                  
                          // Access status for each p1, p2, etc.
                          for (const prop in this.Result_Of_pit_variables_floorlanding[key]) {
                              if (Object.prototype.hasOwnProperty.call(this.Result_Of_pit_variables_floorlanding[key], prop) && prop==unit_individual) {
                                 
                                const status = this.Result_Of_pit_variables_floorlanding[key][prop]["status"];  
                                  console.log(`  ${prop}: ${status}`);
                                  if(status.trim()=="N"  || status.trim()==="NA")
                                    {
                                      let indexOfHyphen = this.Result_Of_pit_variables_floorlanding[key][prop]["report_string"].indexOf('~ ');
      
                                      // Check if "-" exists in the string
                                      if (indexOfHyphen !== -1) {
                                          // Extract substring starting from the character after the first "-"
                                          let substringAfterHyphen = this.Result_Of_pit_variables_floorlanding[key][prop]["report_string"].substring(indexOfHyphen + 2).trim();
                                          let drop_down_values:string[]=substringAfterHyphen.split('~');
                                        
                                          let RiskLevel_XL = '';
                                          let flag = 1;
                                          
                                          for (let inspe_Master of this.inspectionMasterData) {
                                              if (inspe_Master["Description"].trim() === key) {
                                                  for (let drop_down_values_split of drop_down_values) {
                                                      // Trim leading and trailing spaces from drop_down_values_split
                                                      let trimmedValue = drop_down_values_split.trim();
                                                      
                                                      // Find the exact match index in inspe_Master["Dropdown"]
                                                      let index = inspe_Master["Dropdown"].findIndex(item => item.trim() === trimmedValue);
                                          
                                                      if (index !== -1) {
                                                          let Riskl = inspe_Master["Risklevel"][index];
                                                          console.log("!~!", trimmedValue, index, Riskl);
                                          
                                                          if (flag === 1) {
                                                              RiskLevel_XL = Riskl;
                                                              flag++;
                                                          } else {
                                                              RiskLevel_XL = RiskLevel_XL + '~' + Riskl;
                                                              flag++;
                                                          }
                                                      }
                                                  }
                                              }
                                          }
                                          
      
                                            if (RiskLevel_XL.endsWith('~')) {
                                              RiskLevel_XL = RiskLevel_XL.slice(0, -1);
                                          }
      
      
                                          data.push([element["oem"].toUpperCase(),this.buildingNO.toUpperCase(),unit_individual.toUpperCase(),parameter_xl.toUpperCase(),key.toUpperCase(),substringAfterHyphen,RiskLevel_XL,"","",""])
      
                                        } 
                                      
                                    }
                                    else{
                                      data.push([element["oem"].toUpperCase(),this.buildingNO.toUpperCase(),unit_individual.toUpperCase(),parameter_xl.toUpperCase(),key.toUpperCase(),"Satisfactory","-","","",""])
                 
                                    }
                                  
                              }
                          }
                      }
                     }
                  }
          }
        }
  }
  



}

// Create the worksheet and workbook
const ws = XLSX.utils.aoa_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

// Generate the Excel file as a Blob
const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

// Convert ArrayBuffer to Blob
const blob = new Blob([wbout], { type: 'application/octet-stream' });

this.downloadExcel(blob);


// Create a temporary URL for the Blob
const url = window.URL.createObjectURL(blob);

// Create a link element to trigger the download
const link = document.createElement('a');
link.href = url;
link.download = this.buildingNO + '' + this.place + '' + this.contractNo + '.xlsx';

// Append the link to the DOM and trigger the download
document.body.appendChild(link);
link.click();

// Clean up
document.body.removeChild(link);
window.URL.revokeObjectURL(url);




}

//excel download
private downloadExcel(blob: Blob) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  // Use existing properties for the file name
  link.download = `${this.projectName}_${this.buildingNO}_${this.place}.xlsx`;

  // Append the link to the DOM, trigger the download, and clean up
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);




const report_id = this['report_id']; // Use bracket notation
const name = this.inspectorNameandCode; // Assuming this is already set in your class
const contract = this.contractNo; // Get from the class property
const Ordered_unit = this.Ordered_unit;
const formData = new FormData();
formData.append('file', blob);
formData.append('projectName', this.projectName);
formData.append('buildingNO', this.buildingNO);
formData.append('place', this.place);
formData.append('documentidForUrl', this.documentidForUrl);
formData.append('inspector_name', name || '');
formData.append('report_id', report_id || '');
formData.append('contract_no', contract);
if (Array.isArray(Ordered_unit)) {
  Ordered_unit.forEach(unit => {
    formData.append('unit_name[]', unit); // Append each unit name
  });
}


const apiUrl = `${environment.serverUrl}upload-excel-report`;


this.http.post(apiUrl, formData).subscribe(response => {
console.log('File uploaded successfully:', response);
});
}



private convertBlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log('Base64 String:', reader.result); // Debug Base64
      resolve(reader.result as string);
    };
    reader.onerror = (error) => {
      console.error('Error during Blob to Base64 conversion:', error);
      reject(error);
    };
    reader.readAsDataURL(blob);
  });
}






  check_Image_pit(Result_unit_status_Desc:string , checklistmaster:any ):boolean
  {
    let flag:boolean=false;
    

    for(let unit of this.Ordered_unit)
      {
       flag=( this.Result_unit_status_pit_pit[Result_unit_status_Desc.trim()]==true && this.Result_Of_pit_variables_pit[Result_unit_status_Desc.trim()][unit].has_image== true && Result_unit_status_Desc.trim().replace(/\s+/g, '')== checklistmaster.Description.trim().replace(/\s+/g, '')) 
     console.log("mm pit",flag,Result_unit_status_Desc)
       if(flag ==true)
        {
          return flag
        }
      }
   

    // Result_unit_status_pit[Result_unit_status_Desc]==true && Result_Of_pit_variables[Result_unit_status_Desc]["unit1"]. && Result_unit_status_Desc== checklistmaster.Description  "
    return  flag;
  }
 
  getImageData_pit(obj: any, uni: any,index:number): string {
    // Assuming `Result_Of_pit_variables` is your data structure
    // and `image` is an array containing base64-encoded image data

    // Check if the image data exists and is non-empty
    if (this.Result_Of_pit_variables_pit[obj][uni].image && this.Result_Of_pit_variables_pit[obj][uni].image.length > 0) {
      console.log("||",this.Result_Of_pit_variables_pit[obj][uni].image[index])
      return 'data:image/jpeg;base64,' + this.Result_Of_pit_variables_pit[obj][uni].image[index].blob;
    } else {
      // Return a default image or handle the case where image data is missing
      return 'default-image-url.jpg';
    }
  }
  shouldPageBreak(index: number): boolean {
    return (index + 1) % 2 === 0;
  }


  get_Remarks_pit(obj:any)
  {

    let Remark="";

    for(let unit_iteration of this.Ordered_unit)
      {

        const rec=this.Result_Of_pit_variables_pit[obj][unit_iteration]
        console.log("rec",this.Result_Of_pit_variables_pit[obj][unit_iteration],rec.report_string)
        if(rec.status=="N" || rec.status=="n" )
          {
            if(Remark=="")
              {
                Remark=rec.report_string+";"
                Remark=Remark.replace(unit_iteration,"!"+unit_iteration+"!")
              }
              else{
                Remark+=rec.report_string 
                Remark=Remark.replace(unit_iteration,"!"+unit_iteration+"!")
              }
            
          }
          if(rec.status=="Y" || rec.status=="y")
            {

              if(Remark=="")
                {
                  Remark=unit_iteration+"  Satisfactory"+";"
                  Remark=Remark.replace(unit_iteration,"!"+unit_iteration+"!")
                }
                else{
                  Remark+=unit_iteration+" Satisfactory" 
                  Remark=Remark.replace(unit_iteration,"!"+unit_iteration+"!")
                }

            }
      }

    return Remark;
  }


  // cabin

  check_Image_cabin(Result_unit_status_Desc:string , checklistmaster:any ):boolean
  {
    let flag:boolean=false;
    

    for(let unit of this.Ordered_unit)
      {
       flag=( this.Result_unit_status_cabin[Result_unit_status_Desc.trim()]==true && this.Result_Of_pit_variables_cabin[Result_unit_status_Desc.trim()][unit].has_image== true && Result_unit_status_Desc.trim().replace(/\s+/g, '')=== checklistmaster.Description.trim().replace(/\s+/g, '')) 
    //  console.log("mm",flag)
       if(flag ==true)
        {
          return flag
        }
      }
   

    // Result_unit_status_pit[Result_unit_status_Desc]==true && Result_Of_pit_variables[Result_unit_status_Desc]["unit1"]. && Result_unit_status_Desc== checklistmaster.Description  "
    return  flag;
  }
 
  getImageData_cabin(obj: any, uni: any,index:number): string {
    // Assuming `Result_Of_pit_variables` is your data structure
    // and `image` is an array containing base64-encoded image data

    // Check if the image data exists and is non-empty
    if (this.Result_Of_pit_variables_cabin[obj][uni].image && this.Result_Of_pit_variables_cabin[obj][uni].image.length > 0) {
      console.log("||",this.Result_Of_pit_variables_cabin[obj][uni].image[index])
      return 'data:image/jpeg;base64,' + this.Result_Of_pit_variables_cabin[obj][uni].image[index].blob;
    } else {
      // Return a default image or handle the case where image data is missing
      return 'default-image-url.jpg';
    }
  }


  get_Remarks_cabin(obj:any)
  {

    let Remark="";

    for(let unit_iteration of this.Ordered_unit)
      {

        const rec=this.Result_Of_pit_variables_cabin[obj][unit_iteration]
        console.log("rec",this.Result_Of_pit_variables_cabin[obj][unit_iteration],rec.report_string)
        if(rec.status=="N" || rec.status=="n" )
          {
            if(Remark=="")
              {
                Remark=rec.report_string+";"
                Remark=Remark.replace(unit_iteration,"!"+unit_iteration+"!")
              }
              else{
                Remark+=rec.report_string 
                Remark=Remark.replace(unit_iteration,"!"+unit_iteration+"!")
              }
            
          }
          if(rec.status=="Y" || rec.status=="y")
            {

              if(Remark=="")
                {
                  Remark=unit_iteration+"  Satisfactory"+";"
                  Remark=Remark.replace(unit_iteration,"!"+unit_iteration+"!")
                }
                else{
                  Remark+=unit_iteration+" Satisfactory" 
                  Remark=Remark.replace(unit_iteration,"!"+unit_iteration+"!")
                }

            }
      }

    return Remark;
  }

// cartop
  check_Image_cartop(Result_unit_status_Desc:string , checklistmaster:any ):boolean
  {
    let flag:boolean=false;
    

    for(let unit of this.Ordered_unit)
      {
       flag=( this.Result_unit_status_cartop[Result_unit_status_Desc.trim()]==true && this.Result_Of_pit_variables_cartop[Result_unit_status_Desc.trim()][unit].has_image== true && Result_unit_status_Desc.trim().replace(/\s+/g, '')=== checklistmaster.Description.trim().replace(/\s+/g, '')) 
    //  console.log("mm",flag)
       if(flag ==true)
        {
          return flag
        }
      }
   

    // Result_unit_status_pit[Result_unit_status_Desc]==true && Result_Of_pit_variables[Result_unit_status_Desc]["unit1"]. && Result_unit_status_Desc== checklistmaster.Description  "
    return  flag;
  }
 
  getImageData_cartop(obj: any, uni: any,index:number): string {
    // Assuming `Result_Of_pit_variables` is your data structure
    // and `image` is an array containing base64-encoded image data

    // Check if the image data exists and is non-empty
    if (this.Result_Of_pit_variables_cartop[obj][uni].image && this.Result_Of_pit_variables_cartop[obj][uni].image.length > 0) {
      console.log("||",this.Result_Of_pit_variables_cartop[obj][uni].image[index])
      return 'data:image/jpeg;base64,' + this.Result_Of_pit_variables_cartop[obj][uni].image[index].blob;
    } else {
      // Return a default image or handle the case where image data is missing
      return 'default-image-url.jpg';
    }
  }


  get_Remarks_cartop(obj:any)
  {

    let Remark="";

    for(let unit_iteration of this.Ordered_unit)
      {

        const rec=this.Result_Of_pit_variables_cartop[obj][unit_iteration]
        console.log("rec",this.Result_Of_pit_variables_cartop[obj][unit_iteration],rec.report_string)
        if(rec.status=="N" || rec.status=="n" )
          {
            if(Remark=="")
              {
                Remark=rec.report_string+";"
                Remark=Remark.replace(unit_iteration,"!"+unit_iteration+"!")
              }
              else{
                Remark+=rec.report_string 
                Remark=Remark.replace(unit_iteration,"!"+unit_iteration+"!")
              }
            
          }
          if(rec.status=="Y" || rec.status=="y")
            {

              if(Remark=="")
                {
                  Remark=unit_iteration+"  Satisfactory"+";"
                  Remark=Remark.replace(unit_iteration,"!"+unit_iteration+"!")
                }
                else{
                  Remark+=unit_iteration+" Satisfactory" 
                  Remark=Remark.replace(unit_iteration,"!"+unit_iteration+"!")
                }

            }
      }

    return Remark;
  }

  // machineroom
  check_Image_machineroom(Result_unit_status_Desc:string , checklistmaster:any ):boolean
  {
    let flag:boolean=false;
    

    for(let unit of this.Ordered_unit)
      {
       flag=( this.Result_unit_status_machineroom[Result_unit_status_Desc.trim()]==true && this.Result_Of_pit_variables_machineroom[Result_unit_status_Desc.trim()][unit].has_image== true && Result_unit_status_Desc.trim().replace(/\s+/g, '')=== checklistmaster.Description.trim().replace(/\s+/g, '')) 
    //  console.log("mm",flag)
       if(flag ==true)
        {
          return flag
        }
      }
   

    // Result_unit_status_pit[Result_unit_status_Desc]==true && Result_Of_pit_variables[Result_unit_status_Desc]["unit1"]. && Result_unit_status_Desc== checklistmaster.Description  "
    return  flag;
  }
 
  getImageData_machineroom(obj: any, uni: any,index:number): string {
    // Assuming `Result_Of_pit_variables` is your data structure
    // and `image` is an array containing base64-encoded image data

    // Check if the image data exists and is non-empty
    if (this.Result_Of_pit_variables_machineroom[obj][uni].image && this.Result_Of_pit_variables_machineroom[obj][uni].image.length > 0) {
      console.log("||",this.Result_Of_pit_variables_machineroom[obj][uni].image[index])
      return 'data:image/jpeg;base64,' + this.Result_Of_pit_variables_machineroom[obj][uni].image[index].blob;
    } else {
      // Return a default image or handle the case where image data is missing
      return 'default-image-url.jpg';
    }
  }


  get_Remarks_machineroom(obj:any)
  {

    let Remark="";

    for(let unit_iteration of this.Ordered_unit)
      {

        const rec=this.Result_Of_pit_variables_machineroom[obj][unit_iteration]
        console.log("rec",this.Result_Of_pit_variables_machineroom[obj][unit_iteration],rec.report_string)
        if(rec.status=="N" || rec.status=="n" )
          {
            if(Remark=="")
              {
                Remark=rec.report_string+";"
                Remark=Remark.replace(unit_iteration,"!"+unit_iteration+"!")
              }
              else{
                Remark+=rec.report_string 
                Remark=Remark.replace(unit_iteration,"!"+unit_iteration+"!")
              }
            
          }
          if(rec.status=="Y" || rec.status=="y")
            {

              if(Remark=="")
                {
                  Remark=unit_iteration+"  Satisfactory"+";"
                  Remark=Remark.replace(unit_iteration,"!"+unit_iteration+"!")
                }
                else{
                  Remark+=unit_iteration+" Satisfactory" 
                  Remark=Remark.replace(unit_iteration,"!"+unit_iteration+"!")
                }

            }
      }

    return Remark;
  }

  // floorlanding
  check_Image_floorlanding(Result_unit_status_Desc:string , checklistmaster:any ):boolean
  {
    let flag:boolean=false;
    

    for(let unit of this.Ordered_unit)
      {
       flag=( this.Result_unit_status_floorlanding[Result_unit_status_Desc.trim()]==true && this.Result_Of_pit_variables_floorlanding[Result_unit_status_Desc.trim()][unit].has_image== true && Result_unit_status_Desc.trim().replace(/\s+/g, '')=== checklistmaster.Description.trim().replace(/\s+/g, '')) 
    //  console.log("mm",flag)
       if(flag ==true)
        {
          return flag
        }
      }
   

    // Result_unit_status_pit[Result_unit_status_Desc]==true && Result_Of_pit_variables[Result_unit_status_Desc]["unit1"]. && Result_unit_status_Desc== checklistmaster.Description  "
    return  flag;
  }
 
  getImageData_floorlanding(obj: any, uni: any,index:number): string {
    // Assuming `Result_Of_pit_variables` is your data structure
    // and `image` is an array containing base64-encoded image data

    // Check if the image data exists and is non-empty
    if (this.Result_Of_pit_variables_floorlanding[obj][uni].image && this.Result_Of_pit_variables_floorlanding[obj][uni].image.length > 0) {
      console.log("||",this.Result_Of_pit_variables_floorlanding[obj][uni].image[index])
      return 'data:image/jpeg;base64,' + this.Result_Of_pit_variables_floorlanding[obj][uni].image[index].blob;
    } else {
      // Return a default image or handle the case where image data is missing
      return 'default-image-url.jpg';
    }
  }


  get_Remarks_floorlanding(obj:any)
  {

    let Remark="";

    for(let unit_iteration of this.Ordered_unit)
      {

        const rec=this.Result_Of_pit_variables_floorlanding[obj][unit_iteration]
        console.log("rec",this.Result_Of_pit_variables_floorlanding[obj][unit_iteration],rec.report_string)
        if(rec.status=="N" || rec.status=="n" )
          {
            if(Remark=="")
              {
                Remark=rec.report_string+";"
                Remark=Remark.replace(unit_iteration,"!"+unit_iteration+"!")
              }
              else{
                Remark+=rec.report_string 
                Remark=Remark.replace(unit_iteration,"!"+unit_iteration+"!")
              }
            
          }
          if(rec.status=="Y" || rec.status=="y")
            {

              if(Remark=="")
                {
                  Remark=unit_iteration+"  Satisfactory"+";"
                  Remark=Remark.replace(unit_iteration,"!"+unit_iteration+"!")
                }
                else{
                  Remark+=unit_iteration+" Satisfactory" 
                  Remark=Remark.replace(unit_iteration,"!"+unit_iteration+"!")
                }

            }
      }

    return Remark;
  }

checknoof_img(finadata:any)
{
  let count=0

  for(let unit of this.Ordered_unit)
    {
      if(finadata[unit].image.length==1)
        {
          if(finadata[unit].image[0]!= null)
            {
              count+= finadata[unit].image.length
            }
         
        }
        else{
          count+= finadata[unit].image.length
        }
      
    }

console.log("checknoof_img",count,finadata)

  return count;
}



checkunithastwoimg(finadata:any){
  let check_two_img=false
  for(let unit of this.Ordered_unit)
    {
      console.log("check two img",finadata[unit].has_image== true && finadata[unit].image.length==2,finadata[unit].has_image, finadata[unit].image.length)
     if( finadata[unit].has_image== true && finadata[unit].image.length==2)
      {

        check_two_img=true
        return true;

       

      }

    }

return false

}











getMaxObservations_pit(): number {
  return Math.max(...this.Ordered_unit.map(unit => this.Pit_ObservationPoints[unit].length));
}


getMaxObservations_cabin(): number {
  return Math.max(...this.Ordered_unit.map(unit => this.Cabin_ObservationPoints[unit].length));
}
getMaxObservations_machineroom(): number {
  return Math.max(...this.Ordered_unit.map(unit => this.Machine_ObservationPoints[unit].length));
}
getMaxObservations_floorlanding(): number {
  return Math.max(...this.Ordered_unit.map(unit => this.Floor_ObservationPoints[unit].length));
}
getMaxObservations_cartop(): number {
  return Math.max(...this.Ordered_unit.map(unit => this.Cartop_ObservationPoints[unit].length));
}

// Inside your component class
getStatusColor(status: string): string {
  if (status.toLowerCase() === 'y') {

    // console.log("$$@",status)
      return 'green'; // Set color to green for 'y' or 'Y'
  } else if (status.toLowerCase() === 'n') {
      return 'red'; // Set color to red for 'n' or 'N'
  }
  else if (status.toLowerCase() === 'na') {
    return 'orange'; // Set color to red for 'n' or 'N'
} else {
      return 'black'; // Default color
  }
}


  *range(start: number, end: number): Iterable<number> {
    for (let i = start; i < end; i++) {
      yield i;
    }
  }


Generate_Date_and_Basic_data(result:any[],unit:any[]){
  const jsonArray: any[] = JSON.parse(result[0].inspector_array);
                              const inspector_keyValuePairs: { [key: string]: any }[] = [];
                       
                            
                              jsonArray.forEach((obj) => {
                               const keyValue: { [key: string]: any } = {};
                               for (const key in obj) {
                                if (Object.hasOwn(obj, key)) {
                                  const value = obj[key];
                                  keyValue[key] = value;
                                }
                              }
                              
                              
                               inspector_keyValuePairs.push(keyValue);
                              });
               
                              // console.log(inspector_keyValuePairs)
               
               
                             
               
                               let matchedObject: { [key: string]: any } | undefined;
               
                                // Loop through each object in the inspector_keyValuePairs array
                               for (const element of inspector_keyValuePairs) {
                                const obj = element;
                                  if (obj['name'] === this.inspectorNameandCode) {
                                  matchedObject = obj; // Found a matching object
                                  break; // Exit the loop once a match is found
                                  }
                               }
               
                               if (matchedObject) {
                              

                                
               
                               // Parse date without time zone adjustments
const dateObject: Date = new Date(matchedObject['fromDate'].split("T")[0]);
const dateObject1: Date = new Date(matchedObject['toDate'].split("T")[0]);

// Format the date components as before
const day: number = dateObject.getDate();
const month: number = dateObject.getMonth() + 1; // Months are zero-based (0 = January)
const year: number = dateObject.getFullYear();

const day1: number = dateObject1.getDate();
const month1: number = dateObject1.getMonth() + 1; // Months are zero-based (0 = January)
const year1: number = dateObject1.getFullYear();

               
               
                                
               
                              this.nos_Product=matchedObject['units']
               
               
                              if(unit[0].inspector_name=== matchedObject['name'] ){
                              this.inspectedBy= unit[0].inspector_name.split('-')[0].trim();
                              }
                              else{
                                 this.inspectedBy= matchedObject['name'].split('-')[0].trim();
                               }
                             } 
                           
               
               
               
               
                            this.headervalue=this.contractNo.replace(/-/g, "/")+"/"+this.BriefmultiDimArray[0].oem+"/"+this.projectName+"/"+this.buildingNO+"/"+this.place+"/REV 01"
                        
                 
                            const currentDate = new Date();
               
                                        // Extract day, month, and year from the current date
                                        const day = String(currentDate.getDate()).padStart(2, '0'); 
                                        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
                                        const year = currentDate.getFullYear();
                
                                        // Create the time string in "DD/MM/YYYY" format
                                        this.approvedDate = `${day}/${month}/${year}`;
               
              
                                         //  get witness data
                         
               
                                         try {
                                           this.witnessDetailsArray = JSON.parse(unit[0].witness_details);
                                         } catch (error) {
                                           console.error("Error parsing JSON:", error);
                                         }
                         
                                   // Process the array if parsing was successful
                                   if (Array.isArray(this.witnessDetailsArray)) {
                                   
                                    this.witnessDetailsArray = this.witnessDetailsArray.filter(obj =>
                                      Object.values(obj).some(value => value !== '' && value !== null)
                                    );
                                    } 
                                            
              
 }
  

  get_unique_description_with_section(){
    this.apicallservice.get_unique_description_with_section_api().subscribe((resultof:any)=>{
      if(resultof)
        {
         

          this.dataservice.Unique_description_with_section=resultof
          console.log("//",this.dataservice.Unique_description_with_section)
          this.Report_Quality_anotherParts();
          
        }


    });
  }






  Report_Quality_anotherParts()
  {

    // console.log("...,,,called",this.Ordered_unit,this.dataservice.Unique_description_with_section);
    
             for (const unit of this.Ordered_unit) {
                for (const parts of this.dataservice.Unique_description_with_section) {
                  console.log('parts ',parts);
                  
                    // Extract the first key of the parts object and convert it to lowercase
                   const partKey = Object.keys(parts)[0].toLowerCase();  // Call toLowerCase() correctly 
                   console.log('partkey',partKey);
                   
                           switch (partKey) {
                        case "pit":{
                          
                  // console.log("pit...");
                  //     console.log("pit arrya",parts)
                      const pitValues = parts[Object.keys(parts)[0]];
                      let const_per:number=0;
                      let a=0
                      
                     pitValues.forEach((description:any, index:any) => {
                     console.log(`Value ${index + 1}: ${description}`);
                     let flag_check:boolean=false;              
                     for(const Singleresult_emergency of this.Record_Values)
                       {
                       
                        if (description.trim() === Singleresult_emergency.description.trim() && unit === Singleresult_emergency.unit_no) {
                                                 
                              if(Singleresult_emergency.checked== true )
                               {
                                if (!Singleresult_emergency.dropdown_option.toLowerCase().includes("not applicable")) {
                                  // Set the flag and push the dropdown_option if 'not applicable' is not found
                                  flag_check = true;
                                
                                  this.Pit_ObservationPoints[unit].push(Singleresult_emergency.description+' - '+Singleresult_emergency.dropdown_option);
                                  // Optionally log a success message
                                  console.log("Dropdown option pushed:", Singleresult_emergency.dropdown_option);
                              }
                               else {
                                  // Optionally log a message if 'not applicable' is found
                                  console.log("Dropdown option contains 'not applicable', not pushing:", Singleresult_emergency.dropdown_option);
                              }
                               }    
                                           
                           }
                       }

                  
                       if(flag_check===true)
                         {
                          a=a+1;
                         }
                     });


                    
                       for(let value of this.Count_Description)
                       {
                         if(value.Parts.toUpperCase()==="PIT")
                           {
                             console.log("mmm--",value.description_count,a);
                            console.log(((value.description_count-a)/value.description_count)*100)
                            const_per=((value.description_count-a)/value.description_count)*100

                            this.pit_Quality[unit] = { per:const_per };


                             
                           }

                       }
                      
                    
                     
                     console.log("const final MNT, ADJ",this.pit_Quality)
                      const_per=0;
                  break; 
                      }

                  case "cabin":
                    {
                      
                    // console.log("pit...");
                    //     console.log("pit arrya",parts)
                        const cabinValues = parts[Object.keys(parts)[0]];
                        let cabinconst_per:number=0;
                        let cabin_a=0
                        
                     cabinValues.forEach((description:any, index:any) => {
                       console.log(`Value ${index + 1}: ${description}`);
                       let flag_check:boolean=false;              
                       for(const Singleresult_emergency of this.Record_Values)
                         {
                         
                          if (description.trim() === Singleresult_emergency.description.trim() && unit === Singleresult_emergency.unit_no) {
                                                   
                                if(Singleresult_emergency.checked== true )
                                 {
                                  if (!Singleresult_emergency.dropdown_option.toLowerCase().includes("not applicable")) {
                                    // Set the flag and push the dropdown_option if 'not applicable' is not found
                                    flag_check = true;
                                  
                                    this.Cabin_ObservationPoints[unit].push(Singleresult_emergency.description+' - '+Singleresult_emergency.dropdown_option);
                                    // Optionally log a success message
                                    console.log("Dropdown option pushed:", Singleresult_emergency.dropdown_option);
                                }
                                 else {
                                    // Optionally log a message if 'not applicable' is found
                                    console.log("Dropdown option contains 'not applicable', not pushing:", Singleresult_emergency.dropdown_option);
                                }
                                 }    
                                             
                             }
                         }
  
                    
                         if(flag_check===true)
                           {
                            cabin_a=cabin_a+1;
                           }
                       });
  
  
                      
                         for(let value of this.Count_Description)
                         {
                           if(value.Parts.toUpperCase()==="CABIN")
                             {
                               console.log("mmm--",value.description_count,cabin_a);
                              console.log(((value.description_count-cabin_a)/value.description_count)*100)
                              cabinconst_per=((value.description_count-cabin_a)/value.description_count)*100
  
                              this.cabin_Quality[unit] = { per:cabinconst_per };
  
  
                               
                             }
  
                         }
                        
                      
                       
                       console.log("const final MNT, ADJ",this.cabin_Quality)
                        cabinconst_per=0;
                    break; 
                        }
  

                        case "car top":
                          {
                            
                          // console.log("pit...");
                          //     console.log("pit arrya",parts)
                              const cabinValues = parts[Object.keys(parts)[0]];
                              let cabinconst_per:number=0;
                              let cabin_a=0
                              
                           cabinValues.forEach((description:any, index:any) => {
                             console.log(`Value ${index + 1}: ${description}`);
                             let flag_check:boolean=false;              
                             for(const Singleresult_emergency of this.Record_Values)
                               {
                               
                                if (description.trim() === Singleresult_emergency.description.trim() && unit === Singleresult_emergency.unit_no) {
                                                         
                                      if(Singleresult_emergency.checked== true )
                                       {
                                        if (!Singleresult_emergency.dropdown_option.toLowerCase().includes("not applicable")) {
                                          // Set the flag and push the dropdown_option if 'not applicable' is not found
                                          flag_check = true;
                                        
                                          this.Cartop_ObservationPoints[unit].push(Singleresult_emergency.description+' - '+Singleresult_emergency.dropdown_option);
                                          // Optionally log a success message
                                          console.log("Dropdown option pushed:", Singleresult_emergency.dropdown_option);
                                      }
                                       else {
                                          // Optionally log a message if 'not applicable' is found
                                          console.log("Dropdown option contains 'not applicable', not pushing:", Singleresult_emergency.dropdown_option);
                                      }
                                       }    
                                                   
                                   }
                               }
        
                          
                               if(flag_check===true)
                                 {
                                  cabin_a=cabin_a+1;
                                 }
                             });
        
        
                            
                               for(let value of this.Count_Description)
                               {
                                 if(value.Parts.toUpperCase()==="CAR TOP")
                                   {
                                     console.log("mmm--",value.description_count,cabin_a);
                                    console.log(((value.description_count-cabin_a)/value.description_count)*100)
                                    cabinconst_per=((value.description_count-cabin_a)/value.description_count)*100
        
                                    this.cartop_Quality[unit] = { per:cabinconst_per };
        
        
                                     
                                   }
        
                               }
                              
                            
                             
                             console.log("const final MNT, ADJ",this.cartop_Quality)
                              cabinconst_per=0;
                          break; 
                              }

                              case "machine room":
                                {
                                  
                                // console.log("pit...");
                                //     console.log("pit arrya",parts)
                                    const cabinValues = parts[Object.keys(parts)[0]];
                                    let cabinconst_per:number=0;
                                    let cabin_a=0
                                    
                                 cabinValues.forEach((description:any, index:any) => {
                                   console.log(`Value ${index + 1}: ${description}`);
                                   let flag_check:boolean=false;              
                                   for(const Singleresult_emergency of this.Record_Values)
                                     {
                                     
                                      if (description.trim() === Singleresult_emergency.description.trim() && unit === Singleresult_emergency.unit_no) {
                                                               
                                            if(Singleresult_emergency.checked== true )
                                             {
                                              if (!Singleresult_emergency.dropdown_option.toLowerCase().includes("not applicable")) {
                                                // Set the flag and push the dropdown_option if 'not applicable' is not found
                                                flag_check = true;
                                              
                                                this.Machine_ObservationPoints[unit].push(Singleresult_emergency.description+' - '+Singleresult_emergency.dropdown_option);
                                                // Optionally log a success message
                                                console.log("Dropdown option pushed:", Singleresult_emergency.dropdown_option);
                                            }
                                             else {
                                                // Optionally log a message if 'not applicable' is found
                                                console.log("Dropdown option contains 'not applicable', not pushing:", Singleresult_emergency.dropdown_option);
                                            }
                                             }    
                                                         
                                         }
                                     }
              
                                
                                     if(flag_check===true)
                                       {
                                        cabin_a=cabin_a+1;
                                       }
                                   });
              
              
                                  
                                     for(let value of this.Count_Description)
                                     {
                                       if(value.Parts.toUpperCase()==="MACHINE ROOM")
                                         {
                                           console.log("mmm--",value.description_count,cabin_a);
                                          console.log(((value.description_count-cabin_a)/value.description_count)*100)
                                          cabinconst_per=((value.description_count-cabin_a)/value.description_count)*100
              
                                          this.machineroom_Quality[unit] = { per:cabinconst_per };
              
              
                                           
                                         }
              
                                     }
                                    
                                  
                                   
                                   console.log("const final MNT, ADJ",this.machineroom_Quality)
                                    cabinconst_per=0;
                                break; 
                                    }


                                    case "floor landing":
                                      {
                                        
                                      // console.log("pit...");
                                      //     console.log("pit arrya",parts)
                                          const cabinValues = parts[Object.keys(parts)[0]];
                                          let cabinconst_per:number=0;
                                          let cabin_a=0
                                          
                                       cabinValues.forEach((description:any, index:any) => {
                                         console.log(`Value ${index + 1}: ${description}`);
                                         let flag_check:boolean=false;              
                                         for(const Singleresult_emergency of this.Record_Values)
                                           {
                                           
                                            if (description.trim() === Singleresult_emergency.description.trim() && unit === Singleresult_emergency.unit_no) {
                                                                     
                                                  if(Singleresult_emergency.checked== true )
                                                   {
                                                    if (!Singleresult_emergency.dropdown_option.toLowerCase().includes("not applicable")) {
                                                      // Set the flag and push the dropdown_option if 'not applicable' is not found
                                                      flag_check = true;
                                                    
                                                      this.Floor_ObservationPoints[unit].push(Singleresult_emergency.description+' - '+Singleresult_emergency.dropdown_option);
                                                      // Optionally log a success message
                                                      console.log("Dropdown option pushed:", Singleresult_emergency.dropdown_option);
                                                  }
                                                   else {
                                                      // Optionally log a message if 'not applicable' is found
                                                      console.log("Dropdown option contains 'not applicable', not pushing:", Singleresult_emergency.dropdown_option);
                                                  }
                                                   }    
                                                               
                                               }
                                           }
                    
                                      
                                           if(flag_check===true)
                                             {
                                              cabin_a=cabin_a+1;
                                             }
                                         });
                    
                    
                                        
                                           for(let value of this.Count_Description)
                                           {
                                             if(value.Parts.toUpperCase()==="FLOOR LANDING")
                                               {
                                                 console.log("mmm--",value.description_count,cabin_a);
                                                console.log(((value.description_count-cabin_a)/value.description_count)*100)
                                                cabinconst_per=((value.description_count-cabin_a)/value.description_count)*100
                    
                                                this.floorlanding_Quality[unit] = { per:cabinconst_per };
                    
                    
                                                 
                                               }
                    
                                           }
                                          
                                        
                                         
                                         console.log("const final MNT, ADJ",this.floorlanding_Quality)
                                          cabinconst_per=0;
                                      break; 
                                          }

             
                   }
                       }
               }

            
                   let total_mnt=0
                   let total_adj=0
                   let avg=0
                 
                    for(const unit of this.Ordered_unit)
                      {
                        console.log("@@@!", (this.pit_Quality[unit].per +
                          this.cabin_Quality[unit].per +
                          this.cartop_Quality[unit].per +
                          this.machineroom_Quality[unit].per +
                          this.floorlanding_Quality[unit].per)/5);
                        this.Total_Quality[unit].per = (
                          this.pit_Quality[unit].per +
                          this.cabin_Quality[unit].per +
                          this.cartop_Quality[unit].per +
                          this.machineroom_Quality[unit].per +
                          this.floorlanding_Quality[unit].per
                        )/5 ;
                        this.Total_Quality[unit].per = Number(this.Total_Quality[unit].per.toFixed(2));
                      }
                      
                      












              }
  
  




  getWidth(remarks: string): number {
    // You can adjust the multiplier (e.g., 8) according to your design preference
    return remarks.length * 8; // Adjust 8 according to your design preference
}


checkEmergency() {   

  let emergency_AL_flag:boolean=false
  let emergency_AL_string:string=""
  let emergency_LI_flag:boolean=false
  let emergency_LI_string:string=""
  let intercom_flag:boolean=false
  let intercom_string:string=""
  let ard_flag:boolean=false
  let ard_string:string=""
  let fireman_flag:boolean=false
  let fireman_string:string=""
  let manual_break_flag:boolean=false
  let manual_break_string:string=""
  
  for (const brief of this.BriefmultiDimArray) {      
    for (const record of this.Record_Values) {
     
     
      // cabin Emergency alaram
        if (brief.unit_no === record.unit_no && "cabin".toLowerCase() === record.section.toLowerCase() && "FUNCTIONING OF EMERGENCY ALARM".toLowerCase() === record.description.toLowerCase()) {
         
         if(record.checked)
          {
            emergency_AL_flag=true;
            if(emergency_AL_string)
              {
                emergency_AL_string+=", "+record.dropdown_option
              }
              else{
                emergency_AL_string=record.dropdown_option
              }
          }
        } 
       
        // emergency light
        if (brief.unit_no === record.unit_no && "cabin".toLowerCase() === record.section.toLowerCase() && "FUNCTIONING OF EMERGENCY LIGHT".toLowerCase() === record.description.toLowerCase())
          {

          if(record.checked)
           {
             emergency_LI_flag=true;
             if(emergency_LI_string)
               {
                 emergency_LI_string+=", "+record.dropdown_option
               }
               else{
                 emergency_LI_string=record.dropdown_option
               }
           }
         } 
        //  Intercom

        if (brief.unit_no === record.unit_no && "cabin".toLowerCase() === record.section.toLowerCase() && "FUNCTIONING OF INTERCOM OPERATION".toLowerCase() === record.description.toLowerCase())
          {
          
        if(record.checked)
          {
            intercom_flag=true;
            if(intercom_string)
              {
                intercom_string+=", "+record.dropdown_option
              }
              else{
                intercom_string=record.dropdown_option
              }
          }
        } 

        // ARD

        if (brief.unit_no === record.unit_no && "cabin".toLowerCase() === record.section.toLowerCase() && "FUNCTION OF ARD".toLowerCase() === record.description.toLowerCase())
        {
        if(record.checked)
          {
            ard_flag=true;
            if(ard_string)
              {
                ard_string+=", "+record.dropdown_option
              }
              else{
                ard_string=record.dropdown_option
              }
          }
        } 

        // Fireman

        if (brief.unit_no === record.unit_no && "floorlanding".toLowerCase() === record.section.toLowerCase() && "FIREMAN OPERATION".toLowerCase() === record.description.toLowerCase())
        {

        if(record.checked)
          {
            fireman_flag=true;
            if(fireman_string)
              {
                fireman_string+=", "+record.dropdown_option
              }
              else{
                fireman_string=record.dropdown_option
              }
          }
        }

        // manual break

        if (brief.unit_no === record.unit_no && "machineroom".toLowerCase() === record.section.toLowerCase() && "MANUAL RESCUE OPERATION".toLowerCase() === record.description.toLowerCase()) 
        {
        if(record.checked)
          {
            manual_break_flag=true;
            if(manual_break_string)
              {
                manual_break_string+=", "+record.dropdown_option
              }
              else{
                manual_break_string=record.dropdown_option
              }
          }
        }
      }
         const template = {
         Emergency_al: "",
         Emergency_Li: "",
         Intercom: "",
         ARd: "",
         Fireman: "",
         Manual_Res: ""
        };

        if (emergency_AL_flag ) template.Emergency_al = emergency_AL_string; else template.Emergency_al="Working"
        if (emergency_LI_flag) template.Emergency_Li = emergency_LI_string;  else template.Emergency_Li="Working"
        if (intercom_flag) template.Intercom = intercom_string;              else template.Intercom="Working"
        if (ard_flag) template.ARd = ard_string;                             else template.ARd="Working"
        if (fireman_flag) template.Fireman = fireman_string;                 else template.Fireman="Working"
        if (manual_break_flag) template.Manual_Res = manual_break_string;    else template.Manual_Res="Working"


       const emergency_Table_Data = { unit_no: brief.unit_no, ...template };

       emergency_AL_flag=false;
       emergency_AL_string=""
       emergency_LI_flag=false;
       emergency_LI_string=""
       intercom_flag=false;
       intercom_string=""
       ard_flag=false;
       ard_string=""
       fireman_flag=false;
       fireman_string=""
       manual_break_flag=false;
       manual_break_string=""       
       this.emergency_Table_Data.push(emergency_Table_Data);
     }
     
}

private readonly companyLogoPath = 'assets/carp.jpg'; // Path relative to 'src'
private readonly reportLogoPath = 'assets/nabcb_new.jpg'; // Path relative to 'src'
private readonly papl_image='assets/seal.png';


  async generatePDF1() {

  



  setTimeout(() => {
    this.isLoading = true;
    this.cdr.detectChanges(); // Trigger change detection manually
  }, 2000);
  // const doc = new jsPDF('landscape', 'mm', 'a4') as jsPDF & { autoTable: (options: any) => void };
 

  // this.apicallservice.insert_data_recordvalues_prepared(this.preparedData_pit,this.preparedData_cabin,this.preparedData_cartop,this.preparedData_floorlanding,this.preparedData_machineroom, this.docid, this.inf_contract_number).subscribe((result:any)=>{},(error:any)=>{})


  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true, // Enable compression
  }) as jsPDF & { autoTable: (options: any) => void };
  

  
  
doc.addFileToVFS('calibri-bold.ttf', this.dataservice.calibriBoldBase64);
doc.addFont('calibri-bold.ttf', 'calibri', 'bold');
doc.addFileToVFS('calibri-regular.ttf', this.dataservice.calibriRegularBase64);
doc.addFont('calibri-regular.ttf', 'calibri', 'normal');


  const totalPagesExp = "{total_pages_count_string}";

  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
this.headervalue=this.headervalue.toUpperCase()
  

  // Function to add content, including images
  const addContent = () => {
    // Add company logo and report logo to the content area
    doc.addImage(this.companyLogoPath, 'PNG', 18.5, 15, 60, 20); // Adjust position and size as needed

    const imageXPosition = pageWidth - 40; // X position of the image
    const imageWidth = 25; // Width of the image
    const imageEndXPosition = imageXPosition + imageWidth; // End position of the image on X axis

    doc.addImage(this.reportLogoPath, 'PNG', imageXPosition, 16, imageWidth, 25); // Add the image

    // Add text below company logo
    doc.setFontSize(10);
    doc.setFont('calibri', 'bold');
    doc.text('VHT PLANNERS, ENGINEERS & INSPECTORS', 20, 37);
    doc.text('ELEVATORS, ESCALATORS & MOVING WALKS', 20, 41);

   const Title='ELEVATOR INSPECTION REPORT'
    
    const textWidth = doc.getTextWidth(Title);
    const x = (pageWidth - textWidth) / 2-20; // Center-align with page width
    doc.setFont('calibri', 'bold');
    doc.setFontSize(20)
    doc.text(Title, x, 60);

    doc.setFontSize(12)
    const title="Project Name:"
    doc.text(title,20,80)
    doc.setFont('calibri', 'normal');

    doc.text(this.projectName,doc.getTextWidth(title)+21,80)
    // doc.text(this.projectName,65,70)

    doc.setFont('calibri', 'bold');
    doc.text("Building No:",20,90)
    doc.setFont('calibri', 'normal');
    // doc.setFontSize(10);
    doc.text(this.buildingNO,doc.getTextWidth("Building No:")+21,90)

    doc.setFont('calibri', 'bold');
    doc.text("Place:",20,100)
    doc.setFont('calibri', 'normal');
    // doc.setFontSize(10);
    doc.text(this.place,doc.getTextWidth("Place:")+21,100)

    doc.setFont('calibri', 'bold');
    doc.text("Contract No:",20,110)
    doc.setFont('calibri', 'normal');
    // doc.setFontSize(10);
    doc.text(this.contractNo.replace('-', '/'),doc.getTextWidth("Contract No:")+21,110)

    doc.setFont('calibri', 'bold');
    doc.text("Report ID:",20,120);
    doc.setFont('calibri', 'normal');
    // doc.setFontSize(10);
    doc.text(this.documentidForUrl+"/"+this.report_id,doc.getTextWidth("Report No:")+21,120)

    doc.setFont('calibri', 'bold');
    doc.text("Date of Inspection:",20,130)
    doc.setFont('calibri', 'normal');
    // doc.text("FROM",55,120)
    // doc.setFontSize(10);

    if(this.Rep_From === this.Rep_to )
    {
      doc.text(this.Rep_From,doc.getTextWidth("Date of Inspection:")+21,130)
  
    }
    else{
      doc.text("From "+this.Rep_From+" To "+this.Rep_to,doc.getTextWidth("Date of Inspection:")+21,130)
  
    }
      // doc.text("TO",20,120)
    // doc.text(this.Rep_to,20,120)

    doc.setFont('calibri', 'bold');
    doc.text("Inspector Name / Code:",20,140)
    doc.setFont('calibri', 'normal');
    // doc.setFontSize(10);
    doc.text(this.inspectorNameandCode as string,doc.getTextWidth("Inspector Name / Code:")+21,140)


    const yPosition = pageHeight - 50;

    // doc.line(20, yPosition, pageWidth - 10, yPosition);
    doc.line(20, yPosition+20, imageEndXPosition, yPosition+20);

    const pageWidth_address = doc.internal.pageSize.width; // Get the page width
    console.log("pagewitdh",pageWidth,pageWidth_address)

    const text = "PAPL CORP PRIVATE LIMITED NO 389, 2nd floor, Nehru Nagar, 1st Main Road, Kottivakkam, OMR, Chennai-600 041";
    const textWidth_address = doc.getTextWidth(text); // Calculate the width of the text
    
    const xPosition = (pageWidth_address - textWidth_address) / 2; // Calculate the X position to center the text
    const yPosition_address = doc.internal.pageSize.height - 50 + 25; // Adjust the Y position as needed
    
    doc.setFont('calibri', 'normal');
    doc.setFontSize(12)
    doc.text(text, xPosition, yPosition_address);  // doc.setFont('calibri', 'normal');
    // doc.text(this.projectName, doc.getTextWidth("Project Name:") + 21, );

    if (this.imageData) {
      // Make sure the Base64 data is properly prefixed and formatted
      const base64Prefix = 'data:image/jpeg;base64,';
      const imageData =  base64Prefix + this.imageData;
    
      const x = 190; // X position
      const y = 70; // Y position
       // Example value, set this according to your requirement
    
      // Calculate the width so that the image's right end is at imageEndXPosition
      const width = imageEndXPosition - x; // Width of the image
      const height = 80; // Height of the image
    
      // Add the image to the PDF
      doc.addImage(imageData, 'JPEG', x, y, width, height);
    } else {
      console.error('No image data provided');
    }

      };





      // Function to add header
  const addHeader = () => {
    doc.setFontSize(7);
    doc.setTextColor(40);
    doc.setFont('calibri', 'normal');
    const textWidth = doc.getTextWidth(this.headervalue);
    const x = pageWidth - textWidth - 20; // Right-align with margin
    doc.setFont('calibri', 'normal');
    doc.text(this.headervalue, x, 12);
  };

  // Function to add footer
  const addFooter = () => {
    doc.setFontSize(7);
    doc.setTextColor(40);
    doc.setFont('calibri', 'normal');
    const text = 'PAPL/INF/22 A, VER.2.0, 10-07-2024';
    const textWidth = doc.getTextWidth(text);
    const x = pageWidth - textWidth - 20; // 10mm margin from the right
    doc.setFont('calibri', 'normal');
    doc.text(text, x, pageHeight - 10);
  };




  
  const addContent2 = () => {
    doc.setFontSize(12);
    doc.setFont('calibri', 'bold');

    doc.text('Prepared By.', (pageWidth - doc.getTextWidth('Prepared By.')) / 2,20)
    const textWidth = doc.getTextWidth("Prepared By.");

// Calculate the Y position for the underline (slightly below the text)
    let underlineY = 20 + 1; // Adjust the value as needed for the underline position

// Set color for the underline (optional, RGB format for black)
doc.setDrawColor(0, 0, 0); // RGB for black

// Draw the underline
doc.line((pageWidth - doc.getTextWidth('Prepared By.')) / 2, underlineY, (pageWidth - doc.getTextWidth('Prepared By.')) / 2 + textWidth, underlineY);



// PAPL CORP PRIVATE LIMITED
doc.setTextColor(0, 0, 255);
doc.text('PAPL CORP PRIVATE LIMITED', (pageWidth - doc.getTextWidth('PAPL CORP PRIVATE LIMITED')) / 2,25);

doc.setTextColor(0, 0, 0);
doc.text('VHT PLANNERS, ENGINEERS & INSPECTORS', (pageWidth - doc.getTextWidth('VHT PLANNERS, ENGINEERS & INSPECTORS')) / 2,30);

doc.text('Corporate Office', (pageWidth - doc.getTextWidth('Corporate Office')) / 2,35);
doc.setDrawColor(0, 0, 0); // RGB for black

// Draw the underline
underlineY=35+1
doc.line((pageWidth - doc.getTextWidth('Corporate Office')) / 2, underlineY, (pageWidth - doc.getTextWidth('Corporate Office')) / 2 + doc.getTextWidth('Corporate Office'), underlineY);



// NO.389, 2nd floor, Nehru Nagar, 1st Main Road, Kottivakkam, OMR, Chennai-600 041
doc.setFont('calibri', 'normal');
doc.text('No.389, 2nd floor, Nehru Nagar, 1st Main Road, Kottivakkam, OMR, Chennai-600 041. India', (pageWidth - doc.getTextWidth('NO.389, 2nd floor, Nehru Nagar, 1st Main Road, Kottivakkam, OMR, Chennai-600 041. India')) / 2,40);

doc.text('Tel: +919884507535', (pageWidth - doc.getTextWidth('Tel: +919884507535')) / 2,44)

doc.setTextColor(0,0,225)
doc.text('E: info@paplcorp.com W: www.paplcorp.com', (pageWidth - doc.getTextWidth('E: info@paplcorp.com W: www.paplcorp.com')) / 2,48)


const boxWidth = 297 - 20 - 20; // Width of the box
const boxHeight = 100; // Increased height for additional text
const marginLeft = 20; // Left margin for the box
const marginTop = 60; // Top margin for the box
const lineHeight = 4; // Line height for text
const textX = marginLeft + 3; // X position for text within the box
const textY = marginTop + 8; // Initial Y position for text within the box

// Ensure the drawing color is visible
doc.setDrawColor(0, 0, 255); // Set color to blue for visibility
doc.setFillColor(255, 255, 255); // Optional: Set background color for the box
doc.rect(marginLeft, marginTop, boxWidth, boxHeight); // Fill the box

// Main text content with placeholders for bold sections
    let mainText = `Inspection carried out on Elevators installed in ${this.projectName}, ${this.place} as per check list IS 14665 (Part 5): 1999. NBC 2016 PART 8/ Sec. 5A, ANNEX- A (Clause15.5) & EN 81-20 `;

if(this.Rep_From===this.Rep_to)
{
mainText=mainText+`On ${this.Rep_From}`
}
else{

mainText=mainText+`From ${this.Rep_From} To ${this.Rep_to}`
}

// mainText=mainText+

// Additional text
const additionalText1 = "For & on behalf of";
const additionalText2 = "PAPL CORP PRIVATE LIMITED";
const inspectedByText = "Inspected by:";
const inspectorName = this.inspectedBy;
const inspectorRole = "(Inspector)";
const approvedByText = "Approved by:";
const approvedByName = this.approvedBy;
const approvedByRole = "(HEAD-QuEST)";

// Function to wrap text within a fixed width
function wrapText(text: string, maxWidth: number) {
const words = text.split(' ');
let lines = [];
let line = '';

words.forEach((word) => {
    const testLine = line + word + ' ';
    const testWidth = doc.getTextWidth(testLine);
    if (testWidth > maxWidth) {
        lines.push(line.trim());
        line = word + ' ';
    } else {
        line = testLine;
    }
});
lines.push(line.trim());

return lines;
}

// Calculate available width for text
const textWidth1 = boxWidth - 10; // Adjust for padding/margin

// Wrap the main text to fit within the box width
const wrappedText = wrapText(mainText, textWidth1);

// Draw each line within the box
doc.setFont('calibri', 'normal');
doc.setTextColor(0, 0, 0); // Text color black

wrappedText.forEach((line, index) => {
const lineY = textY + (index * lineHeight);

// Function to draw text with parts in bold
const drawBoldText = (line: any, xPos: number, lineY: number) => {
    let remainingText = line;
    while (remainingText.length > 0) {
        // Find the start positions of all bold placeholders
        const startProjectName = remainingText.indexOf(this.projectName);
        const startPlace = remainingText.indexOf(this.place);
        const startRepFrom = remainingText.indexOf(this.Rep_From);
        const startRepTo = remainingText.indexOf(this.Rep_to);

        // Determine which placeholder comes first
        const positions = [startProjectName, startPlace, startRepFrom, startRepTo].filter(pos => pos !== -1);
        if (positions.length === 0) {
            // Draw remaining text if no bold placeholders
            doc.setFont('calibri', 'normal');
            doc.text(remainingText, xPos, lineY);
            remainingText = '';
            return;
        }

        const firstPosition = Math.min(...positions);
        const beforeText = remainingText.substring(0, firstPosition);
        let boldText = '';
        let afterText = '';

        if (firstPosition === startProjectName) {
            boldText = this.projectName;
            afterText = remainingText.substring(firstPosition + boldText.length);
        } else if (firstPosition === startPlace) {
            boldText = this.place;
            afterText = remainingText.substring(firstPosition + boldText.length);
        } else if (firstPosition === startRepFrom) {
            boldText = this.Rep_From;
            afterText = remainingText.substring(firstPosition + boldText.length);
        } else if (firstPosition === startRepTo) {
            boldText = this.Rep_to;
            afterText = remainingText.substring(firstPosition + boldText.length);
        }

        // Draw text before the bold section
        doc.setFont('calibri', 'normal');
        doc.text(beforeText, xPos, lineY);

        // Draw bold section
        xPos += doc.getTextWidth(beforeText);
        doc.setFont('calibri', 'bold');
        doc.text(boldText, xPos, lineY);

        // Update remaining text and position
        xPos += doc.getTextWidth(boldText);
        remainingText = afterText;
    }
}

// Draw the line with bold placeholders
drawBoldText.call(this, line, textX, lineY);
});
// Your text
const text = "PAPL CORP PRIVATE LIMITED disclaims any responsibility to the clients and others in respect of any matter beyond the scope of contract.";

// Calculate the width of the text
const textWidth_pla = doc.getTextWidth(text);

// Get the page width
const pageWidth12 = doc.internal.pageSize.getWidth();

// Calculate the X position for center alignment
const xPos = (pageWidth12 - textWidth_pla) / 2;
doc.setFont('calibri', 'normal');
// Add the text to the PDF at the calculated X position
doc.text(text, xPos, boxHeight + 68);

// Draw additional text "For & on behalf of"
const additionalTextY1 = textY + (wrappedText.length * lineHeight) + lineHeight;
doc.setFont('calibri', 'normal');
doc.setTextColor(0, 0, 0); // Text color black
doc.text(additionalText1, textX, additionalTextY1);

// Draw "PAPL CORP PRIVATE LIMITED" in blue and bold
const additionalTextY2 = additionalTextY1 + lineHeight;
doc.setFont('calibri', 'bold');
doc.setTextColor(0, 0, 255); // Set color to blue
doc.text(additionalText2, textX, additionalTextY2);




// Draw "Inspected by:" in bold black
const inspectedByTextY = additionalTextY2 + lineHeight + 15;
doc.setFont('calibri', 'bold');
doc.setTextColor(0, 0, 0); // Set color to black
doc.text(inspectedByText, textX+8, inspectedByTextY);

// Draw inspector name in bold black
const inspectorNameY = inspectedByTextY + lineHeight;
doc.setFont('calibri', 'bold');
doc.setTextColor(0, 0, 0); // Set color to black
doc.text(inspectorName, textX+8, inspectorNameY);

// Draw "(Inspector)" in bold black
const inspectorRoleY = inspectorNameY + lineHeight;
doc.setFont('calibri', 'bold');
doc.setTextColor(0, 0, 0); // Set color to black
doc.text(inspectorRole, textX+8, inspectorRoleY);



// Draw "Approved by:" in bold black
const approvedByTextY = additionalTextY2 + lineHeight + 15;
doc.setFont('calibri', 'bold');
doc.setTextColor(0, 0, 0); // Set color to black
doc.text(approvedByText, 297-5- 20-8 -(doc.getTextWidth(approvedByText)), approvedByTextY);

// Draw approved by name in bold black
const approvedByNameY = approvedByTextY + lineHeight;
doc.setFont('calibri', 'bold');
doc.setTextColor(0, 0, 0); // Set color to black
doc.text(approvedByName, 297-5- 20-8 -(doc.getTextWidth(approvedByName)), approvedByNameY);

// Draw "(HEAD-QuEST)" in bold black
const approvedByRoleY = approvedByNameY + lineHeight;
doc.setFont('calibri', 'bold');
doc.setTextColor(0, 0, 0); // Set color to black
doc.text(approvedByRole,  297-5- 20-8 -(doc.getTextWidth(approvedByRole)), approvedByRoleY);

const place = additionalTextY2 + lineHeight + 20;


const imageTop = place + 20;
// Height of the image
const imageHeight = 20;
// Bottom position of the image
const imageBottom = imageTop + imageHeight;


doc.setFont('calibri', 'bold');
doc.setTextColor(0, 0, 0); // Set color to black
doc.text("Place:", textX, imageBottom-5);  
doc.text(this.approvedPlace, textX+doc.getTextWidth("Place:"), imageBottom-5);  


doc.text("Date:", textX,imageBottom);  
doc.text(this.approvedDate, textX+doc.getTextWidth("Date:"), imageBottom);  


// Draw the image
doc.addImage(this.papl_image, 'PNG', 297 - 43-8, imageTop-3, 20, imageHeight);

// Align text with the bottom of the image
doc.text("Official Seal", 297 - 43-8, imageBottom+3);




}

const addContent3 = () => {
  const boxWidth = 297 - 20 - 20; // Width of the box
  const boxHeight = 100; // Height for additional text
  const marginLeft = 20; // Left margin for the box
  const marginTop = 60; // Top margin for the box
  const lineHeight = 6; // Line height for text
  const textX = marginLeft + 3; // X position for text within the box
  let textY = marginTop + 8; // Initial Y position for text within the box

  const disclaimerText = "DISCLAIMER";
  const textWidth = doc.getTextWidth(disclaimerText);
  const centerX = marginLeft + (boxWidth / 2) - (textWidth / 2);

  doc.setFont('calibri', 'bold'); // Set the font and style for "Disclaimer"
  doc.setFontSize(14);
  doc.text(disclaimerText, centerX, 55);
  doc.setFont('calibri', 'normal'); // Set the font and style for "Disclaimer"
  doc.setFontSize(12);
  // Ensure the drawing color is visible
  doc.setDrawColor(0, 0, 255); // Set color to blue for visibility
  doc.setFillColor(255, 255, 255); // Optional: Set background color for the box
  doc.rect(marginLeft, marginTop, boxWidth, boxHeight); // Fill the box

  // Main text content with placeholders for bold sections
  let mainText = `THIS IS A VISUAL INSPECTION ONLY limited to those areas and sections of the elevator, hoistway, pit, machine room and lobbies fully accessible and visible to the Inspector on the date of Inspection. Some photos taken at site may be presented in this report for courtesy/information or to clarify where the inspector has been, what was looked at and the condition of the component at the time of the inspection. Some pictures may be of deficiencies or problem areas, these are to help you better understand what is documented in the report and may allow you to see areas or items you normally may not see.  It may not be possible to present  all the photos to evidence deficiencies.  DISCLAIMER OF LIABILITY: No Liability shall be accepted on an account of failure of the Report to notify any problems in the area(s) or section(s) related to vertical transportation of the subject property physically inaccessible for inspection, or to which access for Inspection is denied by or to the Inspector (including but not limited to or any area(s) or section(s) so specified by the Report) DISCLAIMER OF LIABILITY TO THE THIRD PARTIES: This Report is made solely for the use and benefit of the Client named on the front of this report. No liability or responsibility whatsoever, in contract or tort, is accepted to any third party who may rely on the report wholly or in part. Any third party acting or relying on this report, in whole or in part does so at his or her own risk. This report will assist client and their maintenance team in identifying ways to improve rider safety and will not be used to assign blame or liability direct or consequential.`;

  // Function to wrap text within a fixed width
  function wrapText(text: string, maxWidth: number) {
    const words = text.split(' ');
    let lines = [];
    let line = '';

    words.forEach((word) => {
      const testLine = line + word + ' ';
      const testWidth = doc.getTextWidth(testLine);
      if (testWidth > maxWidth) {
        lines.push(line.trim());
        line = word + ' ';
      } else {
        line = testLine;
      }
    });
    lines.push(line.trim());

    return lines;
  }

  // Function to justify text within a line
  function justifyText(line: string, xPos: number, lineY: number, maxWidth: number) {
    const words = line.split(' ');
    if (words.length < 2) {
      doc.text(line, xPos, lineY);
      return;
    }

    const totalWidth = words.reduce((width, word) => width + doc.getTextWidth(word + ' '), 0);
    const spaceWidth = (maxWidth - totalWidth) / (words.length - 1);

    let xOffset = xPos;
    words.forEach((word, index) => {
      doc.text(word, xOffset, lineY);
      xOffset += doc.getTextWidth(word + ' ') + spaceWidth;
    });
  }

  // Calculate available width for text
  const textWidth1 = boxWidth - 10; // Adjust for padding/margin

  // Wrap the main text to fit within the box width
  const wrappedText = wrapText(mainText, textWidth1);

  // Draw each line within the box
  doc.setFont('calibri', 'normal');
  doc.setTextColor(0, 0, 0); // Text color black

  wrappedText.forEach((line, index) => {
    const lineY = textY + (index * lineHeight);
    justifyText(line, textX, lineY, textWidth1);
  });

  doc.setFontSize(12)

  // Your text
const text = "PAPL CORP PRIVATE LIMITED disclaims any responsibility to the clients and others in respect of any matter beyond the scope of contract.";

// Calculate the width of the text
const textWidth_pla = doc.getTextWidth(text);

// Get the page width
const pageWidth = doc.internal.pageSize.getWidth();

// Calculate the X position for center alignment
const xPos = (pageWidth - textWidth_pla) / 2;

// Add the text to the PDF at the calculated X position
// doc.text(text, xPos, boxHeight + 68);
};





const addContent4 = () => {
  const text = "INDEX";
  const pageWidth = doc.internal.pageSize.width;
  const textWidth = doc.getTextWidth(text);
  const x = (pageWidth - textWidth) / 2; // Center the text horizontally

  doc.setFontSize(12);
  doc.setFont('calibri', 'bold');
  doc.text(text, x, 50);

  autoTable(doc, {
    head: [['S.NO', 'CONTENT']],
    body: [
      ['1', 'EXECUTIVE SUMMARY'],
      ['2', 'BRIEF SPECIFICATION'],
      ['3','QUALITY EVALUATION & PERFORMANCE RATING'],
      ['4', 'EMERGENCY OPERATIONS'],
      ['5', 'OBSERVATIONS NEED ATTENTION'],
      ['6', 'PIT DETAILED REPORT'],
      ['7', 'CABIN DETAILED REPORT'],
      ['8', 'CAR TOP DETAILED REPORT'],
      ['9', 'MACHINE ROOM DETAILED REPORT'],
      ['10', 'FLOOR LANDING DETAILED REPORT']
    ],
    startY: 60, // Start the table below the default margin
    theme: 'striped',
    margin: { top: 20, right: 30, bottom: 20, left: 30 },
    columnStyles: {
      0: { // For the 'S.NO' column
        halign: 'center', // Center the S.NO column
        cellWidth: 12, // Adjust the width as needed
      },
      1: { // For the 'CONTENT' column
        halign: 'center', // Align CONTENT to the left
       
      },
    },
    styles: {
      halign: 'center', // Center align the text horizontally for all cells
      lineColor: [0, 0, 0], // Black border color
      lineWidth: 0.5 // Border width
    },
    headStyles: {
      halign: 'center', // Center align the header text horizontally
      fillColor: [255, 255, 204], // Orange background color
      textColor: [0, 0, 0] // Header text color (black)
    },
    bodyStyles: {
      font: 'calibri', // Set font family
      fontStyle: 'normal', // Set font style
      textColor: [0, 0, 0], // Set text color to black
    },
  });
};



const addContent_Executive_summary=()=>{

  const text = "EXECUTIVE SUMMARY";
    const pageWidth = doc.internal.pageSize.width;
    const textWidth = doc.getTextWidth(text);
    const x = (pageWidth - textWidth) / 2; // Center the text horizontally

    doc.setFontSize(12);
    doc.setFont('calibri', 'bold');
    doc.setTextColor(95, 131, 248);
    doc.text(text, x, 35);

    doc.setFontSize(12);
    doc.setFont('calibri', 'bold');
    doc.setTextColor(16, 84, 42);
    doc.text("BASIC INFORMATION", 20, 40);

    doc.setFont('calibri', 'normal');
    doc.setTextColor(0,0,0);
    const unitCount = this.Ordered_unit_count;
    const inspectorName = this.inspectorNameandCode ? this.inspectorNameandCode.split(' - ')[0] || "" : "";
    let repFrom = ""

    if(this.Rep_From===this.Rep_to)
      {
        repFrom=repFrom+`On ${this.Rep_From}`
      }
      else{
      
        repFrom=repFrom+`From ${this.Rep_From} To ${this.Rep_to}`
      }
    
    let content = `The inspection of '${unitCount}' ${unitCount === 1 ? 'unit' : 'units'} covered in this report and carried out '${repFrom}' by '${inspectorName}' INSPECTOR PAPL CORP PRIVATE LIMITED in the presence of`;
    
    // Set font and size
 
    
    // Define margins and page width
    const leftMargin = 20; // 20mm left margin
    const rightMargin = 20; // 20mm right margin
    const pageWidth1 = doc.internal.pageSize.getWidth();
    const textWidth1 = pageWidth1 - leftMargin - rightMargin; // Width available for text
    
    // Split text into lines that fit within the page width minus margins
    const lines = doc.splitTextToSize(content, textWidth1);
    
    // Set y position and line height
    const yStart = 47;
    const lineHeight =4; // Adjust line height as needed
    
    // Add each line to the document with right alignment
    lines.forEach((line:any , index: number) => {
      // Calculate the width of the line
      const lineWidth = doc.getStringUnitWidth(line) * doc.internal.scaleFactor;
      // Calculate the x position for right alignment
      const xPos = pageWidth - rightMargin - lineWidth;
      
      doc.text(line, 20, yStart + index * lineHeight);
    });


    const tableHeaders = [['SI.No', 'NAME', 'COMPANY NAME', 'DESIGNATION']];

    // Define the table body

    console.log("witnessDetails",this.witnessDetailsArray)


    const tableBody = this.witnessDetailsArray.map((person, index) => [
      (index + 1).toString(), // SI.No
      person.name,
      person.company,
      person.designation
    ]);

    // Add the table to the PDF
   // Add the table to the PDF
   autoTable(doc, {
    head: tableHeaders,
    body: tableBody,
    startY: 60, // Start the table below the default margin
    theme: 'striped', // Apply striped table theme
    margin: { top: 20, right: 30, bottom: 20, left: 30 }, // Set margins
    styles: {
      halign: 'center', // Center-align text
      lineColor: [0, 0, 0], // Black border color
      lineWidth: 0.25 // Border width
     
    },
    headStyles: {
      halign: 'center', // Center-align header text
      fillColor: [255,255,204], // Yellow background color for header
      textColor: [0, 0, 0], // Text color (black)
      lineColor: [0,0,0,],
      lineWidth: 0.25
       // Thin border for headers
    },
    bodyStyles: {
      lineWidth: 0.25,
      lineColor: [0,0,0,],
      font: 'calibri', // Set font family
      fontStyle: 'normal', // Set font style
      textColor: [0, 0, 0], // Set text color to black

    },
   

  });
    
    // Add the table to the PDF
   
   

}


// const addContent_Brief_Executive_summary=()=>{

//   const text = "BRIEF SPECIFICATION";
//     const pageWidth = doc.internal.pageSize.width;
//     const textWidth = doc.getTextWidth(text);
//     const x = (pageWidth - textWidth) / 2; // Center the text horizontally

//     doc.setFontSize(12);
//     doc.setFont('calibri', 'bold');
//     doc.setTextColor(0, 0, 0);
//     doc.text(text, x, 25);

//     doc.setFontSize(11);
//     doc.setFont('calibri', 'bold');

//      // Define the table headers
//      const headers = [
//       ['REQUIRED KEY CONTENTS', ...this.Ordered_unit]
//     ];
  
//     // Function to check if all elements in an array are equal
//     const allEqual = (arr: string[]) => arr.every(val => val === arr[0]);
  
//     // Extract OEM / Service Provider values
//     const oemServiceProviders = this.BriefmultiDimArray.map(item => `${item.oem} / ${item.service_provider}`);
//     console.log('breif',this.BriefmultiDimArray);
//     console.log('ordered unit',this.Ordered_unit);
//     console.log('Sorted BriefmultiDimArray:', this.BriefmultiDimArray);
//    // Check if all OEM / Service Provider values are equal
//     const areAllOemServiceProvidersEqual = allEqual(oemServiceProviders);
  
//     const body1 = this.Ordered_unit.map((unit, index) => {

//     });


//     // Define the table body
//     const body = [
//       areAllOemServiceProvidersEqual ? ['OEM / Service Provider',{ content: oemServiceProviders[0], colSpan: this.Ordered_unit_count }] : ['OEM / Service Provider', ...oemServiceProviders],
//       ['Year of Manufacture', ...this.BriefmultiDimArray.map(item => item.year_of_manufacture)],
//       ['Machine Serial No', ...this.BriefmultiDimArray.map(item => item.motor_serial_number)],
//       ['EQUIPMENT TYPE/USAGE/ M/C.LOCATION', ...this.BriefmultiDimArray.map(item => item.type_of_equipment+` / `+item.type_of_usage+` / `+item.machine_location)],
//       ['MACHINE TYPE & MOTOR DETAILS(KW, VOLT, AMP, FREQ., RPM)', ...this.BriefmultiDimArray.map(item => item.machine_type+` & `+item.motor_kilo_watt+`, `+item.motor_voltage+`, `+item.motor_current_in_ampere+`, `+item.motor_frequency+`, `+item.motor_rpm)],
     
      
//       ['CAPACITY (PAX/ Kg.) & SPEED (m/s.)', ...this.BriefmultiDimArray.map(item => item.capacity+` & `+item.speed)],
//       ['Operating System/Grouping Type', ...this.BriefmultiDimArray.map(item => item.type_of_operation+` / `+item.grouping_type)],
//       ['STOPS / OPENINGS & FLOOR DESIGNATIONS', ...this.BriefmultiDimArray.map(item => item.floor_stops+` / `+item. floor_opening+` & `+item. floor_designation)],

//       ['TRACTION DETAILS (ROPES/ BELTS, Nos., SIZE, ROPING)', ...this.BriefmultiDimArray.map(item => item.rope_category+`, `+item.  number_of_rope_belt+`, `+item.  rope_size+`, `+item.  type_of_roping)],

//       ['CABIN SIZE (Width x Depth x Height)', ...this.BriefmultiDimArray.map(item => item.cabin_width+` x `+item. cabin_depth+` x `+item. cabin_height)],

//       ['ENTRANCE SIZE (Width X Height)/ TYPE OF OPENING', ...this.BriefmultiDimArray.map(item => item.entrance_width+` x `+item.  entrance_height+` / `+item. entrance_type_of_opening)],
  

//       ['GOVERNOR DETAILS-SPEED (Normal, Elect. Tripping/ Mech tripping) & Rope Dia.', ...this.BriefmultiDimArray.map(item => item.car_governor_normal_speed+`, `+item.  car_governor_electric_tripping_speed+` / `+item.  car_governor_mechanical_tripping_speed+` & `+item.car_governor_rope_dia)],
    
//       ['CAR FEATURE: INDICATOR, BUTTONS, VOICE, DOOR SENSOR.', ...this.BriefmultiDimArray.map(item => item.car_indicator_type+`, `+item.  car_stop_button+`, `+item.  car_voice_announcement+`, -----`)],

//       ['HALL FEATURE: INDICATOR, BUTTONS, HALL LANTERNS, ARRIVAL CHIME, No. OF RISER (MAIN & OTHER FLOORS)', ...this.BriefmultiDimArray.map(item => item.hall_indicator_type+`, `+item. hall_call_type_at_all_floors+`, `+item. hall_lantems+`, `+item. hall_arrival_chime+`, `+item.no_of_risers_at_main_lobby+` & `+item.no_of_risers_at_other_floors)],

//     ];
  
//     // Add the table to the PDF
//     autoTable(doc, {
//       head: headers,
//       body: body,
//       startY: 29, // Adjust as needed
//       theme: 'striped',
//       margin: { top: 10, right: 10, bottom: 10, left: 10 },
//       styles: {
//         halign: 'center',
//         lineColor: [0, 0, 0],
//         lineWidth: 0.5,
        
//       },
      
//       headStyles: {
//         halign: 'center',
//         fillColor: [255,255,204],
//         textColor: [0, 0, 0],
//         lineWidth:0.25
//       }, bodyStyles: {
        
//         lineWidth: 0.25,
//     font: 'calibri', // Set font family
//     fontStyle: 'normal', // Set font style
//     textColor: [0, 0, 0], // Set text color to black
//     cellPadding: 0.8,


//       }
//     });


// }
const addContent_Brief_Executive_summary=()=>{

  const text = "BRIEF EQUIPMENT DETAILS";
    const pageWidth = doc.internal.pageSize.width;
    const textWidth = doc.getTextWidth(text);
    const x = (pageWidth - textWidth) / 2; // Center the text horizontally

    doc.setFontSize(12);
    doc.setFont('calibri', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(text, x, 25);

    doc.setFontSize(12);
    doc.setFont('calibri', 'bold');

     // Define the table headers
     const headers = [
      ['UNIT NOMENCLATURE', ...this.Ordered_unit]
    ];
  
    // Function to check if all elements in an array are equal
    const allEqual = (arr: string[]) => arr.every(val => val === arr[0]);
  
    // Extract OEM / Service Provider values
    const oemServiceProviders = this.BriefmultiDimArray.map(item => `${item.oem} / ${item.service_provider}`);
    console.log('breif',this.BriefmultiDimArray);
    console.log('ordered unit',this.Ordered_unit);

    // previously sorted this array to respective order
    // this.BriefmultiDimArray.sort((a: any, b: any) => {
    //   return this.Ordered_unit.indexOf(a.unit_no) - this.Ordered_unit.indexOf(b.unit_no);
    // });


    

    
    console.log('Sorted BriefmultiDimArray:', this.BriefmultiDimArray);
    
    
    
  
    // Check if all OEM / Service Provider values are equal
    const areAllOemServiceProvidersEqual = allEqual(oemServiceProviders);
  
    const body1 = this.Ordered_unit.map((unit, index) => {

    });


    // Define the table body
    const body = [
      areAllOemServiceProvidersEqual ? ['OEM / Service Provider',{ content: oemServiceProviders[0], colSpan: this.Ordered_unit_count }] : ['OEM / Service Provider', ...oemServiceProviders],
      ['Year of Manufacture', ...this.BriefmultiDimArray.map(item => item.year_of_manufacture)],
      ['Machine Serial No', ...this.BriefmultiDimArray.map(item => item.motor_serial_number)],
      ['Capacity', ...this.BriefmultiDimArray.map(item => item.capacity)],
      ['Speed', ...this.BriefmultiDimArray.map(item => item.speed)],
      ['Number of Stops/Opening', ...this.BriefmultiDimArray.map(item => item.floor_stops+` / `+item.	floor_opening)],
      ['Equipment Type/Usage/Location', ...this.BriefmultiDimArray.map(item => item.type_of_equipment+` / `+item.type_of_usage+` / `+item.machine_location)],
      
      ['Operating System', ...this.BriefmultiDimArray.map(item => item.type_of_operation)],
    ];
  
    // Add the table to the PDF
    autoTable(doc, {
      head: headers,
      body: body,
      startY: 29, // Adjust as needed
      theme: 'striped',
      margin: { top: 20, right: 30, bottom: 20, left: 30 },
      styles: {
        halign: 'center',
        lineColor: [0, 0, 0],
        lineWidth: 0.5
      },
      headStyles: {
        halign: 'center',
        fillColor: [255,255,204],
        textColor: [0, 0, 0],
        lineWidth:0.25
      }, bodyStyles: {lineWidth: 0.25,
    font: 'calibri', // Set font family
    fontStyle: 'normal', // Set font style
    textColor: [0, 0, 0], // Set text color to black


      }
    });


}

const addcontent_EMERGENCY_OPERATIONS=()=>{
  const text = "EMERGENCY OPERATIONS";
    const pageWidth = doc.internal.pageSize.width;
    const textWidth = doc.getTextWidth(text);
    const x = (pageWidth - textWidth) / 2; // Center the text horizontally

    doc.setFontSize(12);
    doc.setFont('calibri', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(text, x, 25);

    // Define the table headers
    const headers = [
      [
        'UNITS',
        'EMERGENCY\nALARM',
        'EMERGENCY\nLIGHT',
        'INTERCOM',
        'ARD',
        'FIREMAN',
        'MANUAL\nRESCUE'
      ]
    ];


    // Define the table body
    const body: string[][] = [];
console.log("***",this.Ordered_unit,this.emergency_Table_Data)
    this.Ordered_unit.forEach(unit => {
      this.emergency_Table_Data.forEach((dummy, i) => {
        if (dummy.unit_no === unit) {
          body.push([
            unit,
            dummy.Emergency_al,
            dummy.Emergency_Li,
            dummy.Intercom,
            dummy.ARd,
            dummy.Fireman,
            dummy.Manual_Res
          ]);
        }
      });
    });

    // Add the table to the PDF
    autoTable(doc, {
      head: headers,
      body: body,
      startY: 29, // Adjust as needed
      theme: 'striped',
      margin: { top: 20, right: 30, bottom: 20, left: 30 },
      styles: {
        halign: 'center' as HAlignType,
        lineColor: [0, 0, 0],
        lineWidth: 0.5
      },
      headStyles: {
        halign: 'center' as HAlignType,
        fillColor: [255,255,204],
        textColor: [0, 0, 0],
        lineWidth:0.25
      },
      bodyStyles: {
       
    font: 'calibri', // Set font family
    fontStyle: 'normal', // Set font style
    textColor: [0, 0, 0], // Set text color to black
 


        halign: 'center' as HAlignType,
        lineWidth:0.25
      }, didParseCell: (data: CellHookData) => {
        if (data.section === 'body') {
          const cell = data.cell;
          const column = data.column.index;

          if (column > 0 && cell.raw === 'Working') {
            cell.styles.textColor = 'green';
          } else if (column > 0) {
            cell.styles.textColor = 'red';
          }
        }
      }
    });


}



const addcontent_FOLLOWING_OBSERVATION_pit = () => {
  const text = "OBSERVATIONS NEED ATTENTION - PIT";
  const pageWidth = doc.internal.pageSize.width;
  const textWidth = doc.getTextWidth(text);
  const x = ((pageWidth - textWidth) / 2)-7; // Center the text horizontally

  doc.setFontSize(12);
  doc.setFont('calibri', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(text, x, 25);

  // Define the table headers dynamically from Ordered_unit
  const headers = ['S.No.', ...this.Ordered_unit]; // Add "S.No." as the first header

  // Define the table body
  const body: string[][] = [];
  console.log("+=+=>", this.Pit_ObservationPoints);

  // Create rows for each observation index
  for (let rowIndex = 0; rowIndex < this.getMaxObservations_pit(); rowIndex++) {
    const row: string[] = [String(rowIndex + 1)]; // Add the serial number to the row
    const observationRow = this.Ordered_unit.map(unit => {
      const content = this.Pit_ObservationPoints[unit][rowIndex] || '-'; // Replace empty values with "-"
      return content;  // Do not replace empty cells with space, keep '-'
    });
    body.push(row.concat(observationRow)); // Concatenate the serial number with the rest of the row
  }

   
  const sNoWidth = 13;

  // Calculate the remaining width for Ordered_unit columns
  const totalColumns = headers.length;
  const availableWidth = pageWidth - 60 - sNoWidth; // Subtract the left and right margins (30px each) and the width for S.No.
  const remainingWidth = availableWidth / (totalColumns - 1); // Divide the remaining width equally among the Ordered_unit columns

  // Add the table to the PDF
  autoTable(doc, {
    head: [headers], // Use the headers array
    body: body, // Body with filled '-' for empty cells
    startY: 29, // Adjust as needed
    theme: 'striped',
    margin: { top: 20, right: 30, bottom: 20, left: 30 },
    columnStyles: {
      // Apply the fixed width for 'S.No.' and dynamic width for other columns
      0: { cellWidth: sNoWidth }, // Apply to 'S.No.'
      ...this.Ordered_unit.reduce((acc:any, unit, index) => {
        acc[index + 1] = { cellWidth: remainingWidth }; // Apply to each Ordered_unit column
        return acc;
      }, {})
    },
    styles: {
      // Justify content for non-empty cells and center "-" cells
      halign: 'justify', // Default alignment
      lineColor: [0, 0, 0],
      lineWidth: 0.25, // Set this to 0.25 for a thin border
    },
    headStyles: {
      halign: 'center' as HAlignType,
      fillColor: [255, 255, 204], // Change to desired color
      textColor: [0, 0, 0],
      lineWidth: 0.25, // Thin border for headers
    },
    bodyStyles: {
      lineWidth: 0.25, // Thin border for body cells
      font: 'calibri', // Set font family
      fontStyle: 'normal', // Set font style
      textColor: [0, 0, 0], // Set text color to black
      halign: 'justify', // Default justify
      valign: 'middle', // Vertically align content to the middle of the cell
    },
    didParseCell: (data) => {

      if (data.column.index === 0) { // Target the 'S.No.' column
        data.cell.styles.halign = 'center'; // Center horizontally
        data.cell.styles.valign = 'middle'; // Center vertically
      }
      // Center the content for cells with '-'
      if (data.cell.raw === '-') {
        data.cell.styles.halign = 'center'; // Center align for '-' cells
        data.cell.styles.valign = 'middle'; // Vertically center '-' cells
      }
    }
  });

  // Add note below the table
  const note = "Note: It is recommended that all items that are non-compliant on snags recorded be attended to and rectified on priority";
  const noteWidth = doc.getTextWidth(note);
  const noteX = (pageWidth - noteWidth) / 2; // Center the note horizontally

  // Get current Y position after the table to place the note
  const finalY = (doc as any).lastAutoTable.finalY + 10; // Add some spacing after the table

  doc.setFontSize(10);
  doc.setFont('calibri', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(note, noteX + 10, finalY); // Add the note centered below the table
}









const addcontent_FOLLOWING_OBSERVATION_cabin = () => {
  const text = "OBSERVATIONS NEED ATTENTION - CABIN";
  const pageWidth = doc.internal.pageSize.width;
  const textWidth = doc.getTextWidth(text);
  const x = ((pageWidth - textWidth) / 2)-7; // Center the text horizontally

  doc.setFontSize(12);
  doc.setFont('calibri', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(text, x, 25);

  // Define the table headers dynamically from Ordered_unit
  const headers = ['S.No.', ...this.Ordered_unit]; // Add "S.No." as the first header

  // Define the table body
  const body: string[][] = [];
  console.log("+=+=>", this.Cabin_ObservationPoints);

  // Create rows for each observation index
  for (let rowIndex = 0; rowIndex < this.getMaxObservations_cabin(); rowIndex++) {
    const row: string[] = [String(rowIndex + 1)]; // Add the serial number to the row
    const observationRow = this.Ordered_unit.map(unit => {
      const content = this.Cabin_ObservationPoints[unit][rowIndex] || '-'; // Replace empty cells with "-"
      return content;  // Keep "-" for empty cells
    });
    body.push(row.concat(observationRow)); // Concatenate the serial number with the rest of the row
  }

   
  const sNoWidth = 13;

  // Calculate the remaining width for Ordered_unit columns
  const totalColumns = headers.length;
  const availableWidth = pageWidth - 60 - sNoWidth; // Subtract the left and right margins (30px each) and the width for S.No.
  const remainingWidth = availableWidth / (totalColumns - 1); // Divide the remaining width equally among the Ordered_unit columns

  // Add the table to the PDF
  autoTable(doc, {
    head: [headers], // Use the headers array
    body: body, // Body with filled '-' for empty cells
    startY: 29, // Adjust as needed
    theme: 'striped',
    margin: { top: 20, right: 30, bottom: 20, left: 30 },
    columnStyles: {
      // Apply the fixed width for 'S.No.' and dynamic width for other columns
      0: { cellWidth: sNoWidth }, // Apply to 'S.No.'
      ...this.Ordered_unit.reduce((acc:any, unit, index) => {
        acc[index + 1] = { cellWidth: remainingWidth }; // Apply to each Ordered_unit column
        return acc;
      }, {})
    },
    styles: {
      // Justify content for non-empty cells and center "-" cells
      halign: 'justify', // Default alignment
      lineColor: [0, 0, 0],
      lineWidth: 0.25, // Set this to 0.25 for a thin border
    },
    headStyles: {
      halign: 'center' as HAlignType,
      fillColor: [255, 255, 204], // Change to desired color
      textColor: [0, 0, 0],
      lineWidth: 0.25, // Thin border for headers
    },
    bodyStyles: {
      lineWidth: 0.25, // Thin border for body cells
      font: 'calibri', // Set font family
      fontStyle: 'normal', // Set font style
      textColor: [0, 0, 0], // Set text color to black
      halign: 'justify', // Default justify
      valign: 'middle', // Vertically align content to the middle of the cell
    },
    didParseCell: (data) => {

      if (data.column.index === 0) { // Target the 'S.No.' column
        data.cell.styles.halign = 'center'; // Center horizontally
        data.cell.styles.valign = 'middle'; // Center vertically
      }
      // Center the content for cells with '-'
      if (data.cell.raw === '-') {
        data.cell.styles.halign = 'center'; // Center align for '-' cells
        data.cell.styles.valign = 'middle'; // Vertically center '-' cells
      }
    }
  });

  // Add note below the table
  const note = "Note: It is recommended that all items that are non compliant on snags recorded be attended to and rectified on priority";
  const noteWidth = doc.getTextWidth(note);
  const noteX = (pageWidth - noteWidth) / 2; // Center the note horizontally

  // Get current Y position after the table to place the note
  const finalY = (doc as any).lastAutoTable.finalY + 10; // Add some spacing after the table

  doc.setFontSize(10);
  doc.setFont('calibri', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(note, noteX + 10, finalY); // Add the note centered below the table
}


const addcontent_FOLLOWING_OBSERVATION_machineroom = () => {
  const text = "OBSERVATIONS NEED ATTENTION - MACHINE ROOM";
  const pageWidth = doc.internal.pageSize.width;
  const textWidth = doc.getTextWidth(text);
  const x = ((pageWidth - textWidth) / 2)-7; // Center the text horizontally

  doc.setFontSize(12);
  doc.setFont('calibri', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(text, x, 25);

  // Define the table headers dynamically from Ordered_unit
  const headers = ['S.No.', ...this.Ordered_unit]; // Add "S.No." as the first header

  // Define the table body
  const body: string[][] = [];
  console.log("+=+=>", this.Machine_ObservationPoints);

  // Create rows for each observation index
  for (let rowIndex = 0; rowIndex < this.getMaxObservations_machineroom(); rowIndex++) {
    const row: string[] = [String(rowIndex + 1)]; // Add the serial number to the row
    const observationRow = this.Ordered_unit.map(unit => {
      const content = this.Machine_ObservationPoints[unit][rowIndex] || '-'; // Replace empty cells with "-"
      return content;
    });
    body.push(row.concat(observationRow)); // Concatenate the serial number with the observation data
  }

   
  const sNoWidth = 13;

  // Calculate the remaining width for Ordered_unit columns
  const totalColumns = headers.length;
  const availableWidth = pageWidth - 60 - sNoWidth; // Subtract the left and right margins (30px each) and the width for S.No.
  const remainingWidth = availableWidth / (totalColumns - 1); // Divide the remaining width equally among the Ordered_unit columns

  // Add the table to the PDF
  autoTable(doc, {
    head: [headers], // Use the headers array
    body: body, // Body with filled '-' for empty cells
    startY: 29, // Adjust as needed
    theme: 'striped',
    margin: { top: 20, right: 30, bottom: 20, left: 30 },
    columnStyles: {
      // Apply the fixed width for 'S.No.' and dynamic width for other columns
      0: { cellWidth: sNoWidth }, // Apply to 'S.No.'
      ...this.Ordered_unit.reduce((acc:any, unit, index) => {
        acc[index + 1] = { cellWidth: remainingWidth }; // Apply to each Ordered_unit column
        return acc;
      }, {})
    },
    styles: {
      halign: 'justify', // Default alignment
      lineColor: [0, 0, 0],
      lineWidth: 0.25, // Set this to 0.25 for a thin border
    },
    headStyles: {
      halign: 'center' as HAlignType,
      fillColor: [255, 255, 204], // Change to desired color
      textColor: [0, 0, 0],
      lineWidth: 0.25, // Thin border for headers
    },
    bodyStyles: {
      lineWidth: 0.25, // Thin border for body cells
      font: 'calibri', // Set font family
      fontStyle: 'normal', // Set font style
      textColor: [0, 0, 0], // Set text color to black
      halign: 'justify', // Default justify
      valign: 'middle', // Vertically align content to the middle of the cell
    },
    didParseCell: (data) => {

      if (data.column.index === 0) { // Target the 'S.No.' column
        data.cell.styles.halign = 'center'; // Center horizontally
        data.cell.styles.valign = 'middle'; // Center vertically
      }
      // Center the content for cells with '-'
      if (data.cell.raw === '-') {
        data.cell.styles.halign = 'center'; // Center align for '-' cells
        data.cell.styles.valign = 'middle'; // Vertically center '-' cells
      }
    }
  });

  // Add note below the table
  const note = "Note: It is recommended that all items that are non compliant on snags recorded be attended to and rectified on priority";
  const noteWidth = doc.getTextWidth(note);
  const noteX = (pageWidth - noteWidth) / 2; // Center the note horizontally

  // Get current Y position after the table to place the note
  const finalY = (doc as any).lastAutoTable.finalY + 10; // Add some spacing after the table

  doc.setFontSize(10);
  doc.setFont('calibri', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(note, noteX + 10, finalY); // Add the note centered below the table
}



const addcontent_FOLLOWING_OBSERVATION_cartop = () => {
  const text = "OBSERVATIONS NEED ATTENTION - CAR TOP";
  const pageWidth = doc.internal.pageSize.width;
  const textWidth = doc.getTextWidth(text);
  const x = ((pageWidth - textWidth) / 2)-7; // Center the text horizontally

  doc.setFontSize(12);
  doc.setFont('calibri', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(text, x, 25);

  // Define the table headers dynamically from Ordered_unit
  const headers = ['S.No.', ...this.Ordered_unit]; // Add "S.No." as the first header

  // Define the table body
  const body: string[][] = [];
  console.log("+=+=>", this.Cartop_ObservationPoints);

  // Create rows for each observation index
  for (let rowIndex = 0; rowIndex < this.getMaxObservations_cartop(); rowIndex++) {
    const row: string[] = [String(rowIndex + 1)]; // Add the serial number to the row
    const observationRow = this.Ordered_unit.map(unit => {
      const content = this.Cartop_ObservationPoints[unit][rowIndex] || '-'; // Replace empty cells with "-"
      return content;
    });
    body.push(row.concat(observationRow)); // Concatenate the serial number with the observation data
  }

   
  const sNoWidth = 13;

  // Calculate the remaining width for Ordered_unit columns
  const totalColumns = headers.length;
  const availableWidth = pageWidth - 60 - sNoWidth; // Subtract the left and right margins (30px each) and the width for S.No.
  const remainingWidth = availableWidth / (totalColumns - 1); // Divide the remaining width equally among the Ordered_unit columns

  // Add the table to the PDF
  autoTable(doc, {
    head: [headers], // Use the headers array
    body: body, // Body with filled '-' for empty cells
    startY: 29, // Adjust as needed
    theme: 'striped',
    margin: { top: 20, right: 30, bottom: 20, left: 30 },
    columnStyles: {
      // Apply the fixed width for 'S.No.' and dynamic width for other columns
      0: { cellWidth: sNoWidth }, // Apply to 'S.No.'
      ...this.Ordered_unit.reduce((acc:any, unit, index) => {
        acc[index + 1] = { cellWidth: remainingWidth }; // Apply to each Ordered_unit column
        return acc;
      }, {})
    },
    styles: {
      halign: 'justify', // Default alignment
      lineColor: [0, 0, 0],
      lineWidth: 0.25, // Set this to 0.25 for a thin border
    },
    headStyles: {
      halign: 'center' as HAlignType,
      fillColor: [255, 255, 204], // Change to desired color
      textColor: [0, 0, 0],
      lineWidth: 0.25, // Thin border for headers
    },
    bodyStyles: {
      lineWidth: 0.25, // Thin border for body cells
      font: 'calibri', // Set font family
      fontStyle: 'normal', // Set font style
      textColor: [0, 0, 0], // Set text color to black
      halign: 'justify', // Default justify
      valign: 'middle', // Vertically align content to the middle of the cell
    },
    didParseCell: (data) => {
      if (data.column.index === 0) { // Target the 'S.No.' column
        data.cell.styles.halign = 'center'; // Center horizontally
        data.cell.styles.valign = 'middle'; // Center vertically
      }
      // Center the content for cells with '-'
      if (data.cell.raw === '-') {
        data.cell.styles.halign = 'center'; // Center horizontally
        data.cell.styles.valign = 'middle'; // Center vertically
      }
    }
  });

  // Add note below the table
  const note = "Note: It is recommended that all items that are non compliant on snags recorded be attended to and rectified on priority";
  const noteWidth = doc.getTextWidth(note);
  const noteX = (pageWidth - noteWidth) / 2; // Center the note horizontally

  // Get current Y position after the table to place the note
  const finalY = (doc as any).lastAutoTable.finalY + 10; // Add some spacing after the table

  doc.setFontSize(10);
  doc.setFont('calibri', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(note, noteX + 10, finalY); // Add the note centered below the table
}




const addcontent_FOLLOWING_OBSERVATION_floorlanding = () => {
  const text = "OBSERVATIONS NEED ATTENTION - FLOOR LANDING";
  const pageWidth = doc.internal.pageSize.width;
  const textWidth = doc.getTextWidth(text);
  const x = ((pageWidth - textWidth) / 2)-7; // Center the text horizontally

  doc.setFontSize(12);
  doc.setFont('calibri', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(text, x, 25);

  // Define the table headers dynamically from Ordered_unit
  const headers = ['S.No.', ...this.Ordered_unit]; // Add "S.No." as the first header

  // Define the table body
  const body: string[][] = [];
  console.log("+=+=>", this.Floor_ObservationPoints);

  // Create rows for each observation index
  for (let rowIndex = 0; rowIndex < this.getMaxObservations_floorlanding(); rowIndex++) {
    const row: string[] = [String(rowIndex + 1)]; // Add the serial number to the row
    const observationRow = this.Ordered_unit.map(unit => {
      const content = this.Floor_ObservationPoints[unit][rowIndex] || '-'; // Replace empty cells with "-"
      return content;
    });
    body.push(row.concat(observationRow)); // Concatenate the serial number with the observation data
  }

   
  const sNoWidth = 13;

  // Calculate the remaining width for Ordered_unit columns
  const totalColumns = headers.length;
  const availableWidth = pageWidth - 60 - sNoWidth; // Subtract the left and right margins (30px each) and the width for S.No.
  const remainingWidth = availableWidth / (totalColumns - 1); // Divide the remaining width equally among the Ordered_unit columns

  // Add the table to the PDF
  autoTable(doc, {
    head: [headers], // Use the headers array
    body: body, // Body with filled '-' for empty cells
    startY: 29, // Adjust as needed
    theme: 'striped',
    margin: { top: 20, right: 30, bottom: 20, left: 30 },
    columnStyles: {
      // Apply the fixed width for 'S.No.' and dynamic width for other columns
      0: { cellWidth: sNoWidth }, // Apply to 'S.No.'
      ...this.Ordered_unit.reduce((acc:any, unit, index) => {
        acc[index + 1] = { cellWidth: remainingWidth }; // Apply to each Ordered_unit column
        return acc;
      }, {})
    },
    styles: {
      halign: 'justify', // Default alignment
      lineColor: [0, 0, 0],
      lineWidth: 0.25, // Set this to 0.25 for a thin border
    },
    headStyles: {
      halign: 'center' as HAlignType,
      fillColor: [255, 255, 204], // Change to desired color
      textColor: [0, 0, 0],
      lineWidth: 0.25, // Thin border for headers
    },
    bodyStyles: {
      lineWidth: 0.25, // Thin border for body cells
      font: 'calibri', // Set font family
      fontStyle: 'normal', // Set font style
      textColor: [0, 0, 0], // Set text color to black
      halign: 'justify', // Default justify
      valign: 'middle', // Vertically align content to the middle of the cell
    },
    didParseCell: (data) => {
      if (data.column.index === 0) { // Target the 'S.No.' column
        data.cell.styles.halign = 'center'; // Center horizontally
        data.cell.styles.valign = 'middle'; // Center vertically
      }
      // Center the content for cells with '-'
      if (data.cell.raw === '-') {
        data.cell.styles.halign = 'center'; // Center horizontally
        data.cell.styles.valign = 'middle'; // Center vertically
      }
    }
  });

  // Add note below the table
  const note = "Note: It is recommended that all items that are non compliant on snags recorded be attended to and rectified on priority";
  const noteWidth = doc.getTextWidth(note);
  const noteX = (pageWidth - noteWidth) / 2; // Center the note horizontally

  // Get current Y position after the table to place the note
  const finalY = (doc as any).lastAutoTable.finalY + 10; // Add some spacing after the table

  doc.setFontSize(10);
  doc.setFont('calibri', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(note, noteX + 10, finalY); // Add the note centered below the table
}











const addcontent_Quality_New = () => {
  const text = "QUALITY EVALUATION AND PERFORMANCE RATING";
  const pageWidth = doc.internal.pageSize.width;
  const textWidth = doc.getTextWidth(text);
  const x = (pageWidth - textWidth) / 2; // Center the text horizontally

  doc.setFontSize(12);
  doc.setFont('calibri', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(text, x, 20);

  const body: any[][] = [];
  
  // Table Header
  const head = [
    [
      { content: 'UNIT No.' },
      ...this.Ordered_unit.map(unit => ({ content: unit })),
    ],
    [
      { content: 'SECTION' },
      ...this.Ordered_unit.flatMap(() => [
        { content: 'RATING %' }
      ]),
    ]
  ];

  // console.log("/^",this.pit_Quality,this.cabin_Quality,this.machineroom_Quality,this.cartop_Quality,this.floorlanding_Quality);
// this.apicallservice.setrecordvalues_add_data(this.docid,this.inf_contract_number,this.pit_Quality,this.cabin_Quality,this.machineroom_Quality,this.cartop_Quality,this.floorlanding_Quality,this.machinenumber_withunit).subscribe()

  const descriptions = ['PIT', 'CABIN', 'CAR TOP', 'MACHINE ROOM', 'FLOOR LANDING', 'AVG.RATING'];
  
  descriptions.forEach((description) => {
    const row = [
      { content: description, styles: { fontStyle: 'bold' } }, // Bold descriptions
      ...this.Ordered_unit.map((unit) => {
        let perValue: number = 0;
        switch (description) {
          case 'PIT':
            perValue = Math.round(this.pit_Quality[unit]?.per || 0);
            break;
          case 'CABIN':
            perValue = Math.round(this.cabin_Quality[unit]?.per || 0);
            break;
          case 'CAR TOP':
            perValue = Math.round(this.cartop_Quality[unit]?.per || 0);
            break;
          case 'MACHINE ROOM':
            perValue = Math.round(this.machineroom_Quality[unit]?.per || 0);
            break;
          case 'FLOOR LANDING':
            perValue = Math.round(this.floorlanding_Quality[unit]?.per || 0);
            break;
          case 'AVG.RATING':
            perValue = Math.round(this.Total_Quality[unit]?.per || 0);
            break;
        }
        
        // Conditionally format the perValue
        const formattedValue = Number.isInteger(perValue) 
          ? `${perValue}`          // Display as an integer
          : `${perValue.toFixed(2)}%`; // Display with two decimal places and %
          
        return { content: `${formattedValue}%` }; // Fill the column with formatted per value
      })
    ];
    body.push(row);
  });

  // Generate the table with the new settings
  autoTable(doc, {
    head: head,
    body: body,
    
    startY: 24,
    theme: 'striped', // Apply striped theme
    margin: { top: 20, right: 30, bottom: 20, left: 30 }, // Set margins
    styles: {
      cellPadding: 0.5, // Reduce padding to minimize row height
      valign: 'middle',
      halign: 'center',
      minCellHeight: 9, // Set a minimum cell height to control row height
      lineColor: [0, 0, 0], 
      lineWidth: 0.5, // Increase line width to 0.5
      textColor: [0, 0, 0]
    },
    headStyles: {
      lineWidth: 0.5, // Increase line width in header
      fillColor: [255, 255, 204], // Light yellow background
      textColor: [0, 0, 0],
      fontSize: 9, // Decrease font size in the header
      cellPadding: 0.5, // Match padding with body for consistency
    },
    bodyStyles: {
      lineWidth: 0.5, // Increase line width in body
      lineColor: [0, 0, 0],
  
    font: 'calibri', // Set font family
    fontStyle: 'normal', // Set font style
    textColor: [0, 0, 0], // Set text color to black

    },
    columnStyles: {
      0: { fontStyle: 'bold' }, // Make the description column bold,

    },
    didParseCell: function (data) {
      // Check if it's the second row (index 1 in body array)
      if (data.row.index === 5) {
        data.cell.styles.fontStyle = 'bold';  // Apply bold to entire row
      }
    },
  });

  

const note = "'75% - Unsatisfactory'   '76% to 85% - Average'    '86% to 95% - Good'    '96% to 100% - Excellent'";
const noteWidth = doc.getTextWidth(note);
const noteX = (pageWidth - noteWidth) / 2; // Center the note horizontally

// Get current Y position after the table to place the note
const finalY = (doc as any).lastAutoTable.finalY + 10; // Add some spacing after the table

doc.setFontSize(10);
doc.setFont('calibri', 'bold');
doc.setTextColor(0, 0, 0);
doc.text(note, noteX+10, finalY); // Add the note centered below the table

};




















const addcontent_PIT = () => {
   const head = [['S.No.', 'DESCRIPTION', ...this.Ordered_unit]];

   const headerlen:number=head[0].length-1;
  

   let body: any = [];

   const addInspectionData = () => {
    let finalY = 24; // Initial start position for the first table
    let icount=0;
    this.inspectionMasterData.forEach((checklistmaster, i_master) => {
      const description = checklistmaster.Description.trim();
      Object.keys(this.Result_unit_status_pit_pit).forEach(Result_unit_status_Desc => {
        const Result_unit_status_Desc_trim = Result_unit_status_Desc.trim();
        const matchesDescription = Result_unit_status_Desc_trim === description;
        if (this.Result_unit_status_pit_pit[Result_unit_status_Desc_trim] === true && matchesDescription) {
          const row = [];
          if (checklistmaster.Parts?.toLowerCase() === 'pit') {
     
            row.push({
              content: ++icount ,
              styles: {
                rowSpan: 2,halign: 'center',
                valign: 'middle', // Apply rowspan
              }
            });

            row.push({
              content: description,
              styles: {
                halign: 'center',
                valign: 'middle',
                cellPadding: 2,
              }
            });

            this.Ordered_unit.forEach(uni => {
              if (this.Result_Of_pit_variables_pit[description]?.[uni]) {
                // Get the status value
                const status = this.Result_Of_pit_variables_pit[description][uni].status;
            
                // Replace the status with the full form
                const statusFullForm = status.trim() === 'Y' ? 'Complied': status === 'N'? 'Not Complied': status === 'NA'? 'Not Applicable': status; // Default to original value if it doesn't match
            
                // Push the modified status into the row
                row.push({
                  content: statusFullForm,
                  styles: {
                    halign: 'center',
                    valign: 'middle',
                    cellPadding: 2,
                    minCellWidth: 5,
                    textColor: this.getStatusColor(status)
                  }
                });
              }
            });
            body.push(row);

            if (this.check_Image_pit(Result_unit_status_Desc_trim, checklistmaster) === true) {
            
              if (this.checkunithastwoimg(this.Result_Of_pit_variables_pit[description]) === true) {
                console.log("><0");
                const imageRow: any[] = [];
                const uni_t:String[]=[]
                const imagesData: string[] = [];
                // Iterate over Ordered_unit
                this.Ordered_unit.forEach(uni => {
                  if (this.Result_Of_pit_variables_pit[description][uni].has_image === true) {

                    // Loop through the images and add them to the imagesData array
                    this.Result_Of_pit_variables_pit[description][uni].image.forEach((img, img_len) => {
                      const imgData = this.getImageData_pit(description, uni, img_len) as string; // Get image data as string
                      imagesData.push(imgData); // Push the image data into the array
                      uni_t.push(uni+"-"+img.image_dropdown,)
                    });
              
                    // Now, both images are in the imagesData array
                    // Add the row with images to the body
                   
                  }
                });

                console.log("###$1",uni_t);
                
                if (imagesData.length > 0) {
                  imageRow.push({
                    content: '', // Empty content for cell
                    colSpan: this.Ordered_unit_count + 2,  // Apply colspan for merging cells
                    styles: {
                      valign: 'middle',
                      halign: 'center',
                      minCellHeight: 68,  // Set minimum cell height
                    },
                    imgsData: imagesData,  // Pass the array of images for the unit
                    unit: uni_t,  // Unit name
                  });
                }
                body.push(imageRow);
                console.log("<>/",imageRow);
              }
              
              
               else if (this.checknoof_img(this.Result_Of_pit_variables_pit[description]) === 1) {
                console.log("><1")

                this.Ordered_unit.forEach(uni => {
                  if (this.Result_Of_pit_variables_pit[description][uni].has_image === true) {
                    const imageRow: any[] = [];
                
                    
                    this.Result_Of_pit_variables_pit[description][uni].image.forEach((img, img_len) => {
                      const imgData = this.getImageData_pit(description, uni, img_len) as string; // Cast to string
                        imageRow.push({
                          content: '', // Empty content for cell
                          colSpan:this.Ordered_unit_count+2,
                          styles: {
                            valign: 'middle',
                            halign: 'center',
                            minCellHeight: 68,
                             // Apply colspan here
                          },
                          imgData: imgData ,// Use the imgData here
                          unit:uni+"-"+img.image_dropdown,
                        });               
                        
                        console.log("###$1_",this.Result_Of_pit_variables_pit[description][uni].report_string);
                    });



            
                    body.push(imageRow);
                  }
                });
              } 
              
              else if (this.checknoof_img(this.Result_Of_pit_variables_pit[description]) === 2) {
                console.log("><2");
                const imageRow: any[] = [];
                const uni_t:String[]=[]
                const imagesData: string[] = [];
                // Iterate over Ordered_unit
                this.Ordered_unit.forEach(uni => {
                  if (this.Result_Of_pit_variables_pit[description][uni].has_image === true) {

                    // Loop through the images and add them to the imagesData array
                    this.Result_Of_pit_variables_pit[description][uni].image.forEach((img, img_len) => {
                      const imgData = this.getImageData_pit(description, uni, img_len) as string; // Get image data as string
                      imagesData.push(imgData); // Push the image data into the array
                      uni_t.push(uni+"-"+img.image_dropdown,)
                    });
                    console.log("###$2",uni_t);
              
                    // Now, both images are in the imagesData array
                    // Add the row with images to the body
                   
                  }
                });
                console.log("###$2_",uni_t);
                
                if (imagesData.length > 0) {
                  imageRow.push({
                    content: '', // Empty content for cell
                    colSpan: this.Ordered_unit_count + 2,  // Apply colspan for merging cells
                    styles: {
                      valign: 'middle',
                      halign: 'center',
                      minCellHeight: 68,  // Set minimum cell height
                    },
                    img_Data: imagesData,  // Pass the array of images for the unit
                    unit: uni_t,  // Unit name
                  });
                }
                body.push(imageRow);
                console.log("<>/",imageRow);
                
              } 
              else{
                body.push([{
                  content: 'No Image Captured',
                  colSpan: this.Ordered_unit.length + 3,
                  styles: { halign: 'center',
                    minCellHeight:60,
                    valign: 'middle', }
                }]);
                
              }
            }
            else{
              body.push([{
                content: 'No Image Captured',
                colSpan: this.Ordered_unit.length + 3,
                styles: { halign: 'center',
                  minCellHeight:60,
                  valign: 'middle', }
              }]);
              
            }
            }
          }
        else if (this.Result_unit_status_pit_pit[Result_unit_status_Desc_trim] === false && matchesDescription) {
          if (checklistmaster.Parts?.toLowerCase() === 'pit') {
          const noImageRow: any[] = [
            {
              content: ++icount ,
              styles: {
                rowSpan: 2,halign: 'center',
                minCellHeight:5,
                valign: 'middle', // Apply rowspan
              }
            }
            ,{
              content: description,
              styles: {
                halign: 'center',
            valign: 'middle',
            minCellHeight:5,
                rowSpan: 2, // Apply rowspan
              }
            }
            
          ];

          this.Ordered_unit.forEach(uni => {
            noImageRow.push({
              content: 'Complied',
              styles: {
                minCellHeight:5,
                halign: 'center',
            valign: 'middle',
            cellPadding: 2,
                textColor: this.getStatusColor('Y')
              }
            });
          });

          body.push(noImageRow);
          body.push([{
            content: 'No Image Captured',
            colSpan: this.Ordered_unit.length + 3,
            styles: { halign: 'center',
              minCellHeight:60,
              valign: 'middle', }
          }]);

        }

        }
      });
      // Adjust finalY and create a new table on the next page if i_master + 1 % 2 === 0
      if (((icount) % 2 === 0 && checklistmaster.Parts?.toLowerCase() === 'pit')) {
        addHeader();
      
        // Get page dimensions
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
      
        // Define margins
        const margin = { top: 10, left: 10, right: 10, bottom: 0 };
        const tableWidth = pageWidth - margin.left - margin.right;
      
        // Define static widths for columns 0 and 1
        const staticWidths = {
          0: tableWidth * 0.06, // 15% of table width
          1: tableWidth * 0.55, // 55% of table width
        };
      
        // Calculate the remaining width for dynamic columns
        const remainingWidth = tableWidth - staticWidths[0] - staticWidths[1];
      
        // Determine the number of dynamic columns (excluding 0 and 1)
        const totalColumns = head[0]?.length || 0;
        const dynamicColumnCount = totalColumns - 2;
      
        // Calculate width for each dynamic column
        const dynamicWidth = dynamicColumnCount > 0 ? remainingWidth / dynamicColumnCount : 0;
      
        // Define columnStyles dynamically
        const columnStyles:any = {
          0: { cellWidth: staticWidths[0] }, // Static column 0
          1: { cellWidth: staticWidths[1] }, // Static column 1
        };
      
        // Add dynamic columns to columnStyles
        for (let i = 2; i < totalColumns; i++) {
          columnStyles[i] = { cellWidth: dynamicWidth };
        }
      
        autoTable(doc, {
          head: head,
          body: body,
          startY: finalY,
          theme: 'striped',
          styles: {
            cellPadding: 2,
            halign: 'center',
            fontSize: 10,
            lineColor: [0, 0, 0],
          },
          headStyles: {
            lineWidth: 0.25,
            fillColor: [255, 255, 204],
            textColor: [0, 0, 0],
          },
          bodyStyles: {
            lineWidth: 0.25,
            fillColor: [245, 245, 245],
            font: 'calibri', // Set font family
            fontStyle: 'normal', // Set font style
            textColor: [0, 0, 0], // Set text color to black
          },
          columnStyles: columnStyles,
          margin: margin,
          didDrawCell: function (data) {
            const cellData = data.cell.raw as any;
      
            // Check if the cell contains image data
            if (cellData && typeof cellData === 'object' && 'imgData' in cellData) {
              const imgData = cellData.imgData as string;
      
              // Define the dimensions of the image
              const imgWidth = Math.min(data.cell.width * 0.8, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.8, 56); // Scale within cell height
      
              // Calculate the center position for the image
              const xPos = data.cell.x + (data.cell.width - imgWidth) / 2;
              const yPos = data.cell.y + (data.cell.height - imgHeight) / 2;
      
              // Add the image to the PDF
              doc.addImage(imgData, 'JPEG', xPos, yPos, imgWidth, imgHeight);
      
              // Draw the unit text below the image
              const textXPos = data.cell.x + (data.cell.width - doc.getTextWidth(cellData.unit)) / 2;
              const textYPos = yPos + imgHeight + 4;
      
              // // Add the unit text
              doc.text(cellData.unit.replace(/~/g, '-'), textXPos, textYPos);
            }
            else if (cellData && cellData.imgsData) {
              const imgDataArray = cellData.imgsData as string[];
              const unitArray = cellData.unit as string[]; // Assume `cellData.unit` is an array of text corresponding to images
            
              // Define the dimensions of the images
              const imgWidth = Math.min(data.cell.width * 0.8 / imgDataArray.length, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.6, 56); // Scale within cell height
            
              // Define the space between images
              const spaceBetweenImages = 40; // Adjust this value for the desired space between images
            
              // Calculate the initial x position for the first image
              let xPos = data.cell.x + (data.cell.width - imgWidth * imgDataArray.length - spaceBetweenImages * (imgDataArray.length - 1)) / 2;
            
              // Loop through the images and add them horizontally in the same cell
              imgDataArray.forEach((imgData, index) => {
                // Add the image to the PDF at the calculated position
                doc.addImage(
                  imgData,
                  'JPEG',
                  xPos + index * (imgWidth + spaceBetweenImages), // Horizontal position for each image
                  data.cell.y + (data.cell.height - imgHeight)/3 , // Vertical position to center images in the cell
                  imgWidth,
                  imgHeight
                );
            
                // Calculate the initial position for the text
                const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + (imgWidth / 2);
                // const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + imgWidth / 2 - doc.getTextWidth(unitArray[index]) / 2; // Center text below image
                let textYPos = data.cell.y + (data.cell.height - imgHeight) / 2 + imgHeight + 2 // Start 5px below the image
            
                // Split long text into lines that fit within the image width
                const textLines = doc.splitTextToSize(unitArray[index].replace(/~/g, '-') || '', imgWidth+20);
            
                // Line height for text
                const lineHeight = 3.5; // Adjust line height as needed
            
                // Add each line of text
                textLines.forEach((line: any) => {
                  // Adjust text alignment to center each line
                  const lineWidth = doc.getTextWidth(line);
                  doc.text(line, textXPos - lineWidth / 2, textYPos);
                  textYPos += lineHeight; // Move down for the next line
                });
              });
            } 
             
            else if (cellData && cellData.img_Data) {
              const imgDataArray = cellData.img_Data as string[];
              const unitArray = cellData.unit as string[]; // Assuming `cellData.unit` is an array
            
              // Define the dimensions of the images
              const imgWidth = Math.min(data.cell.width * 0.8 / imgDataArray.length, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.8, 56); // Scale within cell height
            
              // Define the space between images
              const spaceBetweenImages = 40; // Adjust this value for the desired space between images
            
              // Calculate the total width of all images including the space between them
              const totalImagesWidth = imgWidth * imgDataArray.length + spaceBetweenImages * (imgDataArray.length - 1);
            
              // Calculate the initial x position to center the images horizontally
              let xPos = data.cell.x + (data.cell.width - totalImagesWidth) / 2;
            
              // Loop through the images and add them horizontally in the same cell
              imgDataArray.forEach((imgData, index) => {
                // Add the image to the PDF at the calculated position
                doc.addImage(
                  imgData,
                  'JPEG',
                  xPos + index * (imgWidth + spaceBetweenImages), // Horizontal position for each image
                  data.cell.y + (data.cell.height - imgHeight)/3 , // Vertical position to center images in the cell
                  imgWidth,
                  imgHeight
                );
            
                // Calculate the initial position for the text
                const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + (imgWidth / 2);
                // const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + imgWidth / 2 - doc.getTextWidth(unitArray[index]) / 2; // Center text below image
                let textYPos = data.cell.y + (data.cell.height - imgHeight) / 2 + imgHeight + 2 // Start 5px below the image
            
                // Split long text into lines that fit within the image width
                const textLines = doc.splitTextToSize(unitArray[index].replace(/~/g, '-') || '', imgWidth+20);
            
                // Line height for text
                const lineHeight = 3.5; // Adjust line height as needed
            
                // Add each line of text
                textLines.forEach((line: any) => {
                  // Adjust text alignment to center each line
                  const lineWidth = doc.getTextWidth(line);
                  doc.text(line, textXPos - lineWidth / 2, textYPos);
                  textYPos += lineHeight; // Move down for the next line
                });
              });
            }
            
            
            
          },
        });
      
        addFooter();
        body.length = 0;
        // Clear the body for the next set of rows
        doc.addPage(); // Add a new page if necessary
        finalY = 24; // Reset finalY for the new page
      }
      const length = Object.keys(this.Result_Of_pit_variables_pit).length;
      if ((length===icount) && ((icount%2)===1) && checklistmaster.Parts?.toLowerCase() === 'pit' ) {
        addHeader();
        console.log(".,,",(length===icount) && (length%2)===1,length,icount)
        // Get page dimensions
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
      
        // Define margins
        const margin = { top: 10, left: 10, right: 10, bottom: 10 };
        const tableWidth = pageWidth - margin.left - margin.right;
      
        // Define static widths for columns 0 and 1
        const staticWidths = {
          0: tableWidth * 0.06, // 15% of table width
          1: tableWidth * 0.55, // 55% of table width
        };
      
        // Calculate the remaining width for dynamic columns
        const remainingWidth = tableWidth - staticWidths[0] - staticWidths[1];
      
        // Determine the number of dynamic columns (excluding 0 and 1)
        const totalColumns = head[0]?.length || 0;
        const dynamicColumnCount = totalColumns - 2;
      
        // Calculate width for each dynamic column
        const dynamicWidth = dynamicColumnCount > 0 ? remainingWidth / dynamicColumnCount : 0;
      
        // Define columnStyles dynamically
        const columnStyles:any = {
          0: { cellWidth: staticWidths[0] }, // Static column 0
          1: { cellWidth: staticWidths[1] }, // Static column 1
        };
      
        // Add dynamic columns to columnStyles
        for (let i = 2; i < totalColumns; i++) {
          columnStyles[i] = { cellWidth: dynamicWidth };
        }
      
        autoTable(doc, {
          head: head,
          body: body,
          startY: finalY,
          theme: 'striped',
          styles: {
            cellPadding: 2,
            halign: 'center',
            fontSize: 10,
            lineColor: [0, 0, 0],
          },
          headStyles: {
            lineWidth: 0.25,
            fillColor: [255, 255, 204],
            textColor: [0, 0, 0],
          },
          bodyStyles: {
            lineWidth: 0.25,
            fillColor: [245, 245, 245],
            font: 'calibri', // Set font family
            fontStyle: 'normal', // Set font style
            textColor: [0, 0, 0], // Set text color to black
          },
          columnStyles: columnStyles,
          margin: margin,
          didDrawCell: function (data) {
            const cellData = data.cell.raw as any;
      
            // Check if the cell contains image data
            if (cellData && typeof cellData === 'object' && 'imgData' in cellData) {
              const imgData = cellData.imgData as string;
      
              // Define the dimensions of the image
              const imgWidth = Math.min(data.cell.width * 0.8, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.8, 56); // Scale within cell height
      
              // Calculate the center position for the image
              const xPos = data.cell.x + (data.cell.width - imgWidth) / 2;
              const yPos = data.cell.y + (data.cell.height - imgHeight) / 2;
      
              // Add the image to the PDF
              doc.addImage(imgData, 'JPEG', xPos, yPos, imgWidth, imgHeight);
      
              // Draw the unit text below the image
              const textXPos = data.cell.x + (data.cell.width - doc.getTextWidth(cellData.unit)) / 2;
              const textYPos = yPos + imgHeight + 4;
      
              // // Add the unit text
              doc.text(cellData.unit.replace(/~/g, '-'), textXPos, textYPos);
            }

            // _ single unit multiple img.
            else if (cellData && cellData.imgsData) {
              const imgDataArray = cellData.imgsData as string[];
              const unitArray = cellData.unit as string[]; // Assume `cellData.unit` is an array of text corresponding to images
            
              // Define the dimensions of the images
              const imgWidth = Math.min(data.cell.width * 0.8 / imgDataArray.length, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.6, 56); // Scale within cell height
            
              // Define the space between images
              const spaceBetweenImages = 40; // Adjust this value for the desired space between images
            
              // Calculate the initial x position for the first image
              let xPos = data.cell.x + (data.cell.width - imgWidth * imgDataArray.length - spaceBetweenImages * (imgDataArray.length - 1)) / 2;
            
              // Loop through the images and add them horizontally in the same cell
              imgDataArray.forEach((imgData, index) => {
                // Add the image to the PDF at the calculated position
                doc.addImage(
                  imgData,
                  'JPEG',
                  xPos + index * (imgWidth + spaceBetweenImages), // Horizontal position for each image
                  data.cell.y + (data.cell.height - imgHeight)/3 , // Vertical position to center images in the cell
                  imgWidth,
                  imgHeight
                );
            
                // Calculate the initial position for the text
                const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + (imgWidth / 2);
                // const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + imgWidth / 2 - doc.getTextWidth(unitArray[index]) / 2; // Center text below image
                let textYPos = data.cell.y + (data.cell.height - imgHeight) / 2 + imgHeight + 2 // Start 5px below the image
            
                // Split long text into lines that fit within the image width
                const textLines = doc.splitTextToSize(unitArray[index].replace(/~/g, '-') || '', imgWidth+20);
            
                // Line height for text
                const lineHeight = 3.5; // Adjust line height as needed
            
                // Add each line of text
                textLines.forEach((line: any) => {
                  // Adjust text alignment to center each line
                  const lineWidth = doc.getTextWidth(line);
                  doc.text(line, textXPos - lineWidth / 2, textYPos);
                  textYPos += lineHeight; // Move down for the next line
                });
              });
            } 
            //  * multiple unit with multiplke img.
            else if (cellData && cellData.img_Data) {
              const imgDataArray = cellData.img_Data as string[];
              const unitArray = cellData.unit as string[]; // Assuming `cellData.unit` is an array
            
              // Define the dimensions of the images
              const imgWidth = Math.min(data.cell.width * 0.8 / imgDataArray.length, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.8, 56); // Scale within cell height
            
              // Define the space between images
              const spaceBetweenImages = 40; // Adjust this value for the desired space between images
            
              // Calculate the total width of all images including the space between them
              const totalImagesWidth = imgWidth * imgDataArray.length + spaceBetweenImages * (imgDataArray.length - 1);
            
              // Calculate the initial x position to center the images horizontally
              let xPos = data.cell.x + (data.cell.width - totalImagesWidth) / 2;
            
              // Loop through the images and add them horizontally in the same cell
              imgDataArray.forEach((imgData, index) => {
                // Add the image to the PDF at the calculated position
                doc.addImage(
                  imgData,
                  'JPEG',
                  xPos + index * (imgWidth + spaceBetweenImages), // Horizontal position for each image
                  data.cell.y + (data.cell.height - imgHeight)/3 , // Vertical position to center images in the cell
                  imgWidth,
                  imgHeight
                );
            
                // Calculate the initial position for the text
                const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + (imgWidth / 2);
                // const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + imgWidth / 2 - doc.getTextWidth(unitArray[index]) / 2; // Center text below image
                let textYPos = data.cell.y + (data.cell.height - imgHeight) / 2 + imgHeight + 2 // Start 5px below the image
            
                // Split long text into lines that fit within the image width
                const textLines = doc.splitTextToSize(unitArray[index].replace(/~/g, '-') || '', imgWidth+20);
            
                // Line height for text
                const lineHeight = 3.5; // Adjust line height as needed
            
                // Add each line of text
                textLines.forEach((line: any) => {
                  // Adjust text alignment to center each line
                  const lineWidth = doc.getTextWidth(line);
                  doc.text(line, textXPos - lineWidth / 2, textYPos);
                  textYPos += lineHeight; // Move down for the next line
                });
              });
            }
            
            
            
          },
        });
      
        addFooter();
      
       
        doc.addPage();
        body.length = 0;
        finalY = 24; // Reset finalY for the new page
      } 
    });
  };



  
  const text = "PIT";
  const pageWidth = doc.internal.pageSize.width;
  const textWidth = doc.getTextWidth(text);
  const x = (pageWidth - textWidth) / 2;

  doc.setFontSize(12);
  doc.setFont('calibri', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(text, x, 20);

  addInspectionData();
}; 

const addcontent_CABIN = () => {
  const head = [['S.No.', 'DESCRIPTION', ...this.Ordered_unit]];

  const headerlen:number=head[0].length-1;
  

  let body: any = [];
  const addInspectionData = () => {
    let finalY = 24; // Initial start position for the first table
    let icount=0;
    this.inspectionMasterData.forEach((checklistmaster, i_master) => {
      const description = checklistmaster.Description.trim();
      Object.keys(this.Result_unit_status_cabin).forEach(Result_unit_status_Desc => {
        const Result_unit_status_Desc_trim = Result_unit_status_Desc.trim();
        const matchesDescription = Result_unit_status_Desc_trim === description;
        if (this.Result_unit_status_cabin[Result_unit_status_Desc_trim] === true && matchesDescription) {
          const row = [];
          if (checklistmaster.Parts?.toLowerCase() === 'cabin') {
     
            row.push({
              content: ++icount ,
              styles: {
                rowSpan: 2,halign: 'center',
                valign: 'middle', // Apply rowspan
              }
            });

            row.push({
              content: description,
              styles: {
                halign: 'center',
                valign: 'middle',
                cellPadding: 2,
              }
            });

            this.Ordered_unit.forEach(uni => {
              if (this.Result_Of_pit_variables_cabin[description]?.[uni]) {
                // Get the status value
                const status = this.Result_Of_pit_variables_cabin[description][uni].status;
            
                // Replace the status with the full form
                const statusFullForm = status.trim() === 'Y' ? 'Complied': status === 'N'? 'Not Complied': status === 'NA'? 'Not Applicable': status; // Default to original value if it doesn't match
            
                // Push the modified status into the row
                row.push({
                  content: statusFullForm,
                  styles: {
                    halign: 'center',
                    valign: 'middle',
                    cellPadding: 2,
                    minCellWidth: 5,
                    textColor: this.getStatusColor(status)
                  }
                });
              }
            });
            body.push(row);

            if (this.check_Image_cabin(Result_unit_status_Desc_trim, checklistmaster) === true) {
            
              if (this.checkunithastwoimg(this.Result_Of_pit_variables_cabin[description]) === true) {
                console.log("><0");
                const imageRow: any[] = [];
                const uni_t:String[]=[]
                const imagesData: string[] = [];
                // Iterate over Ordered_unit
                this.Ordered_unit.forEach(uni => {
                  if (this.Result_Of_pit_variables_cabin[description][uni].has_image === true) {

                    // Loop through the images and add them to the imagesData array
                    this.Result_Of_pit_variables_cabin[description][uni].image.forEach((img, img_len) => {
                      const imgData = this.getImageData_cabin(description, uni, img_len) as string; // Get image data as string
                      imagesData.push(imgData); // Push the image data into the array
                      uni_t.push(uni+"-"+img.image_dropdown,)
                    });
              
                    // Now, both images are in the imagesData array
                    // Add the row with images to the body
                   
                  }
                });
                if (imagesData.length > 0) {
                  imageRow.push({
                    content: '', // Empty content for cell
                    colSpan: this.Ordered_unit_count + 2,  // Apply colspan for merging cells
                    styles: {
                      valign: 'middle',
                      halign: 'center',
                      minCellHeight: 68,  // Set minimum cell height
                    },
                    imgsData: imagesData,  // Pass the array of images for the unit
                    unit: uni_t,  // Unit name
                  });
                }
                body.push(imageRow);
                console.log("<>/",imageRow);
              }
              
              
               else if (this.checknoof_img(this.Result_Of_pit_variables_cabin[description]) === 1) {
                console.log("><1")

                this.Ordered_unit.forEach(uni => {
                  if (this.Result_Of_pit_variables_cabin[description][uni].has_image === true) {
                    const imageRow: any[] = [];
                
                    
                    this.Result_Of_pit_variables_cabin[description][uni].image.forEach((img, img_len) => {
                      const imgData = this.getImageData_cabin(description, uni, img_len) as string; // Cast to string
                        imageRow.push({
                          content: '', // Empty content for cell
                          colSpan:this.Ordered_unit_count+2,
                          styles: {
                            valign: 'middle',
                            halign: 'center',
                            minCellHeight: 68,
                             // Apply colspan here
                          },
                          imgData: imgData ,// Use the imgData here
                          unit:uni+"-"+img.image_dropdown,
                        });                        
                    });
            
                    body.push(imageRow);
                  }
                });
              } 
              
              else if (this.checknoof_img(this.Result_Of_pit_variables_cabin[description]) === 2) {
                console.log("><2");
                const imageRow: any[] = [];
                const uni_t:String[]=[]
                const imagesData: string[] = [];
                // Iterate over Ordered_unit
                this.Ordered_unit.forEach(uni => {
                  if (this.Result_Of_pit_variables_cabin[description][uni].has_image === true) {

                    // Loop through the images and add them to the imagesData array
                    this.Result_Of_pit_variables_cabin[description][uni].image.forEach((img, img_len) => {
                      const imgData = this.getImageData_cabin(description, uni, img_len) as string; // Get image data as string
                      imagesData.push(imgData); // Push the image data into the array
                      uni_t.push(uni+"-"+img.image_dropdown,)
                    });
              
                    // Now, both images are in the imagesData array
                    // Add the row with images to the body
                   
                  }
                });
                if (imagesData.length > 0) {
                  imageRow.push({
                    content: '', // Empty content for cell
                    colSpan: this.Ordered_unit_count + 2,  // Apply colspan for merging cells
                    styles: {
                      valign: 'middle',
                      halign: 'center',
                      minCellHeight: 68,  // Set minimum cell height
                    },
                    img_Data: imagesData,  // Pass the array of images for the unit
                    unit: uni_t,  // Unit name
                  });
                }
                body.push(imageRow);
                console.log("<>/",imageRow);
                
              } 
              else{
                body.push([{
                  content: 'No Image Captured',
                  colSpan: this.Ordered_unit.length + 3,
                  styles: { halign: 'center',
                    minCellHeight:60,
                    valign: 'middle', }
                }]);
                
              }
            }
            else{
              body.push([{
                content: 'No Image Captured',
                colSpan: this.Ordered_unit.length + 3,
                styles: { halign: 'center',
                  minCellHeight:60,
                  valign: 'middle', }
              }]);
              
            }
            }
          }
        else if (this.Result_unit_status_cabin[Result_unit_status_Desc_trim] === false && matchesDescription) {
          if (checklistmaster.Parts?.toLowerCase() === 'cabin') {
          const noImageRow: any[] = [
            {
              content: ++icount ,
              styles: {
                rowSpan: 2,halign: 'center',
                minCellHeight:5,
                valign: 'middle', // Apply rowspan
              }
            }
            ,{
              content: description,
              styles: {
                halign: 'center',
            valign: 'middle',
            minCellHeight:5,
                rowSpan: 2, // Apply rowspan
              }
            }
            
          ];

          this.Ordered_unit.forEach(uni => {
            noImageRow.push({
              content: 'Complied',
              styles: {
                minCellHeight:5,
                halign: 'center',
            valign: 'middle',
            cellPadding: 2,
                textColor: this.getStatusColor('Y')
              }
            });
          });

          body.push(noImageRow);
          body.push([{
            content: 'No Image Captured',
            colSpan: this.Ordered_unit.length + 3,
            styles: { halign: 'center',
              minCellHeight:60,
              valign: 'middle', }
          }]);

        }

        }
      });
      // Adjust finalY and create a new table on the next page if i_master + 1 % 2 === 0
      if (((icount) % 2 === 0 && checklistmaster.Parts?.toLowerCase() === 'cabin')) {
        addHeader();
      
        // Get page dimensions
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
      
        // Define margins
        const margin = { top: 10, left: 10, right: 10, bottom: 10 };
        const tableWidth = pageWidth - margin.left - margin.right;
      
        // Define static widths for columns 0 and 1
        const staticWidths = {
          0: tableWidth * 0.06, // 15% of table width
          1: tableWidth * 0.55, // 55% of table width
        };
      
        // Calculate the remaining width for dynamic columns
        const remainingWidth = tableWidth - staticWidths[0] - staticWidths[1];
      
        // Determine the number of dynamic columns (excluding 0 and 1)
        const totalColumns = head[0]?.length || 0;
        const dynamicColumnCount = totalColumns - 2;
      
        // Calculate width for each dynamic column
        const dynamicWidth = dynamicColumnCount > 0 ? remainingWidth / dynamicColumnCount : 0;
      
        // Define columnStyles dynamically
        const columnStyles:any = {
          0: { cellWidth: staticWidths[0] }, // Static column 0
          1: { cellWidth: staticWidths[1] }, // Static column 1
        };
      
        // Add dynamic columns to columnStyles
        for (let i = 2; i < totalColumns; i++) {
          columnStyles[i] = { cellWidth: dynamicWidth };
        }
      
        autoTable(doc, {
          head: head,
          body: body,
          startY: finalY,
          theme: 'striped',
          styles: {
            cellPadding: 2,
            halign: 'center',
            fontSize: 10,
            lineColor: [0, 0, 0],
          },
          headStyles: {
            lineWidth: 0.25,
            fillColor: [255, 255, 204],
            textColor: [0, 0, 0],
          },
          bodyStyles: {
            lineWidth: 0.25,
            fillColor: [245, 245, 245],
            font: 'calibri', // Set font family
            fontStyle: 'normal', // Set font style
            textColor: [0, 0, 0], // Set text color to black
          },
          columnStyles: columnStyles,
          margin: margin,
          didDrawCell: function (data) {
            const cellData = data.cell.raw as any;
      
            // Check if the cell contains image data
            if (cellData && typeof cellData === 'object' && 'imgData' in cellData) {
              const imgData = cellData.imgData as string;
      
              // Define the dimensions of the image
              const imgWidth = Math.min(data.cell.width * 0.8, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.8, 56); // Scale within cell height
      
              // Calculate the center position for the image
              const xPos = data.cell.x + (data.cell.width - imgWidth) / 2;
              const yPos = data.cell.y + (data.cell.height - imgHeight) / 2;
      
              // Add the image to the PDF
              doc.addImage(imgData, 'JPEG', xPos, yPos, imgWidth, imgHeight);
      
              // Draw the unit text below the image
              const textXPos = data.cell.x + (data.cell.width - doc.getTextWidth(cellData.unit)) / 2;
              const textYPos = yPos + imgHeight + 4;
      
              // Add the unit text
              doc.text(cellData.unit.replace(/~/g, '-'), textXPos, textYPos);
            }
            else if (cellData && cellData.imgsData) {
              const imgDataArray = cellData.imgsData as string[];
              const unitArray = cellData.unit as string[]; // Assume `cellData.unit` is an array of text corresponding to images
            
              // Define the dimensions of the images
              const imgWidth = Math.min(data.cell.width * 0.8 / imgDataArray.length, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.6, 56); // Scale within cell height
            
              // Define the space between images
              const spaceBetweenImages = 40; // Adjust this value for the desired space between images
            
              // Calculate the initial x position for the first image
              let xPos = data.cell.x + (data.cell.width - imgWidth * imgDataArray.length - spaceBetweenImages * (imgDataArray.length - 1)) / 2;
            
              // Loop through the images and add them horizontally in the same cell
              imgDataArray.forEach((imgData, index) => {
                // Add the image to the PDF at the calculated position
                doc.addImage(
                  imgData,
                  'JPEG',
                  xPos + index * (imgWidth + spaceBetweenImages), // Horizontal position for each image
                  data.cell.y + (data.cell.height - imgHeight)/3 , // Vertical position to center images in the cell
                  imgWidth,
                  imgHeight
                );
            
                // Calculate the initial position for the text
                const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + (imgWidth / 2);
                // const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + imgWidth / 2 - doc.getTextWidth(unitArray[index]) / 2; // Center text below image
                let textYPos = data.cell.y + (data.cell.height - imgHeight) / 2 + imgHeight + 2 // Start 5px below the image
            
                // Split long text into lines that fit within the image width
                const textLines = doc.splitTextToSize(unitArray[index].replace(/~/g, '-') || '', imgWidth+20);
            
                // Line height for text
                const lineHeight = 3.5; // Adjust line height as needed
            
                // Add each line of text
                textLines.forEach((line: any) => {
                  // Adjust text alignment to center each line
                  const lineWidth = doc.getTextWidth(line);
                  doc.text(line, textXPos - lineWidth / 2, textYPos);
                  textYPos += lineHeight; // Move down for the next line
                });
              });
            } 
            //  * multiple unit with multiplke img.
            else if (cellData && cellData.img_Data) {
              const imgDataArray = cellData.img_Data as string[];
              const unitArray = cellData.unit as string[]; // Assuming `cellData.unit` is an array
            
              // Define the dimensions of the images
              const imgWidth = Math.min(data.cell.width * 0.8 / imgDataArray.length, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.8, 56); // Scale within cell height
            
              // Define the space between images
              const spaceBetweenImages = 40; // Adjust this value for the desired space between images
            
              // Calculate the total width of all images including the space between them
              const totalImagesWidth = imgWidth * imgDataArray.length + spaceBetweenImages * (imgDataArray.length - 1);
            
              // Calculate the initial x position to center the images horizontally
              let xPos = data.cell.x + (data.cell.width - totalImagesWidth) / 2;
            
              // Loop through the images and add them horizontally in the same cell
              imgDataArray.forEach((imgData, index) => {
                // Add the image to the PDF at the calculated position
                doc.addImage(
                  imgData,
                  'JPEG',
                  xPos + index * (imgWidth + spaceBetweenImages), // Horizontal position for each image
                  data.cell.y + (data.cell.height - imgHeight)/3 , // Vertical position to center images in the cell
                  imgWidth,
                  imgHeight
                );
            
                // Calculate the initial position for the text
                const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + (imgWidth / 2);
                // const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + imgWidth / 2 - doc.getTextWidth(unitArray[index]) / 2; // Center text below image
                let textYPos = data.cell.y + (data.cell.height - imgHeight) / 2 + imgHeight + 2 // Start 5px below the image
            
                // Split long text into lines that fit within the image width
                const textLines = doc.splitTextToSize(unitArray[index].replace(/~/g, '-') || '', imgWidth+20);
            
                // Line height for text
                const lineHeight = 3.5; // Adjust line height as needed
            
                // Add each line of text
                textLines.forEach((line: any) => {
                  // Adjust text alignment to center each line
                  const lineWidth = doc.getTextWidth(line);
                  doc.text(line, textXPos - lineWidth / 2, textYPos);
                  textYPos += lineHeight; // Move down for the next line
                });
              });
            }
            
            
            
          },
        });
      
        addFooter();
        body.length = 0;
        // Clear the body for the next set of rows
        doc.addPage(); // Add a new page if necessary
        finalY = 24; // Reset finalY for the new page
      }
      const length = Object.keys(this.Result_Of_pit_variables_cabin).length;
      if ((length===icount) && ((icount%2)===1) && checklistmaster.Parts?.toLowerCase() === 'cabin' ) {
        addHeader();
        console.log(".,,",(length===icount) && (length%2)===1,length,icount)
        // Get page dimensions
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
      
        // Define margins
        const margin = { top: 10, left: 10, right: 10, bottom: 10 };
        const tableWidth = pageWidth - margin.left - margin.right;
      
        // Define static widths for columns 0 and 1
        const staticWidths = {
          0: tableWidth * 0.06, // 15% of table width
          1: tableWidth * 0.55, // 55% of table width
        };
      
        // Calculate the remaining width for dynamic columns
        const remainingWidth = tableWidth - staticWidths[0] - staticWidths[1];
      
        // Determine the number of dynamic columns (excluding 0 and 1)
        const totalColumns = head[0]?.length || 0;
        const dynamicColumnCount = totalColumns - 2;
      
        // Calculate width for each dynamic column
        const dynamicWidth = dynamicColumnCount > 0 ? remainingWidth / dynamicColumnCount : 0;
      
        // Define columnStyles dynamically
        const columnStyles:any = {
          0: { cellWidth: staticWidths[0] }, // Static column 0
          1: { cellWidth: staticWidths[1] }, // Static column 1
        };
      
        // Add dynamic columns to columnStyles
        for (let i = 2; i < totalColumns; i++) {
          columnStyles[i] = { cellWidth: dynamicWidth };
        }
      
        autoTable(doc, {
          head: head,
          body: body,
          startY: finalY,
          theme: 'striped',
          styles: {
            cellPadding: 2,
            halign: 'center',
            fontSize: 10,
            lineColor: [0, 0, 0],
          },
          headStyles: {
            lineWidth: 0.25,
            fillColor: [255, 255, 204],
            textColor: [0, 0, 0],
          },
          bodyStyles: {
            lineWidth: 0.25,
            fillColor: [245, 245, 245],
            font: 'calibri', // Set font family
            fontStyle: 'normal', // Set font style
            textColor: [0, 0, 0], // Set text color to black
          },
          columnStyles: columnStyles,
          margin: margin,
          didDrawCell: function (data) {
            const cellData = data.cell.raw as any;
      
            // Check if the cell contains image data
            if (cellData && typeof cellData === 'object' && 'imgData' in cellData) {
              const imgData = cellData.imgData as string;
      
              // Define the dimensions of the image
              const imgWidth = Math.min(data.cell.width * 0.8, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.8, 56); // Scale within cell height
      
              // Calculate the center position for the image
              const xPos = data.cell.x + (data.cell.width - imgWidth) / 2;
              const yPos = data.cell.y + (data.cell.height - imgHeight) / 2;
      
              // Add the image to the PDF
              doc.addImage(imgData, 'JPEG', xPos, yPos, imgWidth, imgHeight);
      
              // Draw the unit text below the image
              const textXPos = data.cell.x + (data.cell.width - doc.getTextWidth(cellData.unit)) / 2;
              const textYPos = yPos + imgHeight + 4;
      
              // Add the unit text
              doc.text(cellData.unit.replace(/~/g, '-'), textXPos, textYPos);
            }
            else if (cellData && cellData.imgsData) {
              const imgDataArray = cellData.imgsData as string[];
              const unitArray = cellData.unit as string[]; // Assume `cellData.unit` is an array of text corresponding to images
            
              // Define the dimensions of the images
              const imgWidth = Math.min(data.cell.width * 0.8 / imgDataArray.length, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.6, 56); // Scale within cell height
            
              // Define the space between images
              const spaceBetweenImages = 40; // Adjust this value for the desired space between images
            
              // Calculate the initial x position for the first image
              let xPos = data.cell.x + (data.cell.width - imgWidth * imgDataArray.length - spaceBetweenImages * (imgDataArray.length - 1)) / 2;
            
              // Loop through the images and add them horizontally in the same cell
              imgDataArray.forEach((imgData, index) => {
                // Add the image to the PDF at the calculated position
                doc.addImage(
                  imgData,
                  'JPEG',
                  xPos + index * (imgWidth + spaceBetweenImages), // Horizontal position for each image
                  data.cell.y + (data.cell.height - imgHeight)/3 , // Vertical position to center images in the cell
                  imgWidth,
                  imgHeight
                );
            
                // Calculate the initial position for the text
                const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + (imgWidth / 2);
                // const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + imgWidth / 2 - doc.getTextWidth(unitArray[index]) / 2; // Center text below image
                let textYPos = data.cell.y + (data.cell.height - imgHeight) / 2 + imgHeight + 2 // Start 5px below the image
            
                // Split long text into lines that fit within the image width
                const textLines = doc.splitTextToSize(unitArray[index].replace(/~/g, '-') || '', imgWidth+20);
            
                // Line height for text
                const lineHeight = 3.5; // Adjust line height as needed
            
                // Add each line of text
                textLines.forEach((line: any) => {
                  // Adjust text alignment to center each line
                  const lineWidth = doc.getTextWidth(line);
                  doc.text(line, textXPos - lineWidth / 2, textYPos);
                  textYPos += lineHeight; // Move down for the next line
                });
              });
            } 
            //  * multiple unit with multiplke img.
            else if (cellData && cellData.img_Data) {
              const imgDataArray = cellData.img_Data as string[];
              const unitArray = cellData.unit as string[]; // Assuming `cellData.unit` is an array
            
              // Define the dimensions of the images
              const imgWidth = Math.min(data.cell.width * 0.8 / imgDataArray.length, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.8, 56); // Scale within cell height
            
              // Define the space between images
              const spaceBetweenImages = 40; // Adjust this value for the desired space between images
            
              // Calculate the total width of all images including the space between them
              const totalImagesWidth = imgWidth * imgDataArray.length + spaceBetweenImages * (imgDataArray.length - 1);
            
              // Calculate the initial x position to center the images horizontally
              let xPos = data.cell.x + (data.cell.width - totalImagesWidth) / 2;
            
              // Loop through the images and add them horizontally in the same cell
              imgDataArray.forEach((imgData, index) => {
                // Add the image to the PDF at the calculated position
                doc.addImage(
                  imgData,
                  'JPEG',
                  xPos + index * (imgWidth + spaceBetweenImages), // Horizontal position for each image
                  data.cell.y + (data.cell.height - imgHeight)/3 , // Vertical position to center images in the cell
                  imgWidth,
                  imgHeight
                );
            
                // Calculate the initial position for the text
                const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + (imgWidth / 2);
                // const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + imgWidth / 2 - doc.getTextWidth(unitArray[index]) / 2; // Center text below image
                let textYPos = data.cell.y + (data.cell.height - imgHeight) / 2 + imgHeight + 2 // Start 5px below the image
            
                // Split long text into lines that fit within the image width
                const textLines = doc.splitTextToSize(unitArray[index].replace(/~/g, '-') || '', imgWidth+20);
            
                // Line height for text
                const lineHeight = 3.5; // Adjust line height as needed
            
                // Add each line of text
                textLines.forEach((line: any) => {
                  // Adjust text alignment to center each line
                  const lineWidth = doc.getTextWidth(line);
                  doc.text(line, textXPos - lineWidth / 2, textYPos);
                  textYPos += lineHeight; // Move down for the next line
                });
              });
            }
            
            
          },
        });
      
        addFooter();
      
       
        doc.addPage();
        body.length = 0;
        finalY = 24; // Reset finalY for the new page
      } 
    });
  };



  const text = "CABIN";
  const pageWidth = doc.internal.pageSize.width;
  const textWidth = doc.getTextWidth(text);
  const x = (pageWidth - textWidth) / 2;

  doc.setFontSize(12);
  doc.setFont('calibri', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(text, x, 20);

  addInspectionData();
}; 

const addcontent_CARTOP = () => {
  const head = [['S.No.', 'DESCRIPTION', ...this.Ordered_unit]];

  const headerlen:number=head[0].length-1;
  

  let body: any = [];

  const addInspectionData = () => {
    let finalY = 24; // Initial start position for the first table
    let icount=0;
    this.inspectionMasterData.forEach((checklistmaster, i_master) => {
      const description = checklistmaster.Description.trim();
      Object.keys(this.Result_unit_status_cartop).forEach(Result_unit_status_Desc => {
        const Result_unit_status_Desc_trim = Result_unit_status_Desc.trim();
        const matchesDescription = Result_unit_status_Desc_trim === description;
        if (this.Result_unit_status_cartop[Result_unit_status_Desc_trim] === true && matchesDescription) {
          const row = [];
          if (checklistmaster.Parts?.toLowerCase() === 'car top') {
     
            row.push({
              content: ++icount ,
              styles: {
                rowSpan: 2,halign: 'center',
                valign: 'middle', // Apply rowspan
              }
            });

            row.push({
              content: description,
              styles: {
                halign: 'center',
                valign: 'middle',
                cellPadding: 2,
              }
            });

            this.Ordered_unit.forEach(uni => {
              if (this.Result_Of_pit_variables_cartop[description]?.[uni]) {
                // Get the status value
                const status = this.Result_Of_pit_variables_cartop[description][uni].status;
            
                // Replace the status with the full form
                const statusFullForm = status.trim() === 'Y' ? 'Complied': status === 'N'? 'Not Complied': status === 'NA'? 'Not Applicable': status; // Default to original value if it doesn't match
            
                // Push the modified status into the row
                row.push({
                  content: statusFullForm,
                  styles: {
                    halign: 'center',
                    valign: 'middle',
                    cellPadding: 2,
                    minCellWidth: 5,
                    textColor: this.getStatusColor(status)
                  }
                });
              }
            });
            body.push(row);

            if (this.check_Image_cartop(Result_unit_status_Desc_trim, checklistmaster) === true) {
            
              if (this.checkunithastwoimg(this.Result_Of_pit_variables_cartop[description]) === true) {
                console.log("><0");
                const imageRow: any[] = [];
                const uni_t:String[]=[]
                const imagesData: string[] = [];
                // Iterate over Ordered_unit
                this.Ordered_unit.forEach(uni => {
                  if (this.Result_Of_pit_variables_cartop[description][uni].has_image === true) {

                    // Loop through the images and add them to the imagesData array
                    this.Result_Of_pit_variables_cartop[description][uni].image.forEach((img, img_len) => {
                      const imgData = this.getImageData_cartop(description, uni, img_len) as string; // Get image data as string
                      imagesData.push(imgData); // Push the image data into the array
                      uni_t.push(uni+"-"+img.image_dropdown,)
                    });
              
                    // Now, both images are in the imagesData array
                    // Add the row with images to the body
                   
                  }
                });
                if (imagesData.length > 0) {
                  imageRow.push({
                    content: '', // Empty content for cell
                    colSpan: this.Ordered_unit_count + 2,  // Apply colspan for merging cells
                    styles: {
                      valign: 'middle',
                      halign: 'center',
                      minCellHeight: 68,  // Set minimum cell height
                    },
                    imgsData: imagesData,  // Pass the array of images for the unit
                    unit: uni_t,  // Unit name
                  });
                }
                body.push(imageRow);
                console.log("<>/",imageRow);
              }
              
              
               else if (this.checknoof_img(this.Result_Of_pit_variables_cartop[description]) === 1) {
                console.log("><1")

                this.Ordered_unit.forEach(uni => {
                  if (this.Result_Of_pit_variables_cartop[description][uni].has_image === true) {
                    const imageRow: any[] = [];
                
                    
                    this.Result_Of_pit_variables_cartop[description][uni].image.forEach((img, img_len) => {
                      const imgData = this.getImageData_cartop(description, uni, img_len) as string; // Cast to string
                        imageRow.push({
                          content: '', // Empty content for cell
                          colSpan:this.Ordered_unit_count+2,
                          styles: {
                            valign: 'middle',
                            halign: 'center',
                            minCellHeight: 68,
                             // Apply colspan here
                          },
                          imgData: imgData ,// Use the imgData here
                          unit:uni+"-"+img.image_dropdown,
                        });                        
                    });
            
                    body.push(imageRow);
                  }
                });
              } 
              
              else if (this.checknoof_img(this.Result_Of_pit_variables_cartop[description]) === 2) {
                console.log("><2");
                const imageRow: any[] = [];
                const uni_t:String[]=[]
                const imagesData: string[] = [];
                // Iterate over Ordered_unit
                this.Ordered_unit.forEach(uni => {
                  if (this.Result_Of_pit_variables_cartop[description][uni].has_image === true) {

                    // Loop through the images and add them to the imagesData array
                    this.Result_Of_pit_variables_cartop[description][uni].image.forEach((img, img_len) => {
                      const imgData = this.getImageData_cartop(description, uni, img_len) as string; // Get image data as string
                      imagesData.push(imgData); // Push the image data into the array
                      uni_t.push(uni+"-"+img.image_dropdown)
                    });
              
                    // Now, both images are in the imagesData array
                    // Add the row with images to the body
                   
                  }
                });
                if (imagesData.length > 0) {
                  imageRow.push({
                    content: '', // Empty content for cell
                    colSpan: this.Ordered_unit_count + 2,  // Apply colspan for merging cells
                    styles: {
                      valign: 'middle',
                      halign: 'center',
                      minCellHeight: 68,  // Set minimum cell height
                    },
                    img_Data: imagesData,  // Pass the array of images for the unit
                    unit: uni_t,  // Unit name
                  });
                }
                body.push(imageRow);
                console.log("<>/",imageRow);
                
              } 
              else{
                body.push([{
                  content: 'No Image Captured',
                  colSpan: this.Ordered_unit.length + 3,
                  styles: { halign: 'center',
                    minCellHeight:60,
                    valign: 'middle', }
                }]);
                
              }
            }
            else{
              body.push([{
                content: 'No Image Captured',
                colSpan: this.Ordered_unit.length + 3,
                styles: { halign: 'center',
                  minCellHeight:60,
                  valign: 'middle', }
              }]);
              
            }
            }
          }
        else if (this.Result_unit_status_cartop[Result_unit_status_Desc_trim] === false && matchesDescription) {
          if (checklistmaster.Parts?.toLowerCase() === 'car top') {
          const noImageRow: any[] = [
            {
              content: ++icount ,
              styles: {
                rowSpan: 2,halign: 'center',
                minCellHeight:5,
                valign: 'middle', // Apply rowspan
              }
            }
            ,{
              content: description,
              styles: {
                halign: 'center',
            valign: 'middle',
            minCellHeight:5,
                rowSpan: 2, // Apply rowspan
              }
            }
            
          ];

          this.Ordered_unit.forEach(uni => {
            noImageRow.push({
              content: 'Complied',
              styles: {
                minCellHeight:5,
                halign: 'center',
            valign: 'middle',
            cellPadding: 2,
                textColor: this.getStatusColor('Y')
              }
            });
          });

          body.push(noImageRow);
          body.push([{
            content: 'No Image Captured',
            colSpan: this.Ordered_unit.length + 3,
            styles: { halign: 'center',
              minCellHeight:60,
              valign: 'middle', }
          }]);

        }

        }
      });
      // Adjust finalY and create a new table on the next page if i_master + 1 % 2 === 0
      if (((icount) % 2 === 0 && checklistmaster.Parts?.toLowerCase() === 'car top')) {
        addHeader();
      
        // Get page dimensions
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
      
        // Define margins
        const margin = { top: 10, left: 10, right: 10, bottom: 10 };
        const tableWidth = pageWidth - margin.left - margin.right;
      
        // Define static widths for columns 0 and 1
        const staticWidths = {
          0: tableWidth * 0.06, // 15% of table width
          1: tableWidth * 0.55, // 55% of table width
        };
      
        // Calculate the remaining width for dynamic columns
        const remainingWidth = tableWidth - staticWidths[0] - staticWidths[1];
      
        // Determine the number of dynamic columns (excluding 0 and 1)
        const totalColumns = head[0]?.length || 0;
        const dynamicColumnCount = totalColumns - 2;
      
        // Calculate width for each dynamic column
        const dynamicWidth = dynamicColumnCount > 0 ? remainingWidth / dynamicColumnCount : 0;
      
        // Define columnStyles dynamically
        const columnStyles:any = {
          0: { cellWidth: staticWidths[0] }, // Static column 0
          1: { cellWidth: staticWidths[1] }, // Static column 1
        };
      
        // Add dynamic columns to columnStyles
        for (let i = 2; i < totalColumns; i++) {
          columnStyles[i] = { cellWidth: dynamicWidth };
        }
      
        autoTable(doc, {
          head: head,
          body: body,
          startY: finalY,
          theme: 'striped',
          styles: {
            cellPadding: 2,
            halign: 'center',
            fontSize: 10,
            lineColor: [0, 0, 0],
          },
          headStyles: {
            lineWidth: 0.25,
            fillColor: [255, 255, 204],
            textColor: [0, 0, 0],
          },
          bodyStyles: {
            lineWidth: 0.25,
            fillColor: [245, 245, 245],
            font: 'calibri', // Set font family
            fontStyle: 'normal', // Set font style
            textColor: [0, 0, 0], // Set text color to black
          },
          columnStyles: columnStyles,
          margin: margin,
          didDrawCell: function (data) {
            const cellData = data.cell.raw as any;
      
            // Check if the cell contains image data
            if (cellData && typeof cellData === 'object' && 'imgData' in cellData) {
              const imgData = cellData.imgData as string;
      
              // Define the dimensions of the image
              const imgWidth = Math.min(data.cell.width * 0.8, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.8, 56); // Scale within cell height
      
              // Calculate the center position for the image
              const xPos = data.cell.x + (data.cell.width - imgWidth) / 2;
              const yPos = data.cell.y + (data.cell.height - imgHeight) / 2;
      
              // Add the image to the PDF
              doc.addImage(imgData, 'JPEG', xPos, yPos, imgWidth, imgHeight);
      
              // Draw the unit text below the image
              const textXPos = data.cell.x + (data.cell.width - doc.getTextWidth(cellData.unit)) / 2;
              const textYPos = yPos + imgHeight + 4;
      
              // Add the unit text
              doc.text(cellData.unit.replace(/~/g, '-'), textXPos, textYPos);
            }
            else if (cellData && cellData.imgsData) {
              const imgDataArray = cellData.imgsData as string[];
              const unitArray = cellData.unit as string[]; // Assume `cellData.unit` is an array of text corresponding to images
            
              // Define the dimensions of the images
              const imgWidth = Math.min(data.cell.width * 0.8 / imgDataArray.length, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.6, 56); // Scale within cell height
            
              // Define the space between images
              const spaceBetweenImages = 40; // Adjust this value for the desired space between images
            
              // Calculate the initial x position for the first image
              let xPos = data.cell.x + (data.cell.width - imgWidth * imgDataArray.length - spaceBetweenImages * (imgDataArray.length - 1)) / 2;
            
              // Loop through the images and add them horizontally in the same cell
              imgDataArray.forEach((imgData, index) => {
                // Add the image to the PDF at the calculated position
                doc.addImage(
                  imgData,
                  'JPEG',
                  xPos + index * (imgWidth + spaceBetweenImages), // Horizontal position for each image
                  data.cell.y + (data.cell.height - imgHeight)/3 , // Vertical position to center images in the cell
                  imgWidth,
                  imgHeight
                );
            
                // Calculate the initial position for the text
                const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + (imgWidth / 2);
                // const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + imgWidth / 2 - doc.getTextWidth(unitArray[index]) / 2; // Center text below image
                let textYPos = data.cell.y + (data.cell.height - imgHeight) / 2 + imgHeight + 2 // Start 5px below the image
            
                // Split long text into lines that fit within the image width
                const textLines = doc.splitTextToSize(unitArray[index].replace(/~/g, '-') || '', imgWidth+20);
            
                // Line height for text
                const lineHeight = 3.5; // Adjust line height as needed
            
                // Add each line of text
                textLines.forEach((line: any) => {
                  // Adjust text alignment to center each line
                  const lineWidth = doc.getTextWidth(line);
                  doc.text(line, textXPos - lineWidth / 2, textYPos);
                  textYPos += lineHeight; // Move down for the next line
                });
              });
            } 
            //  * multiple unit with multiplke img.
            else if (cellData && cellData.img_Data) {
              const imgDataArray = cellData.img_Data as string[];
              const unitArray = cellData.unit as string[]; // Assuming `cellData.unit` is an array
            
              // Define the dimensions of the images
              const imgWidth = Math.min(data.cell.width * 0.8 / imgDataArray.length, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.8, 56); // Scale within cell height
            
              // Define the space between images
              const spaceBetweenImages = 40; // Adjust this value for the desired space between images
            
              // Calculate the total width of all images including the space between them
              const totalImagesWidth = imgWidth * imgDataArray.length + spaceBetweenImages * (imgDataArray.length - 1);
            
              // Calculate the initial x position to center the images horizontally
              let xPos = data.cell.x + (data.cell.width - totalImagesWidth) / 2;
            
              // Loop through the images and add them horizontally in the same cell
              imgDataArray.forEach((imgData, index) => {
                // Add the image to the PDF at the calculated position
                doc.addImage(
                  imgData,
                  'JPEG',
                  xPos + index * (imgWidth + spaceBetweenImages), // Horizontal position for each image
                  data.cell.y + (data.cell.height - imgHeight)/3 , // Vertical position to center images in the cell
                  imgWidth,
                  imgHeight
                );
            
                // Calculate the initial position for the text
                const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + (imgWidth / 2);
                // const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + imgWidth / 2 - doc.getTextWidth(unitArray[index]) / 2; // Center text below image
                let textYPos = data.cell.y + (data.cell.height - imgHeight) / 2 + imgHeight + 2 // Start 5px below the image
            
                // Split long text into lines that fit within the image width
                const textLines = doc.splitTextToSize(unitArray[index].replace(/~/g, '-') || '', imgWidth+20);
            
                // Line height for text
                const lineHeight = 3.5; // Adjust line height as needed
            
                // Add each line of text
                textLines.forEach((line: any) => {
                  // Adjust text alignment to center each line
                  const lineWidth = doc.getTextWidth(line);
                  doc.text(line, textXPos - lineWidth / 2, textYPos);
                  textYPos += lineHeight; // Move down for the next line
                });
              });
            }
            
            
            
          },
        });
      
        addFooter();
        body.length = 0;
        // Clear the body for the next set of rows
        doc.addPage(); // Add a new page if necessary
        finalY = 24; // Reset finalY for the new page
      }
      const length = Object.keys(this.Result_Of_pit_variables_cartop).length;
      if ((length===icount) && ((icount%2)===1) && checklistmaster.Parts?.toLowerCase() === 'car top' ) {
        addHeader();
        console.log(".,,",(length===icount) && (length%2)===1,length,icount)
        // Get page dimensions
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
      
        // Define margins
        const margin = { top: 10, left: 10, right: 10, bottom: 10 };
        const tableWidth = pageWidth - margin.left - margin.right;
      
        // Define static widths for columns 0 and 1
        const staticWidths = {
          0: tableWidth * 0.06, // 15% of table width
          1: tableWidth * 0.55, // 55% of table width
        };
      
        // Calculate the remaining width for dynamic columns
        const remainingWidth = tableWidth - staticWidths[0] - staticWidths[1];
      
        // Determine the number of dynamic columns (excluding 0 and 1)
        const totalColumns = head[0]?.length || 0;
        const dynamicColumnCount = totalColumns - 2;
      
        // Calculate width for each dynamic column
        const dynamicWidth = dynamicColumnCount > 0 ? remainingWidth / dynamicColumnCount : 0;
      
        // Define columnStyles dynamically
        const columnStyles:any = {
          0: { cellWidth: staticWidths[0] }, // Static column 0
          1: { cellWidth: staticWidths[1] }, // Static column 1
        };
      
        // Add dynamic columns to columnStyles
        for (let i = 2; i < totalColumns; i++) {
          columnStyles[i] = { cellWidth: dynamicWidth };
        }
      
        autoTable(doc, {
          head: head,
          body: body,
          startY: finalY,
          theme: 'striped',
          styles: {
            cellPadding: 2,
            halign: 'center',
            fontSize: 10,
            lineColor: [0, 0, 0],
          },
          headStyles: {
            lineWidth: 0.25,
            fillColor: [255, 255, 204],
            textColor: [0, 0, 0],
          },
          bodyStyles: {
            lineWidth: 0.25,
            fillColor: [245, 245, 245],
            font: 'calibri', // Set font family
            fontStyle: 'normal', // Set font style
            textColor: [0, 0, 0], // Set text color to black
          },
          columnStyles: columnStyles,
          margin: margin,
          didDrawCell: function (data) {
            const cellData = data.cell.raw as any;
      
            // Check if the cell contains image data
            if (cellData && typeof cellData === 'object' && 'imgData' in cellData) {
              const imgData = cellData.imgData as string;
      
              // Define the dimensions of the image
              const imgWidth = Math.min(data.cell.width * 0.8, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.8, 56); // Scale within cell height
      
              // Calculate the center position for the image
              const xPos = data.cell.x + (data.cell.width - imgWidth) / 2;
              const yPos = data.cell.y + (data.cell.height - imgHeight) / 2;
      
              // Add the image to the PDF
              doc.addImage(imgData, 'JPEG', xPos, yPos, imgWidth, imgHeight);
      
              // Draw the unit text below the image
              const textXPos = data.cell.x + (data.cell.width - doc.getTextWidth(cellData.unit)) / 2;
              const textYPos = yPos + imgHeight + 4;
      
              // Add the unit text
              doc.text(cellData.unit.replace(/~/g, '-'), textXPos, textYPos);
            }
            else if (cellData && cellData.imgsData) {
              const imgDataArray = cellData.imgsData as string[];
              const unitArray = cellData.unit as string[]; // Assume `cellData.unit` is an array of text corresponding to images
            
              // Define the dimensions of the images
              const imgWidth = Math.min(data.cell.width * 0.8 / imgDataArray.length, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.6, 56); // Scale within cell height
            
              // Define the space between images
              const spaceBetweenImages = 40; // Adjust this value for the desired space between images
            
              // Calculate the initial x position for the first image
              let xPos = data.cell.x + (data.cell.width - imgWidth * imgDataArray.length - spaceBetweenImages * (imgDataArray.length - 1)) / 2;
            
              // Loop through the images and add them horizontally in the same cell
              imgDataArray.forEach((imgData, index) => {
                // Add the image to the PDF at the calculated position
                doc.addImage(
                  imgData,
                  'JPEG',
                  xPos + index * (imgWidth + spaceBetweenImages), // Horizontal position for each image
                  data.cell.y + (data.cell.height - imgHeight)/3 , // Vertical position to center images in the cell
                  imgWidth,
                  imgHeight
                );
            
                // Calculate the initial position for the text
                const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + (imgWidth / 2);
                // const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + imgWidth / 2 - doc.getTextWidth(unitArray[index]) / 2; // Center text below image
                let textYPos = data.cell.y + (data.cell.height - imgHeight) / 2 + imgHeight + 2 // Start 5px below the image
            
                // Split long text into lines that fit within the image width
                const textLines = doc.splitTextToSize(unitArray[index].replace(/~/g, '-') || '', imgWidth+20);
            
                // Line height for text
                const lineHeight = 3.5; // Adjust line height as needed
            
                // Add each line of text
                textLines.forEach((line: any) => {
                  // Adjust text alignment to center each line
                  const lineWidth = doc.getTextWidth(line);
                  doc.text(line, textXPos - lineWidth / 2, textYPos);
                  textYPos += lineHeight; // Move down for the next line
                });
              });
            } 
            //  * multiple unit with multiplke img.
            else if (cellData && cellData.img_Data) {
              const imgDataArray = cellData.img_Data as string[];
              const unitArray = cellData.unit as string[]; // Assuming `cellData.unit` is an array
            
              // Define the dimensions of the images
              const imgWidth = Math.min(data.cell.width * 0.8 / imgDataArray.length, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.8, 56); // Scale within cell height
            
              // Define the space between images
              const spaceBetweenImages = 40; // Adjust this value for the desired space between images
            
              // Calculate the total width of all images including the space between them
              const totalImagesWidth = imgWidth * imgDataArray.length + spaceBetweenImages * (imgDataArray.length - 1);
            
              // Calculate the initial x position to center the images horizontally
              let xPos = data.cell.x + (data.cell.width - totalImagesWidth) / 2;
            
              // Loop through the images and add them horizontally in the same cell
              imgDataArray.forEach((imgData, index) => {
                // Add the image to the PDF at the calculated position
                doc.addImage(
                  imgData,
                  'JPEG',
                  xPos + index * (imgWidth + spaceBetweenImages), // Horizontal position for each image
                  data.cell.y + (data.cell.height - imgHeight)/3 , // Vertical position to center images in the cell
                  imgWidth,
                  imgHeight
                );
            
                // Calculate the initial position for the text
                const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + (imgWidth / 2);
                // const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + imgWidth / 2 - doc.getTextWidth(unitArray[index]) / 2; // Center text below image
                let textYPos = data.cell.y + (data.cell.height - imgHeight) / 2 + imgHeight + 2 // Start 5px below the image
            
                // Split long text into lines that fit within the image width
                const textLines = doc.splitTextToSize(unitArray[index].replace(/~/g, '-') || '', imgWidth+20);
            
                // Line height for text
                const lineHeight = 3.5; // Adjust line height as needed
            
                // Add each line of text
                textLines.forEach((line: any) => {
                  // Adjust text alignment to center each line
                  const lineWidth = doc.getTextWidth(line);
                  doc.text(line, textXPos - lineWidth / 2, textYPos);
                  textYPos += lineHeight; // Move down for the next line
                });
              });
            }
            
            
          },
        });
      
        addFooter();
      
       
        doc.addPage();
        body.length = 0;
        finalY = 24; // Reset finalY for the new page
      } 
    });
  };

  const text = "CAR TOP";
  const pageWidth = doc.internal.pageSize.width;
  const textWidth = doc.getTextWidth(text);
  const x = (pageWidth - textWidth) / 2;

  doc.setFontSize(12);
  doc.setFont('calibri', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(text, x, 20);

  addInspectionData();
};

const addcontent_MACHINEROOM = () => {
  const head = [['S.No.', 'DESCRIPTION', ...this.Ordered_unit]];

  const headerlen:number=head[0].length-1;
  

  let body: any = [];

  const addInspectionData = () => {
    let finalY = 24; // Initial start position for the first table
    let icount=0;
    this.inspectionMasterData.forEach((checklistmaster, i_master) => {
      const description = checklistmaster.Description.trim();
      Object.keys(this.Result_unit_status_machineroom).forEach(Result_unit_status_Desc => {
        const Result_unit_status_Desc_trim = Result_unit_status_Desc.trim();
        const matchesDescription = Result_unit_status_Desc_trim === description;
        if (this.Result_unit_status_machineroom[Result_unit_status_Desc_trim] === true && matchesDescription) {
          const row = [];
          if (checklistmaster.Parts?.toLowerCase() === 'machine room') {
     
            row.push({
              content: ++icount ,
              styles: {
                rowSpan: 2,halign: 'center',
                valign: 'middle', // Apply rowspan
              }
            });

            row.push({
              content: description,
              styles: {
                halign: 'center',
                valign: 'middle',
                cellPadding: 2,
              }
            });

            this.Ordered_unit.forEach(uni => {
              if (this.Result_Of_pit_variables_machineroom[description]?.[uni]) {
                // Get the status value
                const status = this.Result_Of_pit_variables_machineroom[description][uni].status;
            
                // Replace the status with the full form
                const statusFullForm = status.trim() === 'Y' ? 'Complied': status === 'N'? 'Not Complied': status === 'NA'? 'Not Applicable': status; // Default to original value if it doesn't match
            
                // Push the modified status into the row
                row.push({
                  content: statusFullForm,
                  styles: {
                    halign: 'center',
                    valign: 'middle',
                    cellPadding: 2,
                    minCellWidth: 5,
                    textColor: this.getStatusColor(status)
                  }
                });
              }
            });
            body.push(row);

            if (this.check_Image_machineroom(Result_unit_status_Desc_trim, checklistmaster) === true) {
            
              if (this.checkunithastwoimg(this.Result_Of_pit_variables_machineroom[description]) === true) {
                console.log("><0");
                const imageRow: any[] = [];
                const uni_t:String[]=[]
                const imagesData: string[] = [];
                // Iterate over Ordered_unit
                this.Ordered_unit.forEach(uni => {
                  if (this.Result_Of_pit_variables_machineroom[description][uni].has_image === true) {

                    // Loop through the images and add them to the imagesData array
                    this.Result_Of_pit_variables_machineroom[description][uni].image.forEach((img, img_len) => {
                      const imgData = this.getImageData_machineroom(description, uni, img_len) as string; // Get image data as string
                      imagesData.push(imgData); // Push the image data into the array
                      uni_t.push(uni+"-"+img.image_dropdown,)
                    });
              
                    // Now, both images are in the imagesData array
                    // Add the row with images to the body
                   
                  }
                });
                if (imagesData.length > 0) {
                  imageRow.push({
                    content: '', // Empty content for cell
                    colSpan: this.Ordered_unit_count + 2,  // Apply colspan for merging cells
                    styles: {
                      valign: 'middle',
                      halign: 'center',
                      minCellHeight: 68,  // Set minimum cell height
                    },
                    imgsData: imagesData,  // Pass the array of images for the unit
                    unit: uni_t,  // Unit name
                  });
                }
                body.push(imageRow);
                console.log("<>/",imageRow);
              }
              
              
               else if (this.checknoof_img(this.Result_Of_pit_variables_machineroom[description]) === 1) {
                console.log("><1")

                this.Ordered_unit.forEach(uni => {
                  if (this.Result_Of_pit_variables_machineroom[description][uni].has_image === true) {
                    const imageRow: any[] = [];
                
                    
                    this.Result_Of_pit_variables_machineroom[description][uni].image.forEach((img, img_len) => {
                      const imgData = this.getImageData_machineroom(description, uni, img_len) as string; // Cast to string
                        imageRow.push({
                          content: '', // Empty content for cell
                          colSpan:this.Ordered_unit_count+2,
                          styles: {
                            valign: 'middle',
                            halign: 'center',
                            minCellHeight: 68,
                             // Apply colspan here
                          },
                          imgData: imgData ,// Use the imgData here
                          unit:uni+"-"+img.image_dropdown,
                        });                        
                    });
            
                    body.push(imageRow);
                  }
                });
              } 
              
              else if (this.checknoof_img(this.Result_Of_pit_variables_machineroom[description]) === 2) {
                console.log("><2");
                const imageRow: any[] = [];
                const uni_t:String[]=[]
                const imagesData: string[] = [];
                // Iterate over Ordered_unit
                this.Ordered_unit.forEach(uni => {
                  if (this.Result_Of_pit_variables_machineroom[description][uni].has_image === true) {

                    // Loop through the images and add them to the imagesData array
                    this.Result_Of_pit_variables_machineroom[description][uni].image.forEach((img, img_len) => {
                      const imgData = this.getImageData_machineroom(description, uni, img_len) as string; // Get image data as string
                      imagesData.push(imgData); // Push the image data into the array
                      uni_t.push(uni+"-"+img.image_dropdown)
                    });
              
                    // Now, both images are in the imagesData array
                    // Add the row with images to the body
                   
                  }
                });
                if (imagesData.length > 0) {
                  imageRow.push({
                    content: '', // Empty content for cell
                    colSpan: this.Ordered_unit_count + 2,  // Apply colspan for merging cells
                    styles: {
                      valign: 'middle',
                      halign: 'center',
                      minCellHeight: 68,  // Set minimum cell height
                    },
                    img_Data: imagesData,  // Pass the array of images for the unit
                    unit: uni_t,  // Unit name
                  });
                }
                body.push(imageRow);
                console.log("<>/",imageRow);
                
              } 
              else{
                body.push([{
                  content: 'No Image Captured',
                  colSpan: this.Ordered_unit.length + 3,
                  styles: { halign: 'center',
                    minCellHeight:60,
                    valign: 'middle', }
                }]);
                
              }
            }
            else{
              body.push([{
                content: 'No Image Captured',
                colSpan: this.Ordered_unit.length + 3,
                styles: { halign: 'center',
                  minCellHeight:60,
                  valign: 'middle', }
              }]);
              
            }
            }
          }
        else if (this.Result_unit_status_machineroom[Result_unit_status_Desc_trim] === false && matchesDescription) {
          if (checklistmaster.Parts?.toLowerCase() === 'machine room') {
          const noImageRow: any[] = [
            {
              content: ++icount ,
              styles: {
                rowSpan: 2,halign: 'center',
                minCellHeight:5,
                valign: 'middle', // Apply rowspan
              }
            }
            ,{
              content: description,
              styles: {
                halign: 'center',
            valign: 'middle',
            minCellHeight:5,
                rowSpan: 2, // Apply rowspan
              }
            }
            
          ];

          this.Ordered_unit.forEach(uni => {
            noImageRow.push({
              content: 'Complied',
              styles: {
                minCellHeight:5,
                halign: 'center',
            valign: 'middle',
            cellPadding: 2,
                textColor: this.getStatusColor('Y')
              }
            });
          });

          body.push(noImageRow);
          body.push([{
            content: 'No Image Captured',
            colSpan: this.Ordered_unit.length + 3,
            styles: { halign: 'center',
              minCellHeight:60,
              valign: 'middle', }
          }]);

        }

        }
      });
      // Adjust finalY and create a new table on the next page if i_master + 1 % 2 === 0
      if (((icount) % 2 === 0 && checklistmaster.Parts?.toLowerCase() === 'machine room')) {
        addHeader();
      
        // Get page dimensions
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
      
        // Define margins
        const margin = { top: 10, left: 10, right: 10, bottom: 10 };
        const tableWidth = pageWidth - margin.left - margin.right;
      
        // Define static widths for columns 0 and 1
        const staticWidths = {
          0: tableWidth * 0.06, // 15% of table width
          1: tableWidth * 0.55, // 55% of table width
        };
      
        // Calculate the remaining width for dynamic columns
        const remainingWidth = tableWidth - staticWidths[0] - staticWidths[1];
      
        // Determine the number of dynamic columns (excluding 0 and 1)
        const totalColumns = head[0]?.length || 0;
        const dynamicColumnCount = totalColumns - 2;
      
        // Calculate width for each dynamic column
        const dynamicWidth = dynamicColumnCount > 0 ? remainingWidth / dynamicColumnCount : 0;
      
        // Define columnStyles dynamically
        const columnStyles:any = {
          0: { cellWidth: staticWidths[0] }, // Static column 0
          1: { cellWidth: staticWidths[1] }, // Static column 1
        };
      
        // Add dynamic columns to columnStyles
        for (let i = 2; i < totalColumns; i++) {
          columnStyles[i] = { cellWidth: dynamicWidth };
        }
      
        autoTable(doc, {
          head: head,
          body: body,
          startY: finalY,
          theme: 'striped',
          styles: {
            cellPadding: 2,
            halign: 'center',
            fontSize: 10,
            lineColor: [0, 0, 0],
          },
          headStyles: {
            lineWidth: 0.25,
            fillColor: [255, 255, 204],
            textColor: [0, 0, 0],
          },
          bodyStyles: {
            lineWidth: 0.25,
            fillColor: [245, 245, 245],
            font: 'calibri', // Set font family
            fontStyle: 'normal', // Set font style
            textColor: [0, 0, 0], // Set text color to black
          },
          columnStyles: columnStyles,
          margin: margin,
          didDrawCell: function (data) {
            const cellData = data.cell.raw as any;
      
            // Check if the cell contains image data
            if (cellData && typeof cellData === 'object' && 'imgData' in cellData) {
              const imgData = cellData.imgData as string;
      
              // Define the dimensions of the image
              const imgWidth = Math.min(data.cell.width * 0.8, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.8, 56); // Scale within cell height
      
              // Calculate the center position for the image
              const xPos = data.cell.x + (data.cell.width - imgWidth) / 2;
              const yPos = data.cell.y + (data.cell.height - imgHeight) / 2;
      
              // Add the image to the PDF
              doc.addImage(imgData, 'JPEG', xPos, yPos, imgWidth, imgHeight);
      
              // Draw the unit text below the image
              const textXPos = data.cell.x + (data.cell.width - doc.getTextWidth(cellData.unit)) / 2;
              const textYPos = yPos + imgHeight + 4;
      
              // Add the unit text
              doc.text(cellData.unit.replace(/~/g, '-'), textXPos, textYPos);
            }
            else if (cellData && cellData.imgsData) {
              const imgDataArray = cellData.imgsData as string[];
              const unitArray = cellData.unit as string[]; // Assume `cellData.unit` is an array of text corresponding to images
            
              // Define the dimensions of the images
              const imgWidth = Math.min(data.cell.width * 0.8 / imgDataArray.length, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.6, 56); // Scale within cell height
            
              // Define the space between images
              const spaceBetweenImages = 40; // Adjust this value for the desired space between images
            
              // Calculate the initial x position for the first image
              let xPos = data.cell.x + (data.cell.width - imgWidth * imgDataArray.length - spaceBetweenImages * (imgDataArray.length - 1)) / 2;
            
              // Loop through the images and add them horizontally in the same cell
              imgDataArray.forEach((imgData, index) => {
                // Add the image to the PDF at the calculated position
                doc.addImage(
                  imgData,
                  'JPEG',
                  xPos + index * (imgWidth + spaceBetweenImages), // Horizontal position for each image
                  data.cell.y + (data.cell.height - imgHeight)/3 , // Vertical position to center images in the cell
                  imgWidth,
                  imgHeight
                );
            
                // Calculate the initial position for the text
                const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + (imgWidth / 2);
                // const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + imgWidth / 2 - doc.getTextWidth(unitArray[index]) / 2; // Center text below image
                let textYPos = data.cell.y + (data.cell.height - imgHeight) / 2 + imgHeight + 2 // Start 5px below the image
            
                // Split long text into lines that fit within the image width
                const textLines = doc.splitTextToSize(unitArray[index].replace(/~/g, '-') || '', imgWidth+20);
            
                // Line height for text
                const lineHeight = 3.5; // Adjust line height as needed
            
                // Add each line of text
                textLines.forEach((line: any) => {
                  // Adjust text alignment to center each line
                  const lineWidth = doc.getTextWidth(line);
                  doc.text(line, textXPos - lineWidth / 2, textYPos);
                  textYPos += lineHeight; // Move down for the next line
                });
              });
            } 
            //  * multiple unit with multiplke img.
            else if (cellData && cellData.img_Data) {
              const imgDataArray = cellData.img_Data as string[];
              const unitArray = cellData.unit as string[]; // Assuming `cellData.unit` is an array
            
              // Define the dimensions of the images
              const imgWidth = Math.min(data.cell.width * 0.8 / imgDataArray.length, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.8, 56); // Scale within cell height
            
              // Define the space between images
              const spaceBetweenImages = 40; // Adjust this value for the desired space between images
            
              // Calculate the total width of all images including the space between them
              const totalImagesWidth = imgWidth * imgDataArray.length + spaceBetweenImages * (imgDataArray.length - 1);
            
              // Calculate the initial x position to center the images horizontally
              let xPos = data.cell.x + (data.cell.width - totalImagesWidth) / 2;
            
              // Loop through the images and add them horizontally in the same cell
              imgDataArray.forEach((imgData, index) => {
                // Add the image to the PDF at the calculated position
                doc.addImage(
                  imgData,
                  'JPEG',
                  xPos + index * (imgWidth + spaceBetweenImages), // Horizontal position for each image
                  data.cell.y + (data.cell.height - imgHeight)/3 , // Vertical position to center images in the cell
                  imgWidth,
                  imgHeight
                );
            
                // Calculate the initial position for the text
                const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + (imgWidth / 2);
                // const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + imgWidth / 2 - doc.getTextWidth(unitArray[index]) / 2; // Center text below image
                let textYPos = data.cell.y + (data.cell.height - imgHeight) / 2 + imgHeight + 2 // Start 5px below the image
            
                // Split long text into lines that fit within the image width
                const textLines = doc.splitTextToSize(unitArray[index].replace(/~/g, '-') || '', imgWidth+20);
            
                // Line height for text
                const lineHeight = 3.5; // Adjust line height as needed
            
                // Add each line of text
                textLines.forEach((line: any) => {
                  // Adjust text alignment to center each line
                  const lineWidth = doc.getTextWidth(line);
                  doc.text(line, textXPos - lineWidth / 2, textYPos);
                  textYPos += lineHeight; // Move down for the next line
                });
              });
            }
            
            
            
          },
        });
      
        addFooter();
        body.length = 0;
        // Clear the body for the next set of rows
        doc.addPage(); // Add a new page if necessary
        finalY = 24; // Reset finalY for the new page
      }
      const length = Object.keys(this.Result_Of_pit_variables_machineroom).length;
      if ((length===icount) && ((icount%2)===1) && checklistmaster.Parts?.toLowerCase() === 'machine room' ) {
        addHeader();
        console.log(".,,",(length===icount) && (length%2)===1,length,icount)
        // Get page dimensions
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
      
        // Define margins
        const margin = { top: 10, left: 10, right: 10, bottom: 10 };
        const tableWidth = pageWidth - margin.left - margin.right;
      
        // Define static widths for columns 0 and 1
        const staticWidths = {
          0: tableWidth * 0.06, // 15% of table width
          1: tableWidth * 0.55, // 55% of table width
        };
      
        // Calculate the remaining width for dynamic columns
        const remainingWidth = tableWidth - staticWidths[0] - staticWidths[1];
      
        // Determine the number of dynamic columns (excluding 0 and 1)
        const totalColumns = head[0]?.length || 0;
        const dynamicColumnCount = totalColumns - 2;
      
        // Calculate width for each dynamic column
        const dynamicWidth = dynamicColumnCount > 0 ? remainingWidth / dynamicColumnCount : 0;
      
        // Define columnStyles dynamically
        const columnStyles:any = {
          0: { cellWidth: staticWidths[0] }, // Static column 0
          1: { cellWidth: staticWidths[1] }, // Static column 1
        };
      
        // Add dynamic columns to columnStyles
        for (let i = 2; i < totalColumns; i++) {
          columnStyles[i] = { cellWidth: dynamicWidth };
        }
      
        autoTable(doc, {
          head: head,
          body: body,
          startY: finalY,
          theme: 'striped',
          styles: {
            cellPadding: 2,
            halign: 'center',
            fontSize: 10,
            lineColor: [0, 0, 0],
          },
          headStyles: {
            lineWidth: 0.25,
            fillColor: [255, 255, 204],
            textColor: [0, 0, 0],
          },
          bodyStyles: {
            lineWidth: 0.25,
            fillColor: [245, 245, 245],
            font: 'calibri', // Set font family
            fontStyle: 'normal', // Set font style
            textColor: [0, 0, 0], // Set text color to black
          },
          columnStyles: columnStyles,
          margin: margin,
          didDrawCell: function (data) {
            const cellData = data.cell.raw as any;
      
            if (cellData && typeof cellData === 'object' && 'imgData' in cellData) {
              const imgData = cellData.imgData as string;
      
              // Define the dimensions of the image
              const imgWidth = Math.min(data.cell.width * 0.8, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.8, 56); // Scale within cell height
      
              // Calculate the center position for the image
              const xPos = data.cell.x + (data.cell.width - imgWidth) / 2;
              const yPos = data.cell.y + (data.cell.height - imgHeight) / 2;
      
              // Add the image to the PDF
              doc.addImage(imgData, 'JPEG', xPos, yPos, imgWidth, imgHeight);
      
              // Draw the unit text below the image
              const textXPos = data.cell.x + (data.cell.width - doc.getTextWidth(cellData.unit)) / 2;
              const textYPos = yPos + imgHeight + 4;
      
              // // Add the unit text
              doc.text(cellData.unit.replace(/~/g, '-'), textXPos, textYPos);
            }

            // _ single unit multiple img.
            else if (cellData && cellData.imgsData) {
              const imgDataArray = cellData.imgsData as string[];
              const unitArray = cellData.unit as string[]; // Assume `cellData.unit` is an array of text corresponding to images
            
              // Define the dimensions of the images
              const imgWidth = Math.min(data.cell.width * 0.8 / imgDataArray.length, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.6, 56); // Scale within cell height
            
              // Define the space between images
              const spaceBetweenImages = 40; // Adjust this value for the desired space between images
            
              // Calculate the initial x position for the first image
              let xPos = data.cell.x + (data.cell.width - imgWidth * imgDataArray.length - spaceBetweenImages * (imgDataArray.length - 1)) / 2;
            
              // Loop through the images and add them horizontally in the same cell
              imgDataArray.forEach((imgData, index) => {
                // Add the image to the PDF at the calculated position
                doc.addImage(
                  imgData,
                  'JPEG',
                  xPos + index * (imgWidth + spaceBetweenImages), // Horizontal position for each image
                  data.cell.y + (data.cell.height - imgHeight)/3 , // Vertical position to center images in the cell
                  imgWidth,
                  imgHeight
                );
            
                // Calculate the initial position for the text
                const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + (imgWidth / 2);
                // const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + imgWidth / 2 - doc.getTextWidth(unitArray[index]) / 2; // Center text below image
                let textYPos = data.cell.y + (data.cell.height - imgHeight) / 2 + imgHeight + 2 // Start 5px below the image
            
                // Split long text into lines that fit within the image width
                const textLines = doc.splitTextToSize(unitArray[index].replace(/~/g, '-') || '', imgWidth+20);
            
                // Line height for text
                const lineHeight = 3.5; // Adjust line height as needed
            
                // Add each line of text
                textLines.forEach((line: any) => {
                  // Adjust text alignment to center each line
                  const lineWidth = doc.getTextWidth(line);
                  doc.text(line, textXPos - lineWidth / 2, textYPos);
                  textYPos += lineHeight; // Move down for the next line
                });
              });
            } 
            //  * multiple unit with multiplke img.
            else if (cellData && cellData.img_Data) {
              const imgDataArray = cellData.img_Data as string[];
              const unitArray = cellData.unit as string[]; // Assuming `cellData.unit` is an array
            
              // Define the dimensions of the images
              const imgWidth = Math.min(data.cell.width * 0.8 / imgDataArray.length, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.8, 56); // Scale within cell height
            
              // Define the space between images
              const spaceBetweenImages = 40; // Adjust this value for the desired space between images
            
              // Calculate the total width of all images including the space between them
              const totalImagesWidth = imgWidth * imgDataArray.length + spaceBetweenImages * (imgDataArray.length - 1);
            
              // Calculate the initial x position to center the images horizontally
              let xPos = data.cell.x + (data.cell.width - totalImagesWidth) / 2;
            
              // Loop through the images and add them horizontally in the same cell
              imgDataArray.forEach((imgData, index) => {
                // Add the image to the PDF at the calculated position
                doc.addImage(
                  imgData,
                  'JPEG',
                  xPos + index * (imgWidth + spaceBetweenImages), // Horizontal position for each image
                  data.cell.y + (data.cell.height - imgHeight)/3 , // Vertical position to center images in the cell
                  imgWidth,
                  imgHeight
                );
            
                // Calculate the initial position for the text
                const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + (imgWidth / 2);
                // const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + imgWidth / 2 - doc.getTextWidth(unitArray[index]) / 2; // Center text below image
                let textYPos = data.cell.y + (data.cell.height - imgHeight) / 2 + imgHeight + 2 // Start 5px below the image
            
                // Split long text into lines that fit within the image width
                const textLines = doc.splitTextToSize(unitArray[index].replace(/~/g, '-') || '', imgWidth+20);
            
                // Line height for text
                const lineHeight = 3.5; // Adjust line height as needed
            
                // Add each line of text
                textLines.forEach((line: any) => {
                  // Adjust text alignment to center each line
                  const lineWidth = doc.getTextWidth(line);
                  doc.text(line, textXPos - lineWidth / 2, textYPos);
                  textYPos += lineHeight; // Move down for the next line
                });
              });
            }
            
            
            
          },
        });
      
        addFooter();
      
       
        doc.addPage();
        body.length = 0;
        finalY = 24; // Reset finalY for the new page
      } 
    });
  };

  const text = "MACHINE ROOM";
  const pageWidth = doc.internal.pageSize.width;
  const textWidth = doc.getTextWidth(text);
  const x = (pageWidth - textWidth) / 2;

  doc.setFontSize(12);
  doc.setFont('calibri', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(text, x, 20);

  addInspectionData();
};


const addcontent_FLOORLANDING = () => {
  const head = [['S.No.', 'DESCRIPTION', ...this.Ordered_unit]];

  const headerlen:number=head[0].length-1;
  

  let body: any = [];

   const addInspectionData = () => {
    let finalY = 24; // Initial start position for the first table
    let icount=0;
    this.inspectionMasterData.forEach((checklistmaster, i_master) => {
      const description = checklistmaster.Description.trim();
      Object.keys(this.Result_unit_status_floorlanding).forEach(Result_unit_status_Desc => {
        const Result_unit_status_Desc_trim = Result_unit_status_Desc.trim();
        const matchesDescription = Result_unit_status_Desc_trim === description;
        if (this.Result_unit_status_floorlanding[Result_unit_status_Desc_trim] === true && matchesDescription) {
          const row = [];
          if (checklistmaster.Parts?.toLowerCase() === 'floor landing') {
     
            row.push({
              content: ++icount ,
              styles: {
                rowSpan: 2,halign: 'center',
                valign: 'middle', // Apply rowspan
              }
            });

            row.push({
              content: description,
              styles: {
                halign: 'center',
                valign: 'middle',
                cellPadding: 2,
              }
            });

            this.Ordered_unit.forEach(uni => {
              if (this.Result_Of_pit_variables_floorlanding[description]?.[uni]) {
                // Get the status value
                const status = this.Result_Of_pit_variables_floorlanding[description][uni].status;
            
                // Replace the status with the full form
                const statusFullForm = status.trim() === 'Y' ? 'Complied': status === 'N'? 'Not Complied': status === 'NA'? 'Not Applicable': status; // Default to original value if it doesn't match
            
                // Push the modified status into the row
                row.push({
                  content: statusFullForm,
                  styles: {
                    halign: 'center',
                    valign: 'middle',
                    cellPadding: 2,
                    minCellWidth: 5,
                    textColor: this.getStatusColor(status)
                  }
                });
              }
            });
            body.push(row);

            if (this.check_Image_floorlanding(Result_unit_status_Desc_trim, checklistmaster) === true) {
            
              if (this.checkunithastwoimg(this.Result_Of_pit_variables_floorlanding[description]) === true) {
                console.log("><0");
                const imageRow: any[] = [];
                const uni_t:String[]=[]
                const imagesData: string[] = [];
                // Iterate over Ordered_unit
                this.Ordered_unit.forEach(uni => {
                  if (this.Result_Of_pit_variables_floorlanding[description][uni].has_image === true) {

                    // Loop through the images and add them to the imagesData array
                    this.Result_Of_pit_variables_floorlanding[description][uni].image.forEach((img, img_len) => {
                      const imgData = this.getImageData_floorlanding(description, uni, img_len) as string; // Get image data as string
                      imagesData.push(imgData); // Push the image data into the array
                      uni_t.push(uni+"-"+img.image_dropdown,)
                    });
              
                    // Now, both images are in the imagesData array
                    // Add the row with images to the body
                   
                  }
                });
                if (imagesData.length > 0) {
                  imageRow.push({
                    content: '', // Empty content for cell
                    colSpan: this.Ordered_unit_count + 2,  // Apply colspan for merging cells
                    styles: {
                      valign: 'middle',
                      halign: 'center',
                      minCellHeight: 68,  // Set minimum cell height
                    },
                    imgsData: imagesData,  // Pass the array of images for the unit
                    unit: uni_t,  // Unit name
                  });
                }
                body.push(imageRow);
                console.log("<>/",imageRow);
              }
              
              
               else if (this.checknoof_img(this.Result_Of_pit_variables_floorlanding[description]) === 1) {
                console.log("><1")

                this.Ordered_unit.forEach(uni => {
                  if (this.Result_Of_pit_variables_floorlanding[description][uni].has_image === true) {
                    const imageRow: any[] = [];
                
                    
                    this.Result_Of_pit_variables_floorlanding[description][uni].image.forEach((img, img_len) => {
                      const imgData = this.getImageData_floorlanding(description, uni, img_len) as string; // Cast to string
                        imageRow.push({
                          content: '', // Empty content for cell
                          colSpan:this.Ordered_unit_count+2,
                          styles: {
                            valign: 'middle',
                            halign: 'center',
                            minCellHeight: 68,
                             // Apply colspan here
                          },
                          imgData: imgData ,// Use the imgData here
                          unit:uni+"-"+img.image_dropdown,
                        });                        
                    });
            
                    body.push(imageRow);
                  }
                });
              } 
              
              else if (this.checknoof_img(this.Result_Of_pit_variables_floorlanding[description]) === 2) {
                console.log("><2");
                const imageRow: any[] = [];
                const uni_t:String[]=[]
                const imagesData: string[] = [];
                // Iterate over Ordered_unit
                this.Ordered_unit.forEach(uni => {
                  if (this.Result_Of_pit_variables_floorlanding[description][uni].has_image === true) {

                    // Loop through the images and add them to the imagesData array
                    this.Result_Of_pit_variables_floorlanding[description][uni].image.forEach((img, img_len) => {
                      const imgData = this.getImageData_floorlanding(description, uni, img_len) as string; // Get image data as string
                      imagesData.push(imgData); // Push the image data into the array
                      uni_t.push(uni+"-"+img.image_dropdown,)
                    });
              
                    // Now, both images are in the imagesData array
                    // Add the row with images to the body
                   
                  }
                });
                if (imagesData.length > 0) {
                  imageRow.push({
                    content: '', // Empty content for cell
                    colSpan: this.Ordered_unit_count + 2,  // Apply colspan for merging cells
                    styles: {
                      valign: 'middle',
                      halign: 'center',
                      minCellHeight: 68,  // Set minimum cell height
                    },
                    img_Data: imagesData,  // Pass the array of images for the unit
                    unit: uni_t,  // Unit name
                  });
                }
                body.push(imageRow);
                console.log("<>/",imageRow);
                
              } 
              
              
              
              
              else{
                body.push([{
                  content: 'No Image Captured',
                  colSpan: this.Ordered_unit.length + 3,
                  styles: { halign: 'center',
                    minCellHeight:60,
                    valign: 'middle', }
                }]);
                
              }
            }
            else{
              body.push([{
                content: 'No Image Captured',
                colSpan: this.Ordered_unit.length + 3,
                styles: { halign: 'center',
                  minCellHeight:60,
                  valign: 'middle', }
              }]);
              
            }
            }
          }
        else if (this.Result_unit_status_floorlanding[Result_unit_status_Desc_trim] === false && matchesDescription) {
          if (checklistmaster.Parts?.toLowerCase() === 'floor landing') {
          const noImageRow: any[] = [
            {
              content: ++icount ,
              styles: {
                rowSpan: 2,halign: 'center',
                minCellHeight:5,
                valign: 'middle', // Apply rowspan
              }
            }
            ,{
              content: description,
              styles: {
                halign: 'center',
            valign: 'middle',
            minCellHeight:5,
                rowSpan: 2, // Apply rowspan
              }
            }
            
          ];

          this.Ordered_unit.forEach(uni => {
            noImageRow.push({
              content: 'Complied',
              styles: {
                minCellHeight:5,
                halign: 'center',
            valign: 'middle',
            cellPadding: 2,
                textColor: this.getStatusColor('Y')
              }
            });
          });

          body.push(noImageRow);
          body.push([{
            content: 'No Image Captured',
            colSpan: this.Ordered_unit.length + 3,
            styles: { halign: 'center',
              minCellHeight:60,
              valign: 'middle', }
          }]);

        }

        }
      });

      
      // Adjust finalY and create a new table on the next page if i_master + 1 % 2 === 0
      if ((icount) % 2 === 0 && checklistmaster.Parts?.toLowerCase() === 'floor landing') {
        addHeader();
      
        // Get page dimensions
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
      
        // Define margins
        const margin = { top: 10, left: 10, right: 10, bottom: 10 };
        const tableWidth = pageWidth - margin.left - margin.right;
      
        // Define static widths for columns 0 and 1
        const staticWidths = {
          0: tableWidth * 0.06, // 15% of table width
          1: tableWidth * 0.55, // 55% of table width
        };
      
        // Calculate the remaining width for dynamic columns
        const remainingWidth = tableWidth - staticWidths[0] - staticWidths[1];
      
        // Determine the number of dynamic columns (excluding 0 and 1)
        const totalColumns = head[0]?.length || 0;
        const dynamicColumnCount = totalColumns - 2;
      
        // Calculate width for each dynamic column
        const dynamicWidth = dynamicColumnCount > 0 ? remainingWidth / dynamicColumnCount : 0;
      
        // Define columnStyles dynamically
        const columnStyles:any = {
          0: { cellWidth: staticWidths[0] }, // Static column 0
          1: { cellWidth: staticWidths[1] }, // Static column 1
        };
      
        // Add dynamic columns to columnStyles
        for (let i = 2; i < totalColumns; i++) {
          columnStyles[i] = { cellWidth: dynamicWidth };
        }
      
        autoTable(doc, {
          head: head,
          body: body,
          startY: finalY,
          theme: 'striped',
          styles: {
            cellPadding: 2,
            halign: 'center',
            fontSize: 10,
            lineColor: [0, 0, 0],
          },
          headStyles: {
            lineWidth: 0.25,
            fillColor: [255, 255, 204],
            textColor: [0, 0, 0],
          },
          bodyStyles: {
            lineWidth: 0.25,
            fillColor: [245, 245, 245],
            font: 'calibri', // Set font family
            fontStyle: 'normal', // Set font style
            textColor: [0, 0, 0], // Set text color to black
          },
          columnStyles: columnStyles,
          margin: margin,
          didDrawCell: function (data) {
            const cellData = data.cell.raw as any;
      
            // Check if the cell contains image data
            if (cellData && typeof cellData === 'object' && 'imgData' in cellData) {
              const imgData = cellData.imgData as string;
      
              // Define the dimensions of the image
              const imgWidth = Math.min(data.cell.width * 0.8, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.8, 56); // Scale within cell height
      
              // Calculate the center position for the image
              const xPos = data.cell.x + (data.cell.width - imgWidth) / 2;
              const yPos = data.cell.y + (data.cell.height - imgHeight) / 2;
      
              // Add the image to the PDF
              doc.addImage(imgData, 'JPEG', xPos, yPos, imgWidth, imgHeight);
      
              // Draw the unit text below the image
              const textXPos = data.cell.x + (data.cell.width - doc.getTextWidth(cellData.unit)) / 2;
              const textYPos = yPos + imgHeight + 4;
      
              // Add the unit text
              doc.text(cellData.unit.replace(/~/g, '-'), textXPos, textYPos);
            }
            else if (cellData && cellData.imgsData) {
              const imgDataArray = cellData.imgsData as string[];
              const unitArray = cellData.unit as string[]; // Assume `cellData.unit` is an array of text corresponding to images
            
              // Define the dimensions of the images
              const imgWidth = Math.min(data.cell.width * 0.8 / imgDataArray.length, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.6, 56); // Scale within cell height
            
              // Define the space between images
              const spaceBetweenImages = 40; // Adjust this value for the desired space between images
            
              // Calculate the initial x position for the first image
              let xPos = data.cell.x + (data.cell.width - imgWidth * imgDataArray.length - spaceBetweenImages * (imgDataArray.length - 1)) / 2;
            
              // Loop through the images and add them horizontally in the same cell
              imgDataArray.forEach((imgData, index) => {
                // Add the image to the PDF at the calculated position
                doc.addImage(
                  imgData,
                  'JPEG',
                  xPos + index * (imgWidth + spaceBetweenImages), // Horizontal position for each image
                  data.cell.y + (data.cell.height - imgHeight)/3 , // Vertical position to center images in the cell
                  imgWidth,
                  imgHeight
                );
            
                // Calculate the initial position for the text
                const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + (imgWidth / 2);
                // const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + imgWidth / 2 - doc.getTextWidth(unitArray[index]) / 2; // Center text below image
                let textYPos = data.cell.y + (data.cell.height - imgHeight) / 2 + imgHeight + 2 // Start 5px below the image
            
                // Split long text into lines that fit within the image width
                const textLines = doc.splitTextToSize(unitArray[index].replace(/~/g, '-') || '', imgWidth+20);
            
                // Line height for text
                const lineHeight = 3.5; // Adjust line height as needed
            
                // Add each line of text
                textLines.forEach((line: any) => {
                  // Adjust text alignment to center each line
                  const lineWidth = doc.getTextWidth(line);
                  doc.text(line, textXPos - lineWidth / 2, textYPos);
                  textYPos += lineHeight; // Move down for the next line
                });
              });
            } 
            //  * multiple unit with multiplke img.
            else if (cellData && cellData.img_Data) {
              const imgDataArray = cellData.img_Data as string[];
              const unitArray = cellData.unit as string[]; // Assuming `cellData.unit` is an array
            
              // Define the dimensions of the images
              const imgWidth = Math.min(data.cell.width * 0.8 / imgDataArray.length, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.8, 56); // Scale within cell height
            
              // Define the space between images
              const spaceBetweenImages = 40; // Adjust this value for the desired space between images
            
              // Calculate the total width of all images including the space between them
              const totalImagesWidth = imgWidth * imgDataArray.length + spaceBetweenImages * (imgDataArray.length - 1);
            
              // Calculate the initial x position to center the images horizontally
              let xPos = data.cell.x + (data.cell.width - totalImagesWidth) / 2;
            
              // Loop through the images and add them horizontally in the same cell
              imgDataArray.forEach((imgData, index) => {
                // Add the image to the PDF at the calculated position
                doc.addImage(
                  imgData,
                  'JPEG',
                  xPos + index * (imgWidth + spaceBetweenImages), // Horizontal position for each image
                  data.cell.y + (data.cell.height - imgHeight)/3 , // Vertical position to center images in the cell
                  imgWidth,
                  imgHeight
                );
            
                // Calculate the initial position for the text
                const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + (imgWidth / 2);
                // const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + imgWidth / 2 - doc.getTextWidth(unitArray[index]) / 2; // Center text below image
                let textYPos = data.cell.y + (data.cell.height - imgHeight) / 2 + imgHeight + 2 // Start 5px below the image
            
                // Split long text into lines that fit within the image width
                const textLines = doc.splitTextToSize(unitArray[index].replace(/~/g, '-') || '', imgWidth+20);
            
                // Line height for text
                const lineHeight = 3.5; // Adjust line height as needed
            
                // Add each line of text
                textLines.forEach((line: any) => {
                  // Adjust text alignment to center each line
                  const lineWidth = doc.getTextWidth(line);
                  doc.text(line, textXPos - lineWidth / 2, textYPos);
                  textYPos += lineHeight; // Move down for the next line
                });
              });
            }
            
            
          },
        });
      
        addFooter();
      
        body.length = 0; // Clear the body for the next set of rows
        
        if(Object.keys(this.Result_Of_pit_variables_floorlanding).length !== icount){
          doc.addPage(); // Add a new page if necessary
        }
        finalY = 24; // Reset finalY for the new page
      }
      const len=Object.keys(this.Result_Of_pit_variables_floorlanding).length
      if((((icount) % 2 === 1) && (len===icount)) && checklistmaster.Parts?.toLowerCase() === 'floor landing') {
        addHeader();
      
        // Get page dimensions
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
      
        // Define margins
        const margin = { top: 10, left: 10, right: 10, bottom: 10 };
        const tableWidth = pageWidth - margin.left - margin.right;
      
        // Define static widths for columns 0 and 1
        const staticWidths = {
          0: tableWidth * 0.06, // 15% of table width
          1: tableWidth * 0.55, // 55% of table width
        };
      
        // Calculate the remaining width for dynamic columns
        const remainingWidth = tableWidth - staticWidths[0] - staticWidths[1];
      
        // Determine the number of dynamic columns (excluding 0 and 1)
        const totalColumns = head[0]?.length || 0;
        const dynamicColumnCount = totalColumns - 2;
      
        // Calculate width for each dynamic column
        const dynamicWidth = dynamicColumnCount > 0 ? remainingWidth / dynamicColumnCount : 0;
      
        // Define columnStyles dynamically
        const columnStyles:any = {
          0: { cellWidth: staticWidths[0] }, // Static column 0
          1: { cellWidth: staticWidths[1] }, // Static column 1
        };
      
        // Add dynamic columns to columnStyles
        for (let i = 2; i < totalColumns; i++) {
          columnStyles[i] = { cellWidth: dynamicWidth };
        }
      
        autoTable(doc, {
          head: head,
          body: body,
          startY: finalY,
          theme: 'striped',
          styles: {
            cellPadding: 2,
            halign: 'center',
            fontSize: 10,
            lineColor: [0, 0, 0],
          },
          headStyles: {
            lineWidth: 0.25,
            fillColor: [255, 255, 204],
            textColor: [0, 0, 0],
          },
          bodyStyles: {
            lineWidth: 0.25,
            fillColor: [245, 245, 245],
            font: 'calibri', // Set font family
            fontStyle: 'normal', // Set font style
            textColor: [0, 0, 0], // Set text color to black
          },
          columnStyles: columnStyles,
          margin: margin,
          didDrawCell: function (data) {
            const cellData = data.cell.raw as any;
      
            // Check if the cell contains image data
            if (cellData && typeof cellData === 'object' && 'imgData' in cellData) {
              const imgData = cellData.imgData as string;
      
              // Define the dimensions of the image
              const imgWidth = Math.min(data.cell.width * 0.8, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.8, 56); // Scale within cell height
      
              // Calculate the center position for the image
              const xPos = data.cell.x + (data.cell.width - imgWidth) / 2;
              const yPos = data.cell.y + (data.cell.height - imgHeight) / 2;
      
              // Add the image to the PDF
              doc.addImage(imgData, 'JPEG', xPos, yPos, imgWidth, imgHeight);
      
              // Draw the unit text below the image
              const textXPos = data.cell.x + (data.cell.width - doc.getTextWidth(cellData.unit)) / 2;
              const textYPos = yPos + imgHeight + 4;
      
              // Add the unit text
              doc.text(cellData.unit.replace(/~/g, '-'), textXPos, textYPos);
            }
            else if (cellData && cellData.imgsData) {
              const imgDataArray = cellData.imgsData as string[];
              const unitArray = cellData.unit as string[]; // Assume `cellData.unit` is an array of text corresponding to images
            
              // Define the dimensions of the images
              const imgWidth = Math.min(data.cell.width * 0.8 / imgDataArray.length, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.6, 56); // Scale within cell height
            
              // Define the space between images
              const spaceBetweenImages = 40; // Adjust this value for the desired space between images
            
              // Calculate the initial x position for the first image
              let xPos = data.cell.x + (data.cell.width - imgWidth * imgDataArray.length - spaceBetweenImages * (imgDataArray.length - 1)) / 2;
            
              // Loop through the images and add them horizontally in the same cell
              imgDataArray.forEach((imgData, index) => {
                // Add the image to the PDF at the calculated position
                doc.addImage(
                  imgData,
                  'JPEG',
                  xPos + index * (imgWidth + spaceBetweenImages), // Horizontal position for each image
                  data.cell.y + (data.cell.height - imgHeight)/3 , // Vertical position to center images in the cell
                  imgWidth,
                  imgHeight
                );
            
                // Calculate the initial position for the text
                const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + (imgWidth / 2);
                // const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + imgWidth / 2 - doc.getTextWidth(unitArray[index]) / 2; // Center text below image
                let textYPos = data.cell.y + (data.cell.height - imgHeight) / 2 + imgHeight + 2 // Start 5px below the image
            
                // Split long text into lines that fit within the image width
                const textLines = doc.splitTextToSize(unitArray[index].replace(/~/g, '-') || '', imgWidth+20);
            
                // Line height for text
                const lineHeight = 3.5; // Adjust line height as needed
            
                // Add each line of text
                textLines.forEach((line: any) => {
                  // Adjust text alignment to center each line
                  const lineWidth = doc.getTextWidth(line);
                  doc.text(line, textXPos - lineWidth / 2, textYPos);
                  textYPos += lineHeight; // Move down for the next line
                });
              });
            } 
            //  * multiple unit with multiplke img.
            else if (cellData && cellData.img_Data) {
              const imgDataArray = cellData.img_Data as string[];
              const unitArray = cellData.unit as string[]; // Assuming `cellData.unit` is an array
            
              // Define the dimensions of the images
              const imgWidth = Math.min(data.cell.width * 0.8 / imgDataArray.length, 80); // Scale within cell width
              const imgHeight = Math.min(data.cell.height * 0.8, 56); // Scale within cell height
            
              // Define the space between images
              const spaceBetweenImages = 40; // Adjust this value for the desired space between images
            
              // Calculate the total width of all images including the space between them
              const totalImagesWidth = imgWidth * imgDataArray.length + spaceBetweenImages * (imgDataArray.length - 1);
            
              // Calculate the initial x position to center the images horizontally
              let xPos = data.cell.x + (data.cell.width - totalImagesWidth) / 2;
            
              // Loop through the images and add them horizontally in the same cell
              imgDataArray.forEach((imgData, index) => {
                // Add the image to the PDF at the calculated position
                doc.addImage(
                  imgData,
                  'JPEG',
                  xPos + index * (imgWidth + spaceBetweenImages), // Horizontal position for each image
                  data.cell.y + (data.cell.height - imgHeight)/3 , // Vertical position to center images in the cell
                  imgWidth,
                  imgHeight
                );
            
                // Calculate the initial position for the text
                const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + (imgWidth / 2);
                // const textXPos = xPos + index * (imgWidth + spaceBetweenImages) + imgWidth / 2 - doc.getTextWidth(unitArray[index]) / 2; // Center text below image
                let textYPos = data.cell.y + (data.cell.height - imgHeight) / 2 + imgHeight + 2 // Start 5px below the image
            
                // Split long text into lines that fit within the image width
                const textLines = doc.splitTextToSize(unitArray[index].replace(/~/g, '-') || '', imgWidth+20);
            
                // Line height for text
                const lineHeight = 3.5; // Adjust line height as needed
            
                // Add each line of text
                textLines.forEach((line: any) => {
                  // Adjust text alignment to center each line
                  const lineWidth = doc.getTextWidth(line);
                  doc.text(line, textXPos - lineWidth / 2, textYPos);
                  textYPos += lineHeight; // Move down for the next line
                });
              });
            }
            
            
          },
        });
      
        addFooter();
      
        body.length = 0; // Clear the body for the next set of rows
      
        if(len!==icount){
          doc.addPage(); // Add a new page if necessary
        }
        
        finalY = 24; // Reset finalY for the new page
      }
      
    });
 
  };

  const text = "FLOOR LANDING";
  const pageWidth = doc.internal.pageSize.width;
  const textWidth = doc.getTextWidth(text);
  const x = (pageWidth - textWidth) / 2;

  doc.setFontSize(12);
  doc.setFont('calibri', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(text, x, 20);

  addInspectionData();
};

  
 
  const addPage1 = () => {
    // addHeader();
    addContent();
    // addFooter();
  };

  const addPage2 = () => {
    doc.addPage();
    addHeader();
    addContent2();
    addFooter();
  };

  const addpage3=()=>{
    doc.addPage();
    addHeader();
    addContent3();
    addFooter();
  }

  const addpage4=()=>{
    doc.addPage();
    addHeader();
    addContent4();
    addFooter();

  }

  const addpage_Executive_Summary=()=>{
    doc.addPage();
    addHeader();
    addContent_Executive_summary();
    addFooter();
  }


  const addpage_Brief_specification=()=>{

    doc.addPage();
    addHeader();
    addContent_Brief_Executive_summary();
    addFooter();


  }

  const addpage_EMERGENCY_OPERATIONS=()=>{
    doc.addPage();
    addHeader();
    addcontent_EMERGENCY_OPERATIONS();
    addFooter();
  }
  const addpage_FOLLOWING_OBSERVATION_pit=()=>{
    doc.addPage();
    addHeader();
    addcontent_FOLLOWING_OBSERVATION_pit()
    addFooter();

  }
  const addpage_FOLLOWING_OBSERVATION_cabin=()=>{
    doc.addPage();
    addHeader();
    addcontent_FOLLOWING_OBSERVATION_cabin()
    addFooter();

  }
  const addpage_FOLLOWING_OBSERVATION_machineroom=()=>{
    doc.addPage();
    addHeader();
    addcontent_FOLLOWING_OBSERVATION_machineroom()
    addFooter();

  }
  const addpage_FOLLOWING_OBSERVATION_cartop=()=>{
    doc.addPage();
    addHeader();
    addcontent_FOLLOWING_OBSERVATION_cartop()
    addFooter();

  }
  const addpage_FOLLOWING_OBSERVATION_floorlanding=()=>{
    doc.addPage();
    addHeader();
    addcontent_FOLLOWING_OBSERVATION_floorlanding()
    addFooter();

  }

  // const addpage_Extract_of_quality=()=>{
  //   doc.addPage();
  //   addHeader();
  //   addcontent_Extract_of_quality()
  //   addFooter();

  // }


  const addpage_Qyuality_Eval=()=>{
    doc.addPage();
    addHeader();
    // addcontent_Quality_Eval() //old one
    addcontent_Quality_New()
    addFooter();


  }
  const addpage_PIT=()=>{
    doc.addPage();
    addHeader();
    addcontent_PIT()
    addFooter();


  }
  const addpage_CABIN=()=>{
    // doc.addPage();
    addHeader();
    addcontent_CABIN()
    addFooter();


  }
  const addpage_CARTOP=()=>{
    // doc.addPage();
    addHeader();
    addcontent_CARTOP()
    addFooter();


  }

  const addpage_MACHINEROOM=()=>{
    // doc.addPage();
    addHeader();
    addcontent_MACHINEROOM()
    addFooter();


  }

  const addpage_FLOORLANDING=()=>{
    // doc.addPage();
    addHeader();
    addcontent_FLOORLANDING()
    addFooter();


  }

  // Add a single page (for demonstration)
  addPage1();
  addPage2();
  addpage3();
  addpage4();
  addpage_Executive_Summary();


  addpage_Brief_specification();
  addpage_Qyuality_Eval();
  addpage_EMERGENCY_OPERATIONS();

  addpage_FOLLOWING_OBSERVATION_pit();
  addpage_FOLLOWING_OBSERVATION_cabin();
  addpage_FOLLOWING_OBSERVATION_cartop();
  addpage_FOLLOWING_OBSERVATION_machineroom();
 
  addpage_FOLLOWING_OBSERVATION_floorlanding();



 


  addpage_PIT();

  addpage_CABIN();
  addpage_CARTOP();

  addpage_MACHINEROOM();
  addpage_FLOORLANDING();




  // Add total pages placeholder if function is available
  if (typeof doc.putTotalPages === 'function') {
    doc.putTotalPages(totalPagesExp);
  }
  const buildingName = this.buildingNO || 'Unknown_Building'; // Get building name
  const unitNo = Array.isArray(this.Ordered_unit) ? this.Ordered_unit.join('_') : 'Unknown_Unit'; 
  const inspectorName = this.inspectorNameandCode || 'Unknown_Inspector'; // Get inspector name
  
  
  doc.setFontSize(12);

 
  const filename = `${buildingName}-${unitNo}-Inpection Report.pdf`.replace(/ /g, '_'); 

  setTimeout(() => {
    this.isLoading = false;
    this.cdr.detectChanges(); 
  }, 2000);
  
  // doc.save(filename); 
    
  
  // this.pdfBlob = doc.output('blob');
  this.pdfBlob = doc.output('blob');
  this.pdfSrc = URL.createObjectURL(this.pdfBlob);
  // this.isPreviewAvailable = true;
  if (this.pdfSrc) {
    window.open(this.pdfSrc, '_blank'); // Open PDF in new tab
  }


  // await compressPDF(doc, filename);

 
  

  
  
}
uploadPDFManually(): void {
  const fileInput = document.getElementById('pdfInput') as HTMLInputElement;
  fileInput.click();
}

confirmSnapshot(flag:boolean)
{
  console.log("flag",flag)
  this.flag_for_sent_data_snapshot=flag;
  this.popupvisible_for_Download=false
}
close() {
  this.isDialogOpen= false;
}
toggleSelection(unitNo: string, document_id: string) {
  const index = this.selectedUnits.findIndex(item => item.unitNo === unitNo && item.document_id === document_id);

  if (index > -1) {
    // If found, remove it
    this.selectedUnits.splice(index, 1);
  } else {
    // If not found, add it
    this.selectedUnits.push({ unitNo, document_id });
  }
}


uploadPDF(): void {
  this.isLoading=true;

  const pdfBlob = this.pdfBlob;

  // Use class properties directly instead of sessionStorage
  const name = this.inspectorNameandCode; // Assuming this is already set in your class
  const building_name = this.buildingNO; // Get from the class property
  const Ordered_unit = this.Ordered_unit;
  console.log('ordered unit',Ordered_unit);
  

const document_id = this['document_id']; // Use bracket notation
const report_id = this['report_id']; // Use bracket notation
  const contract = this.contractNo; // Get from the class property


  const formData = new FormData();
  formData.append('pdf', pdfBlob || ' ');
  if (Array.isArray(Ordered_unit)) {
    Ordered_unit.forEach(unit => {
      formData.append('unit_name[]', unit); // Append each unit name
    });
  }

  // Append additional data to the formData
  formData.append('inspector_name', name || '');
  formData.append('building_name', building_name || '');
  // formData.append('unit_name', Ordered_unit || '' );
  formData.append('document_id', this.documentidForUrl || '');
  formData.append('report_id', report_id || '');
  formData.append('contract', contract || '');
  formData.append('customer_mobile',this.customer_mobile);
  formData.append('customer_mail',this.customer_mail);
  formData.append('customer_name',this.customer_name);
  formData.append('project_name',this.projectName);

  this.http.post(`${environment.serverUrl}api/upload-pdf`, formData)
    .subscribe(
      (response: any) => {
        console.log('PDF uploaded successfully:', response);
        this.pdfId = response.insertId;  // Store the returned PDF ID
        console.log('111',this.pdfId);
        this.checkEndDateAndGeneratePDF1();
     
        
        alert('Report sent for Approval successfully!');  // Alert on success
       

 
        const emailPayload = {
          to: this.toEmails,  // Replace with the recipient's email
          subject: 'Approval Request Notification',
          message: `Please review the request for approval of unit '${Ordered_unit}' at '${building_name}', submitted by ${name}. Kindly log in to paplexpress.com to complete the approval process.`,
          cc: this.ccEmails    // Use the fetched CC email addresses

        };
        this.isLoading=true
        
        this.http.post(`${environment.serverUrl}api/send-email-notification`, emailPayload)
          .subscribe(
            emailResponse => {
              console.log('Email Notification sent successfully:', emailResponse);
              alert('Email notification sent!');
              setTimeout(() => {
                this.isLoading = false;
                this.cdr.detectChanges(); // Trigger change detection manually if needed
              }, 1000);
            },
            emailError => {
              console.error('Error sending email:', emailError);
              alert('Error sending email notification.');
            }
          );
        
      },
      (error) => {
        console.error('Error uploading PDF:', error);
        alert('Error uploading PDF. Please try again.'); // Optional: alert for errors
      }
    );
}



// Function to view the stored PDF with confirmation alert
viewStoredPDF(): void {
if (this.pdfId) {
  const userConfirmed = confirm('Do you want to view your generated report?');
  if (userConfirmed) {
    this.http.get(`${environment.serverUrl}reports/${this.pdfId}`, { responseType: 'blob' })
      .subscribe(
        (response: Blob) => {
          this.displayPDF(response);
          console.log('PDF retrieved successfully:', response);
        },
        (error) => {
          console.error('Error retrieving PDF:', error);
          alert('Error retrieving PDF. Please try again later.');
        }
      );
  } else {
    console.log('User canceled the action.');
  }
} else {
  alert('No PDF ID available. Please upload a PDF first.');
}
}

// Function to display the PDF
displayPDF(pdfBlob: Blob): void {
const blobUrl = URL.createObjectURL(pdfBlob);
window.open(blobUrl);  // Open PDF in a new tab
}



Report_Generate(){

  if(this.dataservice.Report_image_Value != null )
    {

    
// pit
for(let unitselect of this.Ordered_unit) {
  for(let checklistmaster of this.inspectionMasterData) {    
      let defect_value: string ="  "+unitselect+" " ;
      let anyChecked: boolean = false;
      let negativevalue='-'

      for (let check_list_loop of this.Record_Values) {
        // console.log("888",unitselect,defect_value,checklistmaster.Description.trim() )
        
        if (checklistmaster.Parts.toLowerCase() === "pit" && check_list_loop.section.toLowerCase() === "pit" && check_list_loop.unit_no===unitselect) {
          console.log("FF+",checklistmaster.Description.trim()+'+'+check_list_loop.description.trim(),checklistmaster.Description.trim() === check_list_loop.description.trim());
          
          if (
            checklistmaster.Description.trim().replace(/\s+/g, '') === 
            check_list_loop.description.trim().replace(/\s+/g, '')
          ) {
            console.log("FFF++", check_list_loop);
          
            // Check if "not applicable" is in dropdown_option
            const dropdownOptionNormalized = check_list_loop.dropdown_option.trim().toLowerCase();
            if ((dropdownOptionNormalized.includes("not applicable")|| dropdownOptionNormalized.includes("not applicable,")) && (check_list_loop.checked)) {
              console.log("The dropdown option contains 'not applicable'.");
              negativevalue='NA'
            }
            else{
              if(check_list_loop.checked)
              {
                negativevalue='N'
              }
              
            }
          
            if (check_list_loop.checked === true || check_list_loop.checked) {
              anyChecked = true; // Set the flag to true if any check_list_loop.checked is true
              defect_value = defect_value + " ~ " + check_list_loop.dropdown_option;
          
              console.log("FFF1", check_list_loop.dropdown_option, unitselect);
            }
          }
          
        }
    }
  

    if (anyChecked) { // If any check_list_loop.checked is true for this description
      anyChecked=false
    
      let imgData = this.dataservice.Report_image_Value.find((item: { description: string; }) => item.description.trim().replace(/\s+/g, '')===checklistmaster.Description.trim().replace(/\s+/g, ''));
      if (imgData) {
        


console.log("image datavalue",imgData)

        // 
          let filteredUnits = imgData.units.filter((unit: { unit: string; check: boolean; }) => unit.unit === unitselect && unit.check== true);
          // console.log("!~",filteredUnits)
          if(filteredUnits.length>0 && filteredUnits !==null)
            {
              // console.log("!~1",filteredUnits)
          
           let images = filteredUnits.map((unitdata: { img: any; }) => unitdata.img );


            for(  let i=0;i<images.length;i++)
            {

              // console.log("777-")
              const pitVariables = this.Result_Of_pit_variables_pit[checklistmaster.Description.trim()][unitselect];
              if (pitVariables.image.length <2 && pitVariables.image[0]===null)
                {
                  console.log(checklistmaster.Description)
                  // const val={status:"N",img:[]}
                  this.Result_unit_status_pit_pit[checklistmaster.Description.trim()]=true;
                  this.Result_Of_pit_variables_pit[checklistmaster.Description.trim()][unitselect]={status:negativevalue,image:images[i],report_string:defect_value,actual_description:checklistmaster.Description,has_image:true,image_dropdown:""}
                }
                else{
                  // console.log("991",unitselect,defect_value,checklistmaster.Description )
                  this.Result_unit_status_pit_pit[checklistmaster.Description.trim()]=true;
                  this.Result_Of_pit_variables_pit[checklistmaster.Description.trim()][unitselect].image.push(images[i]);
                }
            }   
          }
          else{


            
            this.Result_unit_status_pit_pit[checklistmaster.Description.trim()]=true;
            this.Result_Of_pit_variables_pit[checklistmaster.Description.trim()][unitselect]={status:negativevalue,image:[null],report_string:defect_value,actual_description:checklistmaster.Description,has_image:false,image_dropdown:""}
             

            console.log("!~",this.Result_Of_pit_variables_pit[checklistmaster.Description.trim()])


          }
      }
      else{
        this.Result_unit_status_pit_pit[checklistmaster.Description.trim()]=true;
       this.Result_Of_pit_variables_pit[checklistmaster.Description.trim()][unitselect]={status:negativevalue,image:[null],report_string:defect_value,actual_description:checklistmaster.Description,has_image:false,image_dropdown:""}
               

      }

  } 
  else {
    if(checklistmaster.Parts.toLowerCase()=="pit")
      {

        // console.log("777+",checklistmaster.Description.trim(),unitselect,defect_value,checklistmaster.Description )
        this.Result_Of_pit_variables_pit[checklistmaster.Description.trim()][unitselect]={status:"Y",image:[null],report_string:"",actual_description:checklistmaster.Description,has_image:false,image_dropdown:""}
        
      }
     }
  }
  for (const firstLevelKey in this.Result_Of_pit_variables_pit) {
    const secondLevelKeys = Object.keys(this.Result_Of_pit_variables_pit[firstLevelKey]);
    const unitString = secondLevelKeys.join("$^$");
    const statusString = secondLevelKeys.map(key => key+":"+this.Result_Of_pit_variables_pit[firstLevelKey][key].status).join("$^$");
    // const reportString = secondLevelKeys.map(key => this.Result_Of_pit_variables_pit[firstLevelKey][key].report_string).join("$^$");
    const reportStrings = secondLevelKeys
  .map((key: string) => this.Result_Of_pit_variables_pit[firstLevelKey][key]?.report_string)
  .filter((reportString: string | undefined) => reportString !== undefined && reportString !== '' && reportString !== "~$^$~");

const reportString = reportStrings.length > 0 ? reportStrings.join("$^$") : null; // Join if there are values, otherwise return null

    const actualDescription = secondLevelKeys.length > 0 ? this.Result_Of_pit_variables_pit[firstLevelKey][secondLevelKeys[0]].actual_description : "";

    this.preparedData_pit[firstLevelKey] = {
      unit: unitString,
      actual_description: actualDescription,
      status: statusString,
      report_string: reportString,
    };
  }

    console.log("prepared____",this.flag_for_sent_data_snapshot,this.preparedData_pit)
    



  // console.log("prepared____",this.flag_for_sent_data_snapshot,this.preparedData_pit)  
  console.log("final,",this.Result_Of_pit_variables_pit,this.Result_unit_status_pit_pit)
}
// cabin
for(let unitselect of this.Ordered_unit) {
for(let checklistmaster of this.inspectionMasterData) {    
    let defect_value: string = "  "+unitselect+" " ;
    let anyChecked: boolean = false;
    let negativevalue='-'

    for (let check_list_loop of this.Record_Values) {
      // console.log("888",unitselect,defect_value,checklistmaster.Description.trim() )
      if (checklistmaster.Parts.toLowerCase()==="cabin" && check_list_loop.section.toLowerCase()==="cabin" && check_list_loop.unit_no===unitselect) {
        
       
        if (
          checklistmaster.Description.trim().replace(/\s+/g, '') === 
          check_list_loop.description.trim().replace(/\s+/g, '')
        ) {
          console.log("FFF cabin1", check_list_loop.description,check_list_loop.dropdown_option, unitselect);
        
          // Check if "not applicable" is in dropdown_option
          const dropdownOptionNormalized = check_list_loop.dropdown_option.trim().toLowerCase();
          if ((dropdownOptionNormalized.includes("not applicable") || dropdownOptionNormalized.includes("not applicable,"))&& (check_list_loop.checked)) {
            console.log("The dropdown option contains 'not applicable'.");
            negativevalue='NA'
          }
          else{
            if(check_list_loop.checked)
            {
              negativevalue='N'
            }
            
          }
        
          if (check_list_loop.checked === true || check_list_loop.checked) {
            anyChecked = true; // Set the flag to true if any check_list_loop.checked is true
            defect_value = defect_value + " ~ " + check_list_loop.dropdown_option;
        
            console.log("FFF1 cabin",check_list_loop.description, check_list_loop.dropdown_option, unitselect);
          }
        }
      }
  }

  if (anyChecked) { // If any check_list_loop.checked is true for this description
    anyChecked=false
    let imgData = this.dataservice.Report_image_Value.find((item: { description: string; }) => item.description.trim().replace(/\s+/g, '')===checklistmaster.Description.trim().replace(/\s+/g, ''));
    console.log("cabin imgD",imgData);
    
    if (imgData) {
      




      // hgfdsdfghjkl
      console.log("!~ cabin1",unitselect)
        let filteredUnits = imgData.units.filter((unit: { unit: string; check: boolean; }) =>   unit.unit === unitselect && unit.check == true);
        console.log("!~ cabin",filteredUnits)
        if(filteredUnits.length>0 && filteredUnits !==null)
          {
            console.log("!~1 cabin",filteredUnits)
        
         let images = filteredUnits.map((unitdata: { img: any; }) => unitdata.img );

         console.log("cabin imgD**",images);
         

          for(  let i=0;i<images.length;i++)
          {

            console.log("777 cabin",images)
            const pitVariables = this.Result_Of_pit_variables_cabin[checklistmaster.Description.trim()][unitselect];
            if (pitVariables.image.length <2 && pitVariables.image[0]===null)
              {
                // const val={status:"N",img:[]}
                this.Result_unit_status_cabin[checklistmaster.Description.trim()]=true;
                this.Result_Of_pit_variables_cabin[checklistmaster.Description.trim()][unitselect]={status:negativevalue,image:images[i],report_string:defect_value,actual_description:checklistmaster.Description,has_image:true,image_dropdown:images[i].image_dropdown}
              }
              else{
                console.log("991 cabin",unitselect,defect_value,checklistmaster.Description )
                
                this.Result_Of_pit_variables_cabin[checklistmaster.Description.trim()][unitselect].image.push(images[i]);
              }
          }   
        }
        else{


          
          this.Result_unit_status_cabin[checklistmaster.Description.trim()]=true;
          this.Result_Of_pit_variables_cabin[checklistmaster.Description.trim()][unitselect]={status:negativevalue,image:[null],report_string:defect_value,actual_description:checklistmaster.Description,has_image:false,image_dropdown:""}
           

          console.log("!~",this.Result_Of_pit_variables_cabin[checklistmaster.Description.trim()])


        }
    }
    else{
      this.Result_unit_status_cabin[checklistmaster.Description.trim()]=true;
     this.Result_Of_pit_variables_cabin[checklistmaster.Description.trim()][unitselect]={status:negativevalue,image:[null],report_string:defect_value,actual_description:checklistmaster.Description,has_image:false,image_dropdown:""}
             

    }

} 
else {
  if(checklistmaster.Parts.toLowerCase()=="cabin")
    {

      console.log("777+ cabin",checklistmaster.Description.trim(),unitselect,defect_value,checklistmaster.Description )
      this.Result_Of_pit_variables_cabin[checklistmaster.Description.trim()][unitselect]={status:"Y",image:[null],report_string:"",actual_description:checklistmaster.Description,has_image:false,image_dropdown:""}
  
    }
   }
}

for (const firstLevelKey in this.Result_Of_pit_variables_cabin) {
  const secondLevelKeys = Object.keys(this.Result_Of_pit_variables_cabin[firstLevelKey]);
  const unitString = secondLevelKeys.join("$^$");
  const statusString = secondLevelKeys.map(key => key+":"+this.Result_Of_pit_variables_cabin[firstLevelKey][key].status).join("$^$");
  // const reportString = secondLevelKeys.map(key => this.Result_Of_pit_variables_cabin[firstLevelKey][key].report_string).join("$^$");
  const reportStrings = secondLevelKeys
  .map((key: string) => this.Result_Of_pit_variables_cabin[firstLevelKey][key]?.report_string)
  .filter((reportString: string | undefined) => reportString !== undefined && reportString !== '' && reportString !== "~$^$~");

const reportString = reportStrings.length > 0 ? reportStrings.join("$^$") : null; // Join if there are values, otherwise return null

  const actualDescription = secondLevelKeys.length > 0 ? this.Result_Of_pit_variables_cabin[firstLevelKey][secondLevelKeys[0]].actual_description : "";

  this.preparedData_cabin[firstLevelKey] = {
    unit: unitString,
    actual_description: actualDescription,
    status: statusString,
    report_string: reportString,
  };
}

console.log("final cabin",this.Result_Of_pit_variables_cabin,this.Result_unit_status_cabin)
}
// cartop
for(let unitselect of this.Ordered_unit) {
for(let checklistmaster of this.inspectionMasterData) {    
  let defect_value: string = "  "+unitselect+" " ;
  let anyChecked: boolean = false;
  let negativevalue='-'

  
  for (let check_list_loop of this.Record_Values) {
    // console.log("~~~~~~~",checklistmaster.Parts.toLowerCase(),check_list_loop.section.toLowerCase())
    // console.log("888",unitselect,defect_value,checklistmaster.Description.trim() )
    if (checklistmaster.Parts.toLowerCase()==="car top" && check_list_loop.section.toLowerCase()==="cartop" && check_list_loop.unit_no===unitselect) {
      // console.log("~~~~~~~+")
      if (
        checklistmaster.Description.trim().replace(/\s+/g, '') === 
        check_list_loop.description.trim().replace(/\s+/g, '')
      ) {
        
      
        // Check if "not applicable" is in dropdown_option
        const dropdownOptionNormalized = check_list_loop.dropdown_option.trim().toLowerCase();
        console.log("FFF", check_list_loop.dropdown_option, unitselect,dropdownOptionNormalized,check_list_loop.checked,(dropdownOptionNormalized.includes("not applicable")|| dropdownOptionNormalized.includes("not applicable,")), (check_list_loop.checked));
        if ((dropdownOptionNormalized.includes("not applicable")|| dropdownOptionNormalized.includes("not applicable,")) && (check_list_loop.checked)) {
          console.log("The dropdown option contains 'not applicable'.");
          negativevalue='NA'
        }
        else{
          if(check_list_loop.checked)
          {
            negativevalue='N'
          }
          
        }
      
        if (check_list_loop.checked === true || check_list_loop.checked) {
          anyChecked = true; // Set the flag to true if any check_list_loop.checked is true
          defect_value = defect_value + " ~ " + check_list_loop.dropdown_option;
      
          console.log("FFF1", check_list_loop.dropdown_option, unitselect);
        }
      }
      
    }
}

if (anyChecked) { // If any check_list_loop.checked is true for this description
  anyChecked=false
  let imgData = this.dataservice.Report_image_Value.find((item: { description: string; }) => item.description.trim().replace(/\s+/g, '')===checklistmaster.Description.trim().replace(/\s+/g, ''));
  // console.log("car imgD",imgData)
  if (imgData) {  
    // hgfdsdfghjkl
      let filteredUnits = imgData.units.filter((unit: { unit: string; check: boolean; }) => unit.unit === unitselect && unit.check== true);
      // console.log("!~",filteredUnits)
      if(filteredUnits.length>0 && filteredUnits !==null)
        {
          // console.log("!~1",filteredUnits)
      
       let images = filteredUnits.map((unitdata: { img: any; }) => unitdata.img );

        for(  let i=0;i<images.length;i++)
        {

          // console.log("777-")
          const pitVariables = this.Result_Of_pit_variables_cartop[checklistmaster.Description.trim()][unitselect];
          if (pitVariables.image.length <2 && pitVariables.image[0]===null)
            {
              // const val={status:"N",img:[]}
              this.Result_unit_status_cartop[checklistmaster.Description.trim()]=true;
              this.Result_Of_pit_variables_cartop[checklistmaster.Description.trim()][unitselect]={status:negativevalue,image:images[i],report_string:defect_value,actual_description:checklistmaster.Description,has_image:true,image_dropdown:""}
            }
            else{
              // console.log("991",unitselect,defect_value,checklistmaster.Description )
              
              this.Result_Of_pit_variables_cartop[checklistmaster.Description.trim()][unitselect].image.push(images[i]);
            }
        }   
      }
      else{
        this.Result_unit_status_cartop[checklistmaster.Description.trim()]=true;
        this.Result_Of_pit_variables_cartop[checklistmaster.Description.trim()][unitselect]={status:negativevalue,image:[null],report_string:defect_value,actual_description:checklistmaster.Description,has_image:false,image_dropdown:""}
         

        // console.log("!~",this.Result_Of_pit_variables_cartop[checklistmaster.Description.trim()])


      }
  }
  else{
    this.Result_unit_status_cartop[checklistmaster.Description.trim()]=true;
   this.Result_Of_pit_variables_cartop[checklistmaster.Description.trim()][unitselect]={status:negativevalue,image:[null],report_string:defect_value,actual_description:checklistmaster.Description,has_image:false,image_dropdown:""}
           

  }

} 
else {
if(checklistmaster.Parts.toLowerCase()=="car top")
  {

    console.log("777+",checklistmaster.Description.trim(),unitselect,defect_value,checklistmaster.Description )
    this.Result_Of_pit_variables_cartop[checklistmaster.Description.trim()][unitselect]={status:"Y",image:[null],report_string:"",actual_description:checklistmaster.Description,has_image:false,image_dropdown:""}
    

  }
 }
}


for (const firstLevelKey in this.Result_Of_pit_variables_cartop) {
  const secondLevelKeys = Object.keys(this.Result_Of_pit_variables_cartop[firstLevelKey]);
  const unitString = secondLevelKeys.join("$^$");
  const statusString = secondLevelKeys.map(key => key+":"+this.Result_Of_pit_variables_cartop[firstLevelKey][key].status).join("$^$");
  // const reportString = secondLevelKeys.map(key => this.Result_Of_pit_variables_cartop[firstLevelKey][key].report_string).join("$^$");
  const reportStrings = secondLevelKeys
  .map((key: string) => this.Result_Of_pit_variables_cartop[firstLevelKey][key]?.report_string)
  .filter((reportString: string | undefined) => reportString !== undefined && reportString !== '' && reportString !== "~$^$~");

const reportString = reportStrings.length > 0 ? reportStrings.join("$^$") : null; // Join if there are values, otherwise return null

  const actualDescription = secondLevelKeys.length > 0 ? this.Result_Of_pit_variables_cartop[firstLevelKey][secondLevelKeys[0]].actual_description : "";

  this.preparedData_cartop[firstLevelKey] = {
    unit: unitString,
    actual_description: actualDescription,
    status: statusString,
    report_string: reportString,
  };
}
console.log("final cartop",this.Result_Of_pit_variables_cartop,this.Result_unit_status_cartop)
}


// machine room
for(let unitselect of this.Ordered_unit) {
for(let checklistmaster of this.inspectionMasterData) {    
  let defect_value: string = "  "+unitselect+" " ;
  let anyChecked: boolean = false;
  let negativevalue='-'

  for (let check_list_loop of this.Record_Values) {
    // console.log("888",unitselect,defect_value,checklistmaster.Description.trim() )
    if (checklistmaster.Parts.toLowerCase()==="machine room" && check_list_loop.section.toLowerCase()==="machineroom" && check_list_loop.unit_no===unitselect) {
      if (
        checklistmaster.Description.trim().replace(/\s+/g, '') === 
        check_list_loop.description.trim().replace(/\s+/g, '')
      ) {
        console.log("FFF", check_list_loop.dropdown_option, unitselect);
      
        // Check if "not applicable" is in dropdown_option
        const dropdownOptionNormalized = check_list_loop.dropdown_option.trim().toLowerCase();
        if ((dropdownOptionNormalized.includes("not applicable") ||dropdownOptionNormalized.includes("not applicable,")) && (check_list_loop.checked)) {
          console.log("The dropdown option contains 'not applicable'.");
          negativevalue='NA'
        }
        else{
          if(check_list_loop.checked)
          {
            negativevalue='N'
          }
          
        }
      
        if (check_list_loop.checked === true || check_list_loop.checked) {
          anyChecked = true; // Set the flag to true if any check_list_loop.checked is true
          defect_value = defect_value + " ~ " + check_list_loop.dropdown_option;
      
          console.log("FFF1", check_list_loop.dropdown_option, unitselect);
        }
      }
      
    }
}

if (anyChecked) { // If any check_list_loop.checked is true for this description
  anyChecked=false
  let imgData = this.dataservice.Report_image_Value.find((item: { description: string; }) => item.description.trim().replace(/\s+/g, '')===checklistmaster.Description.trim().replace(/\s+/g, ''));
  if (imgData) {
    




    // hgfdsdfghjkl
      let filteredUnits = imgData.units.filter((unit: { unit: string; check: boolean; }) => unit.unit === unitselect && unit.check== true);
      // console.log("!~",filteredUnits)
      if(filteredUnits.length>0 && filteredUnits !==null)
        {
          // console.log("!~1",filteredUnits)
      
       let images = filteredUnits.map((unitdata: { img: any; }) => unitdata.img );

        for(  let i=0;i<images.length;i++)
        {

          // console.log("777-")
          const pitVariables = this.Result_Of_pit_variables_machineroom[checklistmaster.Description.trim()][unitselect];
          if (pitVariables.image.length <2 && pitVariables.image[0]===null)
            {
              // const val={status:"N",img:[]}
              this.Result_unit_status_machineroom[checklistmaster.Description.trim()]=true;
              this.Result_Of_pit_variables_machineroom[checklistmaster.Description.trim()][unitselect]={status:negativevalue,image:images[i],report_string:defect_value,actual_description:checklistmaster.Description,has_image:true,image_dropdown:""}
            }
            else{
              // console.log("991",unitselect,defect_value,checklistmaster.Description )
              
              this.Result_Of_pit_variables_machineroom[checklistmaster.Description.trim()][unitselect].image.push(images[i]);
            }
        }   
      }
      else{


        
        this.Result_unit_status_machineroom[checklistmaster.Description.trim()]=true;
        this.Result_Of_pit_variables_machineroom[checklistmaster.Description.trim()][unitselect]={status:negativevalue,image:[null],report_string:defect_value,actual_description:checklistmaster.Description,has_image:false,image_dropdown:""}
         

        // console.log("!~",this.Result_Of_pit_variables_machineroom[checklistmaster.Description.trim()])


      }
  }
  else{
    this.Result_unit_status_machineroom[checklistmaster.Description.trim()]=true;
   this.Result_Of_pit_variables_machineroom[checklistmaster.Description.trim()][unitselect]={status:negativevalue,image:[null],report_string:defect_value,actual_description:checklistmaster.Description,has_image:false,image_dropdown:""}
           

  }

} 
else {
if(checklistmaster.Parts.toLowerCase()=="machine room")
  {

    // console.log("777+",checklistmaster.Description.trim(),unitselect,defect_value,checklistmaster.Description )
    this.Result_Of_pit_variables_machineroom[checklistmaster.Description.trim()][unitselect]={status:"Y",image:[null],report_string:"",actual_description:checklistmaster.Description,has_image:false,image_dropdown:""}
   
  }
 }
}
for (const firstLevelKey in this.Result_Of_pit_variables_machineroom) {
  const secondLevelKeys = Object.keys(this.Result_Of_pit_variables_machineroom[firstLevelKey]);
  const unitString = secondLevelKeys.join("$^$");
  const statusString = secondLevelKeys.map(key => key+":"+this.Result_Of_pit_variables_machineroom[firstLevelKey][key].status).join("$^$");
  // const reportString = secondLevelKeys.map(key => this.Result_Of_pit_variables_machineroom[firstLevelKey][key].report_string).join("$^$");
  const reportStrings = secondLevelKeys
  .map((key: string) => this.Result_Of_pit_variables_machineroom[firstLevelKey][key]?.report_string)
  .filter((reportString: string | undefined) => reportString !== undefined && reportString !== '' && reportString !== "~$^$~");

const reportString = reportStrings.length > 0 ? reportStrings.join("$^$") : null; // Join if there are values, otherwise return null

  const actualDescription = secondLevelKeys.length > 0 ? this.Result_Of_pit_variables_machineroom[firstLevelKey][secondLevelKeys[0]].actual_description : "";

  this.preparedData_machineroom[firstLevelKey] = {
    unit: unitString,
    actual_description: actualDescription,
    status: statusString,
    report_string: reportString,
  };
}
console.log("final mach",this.Result_Of_pit_variables_machineroom,this.Result_unit_status_machineroom)
}
// floor landing

for(let unitselect of this.Ordered_unit) {
for(let checklistmaster of this.inspectionMasterData) {    
  let defect_value: string = "  "+unitselect+" " ;
  let anyChecked: boolean = false;  
  let negativevalue='-'
  for (let check_list_loop of this.Record_Values) {
    // console.log("888floor",unitselect,defect_value,checklistmaster.Description.trim() )
    if (checklistmaster.Parts.toLowerCase()==="floor landing" && check_list_loop.section.toLowerCase()==="floorlanding" && check_list_loop.unit_no===unitselect) {
      if (
        checklistmaster.Description.trim().replace(/\s+/g, '') === 
        check_list_loop.description.trim().replace(/\s+/g, '')
      ) {
        console.log("FFF", check_list_loop.dropdown_option, unitselect);
      
        // Check if "not applicable" is in dropdown_option
        const dropdownOptionNormalized = check_list_loop.dropdown_option.trim().toLowerCase();
        if ((dropdownOptionNormalized.includes("not applicable,")||dropdownOptionNormalized.includes("not applicable")) && (check_list_loop.checked)) {
          console.log("The dropdown option contains 'not applicable'.",dropdownOptionNormalized);
          negativevalue='NA'
        }
        else{
          if(check_list_loop.checked)
          {
            negativevalue='N'
            console.log("notapplicable",dropdownOptionNormalized);
          }
         
        }
      
        if (check_list_loop.checked === true || check_list_loop.checked) {
          anyChecked = true; // Set the flag to true if any check_list_loop.checked is true
          defect_value = defect_value + " ~ " + check_list_loop.dropdown_option;
      
          console.log("FFF1", check_list_loop.dropdown_option, unitselect);
        }
      }
    }
} 


if (anyChecked) { // If any check_list_loop.checked is true for this description
  anyChecked=false
  let imgData = this.dataservice.Report_image_Value.find((item: { description: string; }) => item.description.trim().replace(/\s+/g, '')===checklistmaster.Description.trim().replace(/\s+/g, ''));
  // console.log("!~ floor",imgData)
  if (imgData) {
    // hgfdsdfghjkl
      let filteredUnits = imgData.units.filter((unit: { unit: string; check: boolean; }) => unit.unit === unitselect && unit.check== true);
      // console.log("!~ floor",filteredUnits)
      if(filteredUnits.length>0 && filteredUnits !==null)
        {
          // console.log("!~1 floor",filteredUnits)           
       let images = filteredUnits.map((unitdata: { img: any; }) => unitdata.img );
        for(  let i=0;i<images.length;i++)
        {
          // console.log("777- floor")
          const pitVariables = this.Result_Of_pit_variables_floorlanding[checklistmaster.Description.trim()][unitselect];
          if (pitVariables.image.length <2 && pitVariables.image[0]===null)
            {
              // const val={status:"N",img:[]}
              this.Result_unit_status_floorlanding[checklistmaster.Description.trim()]=true;
              this.Result_Of_pit_variables_floorlanding[checklistmaster.Description.trim()][unitselect]={status:negativevalue,image:images[i],report_string:defect_value,actual_description:checklistmaster.Description,has_image:true,image_dropdown:""}
            }
            else{
              // console.log("991 floor",unitselect,defect_value,checklistmaster.Description )     
              this.Result_Of_pit_variables_floorlanding[checklistmaster.Description.trim()][unitselect].image.push(images[i]);
            }
        }   
      }
      else{              
        this.Result_unit_status_floorlanding[checklistmaster.Description.trim()]=true;
        this.Result_Of_pit_variables_floorlanding[checklistmaster.Description.trim()][unitselect]={status:negativevalue,image:[null],report_string:defect_value,actual_description:checklistmaster.Description,has_image:false,image_dropdown:""}
       // console.log("!~ floor",this.Result_Of_pit_variables_floorlanding[checklistmaster.Description.trim()]) 
      }
  }
  else{
    this.Result_unit_status_floorlanding[checklistmaster.Description.trim()]=true;
   this.Result_Of_pit_variables_floorlanding[checklistmaster.Description.trim()][unitselect]={status:negativevalue,image:[null],report_string:defect_value,actual_description:checklistmaster.Description,has_image:false,image_dropdown:""}
           

  }

} 
else {
if(checklistmaster.Parts.toLowerCase()=="floor landing")
  {

    // console.log("777+ floor",checklistmaster.Description.trim(),unitselect,defect_value,checklistmaster.Description )
    this.Result_Of_pit_variables_floorlanding[checklistmaster.Description.trim()][unitselect]={status:"Y",image:[null],report_string:"",actual_description:checklistmaster.Description,has_image:false,image_dropdown:""}
  
  }
 }
}


for (const firstLevelKey in this.Result_Of_pit_variables_floorlanding) {
  const secondLevelKeys = Object.keys(this.Result_Of_pit_variables_floorlanding[firstLevelKey]);
  const unitString = secondLevelKeys.join("$^$");
  const statusString = secondLevelKeys.map(key => key+":"+this.Result_Of_pit_variables_floorlanding[firstLevelKey][key].status).join("$^$");
  // const reportString = secondLevelKeys.map(key => this.Result_Of_pit_variables_floorlanding[firstLevelKey][key].report_string).join("$^$");
  const reportStrings = secondLevelKeys
  .map((key: string) => this.Result_Of_pit_variables_floorlanding[firstLevelKey][key]?.report_string)
  .filter((reportString: string | undefined) => reportString !== undefined && reportString !== '' && reportString !== "~$^$~");

const reportString = reportStrings.length > 0 ? reportStrings.join("$^$") : null; // Join if there are values, otherwise return null

  const actualDescription = secondLevelKeys.length > 0 ? this.Result_Of_pit_variables_floorlanding[firstLevelKey][secondLevelKeys[0]].actual_description : "";

  this.preparedData_floorlanding[firstLevelKey] = {
    unit: unitString,
    actual_description: actualDescription,
    status: statusString,
    report_string: reportString,
  };
}
console.log("final floorlanding",this.Result_Of_pit_variables_floorlanding,this.Result_unit_status_floorlanding,this.dataservice.Report_image_Value)
} 
  }
  }
}



