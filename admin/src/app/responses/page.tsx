// admin/src/app/responses/page.tsx
import { redirect } from 'next/navigation';

export default function ResponsesIndexPage() {
  redirect('/responses/simple');
}