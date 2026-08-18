import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  doc,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { db } from "@/lib/firebase/firestore";

import type { Client } from "@/types/client";

const CLIENTS_COLLECTION = "clients";

const auth = getAuth();

export async function createClient(
  client: Omit<
    Client,
    "id" | "createdAt" | "updatedAt"
  >,
) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const now = Timestamp.now();

  const docRef = await addDoc(
    collection(db, CLIENTS_COLLECTION),
    {
      ...client,
      ownerId: user.uid,
      createdAt: now,
      updatedAt: now,
    },
  );

  return docRef.id;
}

export async function getClients(): Promise<Client[]> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const clientsQuery = query(
    collection(db, CLIENTS_COLLECTION),
    where("ownerId", "==", user.uid),
    orderBy("name", "asc"),
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
  >,
) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const clientRef = doc(
    db,
    CLIENTS_COLLECTION,
    clientId,
  );

  await updateDoc(clientRef, {
    ...client,
    updatedAt: Timestamp.now(),
  });
}