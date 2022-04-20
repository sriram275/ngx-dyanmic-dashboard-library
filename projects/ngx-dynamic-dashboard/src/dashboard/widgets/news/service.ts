/**
 * Created by jayhamilton on 6/24/17.
 */
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError} from "rxjs/operators";
import { RuntimeService } from '../../services/runtime.service';
@Injectable()
export class NewsService {

    constructor(private _http: HttpClient) {
    }

    get() {
        return this._http.get('/assets/api/news-model.json')
            .pipe(
                catchError(RuntimeService.handleError)
            );
    }
}
