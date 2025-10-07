import { Component, OnInit } from '@angular/core';
import { ShoppingCenterService } from './shopping-center.service';
import { ShoppingCenter } from './shopping-center.model';
import { MyAuthService } from '../../../services/auth-services/my-auth.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'; // Dodano za drag-and-drop

@Component({
  selector: 'app-shopping-centers',
  templateUrl: './shopping-centers.component.html',
  styleUrls: ['./shopping-centers.component.css'],
})
export class ShoppingCentersComponent implements OnInit {
  shoppingCenters: ShoppingCenter[] = [];
  filteredShoppingCenters: ShoppingCenter[] = [];
  searchQuery: string = '';
  sortBy: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedFile: File | null = null;
  selectedShoppingCenterId: number | null = null;

  uploadedImageUrl: string | null = null;


  newShoppingCenter: Omit<ShoppingCenter, 'id' | 'city'> = {
    name: '',
    address: '',
    workingHours: '',
    openingTime: '',
    closingTime: '',
    cityID: 1,
  };

  feedbackMessage: string | null = null;
  isAdminOrManager: boolean = false;
  loggedInUser: any = null;

  constructor(
    private shoppingCenterService: ShoppingCenterService,
    private authService: MyAuthService
  ) {}

  ngOnInit(): void {
    this.loadShoppingCenters();
    this.checkUserPermissions();
  }

  checkUserPermissions(): void {
    const user = this.authService.getLoggedInUser();
    if (user) {
      this.loggedInUser = user;
      this.isAdminOrManager = this.authService.isAdmin() || this.authService.isManager();
    } else {
      this.loggedInUser = { username: 'Guest', role: 'Guest' };
      this.isAdminOrManager = false;
    }
  }

  loadShoppingCenters(): void {
    this.shoppingCenterService.getShoppingCenters(this.sortBy, this.sortDirection).subscribe(
      (data) => {
        this.shoppingCenters = data;
        this.applyFilters();
      },
      (error) => {
        console.error('Error loading shopping centers:', error);
        this.feedbackMessage = 'An error occurred while loading shopping centers.';
        setTimeout(() => (this.feedbackMessage = null), 3000);
      }
    );
  }

  applyFilters(): void {
    this.filteredShoppingCenters = this.shoppingCenters
      .filter(center => center.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (this.sortBy === 'name') {
          return this.sortDirection === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (this.sortBy === 'address') {
          return this.sortDirection === 'asc'
            ? a.address.localeCompare(b.address)
            : b.address.localeCompare(a.address);
        } else if (this.sortBy === 'workingHours') {
          return this.sortDirection === 'asc'
            ? a.workingHours.localeCompare(b.workingHours)
            : b.workingHours.localeCompare(a.workingHours);
        }
        return 0;
      });
  }

  addShoppingCenter(): void {
    if (!this.isAdminOrManager) {
      this.feedbackMessage = 'You do not have permission to add shopping centers.';
      setTimeout(() => (this.feedbackMessage = null), 3000);
      return;
    }

    const { name, address, workingHours, openingTime, closingTime } = this.newShoppingCenter;

    if (name && address && workingHours && openingTime && closingTime) {
      this.shoppingCenterService.createShoppingCenter(this.newShoppingCenter).subscribe(
        () => {
          this.feedbackMessage = 'Shopping center added successfully!';
          this.newShoppingCenter = {
            name: '',
            address: '',
            workingHours: '',
            openingTime: '',
            closingTime: '',
            cityID: 1,
          };
          this.loadShoppingCenters();
          setTimeout(() => (this.feedbackMessage = null), 3000);
        },
        (error) => {
          console.error('Error adding shopping center:', error);
          this.feedbackMessage = 'An error occurred while adding the shopping center.';
          setTimeout(() => (this.feedbackMessage = null), 3000);
        }
      );
    } else {
      this.feedbackMessage = 'Please fill out all fields!';
      setTimeout(() => (this.feedbackMessage = null), 3000);
    }
  }

  deleteShoppingCenter(centerId: number): void {
    if (!this.isAdminOrManager) {
      this.feedbackMessage = 'You do not have permission to delete shopping centers.';
      setTimeout(() => (this.feedbackMessage = null), 3000);
      return;
    }

    this.shoppingCenterService.deleteShoppingCenter(centerId).subscribe(
      () => {
        this.feedbackMessage = 'Shopping center deleted successfully!';
        this.loadShoppingCenters();
        setTimeout(() => (this.feedbackMessage = null), 3000);
      },
      (error) => {
        console.error('Error deleting shopping center:', error);
        this.feedbackMessage = 'An error occurred while deleting the shopping center.';
        setTimeout(() => (this.feedbackMessage = null), 3000);
      }
    );
  }

  drop(event: CdkDragDrop<ShoppingCenter[]>): void {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(
        this.filteredShoppingCenters,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  updateSort(): void {
    this.loadShoppingCenters();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  selectShoppingCenter(centerId: number): void {
    this.selectedShoppingCenterId = centerId;
  }
  getShoppingCenterImageUrl(center: ShoppingCenter): string {
    if (!center.imageUrl) return '';
    return `https://localhost:7000${center.imageUrl}`;
  }

  uploadImage(): void {
    if (!this.selectedFile) {
      alert('Please select an image to upload!');
      return;
    }

    this.shoppingCenterService.uploadImage(this.selectedFile).subscribe({
      next: (response) => {
        this.uploadedImageUrl = response.imageUrl;
        alert('Image uploaded successfully!');
        console.log('Uploaded image:', response.imageUrl);

        // Update u listi shopping centara
        if (this.selectedShoppingCenterId) {
          const sc = this.shoppingCenters.find(s => s.id === this.selectedShoppingCenterId);
          if (sc) {
            sc.imageUrl = response.imageUrl;
          }
        }
      },
      error: (err) => {
        console.error('Image upload failed:', err);
        alert('Image upload failed!');
      }
    });
  }


}
