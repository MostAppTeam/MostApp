import { Component, OnInit } from '@angular/core';
import { RecommendationService, Recommendation } from './recommendation.service';

@Component({
  selector: 'app-user-recommendations',
  templateUrl: './user-recommendations.component.html',
  styleUrls: ['./user-recommendations.component.css'],
})
export class UserRecommendationsComponent implements OnInit {
  recommendations: Recommendation[] = [];
  userId = 1;

  constructor(private recommendationService: RecommendationService) {}

  ngOnInit(): void {
    this.loadRecommendations();
  }

  loadRecommendations(): void {
    this.recommendationService.getRecommendations(this.userId).subscribe(
      (data) => (this.recommendations = data),
      (error) => console.error('Error loading recommendations:', error)
    );
  }
}
