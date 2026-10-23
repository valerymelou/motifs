import { Component } from '@angular/core';
import { collection, ORDER_ADDRESS } from '../../content';
import { Photo } from '../../photos/photo';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../ui/card/card';

@Component({
  selector: 'mt-collection-section',
  imports: [Card, CardContent, CardFooter, CardHeader, CardTitle, Photo],
  templateUrl: './collection-section.html',
})
export class CollectionSection {
  protected readonly copy = collection;

  protected askLink(piece: string): string {
    const params = new URLSearchParams({ subject: `About the ${piece}` });
    return `mailto:${ORDER_ADDRESS}?${params.toString().replace(/\+/g, '%20')}`;
  }
}
