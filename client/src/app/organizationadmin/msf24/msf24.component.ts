import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';


// Define an interface for the inspection record
interface InspectionRecord {
    id: string;
    contract_number: string;
    type_of_inspection: string;
    client_whatsapp_number: string;
    customer_workorder_date: string;
    master_customer_name: string;
    customer_name_as_per_work_order: string;
    customer_contact_name: string;
    customer_contact_number: string;
    customer_contact_mailid: string;
    building_name: string;
    project_name: string;
    location: string;
    region: string;
    tower: string; // not in inf26 table
    total_number_of_units: string;
    no_of_elevator: string;
    no_of_escalator: string;
    oem_details: string;
    no_of_visits_as_per_work_order: string;
    current_visit: string; // not in inf26 table
    inspection_month: string; // not in inf26 table
    data_of_scheduling: string; // not in inf26 table
    difference_in_days: string;
    schedule_from: string;
    schedule_to: string;
    report_status: string; // report_files_table
    inspector_list: string; // inspector array table
    salesProcess: string; // unit_details table (selfassigned)
    familarity_with_oem_representative: any; // no default
    wcc_date: string; // shutdown notice table
    certificate_issued_date: string; // uploaded_files table
    sticker_provided_date: string; // not in project
}

@Component({
    selector: 'app-msf24',
    templateUrl: './msf24.component.html',
    styleUrls: ['./msf24.component.scss']
})
export class Msf24Component implements OnInit {
    inf26Data: InspectionRecord[] = []; // To hold the fetched data
    reportFilesData: InspectionRecord[] = [];
    salesProcessData: string[] = []; // Array to hold sales process data
    

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.inf_26_data();
        this.reportfiles_data();
        this.unitdetails_data();
        this.msf_wccdate();
    }

    // Function to get data from the Node.js server
    inf_26_data(): void {
        this.http.get<{ data: InspectionRecord[] }>(`${environment.serverUrl}api/msf24_data`)
            .subscribe(
                (response) => {
                    this.inf26Data = response.data; // Accessing the array from the response
                    console.log('Data fetched:', this.inf26Data);
                },
                (error) => {
                    console.error('Error fetching data:', error);
                }
            );
    }

    reportfiles_data(): void {
        this.http.get<{ data: InspectionRecord[] }>(`${environment.serverUrl}api/msf24_report_status`)
            .subscribe(
                (response) => {
                    console.log('response', response);

                    this.reportFilesData = response.data.map(record => ({
                        ...record,
                        report_status: record.report_status == '0' ? 'IN PROGRESS' : 'COMPLETED' // Correctly map the values
                    }));
                    console.log('Report files data:', this.reportFilesData);
                },
                (error) => {
                    console.error('Error fetching report files data:', error);
                }
            );
    }


   
    unitdetails_data(): void {
        this.http.get<{ data: { salesProcess: string }[] }>(`${environment.serverUrl}api/msf24_salesinvolve`)
            .subscribe(
                (response) => {
                    console.log('Unit Details Data:', response);
    
                    // Assuming response.data contains the salesProcess data
                    const salesProcessData = response.data;
    
                    // Now, merge or update your inf26Data with the salesProcess field
                    this.inf26Data.forEach((record, index) => {
                        // Check if there's corresponding salesProcess data for each record
                        if (salesProcessData[index]) {
                            record.salesProcess = salesProcessData[index].salesProcess;
                        } else {
                            record.salesProcess = 'N/A'; // Default if no salesProcess data
                        }
                    });
    
                    console.log('Updated inf26Data with salesProcess:', this.inf26Data);
                },
                (error) => {
                    console.error('Error fetching unit details data:', error);
                }
            );
    }


    msf_wccdate(): void {
        this.http.get<{ data: { wcc_date: string }[] }>(`${environment.serverUrl}api/msf24_wccdate`)
            
            .subscribe(
                (response) => {
                    console.log('WCC Dates:', response.data); // Print the data to the console
    
                    // Assuming response.data contains the wcc_date data
                    const wccDateData = response.data;
    
                    // Now, merge or update your inf26Data with the wcc_date field
                    this.inf26Data.forEach((record, index) => {
                        // Check if there's corresponding wcc_date data for each record
                        if (wccDateData[index]) {
                            record.wcc_date = wccDateData[index].wcc_date;
                        } else {
                            record.wcc_date = 'N/A'; // Default if no wcc_date data
                        }
                    });
    
                    console.log('Updated inf26Data with wcc_date:', this.inf26Data);
                },
                (error) => {
                    console.error('Error fetching WCC Dates:', error); // Print any errors
                }
            );
    }
    
    
    
    
    

    // Function to format date from ISO 8601 to dd/mm/yyyy
    formatDate(dateString: string): string {
        const date = new Date(dateString); // Convert to Date object
        const day = ('0' + date.getDate()).slice(-2); // Get day and pad with zero if needed
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Get month (0-indexed) and pad with zero
        const year = date.getFullYear(); // Get full year
        return `${day}/${month}/${year}`; // Return in dd/mm/yyyy format
    }

    formatInspectorList(inspectorList: string): string {
        // Check if inspectorList is null or undefined
        if (!inspectorList) {
            return ''; // Return an empty string if inspectorList is null or undefined
        }
        // Remove brackets and quotes from the string
        const cleanList = inspectorList.replace(/[\[\]"']+/g, '').trim();
    
        // Split by ' - ' and return name and code in the required format
        const parts = cleanList.split(' - ');
        if (parts.length > 1) {
            const name = parts[0]; // Inspector name
            const code = parts[1]; // Inspector code
            return `${name} (${code})`; // Format as 'Name (Code)'
        }
        return cleanList; // If the format is unexpected, return it as it is
    }

   

    exportToExcelall() {
        // Prepare the data for Excel
        const data = this.inf26Data.map((record, index) => ({
            "SERIAL NO.": index + 1,
            "INF REG NO": record.id,
            "ORDER NO": record.contract_number,
            "INSPECTION TYPE": record.type_of_inspection,
            "CLIENT WO NO": record.client_whatsapp_number,
            "WO DATED": record.customer_workorder_date,
            "MASTER CLIENT": record.master_customer_name,
            "CLIENT NAME AS PER WO": record.customer_name_as_per_work_order,
            "CLIENT REP. NAME": record.customer_contact_name,
            "CLIENT REP. CONTACT No": record.customer_contact_number,
            "CLIENT REP. EMAIL ID": record.customer_contact_mailid,
            "PROJECT / BUILDING NAME": record.project_name,
            "BUILDING NAME": record.building_name,
            "LOCATION": record.location,
            "REGION": record.region,
            "TOWER": record.tower || 'N/A',
            "TOTAL NO OF UNITS": record.total_number_of_units,
            "NO. OF UNITS_ELEV": record.no_of_elevator,
            "NO. OF UNITS_ESC": record.no_of_escalator,
            "OEM":record.oem_details,
            "NO. OF VISITS AS PER W/O": record.no_of_visits_as_per_work_order,
            "CURRENT VISIT NO.": record.current_visit|| 'N/A',
            "INSPECTION MONTH": record.inspection_month || 'N/A',
            "DATE OF SCHEDULING": record.data_of_scheduling || 'N/A',
            "NO. OF DAYS PROPOSED": record.difference_in_days,
            "SCHEDULE FROM & TO": `${record.schedule_from} to ${record.schedule_to}`,
            "REPORT STATUS": this.reportFilesData.map(file => file.report_status).join(', '),
            "INSPECTOR NAME/CODE": this.formatInspectorList(record.inspector_list),
            "SALES PROCESS": record.salesProcess,
            "FAMILIARITY WITH OEM REPRESENTATIVE": record.familarity_with_oem_representative || 'NO',
            "SHUT DOWN NOTICE ISSUED": this.formatDate(record.wcc_date),
            "CERTIFICATE ISSUED DATE": this.formatDate(record.wcc_date),
            "STICKER PROVIDED DATE": record.sticker_provided_date || 'N/A'
        }));
    
        // Define the headers manually
        const headers = Object.keys(data[0]);
    
        // Create the worksheet with headers and data
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, { header: headers });
    
        // Style header cells with yellow background
        const range = XLSX.utils.decode_range(ws['!ref']!);
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
            if (!ws[cellAddress]) continue;
            ws[cellAddress].s = {
                fill: { fgColor: { rgb: 'FFFF00' } },
                font: { bold: true }
            };
        }
    
        // Create a workbook
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'INF-26 Data');
    
        // Generate dynamic file name
        const fileName = `${this.inf26Data[0]?.project_name || 'Project'}_${this.inf26Data[0]?.contract_number || 'Contract'}_${this.inf26Data[0]?.type_of_inspection || 'Inspection'}.xlsx`;
    
        // Write the workbook and trigger download
        XLSX.writeFile(wb, fileName);
    }
    
     // Method to export to Excel
   exportToExcel(documentId: string) {
    // Filter the data based on the selected document_id
    const filteredData = this.inf26Data.filter(record => record.id === documentId);

    // Check if there is any data for the provided document_id
    if (filteredData.length === 0) {
      console.error('No data found for the selected document_id.');
      return; // Exit if no data is found
    }

    // Define the custom headers with grouping for better organization
    const headers = [
      "SERIAL NO.", "INF REG NO", "ORDER NO", "INSPECTION TYPE", "CLIENT WO NO", "WO DATED", "MASTER CLIENT", "CLIENT NAME AS PER WO",
      "CLIENT REP. NAME", "CLIENT REP. CONTACT No", "CLIENT REP. EMAIL ID", "PROJECT / BUILDING NAME", "BUILDING NAME", "LOCATION", "REGION",
      "TOWER", "TOTAL NO OF UNITS", "NO. OF UNITS_ELEV", "NO. OF UNITS_ESC", "OEM", "NO. OF VISITS AS PER W/O", "CURRENT VISIT NO.",
      "INSPECTION MONTH", "DATE OF SCHEDULING", "NO. OF DAYS PROPOSED", "SCHEDULE FROM & TO", "REPORT STATUS", "INSPECTOR NAME/CODE",
      "SALES PROCESS", "FAMILIARITY WITH OEM REPRESENTATIVE", "SHUT DOWN NOTICE ISSUED", "CERTIFICATE ISSUED DATE", "STICKER PROVIDED DATE"
    ];

    // Prepare the data for Excel based on the custom headers
    const data = filteredData.map((record, index) => ({
      "SERIAL NO.": index + 1,
      "INF REG NO": record.id,
      "ORDER NO": record.contract_number,
      "INSPECTION TYPE": record.type_of_inspection,
      "CLIENT WO NO": record.client_whatsapp_number,
      "WO DATED": record.customer_workorder_date,
      "MASTER CLIENT": record.master_customer_name,
      "CLIENT NAME AS PER WO": record.customer_name_as_per_work_order,
      "CLIENT REP. NAME": record.customer_contact_name,
      "CLIENT REP. CONTACT No": record.customer_contact_number,
      "CLIENT REP. EMAIL ID": record.customer_contact_mailid,
      "PROJECT / BUILDING NAME": record.project_name,
      "BUILDING NAME": record.building_name,
      "LOCATION": record.location,
      "REGION": record.region,
      "TOWER": record.tower || 'N/A',
      "TOTAL NO OF UNITS": record.total_number_of_units,
      "NO. OF UNITS_ELEV": record.no_of_elevator,
      "NO. OF UNITS_ESC": record.no_of_escalator,
      "OEM": record.oem_details,
      "NO. OF VISITS AS PER W/O": record.no_of_visits_as_per_work_order,
      "CURRENT VISIT NO.": record.current_visit || 'N/A',
      "INSPECTION MONTH": record.inspection_month || 'N/A',
      "DATE OF SCHEDULING": record.data_of_scheduling || 'N/A',
      "NO. OF DAYS PROPOSED": record.difference_in_days,
      "SCHEDULE FROM & TO": `${record.schedule_from} to ${record.schedule_to}`,
      "REPORT STATUS": this.reportFilesData.map(file => file.report_status).join(', '),
      "INSPECTOR NAME/CODE": this.formatInspectorList(record.inspector_list),
      "SALES PROCESS": record.salesProcess,
      "FAMILIARITY WITH OEM REPRESENTATIVE": record.familarity_with_oem_representative || 'NO',
      "SHUT DOWN NOTICE ISSUED": this.formatDate(record.wcc_date),
      "CERTIFICATE ISSUED DATE": this.formatDate(record.wcc_date),
      "STICKER PROVIDED DATE": record.sticker_provided_date || 'N/A'
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, { header: headers });
    console.log('Generated worksheet:', ws);  // Log here

    // Apply yellow background color to all headers
    const range = XLSX.utils.decode_range(ws['!ref']!);
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!ws[cellAddress]) continue;

      // Apply yellow background color to all headers
      ws[cellAddress].s = {
        fill: { fgColor: { rgb: 'FFFF00' } },
        font: { bold: true, color: { rgb: '000000' } }
      };
    }

    // Apply column widths to make the data easier to read
    const columnWidths: { [key: string]: number } = {
      "SERIAL NO.": 12, "INF REG NO": 18, "ORDER NO": 15, "INSPECTION TYPE": 20, "CLIENT WO NO": 18, "WO DATED": 15,
      "MASTER CLIENT": 20, "CLIENT NAME AS PER WO": 25, "CLIENT REP. NAME": 20, "CLIENT REP. CONTACT No": 20,
      "CLIENT REP. EMAIL ID": 25, "PROJECT / BUILDING NAME": 25, "BUILDING NAME": 20, "LOCATION": 20, "REGION": 15,
      "TOWER": 15, "TOTAL NO OF UNITS": 18, "NO. OF UNITS_ELEV": 18, "NO. OF UNITS_ESC": 18, "OEM": 15,
      "NO. OF VISITS AS PER W/O": 18, "CURRENT VISIT NO.": 18, "INSPECTION MONTH": 18, "DATE OF SCHEDULING": 20,
      "NO. OF DAYS PROPOSED": 18, "SCHEDULE FROM & TO": 25, "REPORT STATUS": 25, "INSPECTOR NAME/CODE": 25,
      "SALES PROCESS": 20, "FAMILIARITY WITH OEM REPRESENTATIVE": 25, "SHUT DOWN NOTICE ISSUED": 18,
      "CERTIFICATE ISSUED DATE": 20, "STICKER PROVIDED DATE": 20
    };

    // Loop through and apply column widths
    Object.keys(columnWidths).forEach((colName, index) => {
      const colIndex = headers.indexOf(colName);
      if (colIndex !== -1) {
        const column = ws['!cols'] || [];
        column[colIndex] = { width: columnWidths[colName] };
      }
    });

    // Create a workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'INF-26 Data');

    // Generate dynamic file name
    const fileName = `${filteredData[0]?.project_name || 'Project'}_${filteredData[0]?.contract_number || 'Contract'}_${filteredData[0]?.type_of_inspection || 'Inspection'}.xlsx`;

    // Write the workbook and trigger download
    XLSX.writeFile(wb, fileName);
  }

//   // Helper methods to format data
//   formatInspectorList(inspectorList: any[]): string {
//     return inspectorList.map(inspector => inspector.name).join(', ');
//   }

//   formatDate(date: string): string {
//     return new Date(date).toLocaleDateString();
//   }
}

    

    
    
    
