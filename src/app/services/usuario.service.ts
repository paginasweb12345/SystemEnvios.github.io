import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Usuario } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private firestore = inject(Firestore);

  obtenerRepartidores(): Observable<Usuario[]> {
    const ref = collection(this.firestore, 'usuarios');
    const q = query(ref, where('rol', '==', 'repartidor'));
    return collectionData(q, { idField: 'uid' }) as Observable<Usuario[]>;
  }
}
