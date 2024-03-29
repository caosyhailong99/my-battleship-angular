import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'my-battleship';
  tenArray = new Array(10);

  onClickGameBox(event: MouseEvent) {
    let gameBoxEl = event.target as HTMLDivElement;
    let shotDotEl = gameBoxEl.querySelector('.shot-dot') as HTMLDivElement;
    console.log(shotDotEl);
    shotDotEl.style.display = 'block'
  }
}
