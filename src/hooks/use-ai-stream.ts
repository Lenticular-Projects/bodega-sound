"use client";

import { useState, useCallback } from 'react';

interface UseAIStreamOptions {
    onChunk?: (chunk: string) => void;
    onComplete?: (fullText: string) => void;
    onError?: (error: Error) => void;
}

export function useAIStream(options: UseAIStreamOptions = {}) {
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamedText, setStreamedText] = useState("");
    const [error, setError] = useState<Error | null>(null);

    const startStream = useCallback(async (prompt: string) => {
        setIsStreaming(true);
        setStreamedText("");
        setError(null);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) throw new Error('Failed to start stream');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullText = "";

            while (reader) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                fullText += chunk;
                setStreamedText(fullText);
                options.onChunk?.(chunk);
            }

            options.onComplete?.(fullText);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Unknown error');
            setError(error);
            options.onError?.(error);
        } finally {
            setIsStreaming(false);
        }
    }, [options]);

    return { startStream, isStreaming, streamedText, error };
}
