import { useState, useCallback } from "react";

export interface FilterOptions {
  limit?: number;
  page?: number;
  filter?: { [key: string]: string | boolean | number };
  sort?: { [key: string]: "asc" | "desc" };
  fields?: string[];
  [key: string]: unknown;
}

const buildQueryString = (params: FilterOptions): string => {
  const queryParts: string[] = [];

  // Limit and Page
  if (params.limit !== undefined) queryParts.push(`limit=${params.limit}`);
  if (params.page !== undefined) queryParts.push(`page=${params.page}`);

  // Filters
  if (params.filter) {
    Object.entries(params.filter).forEach(([key, value]) => {
      if (value !== "") {
        // Exclude empty strings
        queryParts.push(`filter[${key}]=${value}`);
      }
    });
  }

  // Sorting
  if (params.sort) {
    Object.entries(params.sort).forEach(([key, direction]) => {
      queryParts.push(`sort=${key} ${direction}`);
    });
  }

  // Fields
  if (params.fields && params.fields.length > 0) {
    queryParts.push(`fields=${params.fields.join(",")}`);
  }

  // Other parameters (like email, verified, etc.)
  Object.entries(params).forEach(([key, value]) => {
    if (
      !["limit", "page", "filter", "sort", "fields"].includes(key) &&
      value !== ""
    ) {
      queryParts.push(`${key}=${value}`);
    }
  });

  return queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
};

const useApiQueryParams = (initialParams: FilterOptions = {}) => {
  const [params, setParams] = useState<FilterOptions>(initialParams);

  const setFilter = useCallback((newParams: FilterOptions) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  }, []);

  const getQueryString = useCallback(() => {
    return buildQueryString(params);
  }, [params]);

  return {
    params,
    setFilter,
    getQueryString,
  };
};

export default useApiQueryParams;
