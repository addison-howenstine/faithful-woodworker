'use client'

import { useState, useRef, useEffect, type ReactNode } from 'react'

const isDev = process.env.NODE_ENV === 'development'

type EditableTextProps = {
  /** JSON content file name (without extension), e.g. "home" */
  file: string
  /** Dot-separated path to the field, e.g. "hero.headline" or "paragraphs.0" */
  path: string
  /** The current value to display */
  children: ReactNode
  /** HTML tag to render — defaults to "span" */
  as?: keyof HTMLElementTagNameMap
  /** Additional className */
  className?: string
  /** Use a multiline textarea instead of input */
  multiline?: boolean
}

export default function EditableText({
  file,
  path,
  children,
  as: Tag = 'span',
  className = '',
  multiline = false,
}: EditableTextProps) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState('')
  const [savedValue, setSavedValue] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const displayText = savedValue !== null ? savedValue : (typeof children === 'string' ? children : null)
  const rendered = displayText !== null ? renderInlineMarkdown(displayText) : children

  if (!isDev) {
    // In production, render without any editing affordances — zero overhead
    return <Tag className={className}>{rendered}</Tag>
  }

  const handleShiftClick = (e: React.MouseEvent) => {
    if (e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()
      const text = typeof children === 'string' ? children : extractText(children)
      setValue(text)
      setEditing(true)
    }
  }

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch(`http://localhost:3001/?file=${file}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, value }),
      })
      if (!res.ok) {
        const err = await res.json()
        console.error('Failed to save:', err)
      }
    } catch (err) {
      console.error('Failed to save:', err)
    }
    setSavedValue(value)
    setSaving(false)
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditing(false)
    } else if (e.key === 'Enter' && (!multiline || e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      save()
    }
  }

  if (editing) {
    const sharedClass =
      'w-full rounded border-2 border-walnut bg-white px-2 py-1 text-text focus:outline-none focus:ring-2 focus:ring-walnut/40'

    return multiline ? (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={handleKeyDown}
        disabled={saving}
        rows={4}
        className={sharedClass + ' resize-y'}
      />
    ) : (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={handleKeyDown}
        disabled={saving}
        className={sharedClass}
      />
    )
  }

  return (
    <Tag
      className={`${className} cursor-pointer outline-dashed outline-1 outline-transparent hover:outline-walnut/30 transition-all`}
      onClick={handleShiftClick}
      title="Shift+click to edit"
    >
      {rendered}
    </Tag>
  )
}

/** Parse inline markdown: [text](url) links and **bold** */
function renderInlineMarkdown(text: string): ReactNode {
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)|\*\*(.+?)\*\*/g
  const parts: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    if (match[1] && match[2]) {
      parts.push(
        <a key={key++} href={match[2]} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-walnut transition-colors">
          {match[1]}
        </a>
      )
    } else if (match[3]) {
      parts.push(<strong key={key++}>{match[3]}</strong>)
    }
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length === 1 ? parts[0] : parts
}

/** Recursively extract text from React children */
function extractText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (node && typeof node === 'object' && 'props' in node) {
    return extractText((node as { props: { children?: ReactNode } }).props.children)
  }
  return ''
}
