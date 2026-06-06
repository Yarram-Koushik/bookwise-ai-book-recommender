import BookCard from './BookCard.jsx';

function BookGrid({ books = [], showScore = false }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {books.map((book) => (
        <BookCard key={`${book.title}-${book.author}`} book={book} showScore={showScore} />
      ))}
    </div>
  );
}

export default BookGrid;
