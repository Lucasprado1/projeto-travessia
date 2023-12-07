import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  openUserDetail: boolean = false;
  ngOnInit(): void {
    const menu = document.querySelector('.header');
    function activeScroll() {
      console.log("scroll", scrollY);
      menu?.classList.toggle('transicao1', scrollY > 0 && scrollY < 25);
      menu?.classList.toggle('transicao2', scrollY > 25 && scrollY < 55);
      menu?.classList.toggle('ativo', scrollY > 55);
    }
    window.addEventListener('scroll', activeScroll);
  }
  constructor(private _snackBar: MatSnackBar,private elementRef: ElementRef, private renderer: Renderer2){}


 

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.openUserDetail = false;
      // Fecha o user detail box
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: ['custom-snackbar']
    });
  }
  aviso() {
    this.openSnackBar('Ainda sem funcionalidade :´( ', 'Fechar')
  }

  openUserDetailBox() {
    if(this.openUserDetail){
      this.openUserDetail = false;
    }
    else{
      this.openUserDetail = true;
    }
    
  }

}
