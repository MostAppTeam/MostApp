import { Component, OnInit } from '@angular/core';
import { ShoppingCenterService } from './shopping-center.service';
import { ShoppingCenter } from './shopping-center.model';
import { MyAuthService } from '../../../services/auth-services/my-auth.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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

  uploadedImageUrl: string | null = null; // <-- OVDJE

  newShoppingCenter: {
    name: string;
    address: string;
    workingHours: string;
    openingTimeString: string; // HH:MM
    closingTimeString: string; // HH:MM
    cityID: number;
  } = {
    name: '',
    address: '',
    workingHours: '',
    openingTimeString: '',
    closingTimeString: '',
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
        if (this.sortBy === 'name') return this.sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        if (this.sortBy === 'address') return this.sortDirection === 'asc' ? a.address.localeCompare(b.address) : b.address.localeCompare(a.address);
        if (this.sortBy === 'workingHours') return this.sortDirection === 'asc' ? a.workingHours.localeCompare(b.workingHours) : b.workingHours.localeCompare(a.workingHours);
        return 0;
      });
  }

  private timeStringToTicks(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return (h * 3600 + m * 60) * 10000000;
  }

  addShoppingCenter(): void {
    if (!this.isAdminOrManager) {
      this.feedbackMessage = 'You do not have permission.';
      return;
    }

    const { name, address, workingHours, openingTimeString, closingTimeString, cityID } = this.newShoppingCenter;
    if (!name || !address || !workingHours || !openingTimeString || !closingTimeString) {
      this.feedbackMessage = 'Please fill all fields!';
      return;
    }

    const formData = new FormData();
    formData.append("Name", this.newShoppingCenter.name);
    formData.append("Address", this.newShoppingCenter.address);
    formData.append("WorkingHours", this.newShoppingCenter.workingHours);
    formData.append("OpeningTime", this.newShoppingCenter.openingTimeString); // HH:mm
    formData.append("ClosingTime", this.newShoppingCenter.closingTimeString); // HH:mm
    formData.append("CityID", this.newShoppingCenter.cityID.toString());
    if (this.selectedFile) {
      formData.append("ImageFile", this.selectedFile); // MUST match DTO
    }



    console.log('FormData sent to backend:', formData);

    this.shoppingCenterService.createShoppingCenter(formData).subscribe(
      () => {
        this.feedbackMessage = 'Shopping center added successfully!';
        this.newShoppingCenter = { name: '', address: '', workingHours: '', openingTimeString: '', closingTimeString: '', cityID: 1 };
        this.selectedFile = null;
        this.loadShoppingCenters();
        setTimeout(() => (this.feedbackMessage = null), 3000);
      },
      (error) => {
        console.error('Error adding shopping center:', error);
        this.feedbackMessage = 'Failed to add shopping center.';
        setTimeout(() => (this.feedbackMessage = null), 3000);
      }
    );
  }



  deleteShoppingCenter(centerId: number): void {
    if (!this.isAdminOrManager) {
      this.feedbackMessage = 'You do not have permission to delete shopping centers.';
      setTimeout(() => (this.feedbackMessage = null), 3000);
      return;
    }

    if (confirm('Are you sure you want to delete this shopping center?')) {
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
  }

  drop(event: CdkDragDrop<ShoppingCenter[]>): void {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.filteredShoppingCenters, event.previousIndex, event.currentIndex);
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
        this.selectedFile = null;
        this.uploadedImageUrl = response.imageUrl;
        alert('Image uploaded successfully!');
        console.log('Uploaded image:', response.imageUrl);

        if (this.selectedShoppingCenterId) {
          const sc = this.shoppingCenters.find(s => s.id === this.selectedShoppingCenterId);
          if (sc) sc.imageUrl = response.imageUrl;
        }
      },
      error: (err) => {
        console.error('Image upload failed:', err);
        alert('Image upload failed!');
      }
    });
  }
  convertToDateTimeString(timeString: string): string {
    // Pretpostavlja da unos ima format "10:00 AM" ili "22:00"
    const now = new Date();
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    now.setHours(hours);
    now.setMinutes(minutes || 0);
    now.setSeconds(0);
    now.setMilliseconds(0);

    return now.toISOString(); // format koji .NET DateTime očekuje
  }


}
