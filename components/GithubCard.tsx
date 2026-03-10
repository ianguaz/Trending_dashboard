interface GithubRepo {
  name: string;
  desc: string;
  stars: string;
  today: string;
  language: string;
  url: string;
}

export default function GithubCard({ repo, rank }: { repo: GithubRepo; rank: number }) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group"
    >
      <span className="text-gray-300 font-mono text-sm w-5 shrink-0 pt-0.5">
        {rank}
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-blue-600 group-hover:text-blue-700 truncate text-sm">
          {repo.name}
        </div>
        {repo.desc && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{repo.desc}</p>
        )}
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
          {repo.language && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
              {repo.language}
            </span>
          )}
          <span>⭐ {repo.stars}</span>
          {repo.today && (
            <span className="text-green-600 font-medium">{repo.today}</span>
          )}
        </div>
      </div>
    </a>
  );
}
