import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Clapperboard } from "lucide-react";
import { supabase } from "@/lib/supabase"; // Ajusta la ruta a tu proyecto

const INSTAGRAM_URL = "https://www.instagram.com/mgcleaning_melbourne/";

const fallbackPosts = [
  { id: "fallback-1", src: "/images/igm1.webp", alt: "Clean bedroom" },
  { id: "fallback-2", src: "/images/igm2.webp", alt: "Eco cleaning products" },
  { id: "fallback-3", src: "/images/igm3.webp", alt: "Sparkling kitchen" },
  { id: "fallback-4", src: "/images/igm1.webp", alt: "Kitchen transformation" },
  { id: "fallback-5", src: "/images/igm2.webp", alt: "Bathroom revival" },
  { id: "fallback-6", src: "/images/igm3.webp", alt: "Living room refresh" },
];

export default function InstagramFeed() {
  const [posts, setPosts] = useState(fallbackPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchInstagramPosts() {
      try {
        const { data, error } = await supabase.functions.invoke(
          "instagram-feed",
          { method: "GET" },
        );

        if (error) throw error;

        if (active && Array.isArray(data?.posts) && data.posts.length) {
          setPosts(data.posts.slice(0, 6));
        }
      } catch (error) {
        console.error("Instagram feed error:", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchInstagramPosts();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-24 md:py-40 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-brand text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Follow Us
          </p>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-ink mb-6">
            @mgcleaning_melbourne
          </h2>
        </motion.div>

        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
          aria-busy={loading}
        >
          {posts.map((post, i) => (
            <motion.a
              key={post.id}
              href={post.permalink || INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View Instagram post: ${post.alt || "MG Cleaning"}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="aspect-square rounded-2xl overflow-hidden group relative bg-gray-100"
            >
              <img
                src={post.src}
                alt={post.alt || "MG Cleaning Instagram post"}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src =
                    fallbackPosts[i % fallbackPosts.length].src;
                }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {post.mediaType === "VIDEO" && (
                <Clapperboard
                  className="absolute top-3 right-3 w-5 h-5 text-white drop-shadow-md"
                  aria-hidden="true"
                />
              )}

              <div className="absolute inset-0 bg-brand/0 group-hover:bg-brand/30 transition-colors duration-500 flex items-center justify-center">
                <Instagram className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-10"
        >
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand font-semibold hover:underline"
          >
            <Instagram className="w-5 h-5" />
            Follow us on Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
}
