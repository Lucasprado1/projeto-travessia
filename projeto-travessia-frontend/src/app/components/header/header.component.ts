import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
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
  constructor(private _snackBar: MatSnackBar){}

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: ['custom-snackbar']
    });
  }
  aviso() {
    this.openSnackBar('Ainda sem funcionalidade :´( ', 'Fechar')
  }

}
