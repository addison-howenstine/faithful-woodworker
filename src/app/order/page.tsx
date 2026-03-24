'use client'

import { useState, FormEvent } from 'react'
import { order, config } from '@/content'
import EditableText from '@/components/ui/EditableText'

interface FormData {
  name: string
  email: string
  phone: string
  projectType: string
  dimensions: string
  style: string
  colorPreference: string
  budget: string
  description: string
}

const initialForm: FormData = {
  name: '',
  email: '',
  phone: '',
  projectType: '',
  dimensions: '',
  style: '',
  colorPreference: '',
  budget: '',
  description: '',
}

export default function OrderPage() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const update = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!config.appsScriptUrl) {
      alert('Order form is not yet connected. Please contact Austin directly at ' + config.ownerEmail)
      return
    }

    setStatus('submitting')
    try {
      const submission = {
        ...form,
        timestamp: new Date().toISOString(),
        action: 'submitOrder',
      }

      const response = await fetch(config.appsScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      })

      // no-cors means we can't read the response, so assume success
      setStatus('success')
      setForm(initialForm)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="max-w-lg mx-auto px-6 text-center">
          <div className="text-5xl mb-6">&#10003;</div>
          <h1 className="font-display text-3xl text-walnut mb-4">Order Received!</h1>
          <p className="text-muted text-lg mb-8">{order.successMessage}</p>
          <button
            onClick={() => setStatus('idle')}
            className="text-walnut hover:text-oak font-medium border-b-2 border-walnut/30 hover:border-walnut transition-colors pb-1"
          >
            Submit Another Order
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <EditableText file="order" path="heading" as="h1" className="font-display text-4xl md:text-5xl text-walnut mb-4">
            {order.heading}
          </EditableText>
          <EditableText file="order" path="subheading" as="p" className="text-muted text-lg" multiline>
            {order.subheading}
          </EditableText>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="w-full px-4 py-3 border border-border rounded bg-warm-white focus:outline-none focus:ring-2 focus:ring-walnut/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full px-4 py-3 border border-border rounded bg-warm-white focus:outline-none focus:ring-2 focus:ring-walnut/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update('phone', formatPhone(e.target.value))}
              placeholder="(555) 123-4567"
              className="w-full px-4 py-3 border border-border rounded bg-warm-white focus:outline-none focus:ring-2 focus:ring-walnut/30"
            />
          </div>

          {/* Project details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Type of Project <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.projectType}
                onChange={(e) => update('projectType', e.target.value)}
                className="w-full px-4 py-3 border border-border rounded bg-warm-white focus:outline-none focus:ring-2 focus:ring-walnut/30"
              >
                <option value="">Select a type...</option>
                {order.fields.projectTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Style Preference
              </label>
              <select
                value={form.style}
                onChange={(e) => update('style', e.target.value)}
                className="w-full px-4 py-3 border border-border rounded bg-warm-white focus:outline-none focus:ring-2 focus:ring-walnut/30"
              >
                <option value="">Select a style...</option>
                {order.fields.styles.map((style) => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Dimensions / Size
              </label>
              <input
                type="text"
                value={form.dimensions}
                onChange={(e) => update('dimensions', e.target.value)}
                placeholder='e.g., 24" x 36"'
                className="w-full px-4 py-3 border border-border rounded bg-warm-white focus:outline-none focus:ring-2 focus:ring-walnut/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Budget Range
              </label>
              <select
                value={form.budget}
                onChange={(e) => update('budget', e.target.value)}
                className="w-full px-4 py-3 border border-border rounded bg-warm-white focus:outline-none focus:ring-2 focus:ring-walnut/30"
              >
                <option value="">Select a range...</option>
                {order.fields.budgetRanges.map((range) => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Color / Wood Preference
            </label>
            <input
              type="text"
              value={form.colorPreference}
              onChange={(e) => update('colorPreference', e.target.value)}
              placeholder="e.g., Dark walnut with white lettering"
              className="w-full px-4 py-3 border border-border rounded bg-warm-white focus:outline-none focus:ring-2 focus:ring-walnut/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Describe Your Vision <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Tell me about your idea — what it's for, any specific details, reference images you have in mind..."
              className="w-full px-4 py-3 border border-border rounded bg-warm-white focus:outline-none focus:ring-2 focus:ring-walnut/30 resize-y"
            />
          </div>

          <EditableText file="order" path="turnaroundNote" as="p" className="text-sm text-muted italic">
            {order.turnaroundNote}
          </EditableText>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-walnut hover:bg-oak text-cream py-4 rounded text-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'submitting' ? 'Submitting...' : 'Request My Custom Piece'}
          </button>

          {status === 'error' && (
            <p className="text-red-600 text-center">
              Something went wrong. Please try again or email{' '}
              <a href={`mailto:${config.ownerEmail}`} className="underline">
                {config.ownerEmail}
              </a>
              .
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
