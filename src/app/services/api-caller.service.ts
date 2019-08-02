import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Promise} from 'q';
import {map} from 'rxjs/operators';
import {Project} from '../classes/project';

@Injectable({
  providedIn: 'root'
})
export class ApiCallerService {

  /*
    Mit Http-Requests können Anfragen an die erstellte REST-Schnittstelle(Middle-ware) gemacht werden.
    Dabei sagt im allgemeinen:
      * GET um Informationen anzufragen
      * Post um Infos an den Server zu senden
      * (Delete) um Daten im Server zu löschen.
     Es gibt noch weitere aber GET und POST werden überwiegend verwendet.
     Die anderen könnt ihr bei Interesse auf: "https://www.w3schools.com/tags/ref_httpmethods.asp" nachschauen
     Hier gibts auch noch weitere Infos: "https://wiki.selfhtml.org/wiki/HTTP/Anfragemethoden"

     Um aus der Angular Applikation solche Anfragen zu senden, benötigten wird den HttpClien.
     Zudem wird die Adresse, an welche die Anfrage geschickt werden soll benötigt.

     Anschließend kann mittels this.http.get(url) eine simple get anfrage gestellt werden.
     Angular gibt für diesen Aufruf ein Observable zurück.
     Aus diesem Grund ist es möglich die .subscribe() Methode zu nutzen.

   */

  // Die baseUrl gibt die Basis des End Url an. Da sich diese je nach Anfrage unterscheidet,
  // macht es sinn sie erst bei der Anfrage zusammenzusetzen
  private baseUrl = 'http://l234:8080/SimpleVersion-war-1.0/resources/';

  // Wird für Projektspezifische Anfragen genutzt
  private projectUrl = 'project/';

  private subject = new Subject();

  constructor(private http: HttpClient) { }

  public getSubjectObservable() {
    return this.subject.asObservable();
  }



  /* Um die empfangenen Daten eines http requests weiter zu senden, habt ihr im Grunde genommen zwei Möglichkeiten:
  *   1. Ihr benutzt ein Subject und nutzt dieses um die Daten zu schicken.
  *   (z.B. wenn die Daten nicht in der Komponente genutzt werden sollen die den Request gesendet hat)
  *   2. Ihr returned ein Promise um die Daten direkt auswerten zu können.
  *
  *   Falls euch die Begriffe Subject und Promise nichts sagen, schaut euch bitte die anderen Projekte an die ich euch geschickt habe.
  * */

  public getWithSubject() {
    // Zusammensetzen der Url:
    const searchUrl = this.baseUrl + this.projectUrl + 'GetAll';
    // http Aufruf. Der Ausdruck data => im subscribe gibt an, was mit den Daten gemacht werden soll.
    // "data" ist hier nur ein Name den ihr selber zuweisen könnt. Es könnte z.B. auch "Blumenkohl" dastehen.
    // Nach dem Pfeil => wird angegeben was mit den Daten gemacht werden soll. Hier kann einfach eine Methode stehen, oder auch eine ganze Funktion
    // Wenn ihr eine Funktion benutzen wollt müsst ihr diese einfach mit {} öffnen. (data => {});
    // Zudem kann, sollte ein Fehler enstehen, dieser als zweiter Parameter genutzt werden
    this.http.get(searchUrl).subscribe(data => this.subject.next(data), error => console.log(error));

  }

  public getWithPromise() {
    // Zusamensetze der Url:
    const searchUrl = this.baseUrl + this.projectUrl + 'GetAll';
    // Da wir ein observable zurückbekomen, ist es möglich die Daten vor der rückgabe zu bearbeiten. Dafür nutzen wir .pipe() und rxjs operators.
    // Weitere infos dazu hier: "https://www.learnrxjs.io/operators/"
    return new Promise(resolve => {
      this.http.get(searchUrl)
        .pipe(map(data => this.createProjectArray(data)))
        .subscribe(data => resolve(data), error => console.log(error));
    });

  }

  private createProjectArray(data) {
    const pArray: Project[] = [];

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const object = data[key];
        pArray.push(this.createProject(object.id, object.title, object.note, object.pStartTime));
      }
    }
    return pArray;
  }

  private createProject(id, title, note, startTime): Project {
    return new Project(id, title, note, new Date(startTime));
  }

  /* Um Parameter in den Anfragen zu übermitteln, könnt ihr HttpParams nutzen*/
  public deleteProject(project: Project) {
    /* Achtung: Methoden der http gruppen geben immer ein neues Objekt zurück, sie verändern nicht das übergebene.
    Solltet ihr also zustzlich noch Parameter hinzufügen wollen, könnt ihr entweder mehrere set() Methoden aneinander reihen
    => new HttpParams().set().set()
    Oder ihr müsst euer altes Objekt überschreiben:
    params = params.set();
    */
    const params = new HttpParams().set('id', project.id,toString());
    // Setzen der Url
    const requestUrl = this.baseUrl + this.projectUrl + 'DeleteProject';
    this.http.post(requestUrl, {params: params});
  }

}
