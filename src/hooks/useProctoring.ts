'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProctorEventType, ProctorLog } from '@/types/exam';

interface UseProctoringOptions {
  enforceFullscreen?: boolean;
  blockTabSwitch?: boolean;
  maxViolations?: number;
  onViolationThresholdReached?: () => void;
}

export function useProctoring(options: UseProctoringOptions = {}) {
  const {
    enforceFullscreen = true,
    blockTabSwitch = true,
    maxViolations = 3,
    onViolationThresholdReached,
  } = options;

  const [violations, setViolations] = useState<ProctorLog[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const addViolation = useCallback(
    (type: ProctorEventType, details: string) => {
      const newLog: ProctorLog = {
        id: Math.random().toString(36).substring(2, 9),
        submission_id: 'current-session',
        event_type: type,
        details,
        duration_seconds: 0,
        created_at: new Date().toISOString(),
      };

      setViolations((prev) => {
        const next = [...prev, newLog];
        if (next.length >= maxViolations && onViolationThresholdReached) {
          onViolationThresholdReached();
        }
        return next;
      });

      setWarningMessage(
        `ЕСКЕРТУ: ${details} (${violations.length + 1}/${maxViolations})`
      );

      // Auto clear banner after 5 seconds
      setTimeout(() => setWarningMessage(null), 5000);
    },
    [maxViolations, onViolationThresholdReached, violations.length]
  );

  const enterFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch {
      // Browser might block if not directly triggered by user click
    }
  };

  useEffect(() => {
    // 1. Fullscreen change detection
    const handleFullscreenChange = () => {
      const active = Boolean(document.fullscreenElement);
      setIsFullscreen(active);
      if (!active && enforceFullscreen) {
        addViolation('fullscreen_exit', 'Толық экран режимінен шықтыңыз');
      }
    };

    // 2. Tab switch & visibility change detection
    const handleVisibilityChange = () => {
      if (document.hidden && blockTabSwitch) {
        addViolation('tab_switch', 'Басқа терезеге немесе қосымшаға ауыстыңыз');
      }
    };

    // 3. Window blur detection
    const handleBlur = () => {
      if (blockTabSwitch) {
        addViolation('focus_lost', 'Браузер фокусы жоғалды');
      }
    };

    // 4. Copy-paste & Context menu restriction
    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      addViolation('copy_attempt', 'Мәтінді көшіруге тыйым салынған');
    };

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('copy', preventCopy);
    document.addEventListener('contextmenu', preventContextMenu);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, [addViolation, blockTabSwitch, enforceFullscreen]);

  return {
    violations,
    violationCount: violations.length,
    isFullscreen,
    warningMessage,
    enterFullscreen,
    clearWarning: () => setWarningMessage(null),
  };
}
