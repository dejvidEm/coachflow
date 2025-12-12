'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Save, FileText } from 'lucide-react';
import { mutate } from 'swr';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function PdfPagesContent() {
  const { data: pdfPages, mutate: mutatePages } = useSWR(
    '/api/user/pdf-pages',
    fetcher
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstPageHeading: '',
    firstPageText: '',
    firstPageFooter: '',
    firstPageShowLogo: false as boolean,
    lastPageHeading: '',
    lastPageText: '',
    lastPageFooter: '',
    lastPageShowLogo: false as boolean,
  });

  useEffect(() => {
    if (pdfPages) {
      setFormData({
        firstPageHeading: pdfPages.pdfFirstPageHeading || '',
        firstPageText: pdfPages.pdfFirstPageText || '',
        firstPageFooter: pdfPages.pdfFirstPageFooter || '',
        firstPageShowLogo: Boolean(pdfPages.pdfFirstPageShowLogo ?? false),
        lastPageHeading: pdfPages.pdfLastPageHeading || '',
        lastPageText: pdfPages.pdfLastPageText || '',
        lastPageFooter: pdfPages.pdfLastPageFooter || '',
        lastPageShowLogo: Boolean(pdfPages.pdfLastPageShowLogo ?? false),
      });
    }
  }, [pdfPages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/user/pdf-pages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdfFirstPageHeading: formData.firstPageHeading || null,
          pdfFirstPageText: formData.firstPageText || null,
          pdfFirstPageFooter: formData.firstPageFooter || null,
          pdfFirstPageShowLogo: formData.firstPageShowLogo,
          pdfLastPageHeading: formData.lastPageHeading || null,
          pdfLastPageText: formData.lastPageText || null,
          pdfLastPageFooter: formData.lastPageFooter || null,
          pdfLastPageShowLogo: formData.lastPageShowLogo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save PDF page content');
      }

      const data = await response.json();
      await mutatePages();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-6 w-6" style={{ color: '#44B080' }} />
          <h1 className="text-lg lg:text-2xl font-medium text-gray-900">
            PDF Page Customization
          </h1>
        </div>

        <p className="text-sm text-gray-600 mb-8">
          Customize the first and last pages of your Meal Plan and Training Plan PDFs. 
          These pages will appear on every PDF you generate for your clients.
        </p>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            PDF page content saved successfully!
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* First Page Section */}
            <Card>
              <CardHeader>
                <CardTitle>First Page</CardTitle>
                <CardDescription>
                  This content will appear on the first page of every PDF (before the meal/training plan content)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Logo Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <Label htmlFor="firstPageShowLogo" className="text-base font-medium cursor-pointer">
                      Show Logo on First Page
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Display your saved logo at the top of the first page
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="firstPageShowLogo"
                      checked={Boolean(formData.firstPageShowLogo)}
                      onChange={(e) => handleChange('firstPageShowLogo', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
                <div>
                  <Label htmlFor="firstPageHeading">Heading</Label>
                  <Textarea
                    id="firstPageHeading"
                    value={formData.firstPageHeading}
                    onChange={(e) => handleChange('firstPageHeading', e.target.value)}
                    placeholder="Enter heading text for the first page..."
                    className="mt-1 min-h-[80px]"
                  />
                </div>
                <div>
                  <Label htmlFor="firstPageText">Text Content</Label>
                  <Textarea
                    id="firstPageText"
                    value={formData.firstPageText}
                    onChange={(e) => handleChange('firstPageText', e.target.value)}
                    placeholder="Enter main text content for the first page..."
                    className="mt-1 min-h-[120px]"
                  />
                </div>
                <div>
                  <Label htmlFor="firstPageFooter">Footer</Label>
                  <Textarea
                    id="firstPageFooter"
                    value={formData.firstPageFooter}
                    onChange={(e) => handleChange('firstPageFooter', e.target.value)}
                    placeholder="Enter footer text for the first page..."
                    className="mt-1 min-h-[60px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Last Page Section */}
            <Card>
              <CardHeader>
                <CardTitle>Last Page</CardTitle>
                <CardDescription>
                  This content will appear on the last page of every PDF (after the meal/training plan content)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Logo Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <Label htmlFor="lastPageShowLogo" className="text-base font-medium cursor-pointer">
                      Show Logo on Last Page
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Display your saved logo at the top of the last page
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="lastPageShowLogo"
                      checked={Boolean(formData.lastPageShowLogo)}
                      onChange={(e) => handleChange('lastPageShowLogo', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
                <div>
                  <Label htmlFor="lastPageHeading">Heading</Label>
                  <Textarea
                    id="lastPageHeading"
                    value={formData.lastPageHeading}
                    onChange={(e) => handleChange('lastPageHeading', e.target.value)}
                    placeholder="Enter heading text for the last page..."
                    className="mt-1 min-h-[80px]"
                  />
                </div>
                <div>
                  <Label htmlFor="lastPageText">Text Content</Label>
                  <Textarea
                    id="lastPageText"
                    value={formData.lastPageText}
                    onChange={(e) => handleChange('lastPageText', e.target.value)}
                    placeholder="Enter main text content for the last page..."
                    className="mt-1 min-h-[120px]"
                  />
                </div>
                <div>
                  <Label htmlFor="lastPageFooter">Footer</Label>
                  <Textarea
                    id="lastPageFooter"
                    value={formData.lastPageFooter}
                    onChange={(e) => handleChange('lastPageFooter', e.target.value)}
                    placeholder="Enter footer text for the last page..."
                    className="mt-1 min-h-[60px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
                style={{ backgroundColor: '#44B080' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a9a6d'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#44B080'}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
