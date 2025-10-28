import { Component, OnInit } from '@angular/core';
import { MuseumService } from './museum.service';
import { Museum } from './museum.model';
import { MyAuthService } from '../../../services/auth-services/my-auth.service';

// PDF dodaci
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-museums',
  templateUrl: './museums.component.html',
  styleUrls: ['./museums.component.css'],
})
export class MuseumsComponent implements OnInit {
  museums: Museum[] = [];
  newMuseum: Omit<Museum, 'id'> = {
    name: '',
    description: '',
    location: '',
    workingHours: '',
    imageUrl: '',
  };
  feedbackMessage: string | null = null;

  selectedFile: File | null = null;
  selectedMuseumId: number | null = null;
  uploadedImageUrl: string | null = null;
  // === Lightbox / Zoom ===
  viewerOpen = false;
  viewerImageUrl = '';
  zoomScale = 1;
  zoomTranslate = { x: 0, y: 0 };
  isDragging = false;
  lastMousePos = { x: 0, y: 0 };


  // Default values for sorting
  sortBy: string = 'name';
  sortDirection: string = 'asc';

  isAdmin: boolean = false;
  isManager: boolean = false;

  constructor(
    private museumService: MuseumService,
    private authService: MyAuthService
  ) {}

  ngOnInit(): void {
    this.loadMuseums();

    // Provjera korisničkih uloga
    this.isAdmin = this.authService.isAdmin();
    this.isManager = this.authService.isManager();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  loadMuseums(): void {
    this.museumService.getMuseums().subscribe(
      (data) => (this.museums = data),
      (error) => {
        console.error('Error loading museums:', error);
        this.feedbackMessage = 'Error loading museums.';
        setTimeout(() => (this.feedbackMessage = null), 3000);
      }
    );
  }

  updateSort(): void {
    this.loadSortedMuseums();
  }

  loadSortedMuseums(): void {
    this.museumService.getSortedMuseums(this.sortBy, this.sortDirection).subscribe(
      (data) => (this.museums = data),
      (error) => {
        console.error('Error sorting museums:', error);
        this.feedbackMessage = 'Error loading sorted museums.';
        setTimeout(() => (this.feedbackMessage = null), 3000);
      }
    );
  }

  addMuseum(): void {
    if (!this.isAdmin && !this.isManager) {
      this.feedbackMessage = 'You do not have permission to add a museum.';
      setTimeout(() => (this.feedbackMessage = null), 3000);
      return;
    }

    if (
      !this.newMuseum.name.trim() ||
      !this.newMuseum.description.trim() ||
      !this.newMuseum.location.trim() ||
      !this.newMuseum.workingHours.trim()
    ) {
      this.feedbackMessage = 'Please fill out all fields!';
      setTimeout(() => (this.feedbackMessage = null), 3000);
      return;
    }

    const formData = new FormData();
    formData.append('name', this.newMuseum.name);
    formData.append('description', this.newMuseum.description);
    formData.append('location', this.newMuseum.location);
    formData.append('workingHours', this.newMuseum.workingHours);

    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile); // ime mora odgovarati backend DTO-u
    }

