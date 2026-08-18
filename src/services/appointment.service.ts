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

import { db } from "@/lib/firebase/firestore";
import { auth } from "@/lib/firebase/auth";

import type {
  Appointment,
  AppointmentStatus,
} from "@/types/appointment";

const APPOINTMENTS_COLLECTION = "appointments";

export async function createAppointment(
  appointment: Omit<
    Appointment,
    "id" | "createdAt" | "updatedAt"
  >,
) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const now = Timestamp.now();

  const docRef = await addDoc(
    collection(db, APPOINTMENTS_COLLECTION),
    {
      ...appointment,
      ownerId: user.uid,
      createdAt: now,
      updatedAt: now,
    },
  );

  return docRef.id;
}

export async function getAppointments(): Promise<Appointment[]> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const appointmentsQuery = query(
    collection(db, APPOINTMENTS_COLLECTION),
    where("ownerId", "==", user.uid),
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
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const appointmentRef = doc(
    db,
    APPOINTMENTS_COLLECTION,
    appointmentId,
  );

  await updateDoc(appointmentRef, {
    status,
    updatedAt: Timestamp.now(),
  });
}