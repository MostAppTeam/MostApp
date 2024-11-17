import { Component, OnInit } from '@angular/core';
import { EventService } from './event.service';
import { Event } from './event.model';

@Component({
  selector: 'app-events',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  newEvent: Omit<Event, 'id'> = {
    name: '',
    date: '',
    location: '',
    description: '',
  };
  feedbackMessage: string | null = null;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  // Metoda za učitavanje događaja
  loadEvents(): void {
    this.eventService.getEvents().subscribe(
      (data) => {
        this.events = data;
      },
      (error) => {
        console.error('Greška prilikom učitavanja događaja:', error);
        this.feedbackMessage = 'Greška prilikom učitavanja događaja.';
        setTimeout(() => (this.feedbackMessage = null), 3000);
      }
    );
  }

  // Metoda za dodavanje događaja
  addEvent(): void {
    const { name, date, location, description } = this.newEvent;

    // Validacija unosa
    if (name.trim() && date.trim() && location.trim() && description.trim()) {
      this.eventService.createEvent(this.newEvent).subscribe(
        (response) => {
          // Uspešno dodavanje događaja
          this.feedbackMessage = 'Događaj uspješno dodan!';
          this.newEvent = { name: '', date: '', location: '', description: '' }; // Reset forme
          this.loadEvents(); // Osvežavanje liste događaja
          setTimeout(() => (this.feedbackMessage = null), 3000); // Poruka se automatski briše
        },
        (error) => {
          // Obrada greške
          console.error('Greška prilikom dodavanja događaja:', error);
          this.feedbackMessage = 'Došlo je do greške prilikom dodavanja događaja.';
          setTimeout(() => (this.feedbackMessage = null), 3000);
        }
      );
    } else {
      // Ako su polja prazna
      this.feedbackMessage = 'Molimo popunite sva polja!';
      setTimeout(() => (this.feedbackMessage = null), 3000);
    }
  }

  // Metoda za uređivanje događaja
  editEvent(event: Event): void {
    const updatedEvent = { ...event, name: `${event.name} (Izmenjeno)` }; // Simulacija izmene
    this.eventService.updateEvent(updatedEvent).subscribe(
      (response) => {
        this.feedbackMessage = 'Događaj uspješno izmenjen!';
        this.loadEvents();
        setTimeout(() => (this.feedbackMessage = null), 3000);
      },
      (error) => {
        console.error('Greška prilikom izmene događaja:', error);
        this.feedbackMessage = 'Došlo je do greške prilikom izmene događaja.';
        setTimeout(() => (this.feedbackMessage = null), 3000);
      }
    );
  }

  // Metoda za brisanje događaja
  deleteEvent(id: number): void {
    if (confirm('Da li ste sigurni da želite da obrišete ovaj događaj?')) {
      this.eventService.deleteEvent(id).subscribe(
        () => {
          this.feedbackMessage = 'Događaj uspješno obrisan!';
          this.loadEvents();
          setTimeout(() => (this.feedbackMessage = null), 3000);
        },
        (error) => {
          console.error('Greška prilikom brisanja događaja:', error);
          this.feedbackMessage = 'Došlo je do greške prilikom brisanja događaja.';
          setTimeout(() => (this.feedbackMessage = null), 3000);
        }
      );
    }
  }
}
