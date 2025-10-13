import { useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePopularSubjects } from "@/hooks/useSubjects";
import { toast } from "sonner";

/**
 * TribeFilter Component
 * Provides search + subject filter for tribe discovery
 */
export default function TribeFilter({ onResults }) {
  const subjects = usePopularSubjects();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const handleSearch = async () => {
    try {
      let q = collection(db, "tribes");
      if (selectedSubject)
        q = query(q, where("subjects", "array-contains", selectedSubject));

      const snap = await getDocs(q);
      let results = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      if (searchTerm) {
        results = results.filter(
          (t) =>
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      onResults(results);
    } catch (e) {
      console.error(e);
      toast.error("Search failed");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 mb-6">
      <Input
        placeholder="Search tribes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1"
      />

      <Select value={selectedSubject} onValueChange={setSelectedSubject}>
        <SelectTrigger className="md:w-56">
          <SelectValue placeholder="Filter by subject" />
        </SelectTrigger>
        <SelectContent>
          {subjects.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={handleSearch} className="bg-blue-600 text-white">
        Search
      </Button>
    </div>
  );
}
