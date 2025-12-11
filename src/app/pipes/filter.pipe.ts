import { Pipe, PipeTransform } from '@angular/core';
import { Envio } from '../models/models';

@Pipe({
    name: 'filter',
    standalone: true
})
export class FilterPipe implements PipeTransform {
    transform(items: Envio[], searchText: string): Envio[] {
        if (!items) return [];
        if (!searchText) return items;

        searchText = searchText.toLowerCase();

        return items.filter(it => {
            const remitente = it.remitente?.toLowerCase().includes(searchText);
            const destinatario = it.destinatario?.toLowerCase().includes(searchText);
            const direccion = it.direccion?.toLowerCase().includes(searchText);

            return remitente || destinatario || direccion;
        });
    }
}
