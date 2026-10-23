import { Component } from '@angular/core';
import { ORDER_ADDRESS, visit } from '../../content';
import { Photo } from '../../photos/photo';
import { Button } from '../../ui/button/button';

@Component({
  selector: 'mt-visit-section',
  imports: [Button, Photo],
  templateUrl: './visit-section.html',
})
export class VisitSection {
  protected readonly copy = visit;
  protected readonly email = ORDER_ADDRESS;
}
