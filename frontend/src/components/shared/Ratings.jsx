
const StarIcon = ({ fill }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    className="w-4 h-4 inline-block"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id={`star-fill-${fill}`}>
        <stop offset={`${fill * 100}%`} stopColor="#facc15" />
        <stop offset={`${fill * 100}%`} stopColor="#d1d5db" />
      </linearGradient>
    </defs>
    <path
      fill={`url(#star-fill-${fill})`}
      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.447a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.538 1.118L10.588 15.6a1 1 0 00-1.176 0l-3.367 2.447c-.783.57-1.838-.196-1.538-1.118l1.287-3.957a1 1 0 00-.363-1.118L2.064 9.384c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.284-3.957z"
    />
  </svg>
);

const Ratings = ({ value = 0, text }) => {
  return (
    <div className="flex items-center">
      <span className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => {
          const fill = Math.max(0, Math.min(1, value - i));
          return <StarIcon key={i} fill={fill} />;
        })}
      </span>
      {text && <span className="ml-1 text-gray-500 text-sm">{text}</span>}
    </div>
  );
};

export default Ratings;