import { supabase } from "@/integrations/supabase/client";

export const STUDENT_PHOTO_BUCKET = "student-photos";

/** Uploads a student passport photo and returns the storage path. */
export const uploadStudentPhoto = async (file: File, schoolId: string) => {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${schoolId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(STUDENT_PHOTO_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  return path;
};

/** Creates a temporary viewable URL for a stored photo path. */
export const getStudentPhotoUrl = async (path?: string | null) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const { data, error } = await supabase.storage
    .from(STUDENT_PHOTO_BUCKET)
    .createSignedUrl(path, 60 * 60);
  if (error) return null;
  return data?.signedUrl ?? null;
};

/** Resolves photo paths for many students at once (keyed by student id). */
export const getStudentPhotoUrls = async (
  students: { id: string; photo_url?: string | null }[]
) => {
  const entries = await Promise.all(
    students
      .filter((s) => !!s.photo_url)
      .map(async (s) => [s.id, await getStudentPhotoUrl(s.photo_url)] as const)
  );
  return Object.fromEntries(entries.filter(([, url]) => !!url)) as Record<string, string>;
};

/** Converts an image URL to a base64 data URL for PDF embedding. */
export const imageUrlToDataUrl = async (url: string) => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};
