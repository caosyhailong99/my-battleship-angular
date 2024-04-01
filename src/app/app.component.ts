import { Component } from '@angular/core';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'my-battleship';
  tenArray = new Array(10);
  socket = io('localhost:3000');

  ngOnInit() {
    this.socket.on("connection", (socket) => {
      console.log('Ok', socket.id);
    });
  }

  onClickGameBox(event: MouseEvent) {
    let gameBoxEl = event.target as HTMLDivElement;
    let shotDotEl = gameBoxEl.querySelector('.shot-dot') as HTMLDivElement;
    shotDotEl.style.display = 'block'
  }
}
