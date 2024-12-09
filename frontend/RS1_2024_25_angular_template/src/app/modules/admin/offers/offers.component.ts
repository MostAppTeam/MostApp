import { Component, OnInit } from '@angular/core';
import { OfferService } from '../../../services/offer.service'; // Proveri putanju do servisa
import { Offer } from './offer.model';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css'],
})export class OffersComponent implements OnInit {
  offers: Offer[] = [];

  constructor(private offerService: OfferService) {}

  ngOnInit(): void {
    this.fetchOffers();
  }
  fetchOffers(): void {
    this.offerService.getOffers().subscribe(
      (data) => {
        console.log('Fetched offers:', data); // Dodaj log za ispis podataka
        this.offers = data;
      },
      (error) => {
        console.error('Error fetching offers:', error); // Loguj grešku
      }
    );
  }

}
