import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function Loading() {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-6" />
      <Card>
        <CardHeader>
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}