    this.museumService.createMuseum(formData).subscribe(
      () => {
        this.feedbackMessage = 'Museum successfully added!';
        this.newMuseum = { name: '', description: '', location: '', workingHours: '', imageUrl: '' };
        this.selectedFile = null;
        this.loadMuseums();
        setTimeout(() => (this.feedbackMessage = null), 3000);
      },
      (error) => {
        console.error('Error adding museum:', error);
        this.feedbackMessage = 'Error adding museum.';
        setTimeout(() => (this.feedbackMessage = null), 3000);
      }
    );
  }

  deleteMuseum(id: number): void {
    if (!this.isAdmin && !this.isManager) {
      this.feedbackMessage = 'You do not have permission to delete a museum.';
      setTimeout(() => (this.feedbackMessage = null), 3000);
      return;
    }

    if (confirm('Are you sure you want to delete this museum?')) {
      this.museumService.deleteMuseum(id).subscribe(
        () => {
          this.feedbackMessage = 'Museum successfully deleted!';
          this.loadMuseums();
          setTimeout(() => (this.feedbackMessage = null), 3000);
        },
        (error) => {
          console.error('Error deleting museum:', error);
          this.feedbackMessage = 'Error deleting museum.';
          setTimeout(() => (this.feedbackMessage = null), 3000);
        }
      );
    }
  }

  selectMuseum(museumId: number): void {
    this.selectedMuseumId = museumId;
  }

  uploadImage(): void {
    if (!this.selectedFile) {
      alert('Please select an image to upload!');
      return;
    }

    this.museumService.uploadImage(this.selectedFile).subscribe({
      next: (response) => {
        this.uploadedImageUrl = response.imageUrl;
        alert('Image uploaded successfully!');
        console.log('Uploaded image:', response.imageUrl);

        if (this.selectedMuseumId) {
          const museum = this.museums.find(m => m.id === this.selectedMuseumId);
          if (museum) museum.imageUrl = response.imageUrl;
        }
      },
      error: (err) => {
        console.error('Image upload failed:', err);
        alert('Image upload failed!');
      }
    });
  }

  getMuseumImageUrl(museum: Museum): string {
    return museum.imageUrl ? `https://localhost:7000${museum.imageUrl}` : '';
  }

  private async imageUrlToDataUrl(url: string): Promise<string | null> {
    try {
      const res = await fetch(url, { mode: 'cors' });
      const blob = await res.blob();
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  }

  private addHeaderFooter(doc: jsPDF) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Header
    doc.setDrawColor(230);
    doc.line(14, 16, pageWidth - 14, 16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('MostApp — Museums', 14, 12);

    // Footer with pagination
    const pageCount = (doc as any).internal.getNumberOfPages?.() || 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setDrawColor(230);
      doc.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pageHeight - 10, { align: 'right' });
    }
  }

  async downloadMuseumPdf(museum: Museum) {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(museum.name || 'Museum', 14, 28);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    const startY = 36;
    const detailLines = [
      `Location: ${museum.location || '-'}`,
      `Working Hours: ${museum.workingHours || '-'}`,
      '',
      museum.description || '',
    ];

    let cursorY = startY;
    detailLines.forEach((line) => {
      const wrapped = doc.splitTextToSize(line, 180);
      doc.text(wrapped, 14, cursorY);
      cursorY += wrapped.length * 7;
    });

    if (museum.imageUrl) {
      const dataUrl = await this.imageUrlToDataUrl(museum.imageUrl);
      if (dataUrl) {
        try {
          const imgW = 160;
          const imgH = 90;
          const pageHeight = doc.internal.pageSize.getHeight();
          if (cursorY + imgH + 20 > pageHeight) {
            doc.addPage();
            cursorY = 28;
          }
          doc.addImage(dataUrl, 'JPEG', 14, cursorY + 4, imgW, imgH, undefined, 'FAST');
          cursorY += imgH + 16;
        } catch {}
      }
    }

    this.addHeaderFooter(doc);
    doc.save(`Museum_${(museum.name || 'item').replace(/\s+/g, '_')}.pdf`);
  }

  downloadAllMuseumsPdf() {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Museums — Listing', 14, 24);

    const rows = this.museums.map((m, idx) => [
      idx + 1,
      m.name || '',
      m.location || '',
      m.workingHours || '',
      m.description || '',
    ]);

    autoTable(doc, {
      startY: 30,
      head: [['#', 'Name', 'Location', 'Working Hours', 'Description']],
      body: rows,
      styles: { font: 'helvetica', fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [247, 183, 49] },
      columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 40 }, 2: { cellWidth: 40 }, 3: { cellWidth: 35 }, 4: { cellWidth: 60 } },
      didDrawPage: () => this.addHeaderFooter(doc),
      margin: { left: 14, right: 14 },
    });

    doc.save('Museums_All.pdf');
  }

  // ======== Lightbox / Zoom ========
  openViewer(url: string): void {
    this.viewerImageUrl = url;
    this.viewerOpen = true;
    this.zoomScale = 1;
    this.zoomTranslate = { x: 0, y: 0 };
  }

  closeViewer(): void {
    this.viewerOpen = false;
  }

  onWheelZoom(event: WheelEvent): void {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    this.setZoomLevel(this.zoomScale + delta);
  }

  setZoomLevel(level: number): void {
    this.zoomScale = Math.max(0.5, Math.min(level, 5));
  }

  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.lastMousePos = { x: event.clientX, y: event.clientY };
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    const dx = event.clientX - this.lastMousePos.x;
    const dy = event.clientY - this.lastMousePos.y;
    this.zoomTranslate.x += dx;
    this.zoomTranslate.y += dy;
    this.lastMousePos = { x: event.clientX, y: event.clientY };
  }

  onMouseUp(): void {
    this.isDragging = false;
  }

  resetView(): void {
    this.zoomScale = 1;
    this.zoomTranslate = { x: 0, y: 0 };
  }

  getZoomStyle() {
    return {
      transform: `scale(${this.zoomScale}) translate(${this.zoomTranslate.x / this.zoomScale}px, ${this.zoomTranslate.y / this.zoomScale}px)`,
      transition: this.isDragging ? 'none' : 'transform 0.1s ease-out'
    };
  }

}
