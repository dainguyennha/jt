import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import { environment } from '../../environments/environment';

@Injectable()
export class VideoService {
  constructor(private http: HttpClient) { }

  private static _handleError(err: HttpErrorResponse | any) {
    return Observable.throw(
      err.message || "Error: Unable to complete request."
    );
  }

  getVideos(): Observable<any> {
    return this.http.get(`${environment.apiURL}/videos`).catch(VideoService._handleError);
  }

  getVideo(id): Observable<any> {
    return this.http
      .get(`${environment.apiURL}/video/` + id)
      .catch(VideoService._handleError);
  }

  getRois(id): Observable<any> {
    return this.http
      .get(`${environment.apiURL}/rois/` + id)
      .catch(VideoService._handleError);
  }

  getItems(id): Observable<any> {
    return this.http
      .get(`${environment.apiURL}/items/` + id)
      .catch(VideoService._handleError);
  }
}
