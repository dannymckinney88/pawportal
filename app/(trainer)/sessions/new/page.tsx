import { Suspense } from "react";
import { NewSessionForm } from "./NewSessionForm";

export default function NewSessionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <NewSessionForm />
    </Suspense>
  );
}
