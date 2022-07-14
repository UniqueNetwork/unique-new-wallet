export const getConditionBySearchText = (
  searchKey: string,
  searchText: string | null | undefined,
) => {
  const trimmedText = searchText?.trim();

  if (!trimmedText) {
    return null;
  }

  return { [searchKey]: { _ilike: `%${trimmedText}%` } };
};
