import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule, NavController } from "ionic-angular/index";

import { HomePage } from "./home";
import { ServicesProvider } from '../../providers/services/services';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyApp } from "../../app/app.component";

describe('Page1', function () {
    let de: DebugElement;
    let comp: HomePage;
    let fixture: ComponentFixture<HomePage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HomePage],
            imports: [
                IonicModule.forRoot(HomePage)
            ],
            providers: [
                { provide: ServicesProvider, useValue: servicesProviderStub }
            ]
            /* providers: [
                NavController, ServicesProvider, Http, Headers, RequestOptions
            ] */
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomePage);
        comp = fixture.componentInstance;
        // de = fixture.debugElement.query(By.css('h3'));
    });

    it('should create component', () => expect(comp).toBeDefined());

    it('it should be false', () => {
        fixture.detectChanges();
        const test = comp.test();
        expect(test).toBeFalsy();
    })

    it('it should be true', () => {
        const test = comp.test(true);
        expect(test).toBeTruthy();
    })


});