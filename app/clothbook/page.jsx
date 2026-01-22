"use client";
import { useCloths } from "./useClothBook";

export default function ClothsPage() {
  const { cloths, loading, error } = useCloths();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong</p>;

  return (
    <ul>
      {cloths.map((cloth) => (
        <li key={cloth.id}>{cloth.name}</li>
      ))}
    </ul>
  );
}
