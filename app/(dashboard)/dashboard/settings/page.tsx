import { redirect } from 'next/navigation';

export default function SettingsPage() {
  // Redirect to team settings as the default settings page
  redirect('/dashboard/settings/team');
}


