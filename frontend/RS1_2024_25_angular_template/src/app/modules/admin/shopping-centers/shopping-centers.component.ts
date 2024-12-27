import { Component, OnInit } from '@angular/core';
import { ShoppingCenterService } from './shopping-center.service';
import { ShoppingCenter } from './shopping-center.model';
import { MyAuthService } from '../../../services/auth-services/my-auth.service';

@Component({
  selector: 'app-shopping-centers',
  templateUrl: './shopping-centers.component.html',
  styleUrls: ['./shopping-centers.component.css'],
})
export class ShoppingCentersComponent implements OnInit {
  shoppingCenters: ShoppingCenter[] = [];
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

  // Load shopping centers
  loadShoppingCenters(): void {
    this.shoppingCenterService.getShoppingCenters().subscribe(
      (data) => {
        this.shoppingCenters = data;
      },
      (error) => {
        console.error('Error loading shopping centers:', error);
        this.feedbackMessage = 'An error occurred while loading shopping centers.';
        setTimeout(() => (this.feedbackMessage = null), 3000);
      }
    );
  }

  // Add a shopping center
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

  // Delete a shopping center
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
}
