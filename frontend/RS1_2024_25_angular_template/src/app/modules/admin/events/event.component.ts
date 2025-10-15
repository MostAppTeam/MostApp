import { Component, OnInit } from '@angular/core';
import { EventService } from './event.service';
import { Event } from './event.model';
import * as L from 'leaflet';
import { MyAuthService } from '../../../services/auth-services/my-auth.service';
import jsPDF from 'jspdf';

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
    // imageUrl je opciono; popunjavamo nakon uploada
  };

  feedbackMessage: string | null = null;
  filterParams = {
    name: '',
    date: '',
    location: '',
    description: '',
    id: null as number | null,
  };

  // --- Upload / selekcija (kao offers) ---
  selectedFile: File | null = null;
  uploadedImageUrl: string | null = null;
  selectedEventId: number | null = null;

  // --- Sort ---
  sortOption: string = 'nameAsc';

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
    this.checkUserPermissions();
  }

  // --- Permissions ---
  checkUserPermissions(): void {
    const user = this.authService.getLoggedInUser();
    if (user) {
      this.loggedInUser = user;
      this.isAdminOrManager = user.isAdmin || user.isManager;
    } else {
      this.loggedInUser = { username: 'Guest', role: 'Guest' };
    }
  }

  // --- Sort ---
  applySorting(): void {
    switch (this.sortOption) {
      case 'nameAsc':
        this.filteredEvents.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        this.filteredEvents.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'dateAsc':
        this.filteredEvents.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case 'dateDesc':
        this.filteredEvents.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
    }
    this.updateMapMarkers();
  }

  // --- Leaflet map ---
  private initializeMap(): void {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Map container not found!');
      return;
    }

    this.map = L.map('map').setView([43.3438, 17.8081], 13); // Mostar

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    // click -> set newEvent.location
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.newEvent.location = `${lat.toFixed(5)},${lng.toFixed(5)}`;
      const marker = L.marker([lat, lng]).addTo(this.map);
      marker.bindPopup('New Event Location').openPopup();
    });
  }

  private updateMapMarkers(): void {
    this.markers.forEach((m) => this.map.removeLayer(m));
    this.markers = [];

    this.filteredEvents.forEach((ev) => {
      const [lat, lng] = ev.location.split(',').map((c) => parseFloat(c.trim()));
      if (isNaN(lat) || isNaN(lng)) {
        console.error(`Invalid coordinates for event: ${ev.name}, location: ${ev.location}`);
        return;
      }
      const marker = L.marker([lat, lng]).addTo(this.map);
      marker.bindPopup(`<b>${ev.name}</b><br>${ev.description}`);
      this.markers.push(marker);
    });
  }

  // --- Load ---
  loadEvents(): void {
    this.eventService.getEvents().subscribe(
      (data) => {
        this.events = data;
        this.filteredEvents = [...this.events];
        this.applySorting(); // zadrži trenutno sortiranje
        this.updateMapMarkers();
      },
      (error) => {
        console.error('Error loading events:', error);
        this.feedbackMessage = 'Error loading events.';
        setTimeout(() => (this.feedbackMessage = null), 3000);
      }
    );
  }

  // --- Filter ---
  applyFilter(): void {
    if (
      !this.filterParams.name &&
      !this.filterParams.date &&
      !this.filterParams.location &&
      !this.filterParams.description &&
      !this.filterParams.id
    ) {
      this.filteredEvents = this.events;
    } else {
      this.filteredEvents = this.events.filter((ev) => {
        return (
          (!this.filterParams.name ||
            ev.name.toLowerCase().includes(this.filterParams.name.toLowerCase())) &&
          (!this.filterParams.date || ev.date === this.filterParams.date) &&
          (!this.filterParams.location ||
            ev.location.toLowerCase().includes(this.filterParams.location.toLowerCase())) &&
          (!this.filterParams.description ||
            ev.description.toLowerCase().includes(this.filterParams.description.toLowerCase())) &&
          (!this.filterParams.id || ev.id === this.filterParams.id)
        );
      });
    }
    this.applySorting();
    this.updateMapMarkers();
  }

  // --- Create ---
  addEvent(): void {
    if (!this.isAdminOrManager) {
      this.feedbackMessage = 'You do not have permission to add events.';
      setTimeout(() => (this.feedbackMessage = null), 3000);
      return;
    }

    const { name, date, location, description } = this.newEvent;
    if (!name || !date || !location || !description) {
      this.feedbackMessage = 'Please fill out all fields!';
      setTimeout(() => (this.feedbackMessage = null), 3000);
      return;
    }

    this.eventService.createEvent(this.newEvent).subscribe(
      () => {
        this.feedbackMessage = 'Event successfully added!';
        this.newEvent = { name: '', date: '', location: '', description: '' };
        this.selectedFile = null;
        this.uploadedImageUrl = null;
        this.loadEvents();
        setTimeout(() => (this.feedbackMessage = null), 3000);
      },
      (error) => {
        console.error('Error adding event:', error);
        this.feedbackMessage = 'Error adding the event.';
        setTimeout(() => (this.feedbackMessage = null), 3000);
      }
    );
  }

  // --- Update ---
  editEvent(event: Event): void {
    if (!this.isAdminOrManager) {
      this.feedbackMessage = 'You do not have permission to edit events.';
      setTimeout(() => (this.feedbackMessage = null), 3000);
      return;
    }

    this.eventService.updateEvent(event).subscribe(
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

  // --- Delete ---
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

  // --- Upload helpers (isto kao offers) ---

  /** Za polje u formi "Add Event" */
  onNewEventFileSelected(event: any): void {
    const file = event?.target?.files?.[0] as File | undefined;
    if (!file) {
      this.selectedFile = null;
      return;
    }
    this.selectedFile = file;

    this.eventService.uploadImage(this.selectedFile).subscribe({
      next: (res) => {
        this.uploadedImageUrl = res.imageUrl;
        // upiši URL u formu za novi event
        (this.newEvent as any).imageUrl = res.imageUrl;
        alert('Image uploaded successfully!');
        console.log('Uploaded image:', res.imageUrl);
      },
      error: (err) => {
        console.error('Image upload failed:', err);
        alert('Image upload failed!');
      },
    });
  }

  /** Za promjenu slike na postojećoj kartici eventa (iz HTML-a: onEventImageChange($event, event)) */
  onEventImageChange(eventDom: any, ev: Event): void {
    const file = eventDom?.target?.files?.[0] as File | undefined;
    if (!file) return;

    this.eventService.uploadImage(file).subscribe({
      next: (res) => {
        // ako backend ima PUT /{id}/image
        this.eventService.setEventImage(ev.id, res.imageUrl).subscribe({
          next: () => {
            // ažuriraj lokalno
            const found = this.filteredEvents.find((x) => x.id === ev.id);
            if (found) found.imageUrl = res.imageUrl;
            const found2 = this.events.find((x) => x.id === ev.id);
            if (found2) found2.imageUrl = res.imageUrl;
            alert('Event image updated!');
          },
          error: (err) => {
            console.error('Failed to set image on event:', err);
            alert('Failed to set event image!');
          },
        });
      },
      error: (err) => {
        console.error('Image upload failed:', err);
        alert('Image upload failed!');
      },
    });
  }

  /** Ručni upload ako ti treba posebna akcija */
  uploadImage(): void {
    if (!this.selectedFile) {
      alert('Please select an image to upload!');
      return;
    }

    this.eventService.uploadImage(this.selectedFile).subscribe({
      next: (res) => {
        this.uploadedImageUrl = res.imageUrl;
        alert('Image uploaded successfully!');
        console.log('Uploaded image:', res.imageUrl);

        if (this.selectedEventId) {
          // ažuriraj prikaz
          const ev = this.events.find((x) => x.id === this.selectedEventId);
          if (ev) ev.imageUrl = res.imageUrl;
          const ev2 = this.filteredEvents.find((x) => x.id === this.selectedEventId);
          if (ev2) ev2.imageUrl = res.imageUrl;
        } else {
          // ako je za novi event
          (this.newEvent as any).imageUrl = res.imageUrl;
        }
      },
      error: (err) => {
        console.error('Image upload failed:', err);
        alert('Image upload failed!');
      },
    });
  }

  /** Selektuj event (ako želiš koristiti ručni upload dugme) */
  selectEventForImage(ev: Event): void {
    this.selectedEventId = ev.id;
  }

  /** Helper: vrati absolutni URL slike za <img> */
  getEventImageUrl(ev: Event): string {
    const url = ev.imageUrl || '';
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://localhost:7000${url}`;
  }

  // --- PDF ---
  downloadEventsPDF(): void {
    const doc = new jsPDF();
    const imgUrl = './assets/images/stari-most.PNG';
    const img = new Image();
    img.src = imgUrl;

    img.onload = () => {
      doc.addImage(img, 'PNG', 15, 10, 50, 30);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('Events Report', 105, 60, { align: 'center' });

      doc.setFontSize(14);
      let y = 80;

      this.filteredEvents.forEach((event, index) => {
        doc.text(`Event ${index + 1}:`, 15, y);
        doc.text(`Name: ${event.name}`, 15, y + 10);
        doc.text(`Date: ${event.date}`, 15, y + 20);
        doc.text(`Location: ${event.location}`, 15, y + 30);
        doc.text(`Description: ${event.description}`, 15, y + 40);
        y += 50;
      });

      doc.save('Events_Report.pdf');
    };

    img.onerror = () => {
      console.error('Failed to load image:', imgUrl);
      alert('Failed to load image for the PDF.');
    };
  }
}
