import { useRef, useEffect, useState } from "react";

export default function NotificationsMarquee({ notifications, router }) {
  const marqueeRef = useRef(null);
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    if (marqueeRef.current) {
      setScrollWidth(marqueeRef.current.scrollWidth);
    }
  }, [notifications]);

  return (
    <>
      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(600%);
          }
          to {
            transform: translateX(calc(-${scrollWidth}px));
          }
        }
      `}</style>

      <div className="relative bg-gray-100 border border-gray-300 py-2 px-4 overflow-hidden rounded mb-6">
        <span className="absolute left-4 top-2 text-red-600 font-semibold z-10 bg-gray-100 px-2">
          News Update:
        </span>

        <div className="pl-32 overflow-hidden whitespace-nowrap">
          <div
            ref={marqueeRef}
            className="inline-block"
            style={{
              animation: scrollWidth
                ? `marquee ${scrollWidth / 10}s linear infinite` // duration proportional to length
                : "none",
            }}
          >
            {notifications.map((item, idx) => (
              <span
                onClick={() => router.push(item.link)}
                key={`${item.id}-${idx}`}
                className="inline-flex items-center space-x-3 mr-10 text-sm cursor-pointer"
              >
                <span>{item.title}</span>
                <span className="text-red-500 font-bold text-lg leading-none">
                  •
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}