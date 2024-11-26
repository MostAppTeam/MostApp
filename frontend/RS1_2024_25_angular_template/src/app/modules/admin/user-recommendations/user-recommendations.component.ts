import { Component, OnInit } from '@angular/core';
import { RecommendationService } from './recommendation.service';





@Component({
  selector: 'app-user-recommendations',
  templateUrl: './user-recommendations.component.html',
  styleUrls: ['./user-recommendations.component.css'],
})
export class UserRecommendationsComponent implements OnInit {
  recommendations: any[] = [];
  userId = 1; // Hardkodirani ID korisnika za testiranje

  constructor(private recommendationService: RecommendationService) {}

  ngOnInit(): void {
    this.loadRecommendations();
  }

  loadRecommendations(): void {
    this.recommendationService.getRecommendations(this.userId).subscribe(
      (data: any[]) => {
        this.recommendations = data;
      },
      (error: any) => {
        console.error('Error loading recommendations', error);
      }
    );
  }
}
