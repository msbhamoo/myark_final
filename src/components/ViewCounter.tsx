'use client'

import { useEffect, useRef } from 'react'

export function ViewCounter({ slug }: { slug: string }) {
    const initialized = useRef(false)

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true

            // Fire and forget view tracking
            fetch(`/api/blogs/${slug}/track-view`, {
                method: 'POST',
            }).catch(err => console.error('Failed to track view', err))
        }
    }, [slug])

    return null
}
