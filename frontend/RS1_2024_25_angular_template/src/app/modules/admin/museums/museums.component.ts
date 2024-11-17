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

  constructor(private museumService: MuseumService) {}

  ngOnInit(): void {
    this.loadMuseums();
  }

  // Učitavanje muzeja sa servera
  loadMuseums(): void {
    this.museumService.getMuseums().subscribe(
      (data) => {
        this.museums = data;
      },
      (error) => {
        console.error('Greška prilikom učitavanja muzeja:', error);
        this.feedbackMessage = 'Greška prilikom učitavanja muzeja.';
        setTimeout(() => (this.feedbackMessage = null), 3000);
      }
    );
  }

  // Dodavanje novog muzeja
  addMuseum(): void {
    const { name, description, location, workingHours, imageUrl } = this.newMuseum;

    if (name.trim() && description.trim() && location.trim() && workingHours.trim() && imageUrl.trim()) {
      this.museumService.createMuseum(this.newMuseum).subscribe(
        (response) => {
          this.feedbackMessage = 'Muzej uspješno dodan!';
          this.newMuseum = { name: '', description: '', location: '', workingHours: '', imageUrl: '' };
          this.loadMuseums(); // Osvežavanje liste muzeja
          setTimeout(() => (this.feedbackMessage = null), 3000);
        },
        (error) => {
          console.error('Greška prilikom dodavanja muzeja:', error);
          this.feedbackMessage = 'Došlo je do greške prilikom dodavanja muzeja.';
          setTimeout(() => (this.feedbackMessage = null), 3000);
        }
      );
    } else {
      this.feedbackMessage = 'Molimo popunite sva polja!';
      setTimeout(() => (this.feedbackMessage = null), 3000);
    }
  }
}
