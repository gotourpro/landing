import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IContactForm } from '../interfaces/contact-form.interface';



@Injectable({
    providedIn: 'root'
})
export class ContactService {

    /**
     * email зарегистрированный в FormSubmit
     */
    private readonly formSubmitUrl =
        'https://formsubmit.co/ajax/683271139b5b85d710db6ff2ad2c22d6';

    constructor(
        private readonly http: HttpClient
    ) { }

    public send(
        payload: IContactForm
    ): Observable<any> {

        return this.http.post(
            this.formSubmitUrl,
            {
                name: payload.name,
                email: payload.email,
                message: payload.message,

                _subject: 'GoTiva Contact Request',
                _template: 'table',
                _captcha: false
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }
        );
    }
}