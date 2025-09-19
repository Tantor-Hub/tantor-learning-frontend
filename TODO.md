# TODO: Add Subscribers Tab and Features to Admin Dashboard

## 1. Add Subscribers API Endpoint
- [x] Add `listSubscribers` endpoint in `src/lib/apis/admin/user-api.ts` for GET /api/cms/admin/newsletter/subscribers

## 2. Update Admin Dashboard Page
- [x] Modify `src/app/(dashboard)/admin/page.tsx` to fetch subscriber count and display it in a new StatCard

## 3. Add Subscribers Tab in Users Page
- [x] Update `src/app/(dashboard)/admin/users/table-users.tsx` to add "Abonnees" tab
- [x] Fetch and display subscriber emails in the new tab
- [x] Add CSV download button with semicolon separator

## 4. Handle Stats Link
- [x] Made stat cards clickable links to /admin/users with appropriate tab params

## 5. Show Admin in User Route
- [x] Added " - Admin" to the title in the users page

## 6. Testing and Verification
- [ ] Test the new subscribers tab and CSV download
- [ ] Verify subscriber count on admin dashboard
