import { ItemProps } from "@/app/types";
import Image from "next/image";

type MediaPreviewProps = {
  itemName: ItemProps["name"];
  media: ItemProps["media"][number];
};

function MediaPreview({ media, itemName }: MediaPreviewProps) {
  return media.type === "image" ? (
    <Image
      src={media.url}
      alt={itemName}
      fill
      loading="lazy"
      className="object-cover"
      sizes="(max-width: 640px) 100vw, 500px"
    />
  ) : media.type === "video" ? (
    <video controls className="w-full h-auto rounded-lg">
      <source src={media.url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  ) : null;
}
export default MediaPreview;