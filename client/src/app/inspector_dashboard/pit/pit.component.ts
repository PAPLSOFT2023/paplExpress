import { ChangeDetectorRef, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { DataService } from 'src/app/data.service';
import { ApicallService } from 'src/app/apicall.service';
import { response } from 'express';



interface PitDataItem {
  Description:string
  Dropdown: string;
  Photo: string;
  Reference: string;
  Negative_MNT: string;
  Negative_ADJ: string;
  Positive_ADJ: number;
  Positive_MNT: number;
  Emergency_Features: boolean;
  Customer_Scope: boolean;
  functional_point:string;
  Risklevel:string;
  id:string

}


@Component({
  selector: 'app-pit',
  templateUrl: './pit.component.html',
  styleUrls: ['./pit.component.scss']
})
export class PitComponent {
  val :string | null='';
  name:string | null ='';
  document_id:string | null ='';
  unit_no:string|null='';
  loading:boolean=true;


  steps: string[] = [];
  completedStatus: boolean[] =[];
  completedStatus_Index:boolean[]=[];


   dbName = 'OutBox';
   isLoading=true;


  constructor(private route: ActivatedRoute,private apicallService: ApicallService,private http :HttpClient,private router:Router,private cdr:ChangeDetectorRef){
     this.route.paramMap.subscribe(params => {
      this.val = params.get('c_no');
      console.log(this.val);
      // this.isLoading=true;

      
    });

  }
  async ngOnInit(){
    this.document_id = sessionStorage.getItem('document_id');
    console.log('document id is ',this.document_id);
    this.unit_no=sessionStorage.getItem('unit_no');
    console.log('unit number is',this.unit_no);
    console.log('section is ',this.val);
    this.name = sessionStorage.getItem('UserName') as string;
    this.dbName=this.name
    console.log('inspector name',this.name);
  
    if (this.val !== null) {
  
      const openRequest: IDBOpenDBRequest = indexedDB.open("offlinedominus", 1);
      openRequest.onerror = (event) => {
        console.error("Failed to open database:", (event.target as IDBOpenDBRequest).error);
      };
    
      openRequest.onsuccess = async (event) => {
        console.log("Database opened successfully.");
    
        const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
        const transaction: IDBTransaction = db.transaction("inspectionMaster", "readwrite");
        const dominos_data: IDBObjectStore = transaction.objectStore("inspectionMaster");
        const getRequest: IDBRequest<IDBCursorWithValue | null> = dominos_data.openCursor();
  
               getRequest.onsuccess = async (event) => {
                   const cursor: IDBCursorWithValue | null = (event.target as IDBRequest<IDBCursorWithValue>).result;
  
                   if (cursor) {
                       const record = cursor.value;
  

                       const pitData = record.pit;
                       console.log("*:*", this.document_id,this.unit_no,this.val,this.name,this.steps);
                       pitData.forEach((item: PitDataItem) => {
                        this.steps.push(item.Description);
                    });


                    
                    const request = indexedDB.open(this.dbName, 2);

                    request.onupgradeneeded = (event: any) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains(this.name)) {
                      db.createObjectStore(this.name,{ keyPath: "key" });   //
                    }
                    };

                   request.onerror = (event) => {
                     console.error('IndexedDB error:', event);
                   };
                  




                    for (let i of this.steps) {

                      console.log(">>",this.document_id+this.unit_no!+i.toString());
                      
                      const exists = await this.isKeyPresent(this.document_id+'+'+this.unit_no!+'+'+i.toString());
                      this.completedStatus_Index.push( exists );
                    }


        this.apicallService.Check_check_data_exists(
          this.document_id,
          this.unit_no,
          this.val,
          this.name,
          this.steps
        ).subscribe(
          (responseArray: any) => {
            if (responseArray) {
              this.completedStatus = responseArray;
              console.log('complete status',this.completedStatus);
              
            }
            // Delay hiding the loader by 1 second after a successful response
            setTimeout(() => {
              this.isLoading = false;
              this.cdr.detectChanges(); // Trigger change detection manually if needed
            });
          },
          (error) => {
            // Log the error and delay hiding the loader by 1 second in case of an error
            console.error('API Error:', error);
            setTimeout(() => {
              this.isLoading = false;
              this.cdr.detectChanges(); // Trigger change detection manually if needed
            });
          }
        );
  
        
                       
                       cursor.continue();

                   } else {
                       console.log("No more records");
                   }
               };
  
               getRequest.onerror = (event) => {
                   console.error("Error fetching data from IndexedDB:", getRequest.error);
               };
    
       
      };
    
      openRequest.onupgradeneeded = (event) => {
        const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
        // console.log("Creating object store...");
        db.createObjectStore("inspectionMaster", { keyPath: "key", autoIncrement: true });
      };
  
  
  
  
  
      
   
   
  }
  else{
    alert("Session Expired, Please Login again")
  }
  }


  async isKeyPresent(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName);

      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction(this.name, 'readonly');
        const store = transaction.objectStore(this.name);

        const getRequest = store.get(key);

        getRequest.onsuccess = () => {
          resolve(getRequest.result !== undefined);
          // this.isLoading=false;
        };

        getRequest.onerror = () => {
          reject(getRequest.error);
          // this.isLoading=false;
        };
      };

      request.onerror = (event) => {
        reject(event.target);
        // this.isLoading=false;
      };
    });
  }


  getLogoLetters(step: string): string {
    const words = step.split(' '); // Split step into words
    let logo = ''; // Initialize the logo string
    if (words.length > 0) {
      logo += words[0].charAt(0); // Add the first letter of the first word
    }
    if (words.length > 1) {
      logo += words[1].charAt(0); // Add the first letter of the second word
    }
    return logo;
  }

  redirect(){
    this.router.navigate(['afterlogin', 'unit', this.document_id]);

  }

  back(){
    this.router.navigate(['afterlogin','section',this.unit_no]);
  }
  next(){
    this.router.navigate(['afterlogin','cabin','cabin'])
  }

  handleCardClick(step: string) {

    const index = this.steps.indexOf(step);
    if (index !== -1 && this.completedStatus[index]) {
      // If the step is completed, show alert
      alert('Data Exists, Do you really want to change?');
    }
    
    const id = encodeURIComponent(step);
    this.router.navigate(['afterlogin', 'pitcheckpoint',id,this.document_id,this.unit_no,this.name,this.val]);
  }
}
