import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.scss']
})
export class AppHomeComponent {
  @ViewChild('fullscreenContainer') fullscreenContainer!: ElementRef;

  // State variables
  name: string | null = sessionStorage.getItem('UserName');
  servicesDropdownVisible: boolean = false;
  policiesDropdownVisible: boolean = false;
  isMobileMenuOpen: boolean = false;
  

  isNavbar1Fixed: boolean = false; // Tracks if navbar1 should be fixed
  

  // Organizations data
  organizations = [
    { name: 'Organization 1' },
    { name: 'Organization 2' },
    { name: 'Himalayan' },
    { name: 'Himalayan' },
  ];

  // Counter variables
  totalProjects: number = 0;
  unitsServiced: number = 0;
  netProfit: number = 0;


  // Background sliding variables
  currentBackground: string = 'assets/landing1.jpg'; // Default background
  private backgroundImages: string[] = [
    'assets/landing1.jpg',
    'assets/landing2.jpg',
    'assets/landind3.jpg',
  ];
  private currentIndex: number = 0;
  private intervalId: any;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Initialize counters
    this.startCounter('totalProjects', 0, 1000, 1000); // Example: 0 to 100 in 2 seconds
    this.startCounter('unitsServiced', 0, 998, 1000); // Example: 0 to 2500 in 3 seconds
    this.startCounter('netProfit', 0, 5000, 1000); // Example: 0 to 5000 in 4 seconds

    // Start background slider
    this.startBackgroundSlider();

    // Listen to scroll events
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  ngOnDestroy(): void {
    // Cleanup background slider
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    // Remove scroll event listener
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }

  // Scroll event handler
  private onScroll(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    this.isNavbar1Fixed = scrollPosition > 100; // Adjust the scroll threshold as needed
  }


  // Counter logic
  private startCounter(
    property: 'totalProjects' | 'unitsServiced' | 'netProfit',
    start: number,
    end: number,
    duration: number
  ): void {
    const increment = (end - start) / (duration / 10);
    let current = start;

    const updateCounter = () => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        this[property] = end; // Ensure exact final value
        return;
      }
      this[property] = Math.floor(current); // Update counter property
      setTimeout(updateCounter, 10); // Update every 10ms
    };

    updateCounter();
  }

  // Background slider logic
  private startBackgroundSlider(): void {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.backgroundImages.length;
      this.currentBackground = this.backgroundImages[this.currentIndex];
    }, 4000); // Change background every 4 seconds
  }

  // Toggle visibility for Services dropdown
  toggleServicesDropdown(visible: boolean): void {
    this.servicesDropdownVisible = visible;
  }

  // Toggle visibility for Policies dropdown
  togglePoliciesDropdown(visible: boolean): void {
    this.policiesDropdownVisible = visible;
  }
  downloadBrochure(): void {
    const brochureUrl = 'assets/Company Brochure.pdf'; // Path to your PDF file
    const link = document.createElement('a');
    link.href = brochureUrl;
    link.download = 'Company-Brochure.pdf'; // Default download filename
    link.click();
  }
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
