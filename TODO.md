# TODO List - Lemmah Couture Fixes

## Issue 1: Fix Favourite Not Working (Client Side)
- [x] Fix `useAnonymousUser` hook to properly initialize user ID
- [x] Ensure userId is available synchronously from localStorage
- [x] Add error handling for SSR/localStorage issues

## Issue 2: Change Image Upload to Submit-Time
- [x] Modify `ItemForm.tsx` to store files locally (not upload immediately)
- [x] Add image preview using URL.createObjectURL()
- [x] Update `handleSubmit` to upload images on form submission

## Issue 3: Add Share Button to Admin Items
- [x] Add Share icon button in admin items table
- [x] Implement Web Share API with social media fallbacks
- [x] Create share URL for items

