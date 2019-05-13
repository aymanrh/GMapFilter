import {Injectable} from '@angular/core';
import {LoadingController} from "@ionic/angular";

@Injectable({
    providedIn: 'root'
})
export class PreloaderService {
    private isLoading = false;

    constructor(public loadingCtrl: LoadingController) {

    }

    async displayPreloader() {
        this.isLoading = true;
        return await this.loadingCtrl.create({
            message: 'Loading...',

        }).then(value => {
            value.present().then(() => {
                if (!this.isLoading) {
                    value.dismiss().then(() => console.log('abort presenting'));
                }
            })
        });

    }


    async hidePreloader() {
        this.isLoading = false;
        return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
    }
}
