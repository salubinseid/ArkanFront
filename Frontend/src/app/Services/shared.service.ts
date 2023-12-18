import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private storeSubject = new BehaviorSubject<any>([]);
  stores$ = this.storeSubject.asObservable();

  constructor(private dialog: MatDialog) {}

  openDialog(component: any, func: any, size: any) {
    this.dialog
      .open(component, size)
      .afterClosed()
      .subscribe((value) => {
        func();
      });
  }

  setStore(value: string) {
    this.storeSubject.next(value);
  }

  getStore() {
    return this.storeSubject.value;
  }
}
