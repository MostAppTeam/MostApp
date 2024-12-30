import { Component, OnInit } from '@angular/core';
import { OfferService } from './offer.service';
import { Offer } from './offer.model';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css'],
})
export class OffersComponent implements OnInit {
  offers: Offer[] = [];
  showBookingForm: boolean = false;
  bookingData: { name: string; guests: number } = { name: '', guests: 0 };
  selectedOfferId: number | null = null;

  filters: { minPrice?: number; maxPrice?: number } = {};
  sortOrder: string = 'asc'; // Defaultno sortiranje

  constructor(private offerService: OfferService) {}

  ngOnInit(): void {
    this.fetchOffers();
  }

  fetchOffers(): void {
    this.offerService.getOffers(this.filters || {}).subscribe(
      (data) => {
        this.offers = data;
        this.sortOffers(); // Primijeni sortiranje nakon fetchanja
        console.log('Fetched offers:', data);
      },
      (error) => {
        console.error('Error fetching offers:', error);
        alert('Failed to fetch offers. Please try again later.');
      }
    );
  }

  applyFilters(): void {
    this.fetchOffers();
  }

  applySorting(): void {
    this.sortOffers();
  }

  sortOffers(): void {
    this.offers.sort((a, b) => {
      if (this.sortOrder === 'asc') {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
  }

  openBookingForm(offer: Offer): void {
    this.bookingData.name = offer.offerName;
    this.selectedOfferId = offer.id;
    this.showBookingForm = true;
  }

  closeBookingForm(): void {
    this.showBookingForm = false;
    this.bookingData = { name: '', guests: 0 };
    this.selectedOfferId = null;
  }

  downloadPDF(): void {
    const doc = new jsPDF();
    const imgUrl = './assets/images/stari-most.PNG';
    const img = new Image();
    img.src = imgUrl;

    img.onload = () => {
      doc.addImage(img, 'PNG', 15, 10, 50, 30);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('Booking Confirmation', 105, 60, { align: 'center' });
      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      doc.text(`Offer Name: ${this.bookingData.name}`, 15, 90);
      doc.text(`Guests: ${this.bookingData.guests}`, 15, 100);
      doc.text(`Booking Date: ${new Date().toLocaleDateString()}`, 15, 110);
      doc.save(`Report_${this.selectedOfferId}.pdf`);
    };

    img.onerror = () => {
      console.error('Failed to load image:', imgUrl);
      alert('Failed to load image for the PDF.');
    };
  }

  submitBooking(): void {
    const selectedOffer = this.offers.find(
      (offer) => offer.offerName === this.bookingData.name
    );

    if (!selectedOffer) {
      console.error('Selected offer not found!');
      return;
    }

    // Autosave podaci u localStorage
    localStorage.setItem('bookingData', JSON.stringify(this.bookingData));

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

  onBookingDataChange(): void {
    console.log('Booking data changed:', this.bookingData);

    // Autosave u localStorage
    localStorage.setItem('bookingData', JSON.stringify(this.bookingData));
  }


}
