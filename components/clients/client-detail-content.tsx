'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Client } from '@/lib/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Trash2, Loader2, FileText, Copy, Check, ChevronDown, ChevronUp, Mail, Send } from 'lucide-react';
import useSWR, { mutate } from 'swr';
import { EditClientModal } from './edit-client-modal';
import { Modal } from '@/components/ui/modal';
import { PdfViewer } from './pdf-viewer';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ClientDetailContentProps {
  clientId: number;
}

export function ClientDetailContent({ clientId }: ClientDetailContentProps) {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedTraining, setCopiedTraining] = useState(false);
  const [showMealPdfPreview, setShowMealPdfPreview] = useState(true);
  const [showTrainingPdfPreview, setShowTrainingPdfPreview] = useState(true);
  const [isSendMealPlanModalOpen, setIsSendMealPlanModalOpen] = useState(false);
  const [isSendTrainingPlanModalOpen, setIsSendTrainingPlanModalOpen] = useState(false);
  const [isSendingMealPlan, setIsSendingMealPlan] = useState(false);
  const [isSendingTrainingPlan, setIsSendingTrainingPlan] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);

  const { data, error, isLoading, mutate: revalidateClient } = useSWR<{ client: Client & { hasMealPdf?: boolean; hasTrainingPdf?: boolean } }>(
    `/api/clients/${clientId}`,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000, // Dedupe requests within 2 seconds
      focusThrottleInterval: 5000, // Throttle focus revalidation
    }
  );

  const client = data?.client;

  // Revalidate client data when edit modal closes (only once, not on every render)
  useEffect(() => {
    if (!isEditModalOpen && client) {
      // Only revalidate if we have existing data (avoid double fetch on mount)
      revalidateClient();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditModalOpen]); // Only revalidate when modal closes, not on every render

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const response = await fetch(`/api/clients?id=${clientId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete client');
      }

      mutate('/api/clients');
      router.push('/dashboard/clients');
    } catch (err: any) {
      setDeleteError(err.message || 'An error occurred during deletion');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSendMealPlan = async () => {
    if (!client?.email) {
      setSendError('Client does not have an email address');
      return;
    }

    setIsSendingMealPlan(true);
    setSendError(null);
    setSendSuccess(null);

    try {
      const response = await fetch(`/api/clients/${clientId}/meal-plan/send`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send meal plan');
      }

      setSendSuccess('Meal plan PDF sent successfully!');
      setIsSendMealPlanModalOpen(false);
      setTimeout(() => setSendSuccess(null), 5000);
    } catch (err: any) {
      setSendError(err.message || 'An error occurred while sending the email');
    } finally {
      setIsSendingMealPlan(false);
    }
  };

  const handleSendTrainingPlan = async () => {
    if (!client?.email) {
      setSendError('Client does not have an email address');
      return;
    }

    setIsSendingTrainingPlan(true);
    setSendError(null);
    setSendSuccess(null);

    try {
      const response = await fetch(`/api/clients/${clientId}/training-plan/send`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send training plan');
      }

      setSendSuccess('Training plan PDF sent successfully!');
      setIsSendTrainingPlanModalOpen(false);
      setTimeout(() => setSendSuccess(null), 5000);
    } catch (err: any) {
      setSendError(err.message || 'An error occurred while sending the email');
    } finally {
      setIsSendingTrainingPlan(false);
    }
  };

  const fitnessGoalColors: Record<string, string> = {
    mass_gain: '#B4E5FF',
    weight_loss: '#FFB4E5',
    maintain: '#E5FFB4',
  };

  const fitnessGoalLabels: Record<string, string> = {
    mass_gain: 'Mass Gain',
    weight_loss: 'Weight Loss',
    maintain: 'Maintain',
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const calculateAge = (dateOfBirth: Date | null) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (isLoading) {
    return (
      <section className="flex-1 p-4 lg:p-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#44B080' }} />
        </div>
      </section>
    );
  }

  if (error || !client) {
    return (
      <section className="flex-1 p-4 lg:p-8">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Error loading client details</p>
          <Button onClick={() => router.push('/dashboard/clients')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
        </div>
      </section>
    );
  }

  const age = calculateAge(client.dateOfBirth);

  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="mb-6">
        <Button
          onClick={() => router.push('/dashboard/clients')}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Clients
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">{client.name}</h1>
            <span
              className="inline-block px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: fitnessGoalColors[client.fitnessGoal] || '#E5E5E5',
                color: '#333',
              }}
            >
              {fitnessGoalLabels[client.fitnessGoal]}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(true)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="meal-pdf">Meal PDF</TabsTrigger>
          <TabsTrigger value="training-pdf">Training PDF</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {client.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-base text-gray-900 mt-1">{client.email}</p>
                  </div>
                )}

                {client.dateOfBirth && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                    <p className="text-base text-gray-900 mt-1">
                      {formatDate(client.dateOfBirth)}
                      {age !== null && ` (Age: ${age})`}
                    </p>
                  </div>
                )}

                {client.gender && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Gender</label>
                    <p className="text-base text-gray-900 mt-1 capitalize">{client.gender}</p>
                  </div>
                )}

                {client.actualWeight !== null && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Weight</label>
                    <p className="text-base text-gray-900 mt-1">
                      {client.actualWeight} kg
                    </p>
                  </div>
                )}

                {client.actualHeight !== null && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Height</label>
                    <p className="text-base text-gray-900 mt-1">
                      {client.actualHeight} cm
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-600">Fitness Goal</label>
                  <p className="text-base text-gray-900 mt-1">
                    {fitnessGoalLabels[client.fitnessGoal]}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Created</label>
                  <p className="text-base text-gray-900 mt-1">
                    {new Date(client.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {client.note && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Notes</label>
                  <p className="text-base text-gray-900 mt-1 whitespace-pre-wrap">{client.note}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meal-pdf">
          <Card>
            <CardHeader>
              <CardTitle>Meal PDF</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Button
                    onClick={() => router.push(`/dashboard/clients/${clientId}/meal-plan`)}
                    style={{ backgroundColor: '#44B080' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a9a6d'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#44B080'}
                    data-onboarding="pdf-feature"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {client.hasMealPdf ? 'Regenerate Meal Plan' : 'Generate Meal Plan'}
                  </Button>
                </div>

                {client.hasMealPdf ? (
                  <>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Collapsible Header */}
                      <div
                        onClick={() => setShowMealPdfPreview(!showMealPdfPreview)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setShowMealPdfPreview(!showMealPdfPreview);
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-[#44B080]" />
                          <div className="text-left">
                            <p className="font-medium text-gray-900">Meal Plan PDF</p>
                            <p className="text-sm text-gray-500">
                              Generated on {new Date(client.updatedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (client.hasMealPdf) {
                                  // Use authenticated download route instead of direct URL
                                  window.open(`/api/clients/${clientId}/meal-plan/download`, '_blank');
                                }
                              }}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (client.hasMealPdf) {
                                  // Use authenticated proxy route URL instead of direct URL
                                  const proxyUrl = `${window.location.origin}/api/clients/${clientId}/meal-plan/view`;
                                  try {
                                    await navigator.clipboard.writeText(proxyUrl);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                  } catch (err) {
                                    console.error('Failed to copy:', err);
                                  }
                                }
                              }}
                            >
                              {copied ? (
                                <>
                                  <Check className="h-4 w-4 mr-2" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy Link
                                </>
                              )}
                            </Button>
                            {client.email && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsSendMealPlanModalOpen(true);
                                }}
                                className="text-[#44B080] hover:text-[#3a9a6d] hover:bg-[#44B080]/10"
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Send Email
                              </Button>
                            )}
                          </div>
                          <ChevronDown
                            className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                              showMealPdfPreview ? 'transform rotate-180' : ''
                            }`}
                          />
                        </div>
                      </div>
                      
                      {/* Collapsible Content */}
                      {showMealPdfPreview && (
                        <div className="p-4">
                          <PdfViewer
                            pdfUrl=""
                            title="Meal Plan PDF Preview"
                            proxyUrl={`/api/clients/${clientId}/meal-plan/view`}
                          />
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 border border-gray-200 rounded-lg bg-gray-50">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500 mb-2">No meal plan PDF has been generated yet.</p>
                    <p className="text-sm text-gray-400">Click the button above to generate a meal plan.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training-pdf">
          <Card>
            <CardHeader>
              <CardTitle>Training PDF</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Button
                    onClick={() => router.push(`/dashboard/clients/${clientId}/training-plan`)}
                    style={{ backgroundColor: '#44B080' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a9a6d'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#44B080'}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {client.hasTrainingPdf ? 'Regenerate Training Plan' : 'Generate Training Plan'}
                  </Button>
                </div>

                {client.hasTrainingPdf ? (
                  <>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Collapsible Header */}
                      <div
                        onClick={() => setShowTrainingPdfPreview(!showTrainingPdfPreview)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setShowTrainingPdfPreview(!showTrainingPdfPreview);
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-[#44B080]" />
                          <div className="text-left">
                            <p className="font-medium text-gray-900">Training Plan PDF</p>
                            <p className="text-sm text-gray-500">
                              Generated on {new Date(client.updatedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (client.hasTrainingPdf) {
                                  // Use authenticated download route instead of direct URL
                                  window.open(`/api/clients/${clientId}/training-plan/download`, '_blank');
                                }
                              }}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (client.hasTrainingPdf) {
                                  // Use authenticated proxy route URL instead of direct URL
                                  const proxyUrl = `${window.location.origin}/api/clients/${clientId}/training-plan/view`;
                                  try {
                                    await navigator.clipboard.writeText(proxyUrl);
                                    setCopiedTraining(true);
                                    setTimeout(() => setCopiedTraining(false), 2000);
                                  } catch (err) {
                                    console.error('Failed to copy:', err);
                                  }
                                }
                              }}
                            >
                              {copiedTraining ? (
                                <>
                                  <Check className="h-4 w-4 mr-2" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy Link
                                </>
                              )}
                            </Button>
                            {client.email && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsSendTrainingPlanModalOpen(true);
                                }}
                                className="text-[#44B080] hover:text-[#3a9a6d] hover:bg-[#44B080]/10"
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Send Email
                              </Button>
                            )}
                          </div>
                          <ChevronDown
                            className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                              showTrainingPdfPreview ? 'transform rotate-180' : ''
                            }`}
                          />
                        </div>
                      </div>
                      
                      {/* Collapsible Content */}
                      {showTrainingPdfPreview && (
                        <div className="p-4">
                          <PdfViewer
                            pdfUrl=""
                            title="Training Plan PDF Preview"
                            proxyUrl={`/api/clients/${clientId}/training-plan/view`}
                          />
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 border border-gray-200 rounded-lg bg-gray-50">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500 mb-2">No training plan PDF has been generated yet.</p>
                    <p className="text-sm text-gray-400">Click the button above to generate a training plan.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EditClientModal
        client={client}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <p className="text-gray-700 mb-4">
          Are you sure you want to delete the client &quot;{client.name}&quot;? This action cannot be undone.
        </p>
        {deleteError && <p className="text-red-500 text-sm mb-4">{deleteError}</p>}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </div>
      </Modal>

      {/* Send Meal Plan Confirmation Modal */}
      <Modal
        isOpen={isSendMealPlanModalOpen}
        onClose={() => {
          setIsSendMealPlanModalOpen(false);
          setSendError(null);
        }}
        title="Send Updated Meal Plan"
      >
        <p className="text-gray-700 mb-4">
          Are you sure you want to send the updated meal plan PDF to <strong>{client.email}</strong>?
        </p>
        {sendError && <p className="text-red-500 text-sm mb-4">{sendError}</p>}
        {sendSuccess && <p className="text-green-600 text-sm mb-4">{sendSuccess}</p>}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setIsSendMealPlanModalOpen(false);
              setSendError(null);
            }}
            disabled={isSendingMealPlan}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendMealPlan}
            disabled={isSendingMealPlan}
            style={{ backgroundColor: '#44B080' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a9a6d'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#44B080'}
          >
            {isSendingMealPlan ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </>
            )}
          </Button>
        </div>
      </Modal>

      {/* Send Training Plan Confirmation Modal */}
      <Modal
        isOpen={isSendTrainingPlanModalOpen}
        onClose={() => {
          setIsSendTrainingPlanModalOpen(false);
          setSendError(null);
        }}
        title="Send Updated Training Plan"
      >
        <p className="text-gray-700 mb-4">
          Are you sure you want to send the updated training plan PDF to <strong>{client.email}</strong>?
        </p>
        {sendError && <p className="text-red-500 text-sm mb-4">{sendError}</p>}
        {sendSuccess && <p className="text-green-600 text-sm mb-4">{sendSuccess}</p>}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setIsSendTrainingPlanModalOpen(false);
              setSendError(null);
            }}
            disabled={isSendingTrainingPlan}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendTrainingPlan}
            disabled={isSendingTrainingPlan}
            style={{ backgroundColor: '#44B080' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a9a6d'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#44B080'}
          >
            {isSendingTrainingPlan ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </>
            )}
          </Button>
        </div>
      </Modal>
    </section>
  );
}

