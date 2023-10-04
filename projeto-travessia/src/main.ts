import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module'; // Certifique-se de que o caminho para o módulo principal esteja correto

enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
