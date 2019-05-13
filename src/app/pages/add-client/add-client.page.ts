import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {MapsAPILoader} from '@agm/core';
import {Client} from '../../model/client';
import {ClientService} from '../../shared/services/client/client.service';
import {ClientGroup} from '../../model/client-group';
import {AlertController} from '@ionic/angular';
import {UserMessageService} from '../../shared/services/userMessageService/user-message.service';
import {PreloaderService} from '../../shared/services/utils/preloader.service';
import {defaultLat, defaultLng} from '../../shared/constant/constants';


@Component({
    selector: 'app-add-client',
    templateUrl: './add-client.page.html',
    styleUrls: ['./add-client.page.scss'],
})
export class AddClientPage implements OnInit {
    client: Client = {};
    clientForm: FormGroup;
    isSubmitted = false;
    @ViewChild('search')
    public searchElementRef: ElementRef;
    clientGroups: ClientGroup[];
    defaultLat = defaultLat;
    defaultLng = defaultLng;
    private geoCoder;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private formBuilder: FormBuilder,
                private mapsAPILoader: MapsAPILoader,
                private ngZone: NgZone,
                private  clientService: ClientService,
                private alertController: AlertController,
                private userMessageService: UserMessageService,
                private  preloaderService: PreloaderService) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params.id) {
                this.clientService.getClients().subscribe(clients => {
                    const client = clients.find(c => c.id === +params.id);
                    this.client = client;
                    this.clientForm.patchValue(client);
                });
            }
        });
        this.clientService.getCategories().subscribe(value => {
            this.clientGroups = value;
        });
        this.clientForm = this.formBuilder.group({
            id: [''],
            clientGroup: ['', Validators.required],
            name: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.required],
            phone: ['', Validators.required],
            city: ['', Validators.required],
            street: ['', Validators.required],
            mapAddress: ['', Validators.required],
            lat: ['', Validators.required],
            lng: ['', Validators.required],
        });
        this.mapsAPILoader.load().then(() => {
            this.geoCoder = new google.maps.Geocoder();

            const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: ['address']
            });
            autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    // get the place result
                    const place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    // verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }
                    // set latitude, longitude and zoom
                    this.client.lat = place.geometry.location.lat();
                    this.client.lng = place.geometry.location.lng();
                    this.getAddress(this.client.lat, this.client.lng);
                });
            });
        });
    }

    save() {
        this.isSubmitted = true;
        this.preloaderService.displayPreloader().then();
        if (this.client.id) {
            this.clientService.updateClient(this.clientForm.value).then(value => {
                this.preloaderService.hidePreloader().then();
                this.router.navigateByUrl('clients');
            });
        } else {
            this.client.id = new Date().getTime();
            this.clientForm.patchValue(this.client);

            this.clientService.createClient(this.clientForm.value).then(value => {
                this.preloaderService.hidePreloader().then();
                this.router.navigateByUrl('clients');
            });
        }
    }

    markerDragEnd($event) {
        console.log($event);
        this.client.lat = $event.coords.lat;
        this.client.lng = $event.coords.lng;
        this.clientForm.patchValue(this.client);
        this.getAddress(this.client.lat, this.client.lng);
    }

    getAddress(latitude, longitude) {
        this.geoCoder.geocode({location: {lat: latitude, lng: longitude}}, (results, status) => {
            console.log(results);
            console.log(status);
            if (status === 'OK') {
                if (results[0] && !results[0].formatted_address.startsWith('Unnamed Road')) {
                    this.client.mapAddress = results[0].formatted_address;
                    this.clientForm.patchValue(this.client);
                } else if (results[1] && !results[1].formatted_address.startsWith('Unnamed Road')) {
                    this.client.mapAddress = results[1].formatted_address;
                    this.clientForm.patchValue(this.client);
                } else if (results[2] && !results[2].formatted_address.startsWith('Unnamed Road')) {
                    this.client.mapAddress = results[2].formatted_address;
                    this.clientForm.patchValue(this.client);
                } else {
                    this.userMessageService.showErrorMessage('No results found');
                }

            } else {
                this.userMessageService.showErrorMessage('Geocoder failed due to: ' + status);
            }
        });
    }

    async addNewGroup() {
        const alert = await this.alertController.create({
            header: 'Add Group',
            inputs: [
                {
                    placeholder: 'Group Name',
                    name: 'groupName',
                    type: 'text'
                }],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                    }
                }, {
                    text: 'Add',
                    handler: (alertData) => {
                        const createdGroup = {
                                name: alertData.groupName
                            }
                        ;
                        if (this.clientGroups.find(s => s.name.toLowerCase() === alertData.groupName.toLowerCase())) {
                            this.userMessageService.showErrorMessage('Already Exist');
                        } else {
                            this.clientService.createCategory(createdGroup).then(value => {
                                this.userMessageService.showSuccessMessage('Category Created ' + createdGroup.name);
                            });
                        }
                    }
                }
            ]
        });
        await alert.present();
    }

    setCurrentLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.client.lat = position.coords.latitude;
                this.client.lng = position.coords.longitude;
                this.getAddress(this.client.lat, this.client.lng);
                this.clientForm.patchValue(this.client);
            });
        }
    }
}
