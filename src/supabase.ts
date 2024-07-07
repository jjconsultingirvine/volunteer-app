import { createClient } from "@supabase/supabase-js";

const URL = "https://ofcyrxnohrpellwpsikd.supabase.co";
const PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mY3lyeG5vaHJwZWxsd3BzaWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk3ODIxNjksImV4cCI6MjAzNTM1ODE2OX0.Tni0wT-tBUbF8JBbL_yChBNVzH-O45SWhaCVo-EEYQY";

const default_supabase = () => {
  return createClient(URL, PUBLISHABLE_KEY);
}

const clerk_supabase = async (session: any) => {
  const client = createClient(URL, PUBLISHABLE_KEY,
    {
      auth: { persistSession: true, autoRefreshToken: true },
      global: {
        fetch: async (url, options = {}) => {
          if(!session) return fetch(url, options);
          const clerkToken = await session.getToken({
            template: "supabase",
          });

          // Construct fetch headers
          const headers = new Headers(options?.headers);
          headers.set("Authorization", `Bearer ${clerkToken}`);
          // Now call the default fetch
          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    }
  );
  return client;
};
export { default_supabase, clerk_supabase };
