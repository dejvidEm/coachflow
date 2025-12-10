import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function ClientsPageSkeleton() {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-6 w-6 text-gray-300" />
        <h1 className="text-lg lg:text-2xl font-medium text-gray-900">
          Clients
        </h1>
      </div>

      <div className="space-y-8">
        <Card className="mb-6 h-[400px] animate-pulse">
          <CardHeader>
            <CardTitle>Add New Client</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card className="h-[300px] animate-pulse">
          <CardHeader>
            <CardTitle>Your Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 overflow-hidden">
              <div className="min-w-[320px] max-w-[320px] h-64 bg-gray-200 rounded-lg"></div>
              <div className="min-w-[320px] max-w-[320px] h-64 bg-gray-200 rounded-lg"></div>
              <div className="min-w-[320px] max-w-[320px] h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

