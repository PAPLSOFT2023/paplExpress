import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApicallService } from 'src/app/apicall.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss']
})
export class CertificateComponent {
  @ViewChild('contentToConvert') contentToConvert!: ElementRef;
  unitDetails: any;
  report_id:number|null=0;
  wccDates: any[] = [];
  ins_end_date: Date | null = null; // Declare the property
 
  tentativeDate: Date | null = null; // Initialize tentativeDate
  reInspectionDate: string = ''; 
  reInspectionDate1: string = ''; 
  currentDate: string = new Date().toISOString().split('T')[0];

  slicedContractNumber: string = '';  // This will hold the sliced contract number
  nextId: number = 0;
  signature: string = '';
  selectedDate: string = '';
  inf_26: any = {};
  breif_spec: any[] = [];
  htmlContent: string = '';
  unit: string | null = '';
  document_id: string | null = '';
  pdfId!: number; // Definite assignment assertion
  contract: string | null = '';
  remove=environment.clientUrl+"assets/remove_logo.png";
  company=environment.clientUrl+"assets/papl_logo_sample.png";
  nabcb=environment.clientUrl+"assets/nabcb_new.jpg";
  nacc=environment.clientUrl+"assets/image.jpg";

  constructor(private route: ActivatedRoute, private dataService: ApicallService, private http: HttpClient) {}

  ngOnInit() {
    
    
      console.log('unitDetails:', this.unitDetails); // Check if unitDetails exists
      console.log('Raw ins_end_date:', this.unitDetails?.ins_end_date); // Debugging log
    
      if (this.unitDetails && this.unitDetails.ins_end_date) {
        this.ins_end_date = new Date(this.unitDetails.ins_end_date); // Convert to Date
        console.log('Converted ins_end_date:', this.ins_end_date);
      } else {
        console.warn('ins_end_date is missing in unitDetails.');
        this.ins_end_date = null;
      }
    
    
    
    this.fetchSignature();
    
    this.getNextId();
   
    this.unit = this.route.snapshot.paramMap.get('unit');
    this.document_id = this.route.snapshot.paramMap.get('document_id');


    this.contract = sessionStorage.getItem('contract');
    
    console.log('unit is ', this.unit);
    console.log('document id is ', this.document_id);
    console.log('contract_number is ', this.contract);

    if (this.contract) {
      this.dataService.getDetailsForContractName(this.contract).subscribe((details: any) => {
        this.inf_26 = details;
      });
    }

    const inspectorUrl = `${environment.serverUrl}api/b_spec?encodedValue=${this.document_id}&encodedValue1=${this.unit}`;
    this.http.get<any[]>(inspectorUrl).subscribe(data => {
      this.breif_spec = data;
      console.log('breif spec is', this.breif_spec);
    });

    this.getUnitDetails(this.document_id);
    this.fetchWccDates(this.document_id);

    
  }

  getUnitDetails(documentId: string | null): void {
    this.http.get<any>(`${environment.serverUrl}getUnitDetails/${documentId}`).subscribe(
        (response) => {
            this.unitDetails = response.data;
            console.log('Unit details:', this.unitDetails);

            if (this.unitDetails?.ins_end_date) {
                this.ins_end_date = new Date(this.unitDetails.ins_end_date); // Convert to Date
                console.log('Converted ins_end_date:', this.ins_end_date);

                // Compute tentativeDate (6 months from ins_end_date)
                this.tentativeDate = new Date(this.ins_end_date);
                this.tentativeDate.setMonth(this.tentativeDate.getMonth() + 6);

                console.log('Tentative Date (6 months later):', this.tentativeDate);
            } else {
                console.warn('ins_end_date is missing.');
                this.ins_end_date = null;
                this.tentativeDate = null;
            }

            if (this.unitDetails?.report_array) {
                this.report_id = this.getReportIdForUnit(this.unit, this.unitDetails.report_array);
                console.log('Matching report ID:', this.report_id);
            } else {
                console.warn('report_array is undefined.');
            }
        },
        (error) => {
            console.error('Error fetching unit details:', error);
        }
    );
}

  

  //report id
  getReportIdForUnit(unit: string|null, reportArrayString: string): number | null {
    // Parse the stringified JSON report array
    const reportArray = JSON.parse(reportArrayString);
  
    // Iterate through the report array
    for (const report of reportArray) {
      // Check if the 'units' array contains the given unit
      if (report.units.includes(unit)) {
        // Return the corresponding reportId
        return report.reportId;
      }
    }
  
    // Return null if no matching report is found
    return null;
  }

  @HostListener('document:keydown.control.p', ['$event'])
  onCtrlP(event: KeyboardEvent) {
    event.preventDefault(); // Prevent default print action
    this.generatePDF();
  }


  

  getNextId(): void {
    this.http.get<number>(`${environment.serverUrl}api/next-id`).subscribe(
      (id: number) => {
        this.nextId = id;
      },
      (error) => {
        console.error('Error fetching next ID: ', error);
      }
    );
  }

  generatePDF() {
    const htmlContent = document.documentElement.outerHTML;
    this.http.post<any>('/generate-pdf', { htmlContent }).subscribe(
      response => {
        console.log('PDF generated and stored successfully:', response);
      },
      error => {
        console.error('Error generating or storing PDF:', error);
      }
    );
  }


  // Method to fetch WCC dates by documentId
   fetchWccDates(documentId: string|null): void {
  this.http.get<any[]>(`${environment.serverUrl}api/get_wcc_date/${documentId}`).subscribe(
    data => {
      this.wccDates = data;
      console.log('Fetched WCC Dates:', data); // Print data to console
    },
    error => {
      console.error('Error retrieving data:', error);
    }
  );
}


