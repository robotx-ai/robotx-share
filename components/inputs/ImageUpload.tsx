"use client";

import Image from "next/image";
import React, { useCallback, useRef, useState } from "react";
import { TbPhotoPlus } from "react-icons/tb";

type Props = {
  onChange: (value: string) => void;
  value: string;
};

function ImageUpload({ onChange, value }: Props) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error ?? "Upload failed");
        }

        const { url } = await res.json();
        onChange(url);
      } catch (err) {
        console.error("Image upload error:", err);
      } finally {
        setLoading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [onChange]
  );

  return (
    <div
      onClick={() => !loading && inputRef.current?.click()}
      className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <TbPhotoPlus size={50} />
      <div className="font-semibold text-lg">
        {loading ? "Uploading..." : "Click to upload"}
      </div>
      {value && (
        <div className="absolute inset-0 w-full h-full">
          <Image
            alt="Uploaded service"
            fill
            style={{ objectFit: "cover" }}
            src={value}
          />
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
