import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase/firestore";

import type { Appointment } from "@/types/appointment";

const APPOINTMENTS_COLLECTION = "appointments";

export async function createAppointment(
  appointment: Omit<
    Appointment,
    "id" | "createdAt" | "updatedAt"
  >
) {
  const now = Timestamp.now();

  const docRef = await addDoc(
    collection(db, APPOINTMENTS_COLLECTION),
    {
      ...appointment,
      createdAt: now,
      updatedAt: now,
    }
  );

  return docRef.id;
}

export async function getAppointments(): Promise<
  Appointment[]
> {
  const appointmentsQuery = query(
    collection(db, APPOINTMENTS_COLLECTION),
    orderBy("date", "asc")
  );

  const snapshot = await getDocs(appointmentsQuery);

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as Appointment;
  });
}