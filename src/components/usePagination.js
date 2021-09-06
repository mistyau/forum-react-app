// custom hook

import { useMemo } from "react";

export const DOTS = '...';

const range = (start, end) => {
    let length = end - start + 1;

    // create an array of certain length and set the elements within it from start value to end value
    return Array.from({length}, (_, index) => index + start);
};

export const usePagination = ({
    totalCount,         // total count of data available
    pageSize,           // the max data that is visible in a 
                        // ..single page
    siblingCount = 1,   // optional: the min # of page 
                        // ..buttons to be shown on each
                        // ..side of the current page 
                        // ..button. Defaults to 1;
    currentPage         // current active page, i = 1
}) => {
    const paginationRange = useMemo(() => {
        const totalPageCount = Math.ceil(totalCount / pageSize);

        // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS(...)
        const totalPageNumbers = siblingCount + 5;

        // case 1: if # of pages is less than the page
        // ..numbers we want to show in our pagination
        // ..component, we return the range
        // ..[1..totalPageCount]
        if (totalPageNumbers >= totalPageCount) {
            return range(1, totalPageCount);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(
            currentPage + siblingCount,
            totalPageCount
        );

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPageCount;

        // case 2
        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 1 * siblingCount;
            let leftRange = range(1, leftItemCount);

            return [...leftRange, DOTS, totalPageCount];
        }

        // case 3
        if (shouldShowLeftDots && !shouldShowRightDots) {
            let rightItemCount = 3 + 2 * siblingCount;
            let rightRange = range(
                totalPageCount - rightItemCount + 1,
                totalPageCount
            );
            return [firstPageIndex, DOTS, ...rightRange];
        }

        // case 4
        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = range(leftSiblingIndex, rightSiblingIndex);

            return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
        }

    }, [totalCount, pageSize, siblingCount, currentPage]);

    return paginationRange;
};