import { Component, OnInit } from '@angular/core';
import { AttractionsService } from './attractions.service';
import { Attraction } from './attractions.model';

@Component({
  selector: 'app-attractions',
  templateUrl: './attractions.component.html',
  styleUrls: ['./attractions.component.css'],
})
export class AttractionsComponent implements OnInit {
  attractions: Attraction[] = [];
  sortBy: string = 'name'; // Defaultno sortiranje po imenu
  sortDirection: string = 'asc'; // Defaultno sortiranje uzlazno

  constructor(private attractionsService: AttractionsService) {}

  ngOnInit(): void {
    this.loadAttractions(); // Učitaj atrakcije kada se komponenta inicijalizuje
  }

  loadAttractions(): void {
    this.attractionsService.getAttractions(this.sortBy, this.sortDirection).subscribe(
      (data: Attraction[]) => {
        console.log('Attractions loaded:', data);
        this.attractions = data;
      },
      (error) => {
        console.error('Error loading attractions:', error);
        alert('Failed to load attractions. Please try again later.');
      }
    );
  }

  updateSort(): void {
    this.loadAttractions(); // Ponovno učitaj atrakcije sa novim parametrima za sortiranje
  }
}
