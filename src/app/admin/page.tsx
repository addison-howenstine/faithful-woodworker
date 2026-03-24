'use client'

import { useState, useEffect, useCallback } from 'react'
import { config } from '@/content'
import type { OrderRecord } from '@/types'

type StatusFilter = 'all' | OrderRecord['status']

const STATUS_COLORS: Record<OrderRecord['status'], string> = {
  new: 'bg-blue-100 text-blue-800',
  quoted: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const STATUS_LABELS: Record<OrderRecord['status'], string> = {
  new: 'New',
  quoted: 'Quoted',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null)

  const fetchOrders = useCallback(async () => {
    if (!config.appsScriptUrl) return
    setLoading(true)
    try {
      const res = await fetch(
        `${config.appsScriptUrl}?action=admin&key=${config.adminPassword}`
      )
      const data = await res.json()
      setOrders(data.orders || [])
    } catch (e) {
      console.error('Failed to fetch orders:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authenticated) fetchOrders()
  }, [authenticated, fetchOrders])

  const updateOrderStatus = async (orderId: string, newStatus: OrderRecord['status']) => {
    if (!config.appsScriptUrl) return
    try {
      await fetch(config.appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateStatus',
          key: config.adminPassword,
          orderId,
          status: newStatus,
        }),
      })
      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null)
      }
    } catch (e) {
      console.error('Failed to update status:', e)
    }
  }

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const counts = {
    all: orders.length,
    new: orders.filter((o) => o.status === 'new').length,
    quoted: orders.filter((o) => o.status === 'quoted').length,
    in_progress: orders.filter((o) => o.status === 'in_progress').length,
    completed: orders.filter((o) => o.status === 'completed').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  }

  // Login gate
  if (!authenticated) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="max-w-sm mx-auto px-6">
          <h1 className="font-display text-2xl text-walnut mb-6 text-center">Admin Login</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (password === config.adminPassword) {
                setAuthenticated(true)
              } else {
                alert('Incorrect password')
              }
            }}
            className="space-y-4"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 border border-border rounded bg-warm-white focus:outline-none focus:ring-2 focus:ring-walnut/30"
            />
            <button
              type="submit"
              className="w-full bg-walnut text-cream py-3 rounded font-medium hover:bg-oak transition-colors"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl text-walnut">Order Dashboard</h1>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="text-sm text-walnut hover:text-oak border border-border px-4 py-2 rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {!config.appsScriptUrl ? (
          <div className="bg-cream border border-border rounded-lg p-8 text-center">
            <p className="text-muted text-lg mb-2">Admin dashboard not yet connected.</p>
            <p className="text-muted text-sm">
              Set the <code className="bg-border px-2 py-0.5 rounded">appsScriptUrl</code> in{' '}
              <code className="bg-border px-2 py-0.5 rounded">src/content/config.json</code> to enable.
            </p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {(Object.keys(counts) as StatusFilter[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`p-4 rounded-lg border text-center transition-colors ${
                    filter === key
                      ? 'border-walnut bg-walnut/5'
                      : 'border-border hover:border-walnut/30'
                  }`}
                >
                  <div className="text-2xl font-semibold text-walnut">{counts[key]}</div>
                  <div className="text-xs text-muted capitalize mt-1">
                    {key === 'all' ? 'Total' : STATUS_LABELS[key]}
                  </div>
                </button>
              ))}
            </div>

            {/* Orders table */}
            {loading ? (
              <p className="text-center text-muted py-12">Loading orders...</p>
            ) : filteredOrders.length === 0 ? (
              <p className="text-center text-muted py-12">No orders found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 px-4 text-sm font-medium text-muted">Date</th>
                      <th className="py-3 px-4 text-sm font-medium text-muted">Name</th>
                      <th className="py-3 px-4 text-sm font-medium text-muted">Project</th>
                      <th className="py-3 px-4 text-sm font-medium text-muted">Budget</th>
                      <th className="py-3 px-4 text-sm font-medium text-muted">Status</th>
                      <th className="py-3 px-4 text-sm font-medium text-muted"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-border/50 hover:bg-cream/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm">
                          {new Date(order.timestamp).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">{order.name}</td>
                        <td className="py-3 px-4 text-sm">{order.projectType}</td>
                        <td className="py-3 px-4 text-sm">{order.budget}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              STATUS_COLORS[order.status]
                            }`}
                          >
                            {STATUS_LABELS[order.status]}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-sm text-walnut hover:text-oak transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Order detail modal */}
            {selectedOrder && (
              <div
                className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                onClick={() => setSelectedOrder(null)}
              >
                <div
                  className="bg-warm-white rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="font-display text-2xl text-walnut">Order Details</h2>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-muted hover:text-charcoal text-xl"
                    >
                      &times;
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-muted uppercase tracking-wide">Customer</p>
                      <p className="font-medium">{selectedOrder.name}</p>
                      <p className="text-sm text-muted">{selectedOrder.email}</p>
                      {selectedOrder.phone && (
                        <p className="text-sm text-muted">{selectedOrder.phone}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted uppercase tracking-wide">Project Type</p>
                        <p>{selectedOrder.projectType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted uppercase tracking-wide">Budget</p>
                        <p>{selectedOrder.budget || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted uppercase tracking-wide">Style</p>
                        <p>{selectedOrder.style || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted uppercase tracking-wide">Dimensions</p>
                        <p>{selectedOrder.dimensions || 'Not specified'}</p>
                      </div>
                    </div>

                    {selectedOrder.colorPreference && (
                      <div>
                        <p className="text-xs text-muted uppercase tracking-wide">Color / Wood</p>
                        <p>{selectedOrder.colorPreference}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-muted uppercase tracking-wide">Description</p>
                      <p className="whitespace-pre-wrap">{selectedOrder.description}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted uppercase tracking-wide mb-2">Status</p>
                      <div className="flex flex-wrap gap-2">
                        {(Object.keys(STATUS_LABELS) as OrderRecord['status'][]).map((s) => (
                          <button
                            key={s}
                            onClick={() => updateOrderStatus(selectedOrder.id, s)}
                            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                              selectedOrder.status === s
                                ? STATUS_COLORS[s]
                                : 'bg-border text-muted hover:bg-border/80'
                            }`}
                          >
                            {STATUS_LABELS[s]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-muted">
                        Submitted {new Date(selectedOrder.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
