import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, collectionData, query, where, orderBy, Timestamp } from '@angular/fire/firestore';
import { Envio, EstadoEnvio } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class EnvioService {
  private firestore = inject(Firestore);
  private coleccion = 'envios';

  obtenerTodosEnvios(): Observable<Envio[]> {
    const ref = collection(this.firestore, this.coleccion);
    const q = query(ref, orderBy('fecha_envio', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Envio[]>;
  }

  obtenerEnviosCliente(userId: string): Observable<Envio[]> {
    const ref = collection(this.firestore, this.coleccion);
    const q = query(ref, where('userId', '==', userId), orderBy('fecha_envio', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Envio[]>;
  }

  obtenerEnviosRepartidor(repartidorId: string): Observable<Envio[]> {
    const ref = collection(this.firestore, this.coleccion);
    const q = query(ref, where('repartidorId', '==', repartidorId), orderBy('fecha_envio', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Envio[]>;
  }

  filtrarPorEstado(estado: EstadoEnvio, userId?: string): Observable<Envio[]> {
    const ref = collection(this.firestore, this.coleccion);
    let q;

    if (userId) {
      q = query(ref, where('userId', '==', userId), where('estado', '==', estado), orderBy('fecha_envio', 'desc'));
    } else {
      q = query(ref, where('estado', '==', estado), orderBy('fecha_envio', 'desc'));
    }

    return collectionData(q, { idField: 'id' }) as Observable<Envio[]>;
  }

  async crearEnvio(envio: Envio): Promise<void> {
    try {
      const ref = collection(this.firestore, this.coleccion);
      const envioData = {
        ...envio,
        fecha_envio: Timestamp.fromDate(new Date(envio.fecha_envio)),
        estado: 'pendiente' as EstadoEnvio
      };
      await addDoc(ref, envioData);
    } catch (error) {
      console.error('Error al crear envío:', error);
      throw error;
    }
  }

  async actualizarEnvio(id: string, envio: Partial<Envio>): Promise<void> {
    try {
      const ref = doc(this.firestore, `${this.coleccion}/${id}`);
      const updateData: any = { ...envio };
      
      if (envio.fecha_envio) {
        updateData.fecha_envio = Timestamp.fromDate(new Date(envio.fecha_envio));
      }
      
      await updateDoc(ref, updateData);
    } catch (error) {
      console.error('Error al actualizar envío:', error);
      throw error;
    }
  }

  async actualizarEstado(id: string, estado: EstadoEnvio): Promise<void> {
    try {
      const ref = doc(this.firestore, `${this.coleccion}/${id}`);
      await updateDoc(ref, { estado });
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      throw error;
    }
  }

  async eliminarEnvio(id: string): Promise<void> {
    try {
      const ref = doc(this.firestore, `${this.coleccion}/${id}`);
      await deleteDoc(ref);
    } catch (error) {
      console.error('Error al eliminar envío:', error);
      throw error;
    }
  }

  async asignarRepartidor(envioId: string, repartidorId: string): Promise<void> {
    try {
      const ref = doc(this.firestore, `${this.coleccion}/${envioId}`);
      await updateDoc(ref, {
        repartidorId,
        estado: 'en_transito' as EstadoEnvio
      });
    } catch (error) {
      console.error('Error al asignar repartidor:', error);
      throw error;
    }
  }
}