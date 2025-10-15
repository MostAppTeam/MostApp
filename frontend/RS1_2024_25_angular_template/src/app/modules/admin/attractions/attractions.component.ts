import { Component, OnInit } from '@angular/core';
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

  constructor(private attractionsService: AttractionsService) {}

  ngOnInit(): void {
    this.loadAttractions();
  }

  loadAttractions(): void {
    this.attractionsService.getAttractions(this.sortBy, this.sortDirection).subscribe({
      next: (data) => (this.attractions = data),
      error: (err) => {
        console.error('Error loading attractions:', err);
        alert('Failed to load attractions.');
      },
    });
  }

  updateSort(): void {
    this.loadAttractions();
  }

  onAttractionFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) { this.selectedFile = null; return; }
    this.selectedFile = file;

    this.attractionsService.uploadImage(file).subscribe({
      next: (res) => {
        this.uploadedImageUrl = res.imageUrl;
        this.newAttraction.imageUrl = res.imageUrl || '';
      },
      error: (err) => {
        console.error('Image upload failed:', err);
        alert('Image upload failed!');
      },
    });
  }

  getAttractionImageUrl(a: Attraction): string {
    const url = a.imageUrl || '';
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://localhost:7000${url}`;
  }

  addAttraction(): void {
    if (!this.newAttraction.name || !this.newAttraction.name.trim()) {
      alert('Name is required.');
      return;
    }

    const payload: CreateAttractionPayload = {
      name: this.newAttraction.name.trim(),
      description: this.newAttraction.description?.trim() || undefined,
      cityID: this.newAttraction.cityID ?? this.DEFAULT_CITY_ID,
      virtualTourURL: this.newAttraction.virtualTourURL?.trim() || undefined,
      imageUrl: this.newAttraction.imageUrl?.trim() || undefined
    };

    this.attractionsService.createAttraction(payload).subscribe({
      next: (created) => {
        this.attractions = [created, ...this.attractions];
        this.resetForm();
      },
      error: (err) => {
        console.error('Failed to create attraction:', err);
        alert('Failed to create attraction.');
      },
    });
  }
  uploadImage(): void {
    if (!this.selectedFile) {
      alert('Please select an image first!');
      return;
    }

    this.attractionsService.uploadImage(this.selectedFile).subscribe({
      next: (res) => {
        this.uploadedImageUrl = res.imageUrl;
        this.newAttraction.imageUrl = res.imageUrl || '';
        alert('Image uploaded successfully!');
      },
      error: (err) => {
        console.error('Image upload failed:', err);
        alert('Image upload failed.');
      },
    });
  }

  private resetForm(): void {
    this.selectedFile = null;
    this.uploadedImageUrl = null;
    this.newAttraction = {
      name: '',
      description: '',
      cityID: this.DEFAULT_CITY_ID,
      virtualTourURL: '',
      imageUrl: ''
    };
  }
}
