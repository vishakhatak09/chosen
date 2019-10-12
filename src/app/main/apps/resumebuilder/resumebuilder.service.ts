import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ResumeBuilderService {

    public templateData: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor() { }
}
