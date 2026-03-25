"use client";

import React from "react";
import ClassDetailsPage from "@/components/admin/classes/ClassDetailsPage";

interface ClassDetailsPageRouteProps {
  params: Promise<{
    classId: string;
  }>;
}

export default function ClassDetailsPageRoute({ params }: ClassDetailsPageRouteProps) {
  // Unwrap params (Next.js 16 returns a Promise)
  const unwrappedParams = React.use(params);
  
  return <ClassDetailsPage classId={unwrappedParams.classId} />;
}
