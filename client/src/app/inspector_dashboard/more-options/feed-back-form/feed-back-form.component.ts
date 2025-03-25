import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignaturePad } from 'angular2-signaturepad';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-feed-back-form',
  templateUrl: './feed-back-form.component.html',
  styleUrls: ['./feed-back-form.component.scss']
})
export class FeedBackFormComponent {
  @ViewChild(SignaturePad) signaturePad!: SignaturePad;
  val: string | null = '';
  name: string = '';
  designation: string = '';
  contactNo: string = '';
  emailId: string = '';
  signature: string = ''; // Ensure this is properly captured

  option1: string = '';
  option2: string = '';
  option3: string = '';
  option4: string = '';
  option5: string = '';
  
  ratings: number[][] = [
    [0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0]  
  ];

  lastClickedIndex: number[] = [-1, -1, -1, -1, -1];

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    this.route.paramMap.subscribe(params => {
      this.val = params.get('c_no');
      console.log(this.val);
    });
  }

  rate(questionIndex: number, starIndex: number) {
    this.ratings[questionIndex] = this.ratings[questionIndex].map((value, index) => index <= starIndex ? 1 : 0);
    this.lastClickedIndex[questionIndex] = starIndex;
  }

  getLastCheckedText(questionIndex: number): string {
    const lastClicked = this.lastClickedIndex[questionIndex];
    const textMap = ["Poor", "Average", "Good", "Very Good", "Excellent"];
    return lastClicked !== -1 ? textMap[lastClicked] : ''; 
  }

  isInputEnabled(questionIndex: number): boolean {
    const sumOfRatings = this.ratings[questionIndex].reduce((acc, rating) => acc + rating, 0);
    return sumOfRatings < 5;
  }




  


  // check() {
  //   // Ensure ratings is a single value
  //   const ratingValue = Array.isArray(this.ratings) && Array.isArray(this.ratings[0]) 
  //     ? this.ratings[0][0] 
  //     : this.ratings;
  
  //   if (typeof ratingValue !== 'number') {
  //     alert('Invalid rating value.');
  //     return;
  //   }
  
  //   // Validation checks
  //   if (!this.name || this.name.trim() === '') {
  //     alert('Name is required.');
  //     return;
  //   }
  
  //   if (!this.designation || this.designation.trim() === '') {
  //     alert('Designation is required.');
  //     return;
  //   }
  
  //   if (!this.contactNo || !/^[0-9]{10}$/.test(this.contactNo)) {
  //     alert('Contact number is required and must be a 10-digit number.');
  //     return;
  //   }
  
  //   if (!this.emailId || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.emailId)) {
  //     alert('A valid email ID is required.');
  //     return;
  //   }
  
  //   if (!this.signature || this.signature.trim() === '') {
  //     alert('Signature is required.');
  //     return;
  //   }
  
  //   // Additional validation for option1 when rating is less than 5
  //   if (ratingValue < 5 && (!this.option1 || this.option1.trim() === '')) {
  //     alert('Reason is required for rating less than 5.');
  //     return;
  //   }
  
  //   // Prepare input data
  //   const inputData = {
  //     name: this.name,
  //     designation: this.designation,
  //     contactNo: this.contactNo,
  //     emailId: this.emailId,
  //     signature: this.signature, // Ensure the signature is properly captured
  //   };
  
  //   const options = {
  //     option1: this.option1,
  //     option2: this.option2,
  //     option3: this.option3,
  //     option4: this.option4,
  //     option5: this.option5,
  //   };
  
  //   console.log('Input Data:', inputData);
  //   console.log('Options:', options);
  
  //   const storeValues = {
  //     rating: ratingValue,
  //     customer_details: inputData,
  //     options: options,
  //     document_id: this.val,
  //   };
  
  //   // Make API call
  //   this.http.put(`${environment.serverUrl}api/update_data_feedback`, storeValues).subscribe(
  //     (response) => {
  //       if (confirm('Feedback submitted successfully!')) {
  //         this.router.navigate(['afterlogin', 'more_options']);
  //       }
  //     },
  //     (error) => {
  //       console.error('Error storing data', error);
  //       alert('An error occurred while submitting the feedback.');
  //     }
  //   );
  // }
  



//   check() {
//     // Check if ratings is a valid number
//     const ratingValue = Array.isArray(this.ratings) && Array.isArray(this.ratings[0])
//       ? this.ratings[0][0]
//       : this.ratings;
  
//     if (typeof ratingValue !== 'number' || ratingValue < 0 || ratingValue > 5) {
//       alert('Invalid rating value. Please provide a valid rating between 0 and 5.');
//       return;
//     }
  
//     // General validations
//     if (!this.name || this.name.trim() === '') {
//       alert('Name is required.');
//       return;
//     }
  
