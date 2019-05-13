import {Injectable} from '@angular/core';
import {TableColumn} from '../../../model/utilities/table-column';

@Injectable()
export class ArrayFilterService {

    constructor() {}

    filter(list: any[], filter: string, props: TableColumn[]): any[] {
        return list.filter(p => {
            let search = '';
            props.forEach(col => {
                search += (p[col.prop] + '').trim().toLowerCase();
            });
            return search.indexOf(filter) !== -1;
        });
    }

}
