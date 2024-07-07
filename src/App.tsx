import { useEffect, useState } from "react";
import "./App.css";
import { useSession } from "@clerk/clerk-react";
import { clerk_supabase, default_supabase } from "./supabase";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home";
import OrgPage from "./pages/org_page";
import Profile from "./pages/profile";
import Onboard from "./pages/onboard";
import LogHours from "./pages/log_hours";
import { Organization, User } from "./schema";

function App() {
  const [supabase, setSupabase] = useState(() => default_supabase());
  const [user, setUserState] = useState(null as User | null);
  const [orgs, setOrgs] = useState([] as Organization[]);
  const { session } = useSession();
  const setUser = (usr: User) => {
    console.log("setting user", session?.user?.id);
    if (session)
      supabase
        .from("profiles")
        .update(usr)
        .eq("user_id", session.user.id)
        .then((_) => _);
    setUserState(usr as User | null);
  };

  useEffect(() => {
    if (!session) return;
    console.log("Updating supabase");
    setSupabase(clerk_supabase(session));
  }, [session?.user.id]);
  useEffect(() => {
    supabase
      .from("organizations")
      .select()
      .then((orgs) => setOrgs(orgs.data!));
    console.log(session?.user.id);
    if (session)
      supabase
        .from("profiles")
        .select()
        .eq("user_id", session.user.id)
        .then((user) => setUserState(user.data![0]));
  }, [supabase, session]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Home
          clerk_session={session}
          orgs={orgs}
          user={user}
          setUser={setUser}
          supabase={supabase}
        ></Home>
      ),
    },
    {
      path: "/org/:org_id",
      element: (
        <OrgPage
          clerk_session={session}
          orgs={orgs}
          supabase={supabase}
          user={user}
        ></OrgPage>
      ),
    },
    {
      path: "/profile/:profile_id",
      element: (
        <Profile
          clerk_session={session}
          user={user}
          orgs={orgs}
          supabase={supabase}
        ></Profile>
      ),
    },
    {
      path: "/onboard",
      element: (
        <Onboard
          clerk_session={session}
          supabase={supabase}
          user={user}
          setUser={setUser}
        ></Onboard>
      ),
    },
    {
      path: "/log/:organization_name",
      element: (
        <LogHours
          clerk_session={session}
          orgs={orgs}
          supabase={supabase}
          user={user}
          setUser={setUser}
        ></LogHours>
      ),
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
