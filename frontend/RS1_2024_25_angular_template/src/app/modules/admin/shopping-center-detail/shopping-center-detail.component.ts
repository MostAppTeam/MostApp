import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShoppingCenterService } from '../shopping-centers/shopping-center.service';
import { ShoppingCenter } from '../shopping-centers/shopping-center.model';

@Component({
  selector: 'app-shopping-center-detail',
  templateUrl: './shopping-center-detail.component.html',
  styleUrls: ['./shopping-center-detail.component.css'],
})
export class ShoppingCenterDetailComponent implements OnInit {
  shoppingCenter: ShoppingCenter | undefined;

  constructor(
    private route: ActivatedRoute,
    private shoppingCenterService: ShoppingCenterService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.shoppingCenterService.getShoppingCenterById(id).subscribe({
        next: (data) => (this.shoppingCenter = data),
        error: (err) => console.error('Error loading shopping center details:', err),
      });
    }
  }

  getImageUrl(): string {
    return this.shoppingCenter?.imageUrl
      ? `https://localhost:7000${this.shoppingCenter.imageUrl}`
      : '';
  }
}
