"use client";
import { Label } from "@/components/ui/label";
import { UserProfile } from "../types";
import { BadgeCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";

interface Props {
  user: UserProfile;
}

export default function ProfileInfos({ user }: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };
  return (
    <div className="flex flex-col md:flex-row items-start gap-5 md:gap-20 p-6 rounded-xl shadow bg-white justify-center">
      <div className="flex flex-col items-center w-full md:w-fit">
        <picture>
          <Label
            htmlFor="picture"
            className="w-40 h-40 rounded-full bg-[#CAC5C5] cursor-pointer relative overflow-hidden"
          >
            {preview && (
              <Image
                src={preview}
                fill
                alt="preview"
                className="absolute w-full h-full object-cover"
              />
            )}
          </Label>
          <Input
            id="picture"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </picture>

        <h2 className="mt-4 text-sm font-semibold">{user.username}</h2>
        <div className="flex gap-1.5">
          <p className="text-sm text-gray-500">{user.email}</p>
          {user.verified && (
            <span className="text-blue-500">
              <BadgeCheck className="inline w-4 h-4" />
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 text-sm md:w-fit mx-auto md:mx-0">
        {user.sections.map((section, i) => (
          <div key={i}>
            <h3 className="font-semibold">{section.title}</h3>
            {section.fields.map((field, j) => (
              <p key={j} className="flex items-center gap-2 p-2 font-light">
                {field.icon}
                {field.label}
                {field.label.includes("Date") || field.label.includes("Ajouté")
                  ? new Date(field.value).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : field.value}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
