import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'mt-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
