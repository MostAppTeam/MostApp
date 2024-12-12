import { Component, OnInit } from '@angular/core';
import { OfferService } from '../../../services/offer.service';
import { Offer } from './offer.model';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css'],
})
export class OffersComponent implements OnInit {
  offers: Offer[] = [];
  showBookingForm: boolean = false;
  bookingData: { name: string; guests: number } = { name: '', guests: 0 };

  constructor(private offerService: OfferService) {}

  ngOnInit(): void {
    this.fetchOffers();
  }

  // Dohvatanje ponuda sa servera
  fetchOffers(): void {
    this.offerService.getOffers().subscribe(
      (data) => {
        this.offers = data;
        console.log('Fetched offers:', data);
      },
      (error) => {
        console.error('Error fetching offers:', error);
      }
    );
  }

  // Otvaranje forme za rezervaciju
  openBookingForm(offer: Offer): void {
    this.bookingData.name = offer.offerName; // Postavi naziv ponude
    this.showBookingForm = true;
  }

  // Zatvaranje forme za rezervaciju
  closeBookingForm(): void {
    this.showBookingForm = false;
    this.bookingData = { name: '', guests: 0 }; // Reset podataka
  }

  // Slanje podataka za rezervaciju i otvaranje PayPal checkout-a
  submitBooking(): void {
    const selectedOffer = this.offers.find(
      (offer) => offer.offerName === this.bookingData.name
    );

    if (!selectedOffer) {
      console.error('Selected offer not found!');
      return;
    }

    this.offerService.createPayPalOrder(selectedOffer.offerName, selectedOffer.price).subscribe({
      next: (response) => {
        console.log('PayPal Order Created:', response);
        window.open(response.approvalUrl, '_blank'); // Otvori PayPal checkout
      },
      error: (error) => {
        console.error('Error creating PayPal order:', error);
      },
    });

    this.closeBookingForm(); // Zatvori formu
  }
}
