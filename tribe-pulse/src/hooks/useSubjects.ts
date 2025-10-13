import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  increment,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { DEFAULT_SUBJECTS } from "@/data/defaultSubjects";

/**
 * Algorithmic subject updater.
 * Each time a tribe is created, this will:
 *  1. Add new subject fields if they don’t exist.
 *  2. Increment usage counts for existing ones.
 */
export async function updateSubjects(subjects: string[]) {
  const subjectsRef = collection(db, "subjects");

  for (const subject of subjects) {
    const id = subject.toLowerCase().replace(/\s+/g, "_");
    const docRef = doc(subjectsRef, id);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      // Increase popularity count
      await setDoc(docRef, { usageCount: increment(1) }, { merge: true });
    } else {
      // Create a new subject document
      await setDoc(docRef, {
        name: subject,
        usageCount: 1,
        createdAt: serverTimestamp(),
      });
    }
  }
}

/**
 * Hook: usePopularSubjects
 * Fetches the most popular (or default) subjects dynamically.
 */
export function usePopularSubjects(limitCount = 20) {
  const [subjects, setSubjects] = useState<string[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const q = query(
          collection(db, "subjects"),
          orderBy("usageCount", "desc"),
          limit(limitCount)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          // Fallback to defaults if no data yet
          setSubjects(DEFAULT_SUBJECTS);
        } else {
          setSubjects(snapshot.docs.map((d) => d.data().name as string));
        }
      } catch (error) {
        console.error("Error loading subjects:", error);
        setSubjects(DEFAULT_SUBJECTS);
      }
    };

    fetchSubjects();
  }, [limitCount]);

  return subjects;
}