//     if (!this.designation || this.designation.trim() === '') {
//       alert('Designation is required.');
//       return;
//     }
  
//     if (!this.contactNo || !/^[0-9]{10}$/.test(this.contactNo)) {
//       alert('Contact number is required and must be a 10-digit number.');
//       return;
//     }
  
//     if (!this.emailId || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.emailId)) {
//       alert('A valid email ID is required.');
//       return;
//     }
  
//     if (!this.signature || this.signature.trim() === '') {
//       alert('Signature is required.');
//       return;
//     }
  
// // Validate reasons for ratings less than 5
// const reasons = [this.option1, this.option2, this.option3, this.option4, this.option5];

// // Loop through ratings and validate
// for (let i = 0; i < this.ratings.length; i++) {
//   const questionRatings = this.ratings[i]; // Get ratings for the current question
  
//   // Check if any rating for the current question is less than 5
//   if (questionRatings.some(rating => rating < 5)) {
//     if (!reasons[i] || reasons[i].trim() === '') {
//       alert(`Reason is required for question ${i + 1} with a rating less than 5.`);
//       return;
//     }
//   }
// }

// // If all ratings for all questions are 5, no validation required
// console.log('All ratings are 5. No reason validation required.');


//   }
  


check() {
  // Debug: Print ratings array to check its values
  console.log('Ratings:', this.ratings);

  // Reasons array corresponding to each question
  const reasons = [this.option1, this.option2, this.option3, this.option4, this.option5];

  // Loop through each question's ratings
  for (let i = 0; i < this.ratings.length; i++) {
    const questionRatings = this.ratings[i]; // Get ratings for the current question

    // Check if the maximum star clicked (rating) is less than 5
    const maxRating = questionRatings.reduce((acc, rating, index) => (rating === 1 ? index + 1 : acc), 0);

    console.log(`Max rating for question ${i + 1}: ${maxRating}`); // Debug: Log max rating

    // Validate reason if max rating is less than 5
    if (maxRating < 5) {
      if (!reasons[i] || reasons[i].trim() === '') {
        alert(`Reason is required for question ${i + 1} with a rating less than 5.`);
        return;
      }
    }
  }

  // If validation passes
  console.log('All validations passed!');

  // Additional validations for general information
  if (!this.name || this.name.trim() === '') {
    alert('Name is required.');
    return;
  }

  if (!this.designation || this.designation.trim() === '') {
    alert('Designation is required.');
    return;
  }

  if (!this.contactNo || !/^[0-9]{10}$/.test(this.contactNo)) {
    alert('Contact number is required and must be a 10-digit number.');
    return;
  }

  if (!this.emailId || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.emailId)) {
    alert('A valid email ID is required.');
    return;
  }

  if (!this.signature || this.signature.trim() === '') {
    alert('Signature is required.');
    return;
  }



     // Prepare input data
    const inputData = {
      name: this.name,
      designation: this.designation,
      contactNo: this.contactNo,
      emailId: this.emailId,
      signature: this.signature, // Ensure the signature is properly captured
    };
  
    const options = {
      option1: this.option1,
      option2: this.option2,
      option3: this.option3,
      option4: this.option4,
      option5: this.option5,
    };
  
    console.log('Input Data:', inputData);
    console.log('Options:', options);
  
    const storeValues = {
      rating: this.ratings,
      customer_details: inputData,
      options: options,
      document_id: this.val,
    };
  
    // Make API call
    this.http.put(`${environment.serverUrl}api/update_data_feedback`, storeValues).subscribe(
      (response) => {
        if (confirm('Feedback submitted successfully!')) {
          this.router.navigate(['afterlogin', 'more_options']);
        }
      },
      (error) => {
        console.error('Error storing data', error);
        alert('An error occurred while submitting the feedback.');
      }
    );
  
  


  
}












  signaturePadOptions: Object = { 
    'minWidth': 2,
    'canvasWidth': 300,
    'canvasHeight': 150,
    'penColor': 'black' 
  };

  // Method when signature drawing is complete
  drawComplete() {
    if (this.signaturePad) {
      this.signature = this.signaturePad.toDataURL(); // Save the signature as base64 image
      console.log('Signature captured:', this.signature); // Check if signature is captured
    }
  }
  
  // Method to clear the signature
  clearSignature() {
    if (this.signaturePad) {
      this.signaturePad.clear();
      this.signature = ''; // Clear the signature value
    }
  }


  captureSignature() {
    if  (this.signaturePad && !this.signaturePad.isEmpty() ) {
      this.signature = this.signaturePad.toDataURL(); // Save the signature as base64
      console.log('Captured Signature:', this.signature);
      window.alert('Signature saved successfully!'); // Show alert


    } else {
      console.log('No signature detected!');
    }
  }
  

  
}
