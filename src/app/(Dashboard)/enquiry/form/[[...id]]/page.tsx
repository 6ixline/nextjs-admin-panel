'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { useForm, Controller } from 'react-hook-form'
import { Loader } from '@/components/ui/loader/Loader'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faEnvelope,
  faBox,
  faCalendar,
  faSave,
  faArrowLeft,
  faUserTie,
  faHistory,
} from '@fortawesome/free-solid-svg-icons'
import { updateEnquiry } from '@/services/enquiryServices'
import { EnquiryUpdate } from '@/types/enquiryTypes'


interface Enquiry {
  id: number
  user_id: number
  product_id: number | null
  subject: string
  message: string
  status: string
  priority: string
  remarks: string | null
  admin_reply: string | null
  assigned_to: number | null
  resolved_at: string | null
  resolved_by: number | null
  createdAt: string
  updatedAt: string
  user: {
    id: number
    name: string
    email: string
    mobile: string
  }
  product?: {
    id: number
    name: string
    product_code: string
    ref_code: string
    make: {
      title: string
    }
    category: {
      title: string
    }
  }
  assignedAdmin?: {
    id: number
    name: string
    email: string
  }
  resolvedByAdmin?: {
    id: number
    name: string
    email: string
  }
}

interface Admin {
  id: number
  name: string
  email: string
}

