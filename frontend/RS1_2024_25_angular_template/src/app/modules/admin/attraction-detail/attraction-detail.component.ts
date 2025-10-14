import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AttractionsService} from '../attractions/attractions.service';
import { Attraction} from '../attractions/attractions.model';

@Component({
  selector: 'app-attraction-detail',
  templateUrl: './attraction-detail.component.html',
  styleUrls: ['./attraction-detail.component.css'],
})
export class AttractionDetailComponent implements OnInit {
  attraction: Attraction | undefined;

  constructor(private route: ActivatedRoute, private service: AttractionsService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.service.getAttraction(id).subscribe((data: any) => {
        this.attraction = data;
      });
    }
  }
}
