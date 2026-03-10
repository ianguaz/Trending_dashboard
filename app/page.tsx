import GithubCard from "@/components/GithubCard";
import ProductHuntCard from "@/components/ProductHuntCard";
import githubRaw from "@/data/github.json";
import phRaw from "@/data/producthunt.json";

interface GithubRepo {
  name: string; desc: string; stars: string; today: string; language: string; url: string;
}
interface PHProduct {
  name: string; desc: string; votes: number; url: string; thumbnail: string; topics: string[];
}

const githubData = githubRaw as { date: string; items: GithubRepo[] };
const phData = phRaw as { date: string; items: PHProduct[] };

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight">每日科技趋势</h1>
            <p className="text-xs text-gray-400 mt-0.5">每天北京时间 00:00 自动更新</p>
          </div>
          <div className="text-xs text-gray-400 bg-gray-100 rounded-full px-3 py-1">
            {githubData.date}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* GitHub Trending */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              <h2 className="font-semibold">GitHub Trending</h2>
              <span className="text-xs text-gray-400 ml-auto">今日热门项目</span>
            </div>
            <div className="space-y-2">
              {githubData.items.map((repo, i) => (
                <GithubCard key={repo.name} repo={repo} rank={i + 1} />
              ))}
            </div>
          </section>

          {/* Product Hunt */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-orange-500 font-bold text-base">▲</span>
              <h2 className="font-semibold">Product Hunt</h2>
              <span className="text-xs text-gray-400 ml-auto">今日热门产品</span>
            </div>
            <div className="space-y-2">
              {phData.items.map((product, i) => (
                <ProductHuntCard key={product.url} product={product} rank={i + 1} />
              ))}
            </div>
          </section>

        </div>
      </main>

      <footer className="text-center text-xs text-gray-300 py-8">
        数据来源：GitHub Trending · Product Hunt &nbsp;·&nbsp; 每日北京时间 00:00 更新
      </footer>
    </div>
  );
}
