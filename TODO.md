# TODO: Modify Item Model for Media Support

## Tasks
- [ ] Update Item Model (models/Item.ts): Change images to media with type and url
- [ ] Update Types (app/types/index.ts): Change images to media
- [ ] Update Cloudinary Library (lib/cloudinary.ts): Rename uploadImage to uploadMedia, support videos
- [ ] Update Upload API (app/api/upload/route.ts): Use uploadMedia, return type
- [ ] Update Item Form (components/ItemForm.tsx): Support videos, update previews
- [ ] Update Item Page (app/item/[slug]/page.tsx): Display media, show video thumbnail if only videos
