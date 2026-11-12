
import { useEffect } from "react";

import {
  setSession,
  setInitialized,
} from "../authSlice";
import { useAppDispatch } from "../../../app/store";
import { supabase } from "../../../lib/supabase";

export default function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          dispatch(setSession(session));
        }
      }
    );

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;

      if (error) {
        console.error("Session initialization failed:", error);
      }

      dispatch(setSession(data.session));
      dispatch(setInitialized());
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return null;
}
