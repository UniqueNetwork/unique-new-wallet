import React, { useMemo } from 'react';

interface UsePaginationProps {
  total: number
  pageSize: number
  siblingCount?: number
  currentPage?: number
}

const DOTS = '...';

// create array of numbers (ex: [1,2,3,4,5,6,7])
const range = (start: number, end: number) => {
  const length = end - start + 1;

  return Array.from({ length }, (_, idx) => idx + start);
};

const getTotalPages = (
  totalCount: number,
  pageSize: number,
  siblingCount: number,
  currentPage: number
) => {
  const totalPageCount = Math.ceil(totalCount / pageSize);

  // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
  const totalPageNumbers = siblingCount + 5;

  /*
    If the number of pages is less than the page numbers we want to show in our
    paginationComponent, we return the range [1...totalPageCount]
  */
  if (totalPageNumbers >= totalPageCount) {
    return range(1, totalPageCount);
  }

  /*
    Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
  */
  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);

  /*
    We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
  */
  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPageCount;

  /*
     No left dots to show, but rights dots to be shown
  */
  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = range(1, leftItemCount);

    return [...leftRange, DOTS, totalPageCount];
  }

  /*
    No right dots to show, but left dots to be shown
  */
  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);

    return [firstPageIndex, DOTS, ...rightRange];
  }

  /*
    Both left and right dots to be shown
  */
  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = range(leftSiblingIndex, rightSiblingIndex);

    return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
  }

  return [1];
};

const usePagination = ({
 currentPage = 1,
  pageSize,
  siblingCount = 1,
  total
}: UsePaginationProps) => {
  const paginationRange = useMemo(() => {
    return getTotalPages(total, pageSize, siblingCount, currentPage);
  }, [total, pageSize, siblingCount, currentPage]);

  return paginationRange || [];
};

export type { UsePaginationProps };
export { DOTS };
export default usePagination;
