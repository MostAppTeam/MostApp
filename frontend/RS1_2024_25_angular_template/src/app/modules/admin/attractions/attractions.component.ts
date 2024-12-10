import { Component, OnInit } from '@angular/core';
import { AttractionsService } from './attractions.service';
import { Attraction } from './attractions.model'; // Importuj model Attraction

@Component({
  selector: 'app-attractions',
  templateUrl: './attractions.component.html',
  styleUrls: ['./attractions.component.css'],
})
export class AttractionsComponent implements OnInit {
  attractions: Attraction[] = []; // Tipizirana lista atrakcija

  constructor(private attractionsService: AttractionsService) {}

  ngOnInit(): void {
    this.loadAttractions(); // Učitaj atrakcije kad se komponenta inicijalizuje
  }

  loadAttractions(): void {
    this.attractionsService.getAttractions().subscribe(
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
}
