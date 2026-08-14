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

import type { Appointment, AppointmentStatus } from "@/types/appointment";

const APPOINTMENTS_COLLECTION = "appointments";

export async function createAppointment(
  appointment: Omit<Appointment, "id" | "createdAt" | "updatedAt">,
) {
  const now = Timestamp.now();

  const docRef = await addDoc(collection(db, APPOINTMENTS_COLLECTION), {
    ...appointment,
    createdAt: now,
    updatedAt: now,
  });

  return docRef.id;
}

export async function getAppointments(): Promise<Appointment[]> {
  const appointmentsQuery = query(
    collection(db, APPOINTMENTS_COLLECTION),
    orderBy("date", "asc"),
    orderBy("startTime", "asc"),
  );

  const snapshot = await getDocs(appointmentsQuery);

  return snapshot.docs.map((docSnapshot) => {
    const data = docSnapshot.data();

    return {
      id: docSnapshot.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as Appointment;
  });
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus,
) {
  const appointmentRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);

  await updateDoc(appointmentRef, {
    status,
    updatedAt: Timestamp.now(),
  });
}
