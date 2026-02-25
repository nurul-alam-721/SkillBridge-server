// helpers/paginationSortingHelper.ts

import { TutorSortableFields } from "../modules/tutorProfiles/tutor.service";

export type PaginationSortingResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: TutorSortableFields;
  sortOrder: "asc" | "desc";
};

export const paginationSortingHelper = (
  query: Record<string, unknown>
): PaginationSortingResult => {
  const page = query.page ? Number(query.page) : 1;
  const limit = query.limit ? Number(query.limit) : 10;
  const skip = (page - 1) * limit;

  const allowedSortFields: TutorSortableFields[] = ["createdAt", "hourlyRate", "rating", "experience"];
  const sortBy =
    typeof query.sortBy === "string" && allowedSortFields.includes(query.sortBy as TutorSortableFields)
      ? (query.sortBy as TutorSortableFields)
      : "createdAt";

  const sortOrder = query.sortOrder === "desc" ? "desc" : "asc";

  return { page, limit, skip, sortBy, sortOrder };
};
