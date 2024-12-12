import { Component, OnInit } from '@angular/core';
import { MuseumService } from './museum.service';
import { Museum } from './museum.model';

@Component({
  selector: 'app-museums',
  templateUrl: './museums.component.html',
  styleUrls: ['./museums.component.css'],
})
export class MuseumsComponent implements OnInit {
  museums: Museum[] = [];
  newMuseum: Omit<Museum, 'id'> = {
    name: '',
    description: '',
    location: '',
    workingHours: '',
    imageUrl: '',
  };
  feedbackMessage: string | null = null;

  // Default values for sorting
  sortBy: string = 'name'; // Default sorting criterion
  sortDirection: string = 'asc'; // Default sorting direction

  constructor(private museumService: MuseumService) {}

  ngOnInit(): void {
    this.loadMuseums();
  }

  // Load museums from the server
  loadMuseums(): void {
    this.museumService.getMuseums().subscribe(
      (data) => {
        this.museums = data;
      },
      (error) => {
        console.error('Error loading museums:', error);
        this.feedbackMessage = 'Error loading museums.';
        setTimeout(() => (this.feedbackMessage = null), 3000);
      }
    );
  }

  // Update sorting based on selected options
  updateSort(): void {
    this.loadSortedMuseums();
  }

  // Load sorted museums based on selected criteria and direction
  loadSortedMuseums(): void {
    this.museumService.getSortedMuseums(this.sortBy, this.sortDirection).subscribe(
      (data) => {
        this.museums = data;
      },
      (error) => {
        console.error('Error sorting museums:', error);
        this.feedbackMessage = 'Error loading sorted museums.';
        setTimeout(() => (this.feedbackMessage = null), 3000);
      }
    );
  }

  // Adding new museum
  addMuseum(): void {
    const { name, description, location, workingHours, imageUrl } = this.newMuseum;

    if (name.trim() && description.trim() && location.trim() && workingHours.trim() && imageUrl.trim()) {
      this.museumService.createMuseum(this.newMuseum).subscribe(
        (response) => {
          this.feedbackMessage = 'Museum successfully added!';
          this.newMuseum = { name: '', description: '', location: '', workingHours: '', imageUrl: '' };
          this.loadMuseums(); // Refresh museum list
          setTimeout(() => (this.feedbackMessage = null), 3000);
        },
        (error) => {
          console.error('Error adding museum:', error);
          this.feedbackMessage = 'Error adding museum.';
          setTimeout(() => (this.feedbackMessage = null), 3000);
        }
      );
    } else {
      this.feedbackMessage = 'Please fill out all fields!';
      setTimeout(() => (this.feedbackMessage = null), 3000);
    }
  }
}
