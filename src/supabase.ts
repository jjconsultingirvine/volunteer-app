import { useSession } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";
declare global {
    interface Window {
      Clerk: any;
    }
  }
const supabase = createClient("https://ofcyrxnohrpellwpsikd.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mY3lyeG5vaHJwZWxsd3BzaWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk3ODIxNjksImV4cCI6MjAzNTM1ODE2OX0.Tni0wT-tBUbF8JBbL_yChBNVzH-O45SWhaCVo-EEYQY",{
    global: {
      // Get the Supabase token with a custom fetch method
      fetch: async (url, options = {}) => {
        // const clerkToken = await session().session?.getToken({
        //   template: "supabase",
        // });
        // console.log(clerkToken);

        // // Construct fetch headers
        // const headers = new Headers(options?.headers);
        // headers.set("Authorization", `Bearer ${clerkToken}`);

        // // Now call the default fetch
        return fetch(url, {
          ...options,
        });
      },
    },
  });

export default supabase;