import { Component, OnInit } from '@angular/core';
import { OfferService } from '../../../services/offer.service';
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

  constructor(private offerService: OfferService) {}

  ngOnInit(): void {
    this.fetchOffers();
  }

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

    // Putanja do slike Starog Mosta
    const imgUrl = './assets/images/stari-most.PNG';
    const img = new Image();
    img.src = imgUrl;

    img.onload = () => {
      // Dodavanje slike u PDF
      doc.addImage(img, 'PNG', 15, 10, 50, 30);

      // Naslov
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('Booking Confirmation', 105, 60, { align: 'center' });

      // Detalji rezervacije
      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      doc.text(`Offer Name: ${this.bookingData.name}`, 15, 90);
      doc.text(`Guests: ${this.bookingData.guests}`, 15, 100);
      doc.text(`Booking Date: ${new Date().toLocaleDateString()}`, 15, 110);

      // Sačuvaj PDF
      doc.save(`Report_${this.selectedOfferId}.pdf`);
    };

    // Obrada greške ako slika ne može biti učitana
    img.onerror = () => {
      console.error('Slika nije učitana. Proverite putanju ili format slike:', imgUrl);
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

    this.offerService.createPayPalOrder(selectedOffer.offerName, selectedOffer.price).subscribe({
      next: (response) => {
        console.log('PayPal Order Created:', response);
        window.open(response.approvalUrl, '_blank');
      },
      error: (error) => {
        console.error('Error creating PayPal order:', error);
      },
    });

    this.closeBookingForm();
  }
}
