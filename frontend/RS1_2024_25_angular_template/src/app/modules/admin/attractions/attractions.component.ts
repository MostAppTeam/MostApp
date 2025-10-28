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

  // Sorting & filtering
  sortBy: 'name' | 'description' | 'virtualtoururl' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedCategory: string = 'All';
  categories: string[] = ['All', 'Historic', 'Nature', 'Cultural', 'Modern'];

  // Upload
  selectedFile: File | null = null;
  uploadedImageUrl: string | null = null;

  // Lightbox
  viewerOpen = false;
  viewerImageUrl = '';
  zoomScale = 1;
  zoomTranslate = { x: 0, y: 0 };
  isDragging = false;
  lastMousePos = { x: 0, y: 0 };

  // Form
  readonly DEFAULT_CITY_ID = 1;
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

  // ======== CRUD / Fetch ========
  loadAttractions(): void {
    this.attractionsService
      .getAttractions(this.sortBy, this.sortDirection, this.selectedCategory)
      .subscribe((data: Attraction[]) => {
        this.attractions = data;
      });
  }

  updateCategory(): void {
    this.loadAttractions();
  }

  updateSort(): void {
    this.loadAttractions();
  }

  goToDetail(id: number): void {
    this.router.navigate(['/attraction-detail', id]);
  }

  // ======== Image upload ========
  onAttractionFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) return;

    this.attractionsService.uploadImage(this.selectedFile).subscribe({
      next: (res) => {
        this.uploadedImageUrl = res.imageUrl;
        this.newAttraction.imageUrl = res.imageUrl;
        alert('Image uploaded successfully!');
      },
      error: (err) => alert('Upload failed: ' + err.message)
    });
  }

  // ======== Create Attraction ========
  addAttraction(): void {
    if (!this.newAttraction.name) {
      alert('Name is required!');
      return;
    }

    this.attractionsService.createAttraction(this.newAttraction).subscribe({
      next: (res) => {
        alert('Attraction added successfully!');
        this.newAttraction = {
          name: '',
          description: '',
          cityID: this.DEFAULT_CITY_ID,
          virtualTourURL: '',
          imageUrl: ''
        };
        this.uploadedImageUrl = null;
        this.selectedFile = null;
        this.loadAttractions();
      },
      error: (err) => alert('Failed to add attraction: ' + err.message)
    });
  }

  // ======== Helpers ========
  getAttractionImageUrl(a: Attraction): string {
    if (!a.imageUrl) return 'assets/placeholder.jpg';
    if (a.imageUrl.startsWith('http')) return a.imageUrl;
    return `https://localhost:7000${a.imageUrl}`;
  }

  // ======== Lightbox / Zoom ========
  openViewer(url: string): void {
    this.viewerImageUrl = url;
    this.viewerOpen = true;
    this.zoomScale = 1;
    this.zoomTranslate = { x: 0, y: 0 };
  }

  closeViewer(): void {
    this.viewerOpen = false;
  }

  onWheelZoom(event: WheelEvent): void {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    this.setZoomLevel(this.zoomScale + delta);
  }

  setZoomLevel(level: number): void {
    this.zoomScale = Math.max(0.5, Math.min(level, 5));
  }

  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.lastMousePos = { x: event.clientX, y: event.clientY };
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    const dx = event.clientX - this.lastMousePos.x;
    const dy = event.clientY - this.lastMousePos.y;
    this.zoomTranslate.x += dx;
    this.zoomTranslate.y += dy;
    this.lastMousePos = { x: event.clientX, y: event.clientY };
  }

  onMouseUp(): void {
    this.isDragging = false;
  }

  resetView(): void {
    this.zoomScale = 1;
    this.zoomTranslate = { x: 0, y: 0 };
  }

  getZoomStyle() {
    return {
      transform: `scale(${this.zoomScale}) translate(${this.zoomTranslate.x / this.zoomScale}px, ${this.zoomTranslate.y / this.zoomScale}px)`,
      transition: this.isDragging ? 'none' : 'transform 0.1s ease-out'
    };
  }
}
