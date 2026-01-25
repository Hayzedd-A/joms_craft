import { connectToDatabase } from "@/lib/mongodb";
import { Item } from "@/models/Item";
import { notFound } from "next/navigation";
const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getItem(slug: string) {
  await connectToDatabase();
  const item = await Item.findOne({ slug });
  if (!item) return null;
  return { ...item.toObject(), _id: item._id.toString() };
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const item = await getItem(slug);

  if (!item) return {};

  return {
    title: item.name,
    description: item.description ?? "Check out this item",
    openGraph: {
      title: item.name,
      description: item.description ?? "Check out this item",
      url: `${baseUrl}/item/${item.slug}`,
      type: "website",
      images: [
        {
          url: item.media.find(media => media.type === 'image')?.url || item.media[0]?.url || `${baseUrl}/default-og-image.jpg`,
          width: 1200,
          height: 630,
          alt: item.name,
        },
      ],
    },
  };
}

export default async function ItemPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getItem(slug);

  if (!item) notFound();

  const hasOnlyVideos = item.media.every(m => m.type === 'video');
  const firstMedia = item.media[0];

  return (
    <main>
      <h1>{item.name}</h1>
      {hasOnlyVideos && firstMedia ? (
        <video src={firstMedia.url} controls className="w-full max-w-md" />
      ) : firstMedia ? (
        <img src={firstMedia.url} alt={item.name} />
      ) : null}
      <p>{item.description}</p>
    </main>
  );
}
