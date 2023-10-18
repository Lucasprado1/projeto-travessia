import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  ngOnInit(): void {
    const menu = document.querySelector('.header');
    function activeScroll(){
      console.log("scroll", scrollY);
      menu?.classList.toggle('transicao1', scrollY > 0 && scrollY < 25);
      menu?.classList.toggle('transicao2', scrollY > 25 && scrollY < 55);
      menu?.classList.toggle('ativo', scrollY > 55);
    }
    window.addEventListener('scroll', activeScroll);
  }

}
