import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
//import { retry, catchError } from 'rxjs/operators';

import { Router } from '@angular/router';
import { Injectable } from '@angular/core';


@Injectable()
export class HttpInterceptorHandler implements HttpInterceptor {

    constructor(private router: Router, public _msgs: MessagesHelper,private loaderService: LoaderService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let reqUrl = SERVER_API_URL + request.url;
        if (localStorage.getItem('jwtToken')) {
            request = request.clone({
                url: reqUrl,
                setHeaders: {
                    // Authorization: `Bearer ` + localStorage.getItem('jwtToken'),
                    // Language: "en"
                },
            });
        } else {
            request = request.clone({
                url: reqUrl,
            });
        }


        return Observable.create(observer => {
            const subscription = next.handle(request)
                .subscribe(
                    event => {
                        if (event instanceof HttpResponse) {
                            observer.next(event);
                        }
                    },
                    err => {
                        if (err.status == 401) {
                            // Swal.fire('Oops...', 'Unauthorized Request!', 'warning')
                        } else if (err.status == 500) {
                            this.router.navigate(['/']);
                        }
                        this.loaderService.hide()
                        this._msgs.showMessage(err.name, MessagesTypeEnum.Error);

                        observer.error(err);
                      
                    },
                    () => {
                        observer.complete();
                    });
            return () => {
                subscription.unsubscribe();
            };
        });
    }
}


import { ErrorHandler } from '@angular/core';
import { MessagesHelper } from '../Helper/MessagesService';
import { MessagesTypeEnum } from '../enum/MessagesTypeEnum';
import { SERVER_API_URL } from 'src/app/app.constant';
import { LoaderService } from '../loader/loader.service';
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    handleError(error: any): void {
        const chunkFailedMessage = /Loading chunk [\d]+ failed/;
       // console.log(error.message)
        if (chunkFailedMessage.test(error.message)) {
            window.location.reload();
        }
    }
}