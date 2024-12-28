import { Component, OnInit } from '@angular/core';
import { EventService } from './event.service';
import { Event } from './event.model';
import * as L from 'leaflet';
import { MyAuthService } from '../../../services/auth-services/my-auth.service';

@Component({
  selector: 'app-events',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  newEvent: Omit<Event, 'id'> = {
    name: '',
    date: '',
    location: '',
    description: '',
  };
  feedbackMessage: string | null = null;
  filterParams = {
    name: '',
    date: '',
    location: '',
    description: '',
    id: null,
  };

  private map!: L.Map;
  private markers: L.Marker[] = [];
  isAdminOrManager: boolean = false;
  loggedInUser: any = null;

  constructor(
    private eventService: EventService,
    private authService: MyAuthService
  ) {}

  ngOnInit(): void {
    this.initializeMap();
    this.loadEvents();
    this.checkUserPermissions(); // Check user permissions
  }

  // Check user role and permissions
  checkUserPermissions(): void {
    const user = this.authService.getLoggedInUser();
    if (user) {
      this.loggedInUser = user;
      this.isAdminOrManager = user.isAdmin || user.isManager;
    } else {
      this.loggedInUser = { username: 'Guest', role: 'Guest' };
    }
  }

  sortOption: string = 'nameAsc';

  applySorting(): void {
    switch (this.sortOption) {
      case 'nameAsc':
        this.filteredEvents.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        this.filteredEvents.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'dateAsc':
        this.filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'dateDesc':
        this.filteredEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
    }
    this.updateMapMarkers();
  }


  // Leaflet map initialization
  private initializeMap(): void {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Map container not found!');
      return;
    }

    this.map = L.map('map').setView([43.3438, 17.8081], 13); // Mostar coordinates

    // OpenStreetMap layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    // Click event for adding location
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.newEvent.location = `${lat.toFixed(5)},${lng.toFixed(5)}`;
      const marker = L.marker([lat, lng]).addTo(this.map);
      marker.bindPopup('New Event Location').openPopup();
    });
  }

  // Update markers based on filtered events
  private updateMapMarkers(): void {
    this.markers.forEach((marker) => this.map.removeLayer(marker));
    this.markers = [];

    this.filteredEvents.forEach((event) => {
      const [lat, lng] = event.location.split(',').map((coord) => parseFloat(coord.trim()));
      if (isNaN(lat) || isNaN(lng)) {
        console.error(`Invalid coordinates for event: ${event.name}, location: ${event.location}`);
        return;
      }

      const marker = L.marker([lat, lng]).addTo(this.map);
      marker.bindPopup(`<b>${event.name}</b><br>${event.description}`);
      this.markers.push(marker);
    });
  }

  // Load events
  loadEvents(): void {
    this.eventService.getEvents().subscribe(
      (data) => {
        this.events = data;
        this.filteredEvents = [...this.events];
        this.updateMapMarkers();
      },
      (error) => {
        console.error('Error loading events:', error);
        this.feedbackMessage = 'Error loading events.';
        setTimeout(() => (this.feedbackMessage = null), 3000);
      }
    );
  }

  // Apply filters
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
    this.updateMapMarkers();
  }

  // Edit event
  editEvent(event: Event): void {
    if (!this.isAdminOrManager) {
      this.feedbackMessage = 'You do not have permission to edit events.';
      setTimeout(() => (this.feedbackMessage = null), 3000);
      return;
    }

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

  // Delete event
  deleteEvent(id: number): void {
    if (!this.isAdminOrManager) {
      this.feedbackMessage = 'You do not have permission to delete events.';
      setTimeout(() => (this.feedbackMessage = null), 3000);
      return;
    }

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

  // Add event
  addEvent(): void {
    if (!this.isAdminOrManager) {
      this.feedbackMessage = 'You do not have permission to add events.';
      setTimeout(() => (this.feedbackMessage = null), 3000);
      return;
    }

    const { name, date, location, description } = this.newEvent;
    if (name.trim() && date.trim() && location.trim() && description.trim()) {
      this.eventService.createEvent(this.newEvent).subscribe(
        () => {
          this.feedbackMessage = 'Event successfully added!';
          this.newEvent = { name: '', date: '', location: '', description: '' };
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
}
