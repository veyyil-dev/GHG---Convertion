"use client";
import ScopeTwoFactors from "./Activities/ScopeTwoFactors";

export default function ScopeTwoSelection({ pageChange, onChange }) {
  return (
    <ScopeTwoFactors
      pageChange={pageChange}
      onChange={onChange}
    />
  );
}