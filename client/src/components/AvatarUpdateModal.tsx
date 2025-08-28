import { useState, useRef, ChangeEvent, useCallback } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2, Upload, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadAvatar } from "@/services/profile.service";
import { toast } from "sonner";

interface AvatarUpdateModalProps {
  children: React.ReactNode;
}

export function AvatarUpdateModal({ children }: AvatarUpdateModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type. Please upload an image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Please upload an image smaller than 5MB");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragging) setIsDragging(true);
    },
    [isDragging]
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (!file) return;

      // Reuse the same validation as file input
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type. Please upload an image.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large. Please upload an image smaller than 5MB");
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    },
    [toast]
  );

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const {mutate, isPending} = useMutation({
    mutationFn: () => uploadAvatar(selectedFile),
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], (prev: any) => {
        if (!prev?.user) return prev;

        return {
          ...prev,
          user: {
            ...prev.user,
            avatar: data.avatar,
          },
        };
      });

      toast.success("Avatar uploaded successfully");
      setOpen(false);
      handleRemoveImage();
    },
    onError: (e) => {
      console.log(e);
      toast.error("Failed to upload avatar");
    },
  });

  const handleSubmit = async () => {
    if (!selectedFile) return;
    mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div
            ref={dropAreaRef}
            className={`flex flex-col items-center space-y-4 p-4 rounded-lg transition-colors ${
              isDragging
                ? "bg-primary/10 border-2 border-dashed border-primary"
                : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-48 w-48 rounded-full object-cover border-2 border-dashed border-gray-300"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 rounded-full h-8 w-8"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove image</span>
                </Button>
              </div>
            ) : (
              <div className="h-48 w-48 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                <Upload className="h-12 w-12 text-gray-400" />
              </div>
            )}

            <div className="w-full text-center">
              <Label htmlFor="avatar-upload" className="sr-only">
                Choose profile picture
              </Label>
              <Input
                id="avatar-upload"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <p className="text-sm text-muted-foreground mb-2">
                {isDragging
                  ? "Drop the image here"
                  : "Drag and drop an image here, or click to select"}
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? "Change Image" : "Select Image"}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                JPG, PNG, or WebP. Max 5MB.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setOpen(false);
              handleRemoveImage();
            }}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedFile || isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Update Avatar"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
