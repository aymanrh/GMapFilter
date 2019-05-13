import {Injectable} from '@angular/core';
import {Client} from '../../../model/client';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {ClientGroup} from '../../../model/client-group';

@Injectable({
    providedIn: 'root'
})
export class ClientService {

    static colors = [
        'primary',
        'secondary',
        'warning',
        'danger',
        'medium',
        'light'
    ];

    constructor(private firestore: AngularFirestore) {
    }

    static getAvatarProps(client: Client) {
        client.initials = `${client.name.charAt(0).toUpperCase()}${client.lastName.charAt(0).toUpperCase()}`;
        let sum = 0;
        const fullName = `${client.name} ${client.lastName}`;
        for (let i = 0; i < client.name.length; i++) {
            sum += fullName.charCodeAt(i);
        }
        const index = sum % this.colors.length;
        client.avatarBackground = `var(--ion-color-${this.colors[index]})`;
        client.avatarText = `var(--ion-color-${this.colors[index]}-contrast)`;
    }

    createClient(client: Client): Promise<any> {
        return this.firestore.collection('clients').doc(client.id + '').set(client);
    }

    getClients(): Observable<Client[]> {
        return this.firestore.collection<Client>('clients').valueChanges();
    }

    getCategories() {
        return this.firestore.collection<ClientGroup>('clientGroups').valueChanges();
    }

    createCategory(clientGroup: ClientGroup) {
        return this.firestore.collection('clientGroups').doc(clientGroup.name + '').set(clientGroup);
    }

    updateClient(client: Client) {
        console.log(client.id + '');
        return this.firestore.collection('clients').doc(client.id + '').update(client);
    }
}
