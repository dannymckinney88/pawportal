import { Suspense } from "react";
import { NewSessionForm } from "./NewSessionForm";

export default function NewSessionPage() {
  return (
    <Suspense fallback={<div className="bg-background min-h-screen" />}>
      <NewSessionForm />
    </Suspense>
  );
}