  fetchSignature() {
    const name = sessionStorage.getItem('UserName') as string;
    this.http.get(`${environment.serverUrl}signature/${name}`, { responseType: 'blob' }).subscribe((data: Blob) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.signature = event.target.result;
      };
      reader.readAsDataURL(data);
    }, error => {
      console.error('Error fetching signature:', error);
    });
  }

  generateAndSavePDF() {
        if (this.wccDates.length > 0 && this.wccDates[0].wcc_date) {

    let contentToConvert = this.contentToConvert.nativeElement.innerHTML;

    // Replace input elements with their values
    contentToConvert = contentToConvert.replace(/<input[^>]*value="([^"]*)"[^>]*>/g, (match: string, p1: string) => {
      return `<span>${p1}</span>`;
    });
    contentToConvert = contentToConvert.replace(/<input[^>]*>/g, ''); // Remove any remaining input fields
    contentToConvert = contentToConvert.replace(/placeholder="[^"]*"/g, ''); // Remove placeholder attributes

    // Retrieve additional data
    const name = sessionStorage.getItem('UserName');

    // Define the HTML content with embedded CSS styles
    const htmlContent = `
      <style>
        /* General styles */
        body { font-family: 'Calibri'; }
        @font-face {
  font-family: 'Calibri';
  src: url('/assets/fonts/calibri/calibri-regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

*{
font-family:'Calibri';
}
        header { display: flex; align-items: center; font-size: large; }
        .company-logo { margin-right: 20px; width: 100px; height: auto; }
        .certificate p { text-align: center; margin-left: 50px; text-decoration: underline; font-size: 25px; }
        .signature_ins { text-align: center; margin-bottom: 30px; }
        .new_sign { width: 50px; height: auto; display: block; margin: 0 auto; margin-left: 70px; margin-bottom: 140px; }
        .signature { display: flex; justify-content: space-between; }
        .small-signature { width: 80px; height: auto; }
        .left-content, .right-content { display: flex; flex-direction: column; align-items: flex-start; }
        .top, .down { display: flex; align-items: center; }
        .down p { margin-top: -260px; border-top: 1px solid #000; }
        .signature i { font-size: 20px; }
        .date { font-size: 10px; color: #333; margin-bottom: 10px; font-weight: bold; }
        .date p { margin: 0; }
        .notes { margin-top: -15px; font-size: 10px;}
        .  .date1 { font-size: 10px; color: #333; margin-top: 30px;margin-right: 1000px;}
        
        .number { font-size: 8px; margin-right: 12px; }
        .down_page { text-align: center; margin-top: 30px; }
        .footer { text-align: right; font-size: 10px; }
      .logofooter {
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 20px;
    margin-top: 10px;
  }
  
  .logofooter div {
    display: flex;
    justify-content: center;
  }
  
  .logofooter img {
    width: 60px;  /* Set equal size for all logos */
    height: 80px;
    object-fit: contain;
  }
  
  /* Increase size for .logo1 */
  .logofooter .logo {
    width: 140px;   /* Increase size specifically for this logo */
    height: 120px;  /* Same height to maintain aspect ratio */
  }



        .container { display: flex; justify-content: space-between; align-items: center; }
        table { width: 100%; max-width: 100%; font-size: 10px; border-collapse: collapse; margin-top: 20px; }
        .vertical { position: absolute; bottom: -1185px; right: 10px; }
        .com { color: rgb(137, 134, 134); }
        .borderless-input { border: none; outline: none; box-shadow: none; }
        table td,
table th {
      padding: 10px;
      border: 1px solid #161616;
      font-family: 'calibri';
      text-align: left; /* Align content to the left */
      @page {
    size: letter;
    margin-top: 10mm;
    margin-right: 10mm;
    margin-bottom: 15mm;
    margin-left: 10mm;

  }
  
  }
      </style>
      <body>
        ${contentToConvert}
      </body>
    `;

    const body = {
      htmlContent: htmlContent,
      unit: this.unit,
      document_id: this.document_id,
      contract: this.contract,
      building_name: this.inf_26.building_name,
      inspector_name: name,
      project_name:this.inf_26.project_name,
      region:this.inf_26.region,
      location:this.inf_26.location

    };

  // Specify responseType as 'arraybuffer'
  this.http.post(`${environment.serverUrl}api/generate-certificate1`, body, { responseType: 'arraybuffer' })
    .subscribe(
      (response: ArrayBuffer) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // Create a dynamic filename based on the unit and building name
        const sanitizedBuildingName = this.inf_26.building_name.replace(/[^a-zA-Z0-9]/g, '_'); // Sanitize for filename
        const filename = `${this.unit}_${sanitizedBuildingName}-Certififcate.pdf`;

        const a = document.createElement('a');
        a.href = url;
        a.download = filename; // Use the dynamic filename
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Log and alert success
        console.log('PDF downloaded successfully.');
        alert('Certificate downloaded successfully!'); // Success alert
      },
      (error) => {
        console.error('Error generating or saving PDF:', error);
        alert('Error generating or saving PDF. Please try again later.');
      }
    );
  }
  else{
    alert('You need to fill and generate WCC first, then only you can proceed.')
  }
}
  

  viewStoredPDF1() {
    if (this.pdfId) {
      this.http.get(`${environment.serverUrl}get-pdf1/${this.pdfId}`, { responseType: 'blob' })
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
      alert('No PDF ID available.');
    }
  }

  displayPDF(blob: Blob) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.click();
    window.URL.revokeObjectURL(url);
  }
}