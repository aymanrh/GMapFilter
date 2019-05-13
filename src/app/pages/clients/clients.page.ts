import {Component, OnInit} from '@angular/core';
import {ClientService} from '../../shared/services/client/client.service';
import {Client} from '../../model/client';
import {Router} from '@angular/router';
import {TableColumn} from '../../model/utilities/table-column';
import {ArrayFilterService} from '../../shared/services/utils/array-filter.service';
import {ClipboardService} from 'ngx-clipboard';
import {defaultLat, defaultLng} from '../../shared/constant/constants';

@Component({
    selector: 'app-clients',
    templateUrl: './clients.page.html',
    styleUrls: ['./clients.page.scss'],

})
export class ClientsPage implements OnInit {

    defaultLat = defaultLat;
    defaultLng = defaultLng;
    filteredClients: Client[];
    clients: Client[];
    searchTerm: any;


    columns: TableColumn[] = [
        {prop: 'name'},
        {prop: 'lastName'},
        {prop: 'phone'},
        {prop: 'email'},
        {prop: 'category'},
    ];

    constructor(private clientService: ClientService,
                private router: Router,
                private arrayFilterService: ArrayFilterService,
                private clipboardService: ClipboardService) {
    }

    ngOnInit() {
        this.clientService.getClients().subscribe(value => {
            value.forEach(client => {
                ClientService.getAvatarProps(client);
            });
            this.filteredClients = value;
            this.clients = value;
        });
    }

    boundsChange($event) {
        if (this.searchTerm) {
            return;
        }
        console.log($event.getNorthEast());
        const ne = $event.getNorthEast();
        const sw = $event.getSouthWest();

        const latBounds = {
            top: ne.lat(),
            bottom: sw.lat()
        };

        const lonBounds = {
            left: sw.lng(),
            right: ne.lng()
        };
        console.log(latBounds, lonBounds);
        this.filteredClients = this.clients.filter(s => s.lat < latBounds.top &&
            s.lat > latBounds.bottom &&
            s.lng > lonBounds.left &&
            s.lng < lonBounds.right);
    }

    add() {
        this.router.navigateByUrl('add-client');
    }

    cancelSearch() {

    }

    emptySearch() {

    }

    details(client: Client) {
        this.router.navigate(['add-client', client.id]);
    }

    filterClients(event) {
        this.filteredClients = this.arrayFilterService.filter(this.clients, event.detail.value, this.columns);
    }

    copied(text: string) {
        this.clipboardService.copyFromContent(text);
    }
}
