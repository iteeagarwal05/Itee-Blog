export const buildQueryOptions = (reqQuery, searchableFields = []) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
    isPublished = true,
    isDeleted = false,
  } = reqQuery;

  // Construct the main query with optional search
  const regex = new RegExp(search, "i");

  const searchQuery = search
    ? {
        $or: searchableFields.map((field) =>
          field === "tags"
            ? { [field]: { $in: [regex] } }
            : { [field]: { $regex: regex } }
        ),
      }
    : {};

  // Always include filters like isPublished and isDeleted
  const filters = {
    isPublished: isPublished === "true",
    isDeleted: isDeleted === "true" ? true : false, // fallback to false if not provided
  };

  const query = { ...filters, ...searchQuery };

  const pagination = {
    skip: (page - 1) * limit,
    limit: Number(limit),
    page: Number(page),
  };

  const sort = {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };

  return { query, pagination, sort };
};
