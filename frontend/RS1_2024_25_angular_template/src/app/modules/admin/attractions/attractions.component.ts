import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AttractionsService } from './attractions.service';
import { Attraction } from './attractions.model';

@Component({
  selector: 'app-attractions',
  templateUrl: './attractions.component.html',
  styleUrls: ['./attractions.component.css'],
})
export class AttractionsComponent implements OnInit {
  attractions: Attraction[] = [];
  sortBy: string = 'name';
  sortDirection: string = 'asc';
  selectedCategory: string = 'All';
  categories: string[] = ['All', 'Museums', 'Parks', 'Shopping Centers', 'Historical Sites'];


  constructor(private attractionsService: AttractionsService, private router: Router) {}

  ngOnInit(): void {
    this.loadAttractions();
  }

  loadAttractions(): void {
    this.attractionsService.getAttractions(this.sortBy, this.sortDirection, this.selectedCategory).subscribe(
      (data: Attraction[]) => {
        this.attractions = data;
      },
      (error) => {
        console.error('Error loading attractions:', error);
        alert('Failed to load attractions. Please try again later.');
      }
    );
  }
  updateCategory(): void {
    this.loadAttractions();
  }


  updateSort(): void {
    this.loadAttractions();
  }

  goToDetail(id: number): void {
    console.log('Navigating to attraction', id);
    this.router.navigate(['/attraction-detail', id]);
  }




}
