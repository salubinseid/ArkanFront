import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

export class CRUDServices <T> {

    // baseUrl = environment.baseURL;
    
    protected readonly apiUrl = `${this.url}/${this.entityname}`;
    constructor(
        protected readonly http: HttpClient,
        protected readonly entityname: string,
        protected readonly url: string = environment.baseURL
    ) {}

    // constructor(private http : HttpClient, private endpoint: string ){
        
    // }

    //get all records
    getAll(query?: { [key: string]: string }) : Observable <T>{
        const params = new HttpParams({ fromObject: query });
        return this.http.get<T>(this.apiUrl,{params});
    }

    //add or save new record 
    addRecord(data:T): Observable<T>{
        return this.http.post<T>(this.apiUrl,data);
    }

    //get record by Id
    getById(id:any) : Observable<T>{
        const _apiUrl = this.entityUrl(id);
        return this.http.get<T>(_apiUrl );
    }

    

    //Update a specifc Record
    updateRecord(id:any, data:T): Observable<T>{
        const _apiUrl = this.entityUrl(id);
        return this.http.put<T>(_apiUrl,data);
    }

    protected entityUrl(id: number): string {
        return [this.apiUrl, id].join('/');
      }

}