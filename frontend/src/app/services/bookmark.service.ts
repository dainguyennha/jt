import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/catch";
import { environment } from '../../environments/environment';
import { Bookmark } from "../models/bookmark.model";
import { AuthService } from "../services/auth.service";

@Injectable()
export class BookmarkService {
  constructor(private http: HttpClient, private authService: AuthService) { }

  private static _handleError(err: HttpErrorResponse | any) {
    return Observable.throw(
      err.message || "Error: Unable to complete request."
    );
  }

  getBookmarks(id): Observable<any> {
    return Observable.fromPromise(this.authService.getTokenHeader()).flatMap(
      token => {
        return this.http
          .get(`${environment.apiURL}/bookmark/` + id, token)
          .catch(BookmarkService._handleError);
      }
    );
  }

  addBookmark(bookmark: Bookmark): Observable<any> {
    const formData = new FormData();
    formData.append("video-id", bookmark.video.id);
    formData.append("video-title", bookmark.video.title);
    formData.append("item-id", bookmark.item.id);
    formData.append("item-title", bookmark.item.title);
    formData.append("user", bookmark.user);
    formData.append("location", bookmark.location.toString());
    formData.append("created", bookmark.created.toLocaleString());
    return this.http
      .post(`${environment.apiURL}/bookmark`, formData)
      .catch(BookmarkService._handleError);
  }

  deleteBookmark(id:string): Observable<any> {
    return this.http
      .get(`${environment.apiURL}/delete-bookmark/` + id)
      .catch(BookmarkService._handleError);
  }
}
