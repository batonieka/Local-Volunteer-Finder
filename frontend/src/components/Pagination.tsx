interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  // Only create the pages array once - remove the duplicate logic
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Don't render pagination if there's only 1 page or no pages
  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex justify-center mt-4 gap-2"
      role="navigation"
      aria-label="Pagination"
      style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', gap: '0.5rem' }}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
        style={{
          padding: '0.5rem 1rem',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '6px',
          backgroundColor: currentPage === 1 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
          color: 'inherit',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.5 : 1
        }}
      >
        Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '6px',
            backgroundColor: page === currentPage ? '#646cff' : 'rgba(255, 255, 255, 0.05)',
            color: page === currentPage ? 'white' : 'inherit',
            cursor: 'pointer'
          }}
          aria-label={`Go to page ${page}`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
        style={{
          padding: '0.5rem 1rem',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '6px',
          backgroundColor: currentPage === totalPages ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
          color: 'inherit',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages ? 0.5 : 1
        }}
      >
        Next
      </button>
    </nav>
  );
};