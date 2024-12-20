"use client";
import { useParams } from "next/navigation";

export default function DriveInfo() {
  const { id } = useParams() as { id: string };

  return (
    <div>
      <p>You are viewing the dynamic route for: {id}</p>
    </div>
  );
}
