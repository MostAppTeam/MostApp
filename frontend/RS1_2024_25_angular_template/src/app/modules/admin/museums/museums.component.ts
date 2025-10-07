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

  selectedFile: File | null = null;
  selectedMuseumId: number | null = null;
  uploadedImageUrl: string | null = null;


  // Default values for sorting
  sortBy: string = 'name';
  sortDirection: string = 'asc';

  isAdmin: boolean = false;
  isManager: boolean = false;



  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }


  constructor(
    private museumService: MuseumService,
    private authService: MyAuthService // Dodano za provjeru uloga
  ) {
  }

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

    const formData = new FormData();
    formData.append("name", this.newMuseum.name);
    formData.append("description", this.newMuseum.description);
    formData.append("location", this.newMuseum.location);
    formData.append("workingHours", this.newMuseum.workingHours);

    if (this.selectedFile) {
      formData.append("file", this.selectedFile);
    }

    this.museumService.createMuseum(formData).subscribe(
      (response) => {
        this.feedbackMessage = 'Museum successfully added!';
        this.newMuseum = {name: '', description: '', location: '', workingHours: '', imageUrl: ''};
        this.loadMuseums();
        setTimeout(() => (this.feedbackMessage = null), 3000);
      },
      (error) => {
        console.error('Error adding museum:', error);
        this.feedbackMessage = 'Error adding museum.';
        setTimeout(() => (this.feedbackMessage = null), 3000);
      }
    );
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
  selectMuseum(museumId: number): void {
    this.selectedMuseumId = museumId;
  }


  uploadImage(): void {
    if (!this.selectedFile) {
      alert('Please select an image to upload!');
      return;
    }

    this.museumService.uploadImage(this.selectedFile).subscribe({
      next: (response) => {
        this.uploadedImageUrl = response.imageUrl;
        alert('Image uploaded successfully!');
        console.log('Uploaded image:', response.imageUrl);

        // update muzeja u listi
        if (this.selectedMuseumId) {
          const museum = this.museums.find(m => m.id === this.selectedMuseumId);
          if (museum) {
            museum.imageUrl = response.imageUrl;
          }
        }
      },
      error: (err) => {
        console.error('Image upload failed:', err);
        alert('Image upload failed!');
      }
    });
  }
  getMuseumImageUrl(museum: Museum): string {
    if (!museum.imageUrl) return '';
    return `https://localhost:7000${museum.imageUrl}`;
  }


  protected readonly MyAuthService = MyAuthService;
}
