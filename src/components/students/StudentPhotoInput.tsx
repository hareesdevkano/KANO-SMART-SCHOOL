import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { uploadStudentPhoto, getStudentPhotoUrl } from "@/utils/studentPhoto";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  value?: string | null;
  onChange: (path: string | null) => void;
}

const StudentPhotoInput = ({ value, onChange }: Props) => {
  const { schoolId } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let active = true;
    getStudentPhotoUrl(value).then((url) => {
      if (active) setPreview(url);
    });
    return () => {
      active = false;
    };
  }, [value]);

  const handleFile = async (file?: File) => {
    if (!file || !schoolId) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo must be smaller than 5MB");
      return;
    }
    setUploading(true);
    try {
      const path = await uploadStudentPhoto(file, schoolId);
      onChange(path);
      toast.success("Photo uploaded");
    } catch (error) {
      toast.error("Photo upload failed: " + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="w-20 h-24 rounded-md border-2 border-border bg-muted/40 overflow-hidden flex items-center justify-center flex-shrink-0">
        {preview ? (
          <img src={preview} alt="Student passport photograph" className="w-full h-full object-cover" />
        ) : (
          <User className="w-8 h-8 text-muted-foreground/60" />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Camera className="w-4 h-4 mr-2" />
          )}
          {value ? "Change Photo" : "Upload Photo"}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={() => onChange(null)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};

export default StudentPhotoInput;
