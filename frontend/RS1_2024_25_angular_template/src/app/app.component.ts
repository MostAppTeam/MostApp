import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showNavbar = true;
  showHeroSection = true;
  showFooter = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const route = event.urlAfterRedirects;
        // Prikazujemo hero sekciju i footer samo za Home
        this.showNavbar = true; // Navigacija ostaje vidljiva
        this.showHeroSection = route === '/home';
        this.showFooter = route === '/home';
      }
    });
  }
}
