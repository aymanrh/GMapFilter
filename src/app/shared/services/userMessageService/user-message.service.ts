import {Injectable} from '@angular/core';
import {ToastController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class UserMessageService {

    constructor(private toastController: ToastController) {

    }

    async showErrorMessage(message: string) {
        const toast = await this.toastController.create({
            message,
            showCloseButton: true,
            duration: 5000,
            color: 'danger',
            position: 'top',
        });
        toast.present();
    }

    async showSuccessMessage(message: string) {
        const toast = await this.toastController.create({
            message,
            showCloseButton: true,
            duration: 2000,
            color: 'success',
            position: 'bottom',
        });
        toast.present();
    }
}
