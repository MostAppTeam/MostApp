import { Component, OnInit } from '@angular/core';
import { ShoppingCenterService } from './shopping-center.service';
import { ShoppingCenter } from './shopping-center.model';

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
    cityID: 1, // Pretpostavka da je ID grada 1 za Mostar
  };
  feedbackMessage: string | null = null;

  constructor(private shoppingCenterService: ShoppingCenterService) {}

  ngOnInit(): void {
    this.loadShoppingCenters();
  }

  // Učitavanje postojećih trgovačkih centara
  loadShoppingCenters(): void {
    this.shoppingCenterService.getShoppingCenters().subscribe(
      (data) => {
        this.shoppingCenters = data;
      },
      (error) => {
        console.error('Greška prilikom učitavanja trgovačkih centara:', error);
        this.feedbackMessage = 'Došlo je do greške.';
        setTimeout(() => (this.feedbackMessage = null), 3000);
      }
    );
  }

  // Dodavanje novog trgovačkog centra
  addShoppingCenter(): void {
    const { name, address, workingHours, openingTime, closingTime } = this.newShoppingCenter;

    if (name && address && workingHours && openingTime && closingTime) {
      this.shoppingCenterService.createShoppingCenter(this.newShoppingCenter).subscribe(
        (response) => {
          this.feedbackMessage = 'Trgovački centar uspješno dodan!';
          this.newShoppingCenter = {
            name: '',
            address: '',
            workingHours: '',
            openingTime: '',
            closingTime: '',
            cityID: 1,
          };
          this.loadShoppingCenters(); // Osvježavanje liste centara
          setTimeout(() => (this.feedbackMessage = null), 3000);
        },
        (error) => {
          console.error('Greška prilikom dodavanja trgovačkog centra:', error);
          this.feedbackMessage = 'Došlo je do greške.';
          setTimeout(() => (this.feedbackMessage = null), 3000);
        }
      );
    } else {
      this.feedbackMessage = 'Molimo popunite sva polja!';
      setTimeout(() => (this.feedbackMessage = null), 3000);
    }
  }
}
