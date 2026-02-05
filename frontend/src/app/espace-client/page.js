"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Espace client : redirection vers le dashboard habitant.
 * L'URL /espace-client mène vers le même contenu que /espace-habitant (tableau de bord).
 */
export default function EspaceClientPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/espace-habitant");
  }, [router]);

  return (
    <div className="min-h-screen bg-bouilly-cream flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bouilly-green mx-auto mb-4" />
        <p className="text-gray-600">Redirection vers l&apos;espace citoyen...</p>
      </div>
    </div>
  );
}
