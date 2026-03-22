import { useParams } from "react-router-dom";
import { ImageWithTitleCard } from "../../components/common/card/single-card.component";

const CATEGORIES = [
  {
    _id: "electric-stove",
    title: "Electric stove",
    slug: "/category/electric-stove",
    image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=600&h=450&fit=crop",
  },
  {
    _id: "induction-stove",
    title: "Induction stove",
    slug: "/category/induction-stove",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=450&fit=crop",
  },
];

export const CategoryPage = () => {
  const params = useParams();

  if (params.slug) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="section-heading capitalize">
          {params.slug.replace(/-/g, " ")}
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="section-heading mb-8">All Categories</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {CATEGORIES.map((cat) => (
            <ImageWithTitleCard key={cat._id} data={cat} />
          ))}
        </div>
      </div>
    </div>
  );
};