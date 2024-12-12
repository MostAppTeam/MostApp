
import { Component, OnInit } from '@angular/core';
import { EventService } from './event.service';
import { Event } from './event.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-events',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})
export class EventsComponent implements OnInit {
  events: Event[] = []; // Lista svih događaja
  filteredEvents: Event[] = []; // Filtrirani događaji
  newEvent: Omit<Event, 'id'> = {
    name: '',
    date: '',
    location: '',
    description: '',
  }; // Novi događaj za dodavanje
  feedbackMessage: string | null = null; // Poruka povratne informacije korisniku
  filterParams = {
    name: '',
    date: '',
    location: '',
    description: '',
    id: null,
  }; // Parametri za filtriranje događaja

  private map!: L.Map; // Referenca na Leaflet mapu
  private markers: L.Marker[] = []; // Lista markera na mapi

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.initializeMap(); // Inicijalizacija mape
    this.loadEvents(); // Učitavanje događaja iz baze

    // Primjer rute za testiranje
    this.drawRoute('43.3438,17.8081', '43.3550,17.8100');
  }

  // Inicijalizacija Leaflet mape
  private initializeMap(): void {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Map container not found!');
      return;
    }

    this.map = L.map('map').setView([43.3438, 17.8081], 13); // Koordinate Mostara

    // Dodaj OpenStreetMap sloj
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    // Omogućavanje dodavanja markera klikom na mapu
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.newEvent.location = `${lat.toFixed(5)},${lng.toFixed(5)}`; // Postavljanje lokacije
      const marker = L.marker([lat, lng]).addTo(this.map);
      marker.bindPopup('New Event Location').openPopup();
    });

    // Test marker
    L.marker([43.3438, 17.8081]).addTo(this.map).bindPopup('Test marker');
  }

  // Ažuriranje markera na mapi prema filtriranim događajima
  private updateMapMarkers(): void {
    // Ukloni prethodne markere
    this.markers.forEach((marker) => this.map.removeLayer(marker));
    this.markers = [];

    // Dodaj nove markere za filtrirane događaje
    this.filteredEvents.forEach((event) => {
      const [lat, lng] = event.location.split(',').map((coord) => parseFloat(coord.trim()));
      if (isNaN(lat) || isNaN(lng)) {
        console.error(`Invalid coordinates for event: ${event.name}, location: ${event.location}`);
        return; // Preskoči događaj s neispravnim koordinatama
      }

      const marker = L.marker([lat, lng]).addTo(this.map);
      marker.bindPopup(`<b>${event.name}</b><br>${event.description}`);
      this.markers.push(marker);
    });
  }

  // Crtanje rute između dvije točke
  private drawRoute(start: string, end: string): void {
    const [startLat, startLng] = start.split(',').map((coord) => parseFloat(coord.trim()));
    const [endLat, endLng] = end.split(',').map((coord) => parseFloat(coord.trim()));

    if (isNaN(startLat) || isNaN(startLng) || isNaN(endLat) || isNaN(endLng)) {
      console.error('Invalid coordinates for route');
      return;
    }

    const routeCoordinates: [number, number][] = [
      [startLat, startLng],
      [endLat, endLng],
    ];

    L.polyline(routeCoordinates, { color: 'blue' }).addTo(this.map);
  }

  // Učitavanje događaja iz backend-a
  loadEvents(): void {
    this.eventService.getEvents().subscribe(
      (data) => {
        console.log('Received events:', data); // Log podataka događaja
        this.events = data;
        this.filteredEvents = [...this.events]; // Inicijalno postavi filtrirane događaje
        this.updateMapMarkers();
      },
      (error) => {
        console.error('Error loading events:', error);
        this.feedbackMessage = 'Error loading events.';
        setTimeout(() => (this.feedbackMessage = null), 3000);
      }
    );
  }

  // Uređivanje postojećeg događaja
  editEvent(event: Event): void {
    const updatedEvent = { ...event, name: `${event.name} (Updated)` };
    this.eventService.updateEvent(updatedEvent).subscribe(
      () => {
        this.feedbackMessage = 'Event successfully updated!';
        this.loadEvents();
        setTimeout(() => (this.feedbackMessage = null), 3000);
      },
      (error) => {
        console.error('Error updating event:', error);
        this.feedbackMessage = 'Error updating the event.';
        setTimeout(() => (this.feedbackMessage = null), 3000);
      }
    );
  }

  // Brisanje događaja prema ID-u
  deleteEvent(id: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(id).subscribe(
        () => {
          this.feedbackMessage = 'Event successfully deleted!';
          this.loadEvents();
          setTimeout(() => (this.feedbackMessage = null), 3000);
        },
        (error) => {
          console.error('Error deleting event:', error);
          this.feedbackMessage = 'Error deleting the event.';
          setTimeout(() => (this.feedbackMessage = null), 3000);
        }
      );
    }
  }

  // Dodavanje novog događaja
  addEvent(): void {
    const { name, date, location, description } = this.newEvent;
    if (name.trim() && date.trim() && location.trim() && description.trim()) {
      this.eventService.createEvent(this.newEvent).subscribe(
        () => {
          this.feedbackMessage = 'Event successfully added!';
          this.newEvent = { name: '', date: '', location: '', description: '' }; // Reset forme
          this.loadEvents();
          setTimeout(() => (this.feedbackMessage = null), 3000);
        },
        (error) => {
          console.error('Error adding event:', error);
          this.feedbackMessage = 'Error adding the event.';
          setTimeout(() => (this.feedbackMessage = null), 3000);
        }
      );
    } else {
      this.feedbackMessage = 'Please fill out all fields!';
      setTimeout(() => (this.feedbackMessage = null), 3000);
    }
  }

  // Primjena filtera na događaje
  applyFilter(): void {
    if (!this.filterParams.name && !this.filterParams.date && !this.filterParams.location && !this.filterParams.description && !this.filterParams.id) {
      this.filteredEvents = this.events;
    } else {
      this.filteredEvents = this.events.filter((event) => {
        return (
          (!this.filterParams.name || event.name.toLowerCase().includes(this.filterParams.name.toLowerCase())) &&
          (!this.filterParams.date || event.date === this.filterParams.date) &&
          (!this.filterParams.location || event.location.toLowerCase().includes(this.filterParams.location.toLowerCase())) &&
          (!this.filterParams.description || event.description.toLowerCase().includes(this.filterParams.description.toLowerCase())) &&
          (!this.filterParams.id || event.id === this.filterParams.id)
        );
      });
    }
    this.updateMapMarkers(); // Osveži markere nakon filtriranja
  }
}
