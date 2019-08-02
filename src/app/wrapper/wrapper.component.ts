import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiCallerService} from '../services/api-caller.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.css']
})
export class WrapperComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  constructor(private apiCaller: ApiCallerService) {
  }

  ngOnInit() {
    this.subscription = this.apiCaller.getSubjectObservable().subscribe(data => {
      console.log('With Subject(Hier wurde noch keine Umwandlung zu Projects vorgenommen):');
      console.log(data);
    });
    this.apiCaller.getWithSubject();
    this.getDataWithPromise();
  }

  private async getDataWithPromise() {
    const data = await this.apiCaller.getWithPromise();
    console.log('With Promise:')
    console.log(data);
  }

  ngOnDestroy() {
    //Nachdem dies eine eigene Subscription ist, sollte unsubscribe() verwendet werden, wenn die Komponente gelöscht wird.
    this.subscription.unsubscribe();
  }
}
