'use client';

import { useEffect, useState } from 'react';

export function RelativeTime({ date }: { date: Date }) {
  const [relativeTime, setRelativeTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) {
        setRelativeTime('just now');
      } else if (diffInSeconds < 3600) {
        setRelativeTime(`${Math.floor(diffInSeconds / 60)} minutes ago`);
      } else if (diffInSeconds < 86400) {
        setRelativeTime(`${Math.floor(diffInSeconds / 3600)} hours ago`);
      } else if (diffInSeconds < 604800) {
        setRelativeTime(`${Math.floor(diffInSeconds / 86400)} days ago`);
      } else {
        setRelativeTime(date.toLocaleDateString());
      }
    };

    updateTime();
    // Update every minute for "just now" and "minutes ago"
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [date]);

  return <span>{relativeTime || date.toLocaleDateString()}</span>;
}

