import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AttractionsService } from './attractions.service';
import { Attraction } from './attractions.model';

type CreateAttractionPayload = {
  name: string;
  description?: string;
  cityID: number;
  virtualTourURL?: string;
  imageUrl?: string;
};

@Component({
  selector: 'app-attractions',
  templateUrl: './attractions.component.html',
  styleUrls: ['./attractions.component.css'],
})
export class AttractionsComponent implements OnInit {
  attractions: Attraction[] = [];

  // Sort
  sortBy: 'name' | 'description' | 'virtualtoururl' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Upload
  selectedFile: File | null = null;
  uploadedImageUrl: string | null = null;

  // Default city (ako nema polja u formi)
  readonly DEFAULT_CITY_ID = 1;

  // Model za formu (USKLAĐEN s tvojim interfejsom)
  newAttraction: CreateAttractionPayload = {
    name: '',
    description: '',
    cityID: this.DEFAULT_CITY_ID,
    virtualTourURL: '',
    imageUrl: ''
  };


  constructor(private attractionsService: AttractionsService, private router: Router) {}

  ngOnInit(): void {
    this.loadAttractions();
  }

  loadAttractions(): void {
    this.attractionsService.getAttractions(this.sortBy, this.sortDirection, this.selectedCategory).subscribe(
      (data: Attraction[]) => {
        this.attractions = data;
      },
    });
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
