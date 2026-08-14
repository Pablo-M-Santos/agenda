import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/firestore";

import type { Client } from "@/types/client";

const CLIENTS_COLLECTION = "clients";

export async function createClient(
  client: Omit<
    Client,
    "id" | "createdAt" | "updatedAt"
  >
) {
  const now = Timestamp.now();

  const docRef = await addDoc(
    collection(db, CLIENTS_COLLECTION),
    {
      ...client,
      createdAt: now,
      updatedAt: now,
    }
  );

  return docRef.id;
}

export async function getClients(): Promise<Client[]> {
  const clientsQuery = query(
    collection(db, CLIENTS_COLLECTION),
    orderBy("name", "asc")
  );

  const snapshot = await getDocs(clientsQuery);

  return snapshot.docs.map((docSnapshot) => {
    const data = docSnapshot.data();

    return {
      id: docSnapshot.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as Client;
  });
}

export async function updateClient(
  clientId: string,
  client: Partial<
    Omit<Client, "id" | "createdAt" | "updatedAt">
  >
) {
  const clientRef = doc(
    db,
    CLIENTS_COLLECTION,
    clientId
  );

  await updateDoc(clientRef, {
    ...client,
    updatedAt: Timestamp.now(),
  });
}