export default function EnquiryFormPage() {
  const params = useParams()
  const router = useRouter()
  const enquiryId = params.id as string

  const [enquiry, setEnquiry] = useState<Enquiry | null>(null)
  const [admins, setAdmins] = useState<Admin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const { control, handleSubmit, reset, formState: { isDirty } } = useForm<EnquiryUpdate>({
    defaultValues: {
      status: 'pending',
      priority: 'medium',
      admin_reply: '',
      remarks: '',
      assigned_to: null,
    }
  })

  // Fetch enquiry details
  useEffect(() => {
    const fetchEnquiryDetails = async () => {
      try {
        setIsLoading(true)
        
        // Fetch enquiry details
        const enquiryResponse = await fetch(`/api/admin/enquiry/${enquiryId}`)
        if (!enquiryResponse.ok) throw new Error('Failed to fetch enquiry')
        const enquiryData = await enquiryResponse.json()
        
        setEnquiry(enquiryData.data)
        
        // Reset form with enquiry data
        reset({
          status: enquiryData.data.status,
          priority: enquiryData.data.priority,
          admin_reply: enquiryData.data.admin_reply || '',
          remarks: enquiryData.data.remarks || '',
          assigned_to: enquiryData.data.assigned_to,
        })

        // Fetch admins list
        const adminsResponse = await fetch('/api/admin/admins?limit=100')
        if (adminsResponse.ok) {
          const adminsData = await adminsResponse.json()
          setAdmins(adminsData.data || [])
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to load enquiry details', {
          position: 'top-right',
          duration: 3000,
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (enquiryId) {
      fetchEnquiryDetails()
    }
  }, [enquiryId, reset])

  // Handle form submission
  const onSubmit = async (data: EnquiryUpdate) => {
    try {
      setIsSaving(true)

      const response = await updateEnquiry(enquiryId[0], data);
      toast.success(response.message);
      reset(data) 
      router.push("/enquiry");
    } catch (error: any) {
      toast.error(error.message || 'Failed to update enquiry', {
        position: 'top-right',
        duration: 3000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <Loader />
  }

  if (!enquiry) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">Enquiry not found</p>
        <button
          onClick={() => router.push('/enquiry')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to List
        </button>
      </div>
    )
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Enquiry Details" showNewButton={false} backLink='/enquiry' showBackButton />
      <hr />
      <div className="space-y-6 mt-6">
        
        {/* --- Top Row: User Info & Product Info (Side by Side) --- */}
        <div className={`grid grid-cols-1 ${enquiry.product ? 'md:grid-cols-2' : ''} gap-6`}>
          
          {/* User Information Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h2 className="text-[15px] font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="text-blue-500" />
              User Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-[14px] text-gray-500 dark:text-gray-400">Name</div>
                <div className="font-medium text-gray-900 dark:text-white">{enquiry.user.name}</div>
              </div>
              {enquiry.user.mobile && (
                <div>
                  <div className="text-[14px] text-gray-500 dark:text-gray-400">Mobile</div>
                  <div className="font-medium text-gray-900 dark:text-white">{enquiry.user.mobile}</div>
                </div>
              )}
              <div>
                <div className="text-[14px] text-gray-500 dark:text-gray-400">Email</div>
                <div className="font-medium text-gray-900 dark:text-white" title={enquiry.user.email}>
                  {enquiry.user.email}
                </div>
              </div>
              
            </div>
          </div>

          {/* Product Information Card (Only if product exists) */}
          {enquiry.product && (
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800 p-6 shadow-sm">
              <h2 className="text-[15px] font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <FontAwesomeIcon icon={faBox} />
                Product Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1 sm:col-span-2">
                  <div className="text-[14px] text-blue-700 dark:text-blue-300">Product Name</div>
                  <div className="font-semibold text-[14px] text-blue-900 dark:text-blue-100">{enquiry.product.name}</div>
                </div>
                <div>
                  <div className="text-[14px] text-blue-700 dark:text-blue-300">Product Code</div>
                  <div className="font-medium text-blue-900 text-[14px] dark:text-blue-100">{enquiry.product.product_code}</div>
                </div>
                <div>
                  <div className="text-[14px] text-blue-700 dark:text-blue-300">Make</div>
                  <div className="font-medium text-blue-900 text-[14px] dark:text-blue-100">{enquiry.product.make.title}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- Middle Row: Enquiry Content --- */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
              Enquiry Message
            </h2>
            <div className="text-[14px] text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendar} />
              {format(new Date(enquiry.createdAt), 'MMM dd, yyyy • hh:mm a')}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
              <div className="text-[14px] font-medium text-gray-500 dark:text-gray-400 mb-1">Subject</div>
              <div className="text-base font-semibold text-gray-900 dark:text-white">{enquiry.subject}</div>
            </div>
            <div>
              <div className="text-[14px] font-medium text-gray-500 dark:text-gray-400 mb-2">Message</div>
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                {enquiry.message}
              </div>
            </div>
          </div>

          {/* Previous History/Timeline (Read Only) */}
          {(enquiry.assignedAdmin || enquiry.resolvedByAdmin) && (
             <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-6 text-sm">
               {enquiry.assignedAdmin && (
                 <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                   <FontAwesomeIcon icon={faUserTie} />
                   <span>Current Assignee: <span className="font-medium text-gray-900 dark:text-gray-200">{enquiry.assignedAdmin.name}</span></span>
                 </div>
               )}
               {enquiry.resolvedByAdmin && (
                 <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                   <FontAwesomeIcon icon={faHistory} />
                   <span>Resolved by {enquiry.resolvedByAdmin.name} on {enquiry.resolved_at ? format(new Date(enquiry.resolved_at), 'MMM dd, yyyy') : ''}</span>
                 </div>
               )}
             </div>
          )}
        </div>

        {/* --- Bottom Row: Unified Admin Response --- */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm border-t-4 border-t-blue-500">
            <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
              Response & Management
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reply to User
                </label>
                <Controller
                  name="admin_reply"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={6}
                      placeholder="Write your response here. This will be sent to the user."
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Internal Remarks <span className="text-gray-400 font-normal">(Private)</span>
                </label>
                <Controller
                  name="remarks"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={3}
                      placeholder="Internal notes for admin team..."
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    Status
                  </label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full  text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    )}
                  />
                </div>

              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-start pt-6 mt-6 border-t border-gray-100 dark:border-gray-700">
              <button
                type="submit"
                disabled={isSaving || !isDirty}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm font-medium text-sm"
              >
                <FontAwesomeIcon icon={faSave} />
                {isSaving ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}