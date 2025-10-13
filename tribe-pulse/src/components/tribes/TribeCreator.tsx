import { useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { usePopularSubjects, updateSubjects } from "@/hooks/useSubjects";

/**
 * TribeCreator Component
 * Allows users to create a new Tribe.
 * Automatically updates the subject list algorithmically.
 */
export default function TribeCreator() {
  const { currentUser } = useAuth();
  const subjects = usePopularSubjects();
  const [newTribe, setNewTribe] = useState({
    name: "",
    description: "",
    subjects: [] as string[],
    visibility: "public",
  });

  const handleCreateTribe = async () => {
    if (!newTribe.name.trim()) {
      toast.error("Tribe name is required");
      return;
    }

    try {
      // Save new tribe to Firestore
      await addDoc(collection(db, "tribes"), {
        name: newTribe.name,
        description: newTribe.description,
        subjects: newTribe.subjects,
        visibility: newTribe.visibility,
        createdBy: currentUser?.uid,
        members: [currentUser?.uid],
        createdAt: serverTimestamp(),
      });

      // Algorithmically update subjects collection
      await updateSubjects(newTribe.subjects);

      toast.success("Tribe created successfully!");
      setNewTribe({
        name: "",
        description: "",
        subjects: [],
        visibility: "public",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create tribe");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Create New Tribe</h2>

      <Input
        placeholder="Tribe Name"
        value={newTribe.name}
        onChange={(e) => setNewTribe({ ...newTribe, name: e.target.value })}
        className="mb-3"
      />

      <Textarea
        placeholder="Describe your tribe..."
        value={newTribe.description}
        onChange={(e) =>
          setNewTribe({ ...newTribe, description: e.target.value })
        }
        className="mb-3"
      />

      <label className="block text-sm font-medium mb-1">Select up to 3 Subjects</label>
      <Select
        onValueChange={(val) =>
          setNewTribe((p) => ({
            ...p,
            subjects: p.subjects.includes(val)
              ? p.subjects.filter((s) => s !== val)
              : [...p.subjects, val].slice(0, 3),
          }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select subjects" />
        </SelectTrigger>
        <SelectContent>
          {subjects.map((subject) => (
            <SelectItem key={subject} value={subject}>
              {subject}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <label className="block text-sm font-medium mt-4 mb-1">Visibility</label>
      <Select
        value={newTribe.visibility}
        onValueChange={(v) => setNewTribe({ ...newTribe, visibility: v })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Choose visibility" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="public">General / Public</SelectItem>
          <SelectItem value="invitational">Invitational</SelectItem>
          <SelectItem value="private">Private</SelectItem>
        </SelectContent>
      </Select>

      <Button
        onClick={handleCreateTribe}
        className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        Create Tribe
      </Button>
    </div>
  );
}

