"use client";
import store, { persistor } from "@/store/store";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export function ReduxProvider({ children }: { children: ReactNode }) {
  // If we're on the server or persistor is not ready
  if (typeof window === "undefined" || !persistor) {
    return <Provider store={store}>{children}</Provider>;
  }
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
