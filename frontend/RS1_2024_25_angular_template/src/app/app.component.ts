import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {MyAuthService} from './services/auth-services/my-auth.service';

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
  onLogout(): void {
    // Obriši token ili podatke iz lokalne memorije
    localStorage.removeItem('authToken');
    // Preusmjeri korisnika na login stranicu
    this.router.navigate(['/login']);
  }

}
