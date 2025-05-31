"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";

// Calculate "time ago" from created_at timestamp
// const getTimeAgo = (createdAt) => {
//   if (!createdAt) return "Unknown time";
//   const dt = DateTime.fromISO(createdAt);
//   return dt.toRelative({ base: DateTime.now() }) || "Just now";
// };

// Choose posts to display: currently no mustRead field, so pick newest 4
const getDisplayPosts = (data) => {
  return [...data]
    .sort(
      (a, b) =>
        DateTime.fromISO(b.created_at).toMillis() -
        DateTime.fromISO(a.created_at).toMillis()
    )
    .slice(0, 4);
};

const MustRead = ({ posts }) => {
  // const [posts, setPosts] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   fetch("http://localhost:8000/api/news")
  //     .then((res) => {
  //       if (!res.ok) throw new Error("Failed to fetch data");
  //       return res.json();
  //     })
  //     .then((data) => {
  //       const adaptedData = data.map((item) => ({
  //         id: item.id,
  //         image: item.image
  //           ? `http://localhost:8000/storage/${item.image}`
  //           : "/Logo1.jpg",
  //         title: item.title,
  //         author: item.author || item.postedBy || "Unknown",
  //         timeAgo: item.created_at
  //           ? DateTime.fromISO(item.created_at).toRelative()
  //           : "1 hour ago",
  //         description: item.meta_description || item.content || "",
  //         // Parse categories JSON string and join all categories with commas
  //         categories: (() => {
  //           try {
  //             const cats = JSON.parse(item.categories || "[]");
  //             if (Array.isArray(cats)) return cats.join(", ");
  //             return item.categories || "General";
  //           } catch {
  //             return item.categories || "General";
  //           }
  //         })(),
  //         readTime: "3 min read", // no readTime field, fallback to default
  //         mustRead: false, // no mustRead field in schema, default false
  //       }));
  //       setPosts(adaptedData);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setError(err.message);
  //       setLoading(false);
  //     });
  // }, []);

  // if (loading) {
  //   return <div className="p-4 text-center">Loading must-read news...</div>;
  // }

  // if (error) {
  //   return <div className="p-4 text-center text-red-600">Error: {error}</div>;
  // }

  const router = useRouter();

  if (!posts.length) {
    return <div className="p-4 text-center">No must-read news available.</div>;
  }

  const postsToDisplay = getDisplayPosts(posts);

  const formatPosted = (dateString) => {
    if (!dateString) return "";
    const dt = DateTime.fromISO(dateString);
    const now = DateTime.now();
    const diff = now.diff(dt, ["hours", "days"]);
    if (diff.days >= 1) return dt.toFormat("LLL dd, yyyy");
    if (diff.hours >= 1) return `${Math.floor(diff.hours)} hours ago`;
    return "Just now";
  };

  return (
    <div className="px-4 py-10 lg:mx-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Must Read</h2>
        <div className="flex items-center text-red-600 font-semibold cursor-pointer">
          <span>See all</span>
          <ArrowRight className="ml-1 w-4 h-4" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Highlight */}
        <div className="lg:col-span-2 cursor-pointer" onClick={() => router.push(`/post/${postsToDisplay[0].slug}`)}>
          <div className="rounded-lg overflow-hidden">
            <Image
              src={`http://localhost:8000/storage/${postsToDisplay[0].image}`}
              alt={postsToDisplay[0].title}
              width={600}
              height={400}
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold mt-1">
              {postsToDisplay[0].title}
            </h3>
            {postsToDisplay[0].meta_description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                {postsToDisplay[0].meta_description}
              </p>
            )}
            <p className="text-xs text-red-600 mt-2">
              {(() => {
                if (!postsToDisplay[0].categories) return "General";
                try {
                  const cats = JSON.parse(postsToDisplay[0].categories);
                  if (Array.isArray(cats) && cats.length > 0) {
                    return cats.join(", ");
                  } else {
                    return "General";
                  }
                } catch {
                  return postsToDisplay[0].categories || "General";
                }
              })()}
              {/* •  */}
              {/* {postsToDisplay[0].readTime} */}
            </p>
          </div>
        </div>

        {/* Side List */}
        <div className="space-y-5">
          {postsToDisplay.slice(1).map((item) => {
            const categoriesText = () => {
              if (!item.categories) return "General";
              try {
                const cats = JSON.parse(item.categories);
                if (Array.isArray(cats) && cats.length > 0) {
                  return cats.join(", ");
                } else {
                  return "General";
                }
              } catch {
                return item.categories || "General";
              }
            };
            return (
              <div onClick={() => router.push(`/post/${item.slug}`)} key={item.id} className="flex space-x-3 cursor-pointer">
                <div className="w-28 h-20 overflow-hidden rounded-md flex-shrink-0">
                  <Image
                    src={`http://localhost:8000/storage/${item.image}`}
                    alt={item.title}
                    width={112}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <h4 className="text-sm font-semibold leading-tight line-clamp-3">
                    {item.title}
                  </h4>
                  <div className="flex justify-between">
                    <div className="text-xs text-red-600">
                      {categoriesText()}
                      {/* •  */}
                      {/* {item.readTime} */}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatPosted(item.created_at)}
                      {/* {item.timeAgo} */}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MustRead;