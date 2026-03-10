interface PHProduct {
  name: string;
  desc: string;
  votes: number;
  url: string;
  thumbnail: string;
  topics: string[];
}

export default function ProductHuntCard({ product, rank }: { product: PHProduct; rank: number }) {
  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-sm transition-all group"
    >
      {/* Thumbnail */}
      <div className="shrink-0">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-10 h-10 rounded-lg object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-400 text-lg font-bold">
            {product.name[0]}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="font-semibold text-sm group-hover:text-orange-600 truncate">
            {product.name}
          </div>
          <div className="shrink-0 flex flex-col items-center text-orange-500 bg-orange-50 rounded-lg px-2 py-0.5 min-w-[40px]">
            <span className="text-xs">▲</span>
            <span className="text-xs font-bold leading-none">{product.votes}</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.desc}</p>
        {product.topics.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {product.topics.map((t) => (
              <span key={t} className="text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
