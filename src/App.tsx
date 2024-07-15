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
import { Experience, Organization, User } from "./schema";
import Search from "./pages/search";
import CongressionalAward from "./pages/congressional_award";

function App() {
  const [supabase, setSupabase] = useState(() => default_supabase());
  const [user, setUserState] = useState(null as User | null);
  const [orgs, setOrgs] = useState([] as Organization[]);
  const [myExperiences, setMyExperiences] = useState([] as Experience[]);
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
    if (session)
      supabase
        .from("profiles")
        .select()
        .eq("user_id", session.user.id)
        .then((user) => setUserState(user.data![0]));
  }, [supabase, session]);
  useEffect(() => {
    if(session) supabase
      .from("experiences")
      .select()
      .eq("random_user_id", user?.random_id)
      .then((exps) => {if(exps.data) setMyExperiences(exps.data!)});
  }, [user]);

  const router = createBrowserRouter([
    {
      path: "/volunteer-app",
      element: (
        <Home
          clerk_session={session}
          orgs={orgs}
          user={user}
          setUser={setUser}
          supabase={supabase}
          experiences={myExperiences}
        ></Home>
      ),
    },
    {
      path: "/volunteer-app/search",
      element: (
        <Search
          clerk_session={session}
          orgs={orgs}
          user={user}
          setUser={setUser}
          supabase={supabase}
        ></Search>
      ),
    },
    {
      path: "/volunteer-app/org/:org_id",
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
      path: "/volunteer-app/profile/:profile_id",
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
      path: "/volunteer-app/onboard",
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
      path: "/volunteer-app/log/:organization_name",
      element: (
        <LogHours
          clerk_session={session}
          orgs={orgs}
          supabase={supabase}
          user={user}
          setUser={setUser}
          myExperiences={myExperiences}
          setMyExperiences={setMyExperiences}
        ></LogHours>
      ),
    },
    {
      path: "/volunteer-app/congressional_award",
      element: (
        <CongressionalAward
          clerk_session={session}
          supabase={supabase}
          user={user}
          experiences={myExperiences}
          setMyExperiences={setMyExperiences}
        ></CongressionalAward>
      ),
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
