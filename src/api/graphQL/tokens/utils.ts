export const getConditionBySearchText = (searchText: string | null | undefined) => {
  const trimmedText = searchText?.trim();

  if (!trimmedText) {
    return null;
  }

  return { token_name: { _ilike: `%${trimmedText}%` } };
};
