import Pagination from "react-bootstrap/Pagination";
import { usePagination, DOTS } from "./usePagination";

export default function CustomPagination({ onPageChange, currentPage, totalCount, siblingCount = 1, pageSize }) {

    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize
    });

    if (currentPage === 0 || paginationRange.length < 2) {
        return null;
    }

    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    let lastPage = paginationRange[paginationRange.length - 1];
    return (
        <Pagination className="d-flex justify-content-center">
            <Pagination.Prev disabled={currentPage === 1} onClick={onPrevious} />
            {paginationRange.map((pageNumber, index) => {

                if (pageNumber === DOTS) {
                    return <Pagination.Ellipsis key={index} />;
                }

                return (
                    <Pagination.Item active={pageNumber === currentPage} onClick={() => onPageChange(pageNumber)} key={index} >{pageNumber} </Pagination.Item>
                );
            })}
            <Pagination.Next disabled={currentPage === lastPage} onClick={onNext} />
        </Pagination>
    );
}