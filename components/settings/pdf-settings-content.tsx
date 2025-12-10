'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Upload, X } from 'lucide-react';
import { mutate } from 'swr';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function PdfSettingsContent() {
  const { data: pdfSettings, mutate: mutateSettings } = useSWR(
    '/api/user/pdf-settings',
    fetcher
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    logoUrl: '',
    logoPosition: 'top-left' as 'top-left' | 'top-center' | 'top-right',
    accentColor: '#44B080',
  });

  useEffect(() => {
    if (pdfSettings) {
      setFormData({
        logoUrl: pdfSettings.pdfLogoUrl || '',
        logoPosition: (pdfSettings.pdfLogoPosition || 'top-left') as 'top-left' | 'top-center' | 'top-right',
        accentColor: (pdfSettings.pdfAccentColor && typeof pdfSettings.pdfAccentColor === 'string') ? pdfSettings.pdfAccentColor : '#44B080',
      });
      setLogoPreview(pdfSettings.pdfLogoUrl || null);
    }
  }, [pdfSettings]);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setIsUploadingLogo(true);
    setError(null);

    try {
      // Upload via API route (secure - service role key stays on server)
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/user/logo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload logo');
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, logoUrl: data.logoUrl }));
      setLogoPreview(data.logoUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to upload logo');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeLogo = () => {
    setFormData((prev) => ({ ...prev, logoUrl: '' }));
    setLogoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/user/pdf-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdfLogoUrl: formData.logoUrl || null,
          pdfLogoPosition: formData.logoPosition,
          pdfAccentColor: formData.accentColor,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update PDF settings');
      }

      mutateSettings();
      mutate('/api/user');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-2">
            PDF Settings
          </h1>
          <p className="text-sm text-gray-600">
            Configure the default styling for all PDFs you generate. These settings will apply to all meal plans and training plans.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>PDF Customization</CardTitle>
            <CardDescription>
              Customize the appearance of your generated PDFs. Changes will apply to all future PDF generations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Logo Upload */}
              <div>
                <Label>Logo (optional)</Label>
                <p className="text-xs text-gray-500 mb-2">Upload a logo to display on your PDFs</p>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-[#44B080] bg-[#44B080]/10'
                      : 'border-gray-300 hover:border-[#44B080] hover:bg-gray-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                    disabled={isUploadingLogo}
                  />
                  {logoPreview ? (
                    <div className="relative inline-block">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="max-h-32 mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeLogo();
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      {isUploadingLogo ? (
                        <>
                          <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" style={{ color: '#44B080' }} />
                          <p className="text-sm text-gray-600">Uploading...</p>
                        </>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            Drag and drop a logo here, or click to select
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Logo Position */}
              <div>
                <Label>Logo Position</Label>
                <p className="text-xs text-gray-500 mb-2">Choose where to display the logo on PDF pages</p>
                <RadioGroup
                  value={formData.logoPosition}
                  onValueChange={(value) => setFormData({ ...formData, logoPosition: value as 'top-left' | 'top-center' | 'top-right' })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="top-left" id="top-left" />
                    <Label htmlFor="top-left" className="cursor-pointer font-normal">Top Left</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="top-center" id="top-center" />
                    <Label htmlFor="top-center" className="cursor-pointer font-normal">Top Center</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="top-right" id="top-right" />
                    <Label htmlFor="top-right" className="cursor-pointer font-normal">Top Right</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Accent Color */}
              <div>
                <Label htmlFor="accentColor">Accent Color</Label>
                <p className="text-xs text-gray-500 mb-2">Color for borders and accents in PDF</p>
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="color"
                    id="accentColor"
                    value={formData.accentColor || '#44B080'}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value || '#44B080' })}
                    className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={formData.accentColor || '#44B080'}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value || '#44B080' })}
                    placeholder="#44B080"
                    className="flex-1"
                    pattern="^#[0-9A-Fa-f]{6}$"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Current color: {formData.accentColor || '#44B080'}</p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-600 text-sm">PDF settings saved successfully!</p>
                </div>
              )}

              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button
                  type="submit"
                  disabled={isSubmitting || isUploadingLogo}
                  style={{ backgroundColor: '#44B080' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a9a6d'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#44B080'}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Settings'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

