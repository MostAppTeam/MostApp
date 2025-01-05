import { Component, OnInit } from '@angular/core';
import { MuseumService } from './museum.service';
import { Museum } from './museum.model';
import { MyAuthService} from '../../../services/auth-services/my-auth.service';// Pretpostavka da postoji AuthService za provjeru uloga

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
  sortBy: string = 'name';
  sortDirection: string = 'asc';

  // User role flags
  isAdmin: boolean = false;
  isManager: boolean = false;

  constructor(
    private museumService: MuseumService,
    private authService: MyAuthService // Dodano za provjeru uloga
  ) {}

  ngOnInit(): void {
    this.loadMuseums();

    // Provjera korisničkih uloga
    this.isAdmin = this.authService.isAdmin();
    this.isManager = this.authService.isManager();
  }

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

  updateSort(): void {
    this.loadSortedMuseums();
  }

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

  addMuseum(): void {
    if (!this.isAdmin && !this.isManager) {
      this.feedbackMessage = 'You do not have permission to add a museum.';
      setTimeout(() => (this.feedbackMessage = null), 3000);
      return;
    }

    const { name, description, location, workingHours, imageUrl } = this.newMuseum;

    if (name.trim() && description.trim() && location.trim() && workingHours.trim() && imageUrl.trim()) {
      this.museumService.createMuseum(this.newMuseum).subscribe(
        (response) => {
          this.feedbackMessage = 'Museum successfully added!';
          this.newMuseum = { name: '', description: '', location: '', workingHours: '', imageUrl: '' };
          this.loadMuseums();
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

  deleteMuseum(id: number): void {
    if (!this.isAdmin && !this.isManager) {
      this.feedbackMessage = 'You do not have permission to delete a museum.';
      setTimeout(() => (this.feedbackMessage = null), 3000);
      return;
    }

    if (confirm('Are you sure you want to delete this museum?')) {
      this.museumService.deleteMuseum(id).subscribe(
        () => {
          this.feedbackMessage = 'Museum successfully deleted!';
          this.loadMuseums();
          setTimeout(() => (this.feedbackMessage = null), 3000);
        },
        (error) => {
          console.error('Error deleting museum:', error);
          this.feedbackMessage = 'Error deleting museum.';
          setTimeout(() => (this.feedbackMessage = null), 3000);
        }
      );
    }
  }

  protected readonly MyAuthService = MyAuthService;
}
