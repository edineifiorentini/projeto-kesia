"use client";

import { useEffect } from "react";

const activeTitles = [
  "Késia Dutra | Penteados para noivas",
  "Beleza para o seu grande dia",
  "Reserve seu horário com a Késia",
] as const;

const activeRotationDelay = 6_000;
const inactivityDelay = 30_000;
const reservationPromptDelay = 3_000;

export function TabTitleRotator() {
  useEffect(() => {
    const initialTitle = document.title;
    let activeTitleIndex = 0;
    let inactive = false;
    let rotationTimer: number | undefined;
    let inactivityTimer: number | undefined;
    let reservationPromptTimer: number | undefined;

    const clearTimer = (timer: number | undefined) => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
    };

    const scheduleActiveRotation = () => {
      clearTimer(rotationTimer);
      rotationTimer = window.setTimeout(() => {
        if (inactive || document.hidden) return;

        activeTitleIndex = (activeTitleIndex + 1) % activeTitles.length;
        document.title = activeTitles[activeTitleIndex];
        scheduleActiveRotation();
      }, activeRotationDelay);
    };

    const showInactivePrompt = () => {
      inactive = true;
      clearTimer(rotationTimer);
      clearTimer(reservationPromptTimer);
      document.title = "Ei, você está aí?";

      reservationPromptTimer = window.setTimeout(() => {
        if (inactive) {
          document.title = "Vamos reservar agora?";
        }
      }, reservationPromptDelay);
    };

    const scheduleInactivityPrompt = () => {
      clearTimer(inactivityTimer);
      inactivityTimer = window.setTimeout(showInactivePrompt, inactivityDelay);
    };

    const registerActivity = () => {
      if (document.hidden) return;

      clearTimer(reservationPromptTimer);
      inactive = false;
      activeTitleIndex = 0;
      document.title = activeTitles[activeTitleIndex];
      scheduleActiveRotation();
      scheduleInactivityPrompt();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimer(inactivityTimer);
        showInactivePrompt();
        return;
      }

      registerActivity();
    };

    const activityEvents: Array<keyof WindowEventMap> = [
      "focus",
      "keydown",
      "pointerdown",
      "scroll",
      "touchstart",
    ];

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, registerActivity, { passive: true });
    });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    scheduleActiveRotation();
    scheduleInactivityPrompt();

    return () => {
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, registerActivity);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimer(rotationTimer);
      clearTimer(inactivityTimer);
      clearTimer(reservationPromptTimer);
      document.title = initialTitle;
    };
  }, []);

  return null;
}
