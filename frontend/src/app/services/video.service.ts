import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import { environment } from '../../environments/environment';
import { ROI } from "../models/roi.model";
import { Item } from "../models/item.model";

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

  addRoi(roi){
    console.log(roi)
  }
  addObjectItems(item:Item){
    console.log(item)
  }


  getItems(id): Observable<any> {
    return this.http
      .get(`${environment.apiURL}/items/` + id)
      .catch(VideoService._handleError);
  }
}
