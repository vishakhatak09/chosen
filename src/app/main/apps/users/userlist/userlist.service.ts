import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserListService {
    constructor(private httpClient: HttpClient) { }

    getUsersList(userListapi: string): Observable<any> {
        return this.httpClient.get(userListapi);
    }

    deleteUser(deleteUserApi: string, params: any): Observable<any> {
        return this.httpClient.post(deleteUserApi, params);
    }
}
