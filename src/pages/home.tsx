import "../style/home.css";
import React, { useEffect, useState } from "react";
import supabase from "../supabase";
import { useSession } from "@clerk/clerk-react";
import TopNavBar from "../components/top_nav_bar";
import OrgListing from "../components/org_listing";
import { Organization, User } from "../schema";

const Home: React.FC<{}> = () => {
  const clerk_session = useSession().session;
  const [orgs, setOrgs] = useState([] as Organization[]);
  const [user, setUser] = useState(null as User | null);
  useEffect(() => {
    supabase(clerk_session).then((sup) => {
      sup
        .from("organizations")
        .select()
        .then((data) => {
          console.log(data);
          setOrgs(data.data!);
        });
      if (clerk_session)
        sup
          .from("profiles")
          .select()
          .eq("user_id", clerk_session.user.id)
          .then((data) => setUser(data.data![0]));
    });
  }, [clerk_session]);
  const toggle_save = (name: string) => {
    if (!user) return;
    let new_saved = (user as any).saved as string[];
    if (new_saved.includes(name)) {
      new_saved.splice(new_saved.indexOf(name), 1);
    } else {
      new_saved.push(name);
    }
    console.log(new_saved);
    setUser({ saved: new_saved, ...(user as any) });
    supabase(clerk_session).then((sup) => {
      sup
        .from("profiles")
        .update({ saved: new_saved })
        .eq("user_id", clerk_session!.user.id)
        .then((val) => console.log(val));
    });
  };
  let saved_list = [] as any[];
  let recommended_list = [] as any[];
  let unsaved_list = [] as any[];
  orgs.forEach((org) => {
    if (user && (user.saved as string[]).includes(org.url_name))
      saved_list.push(org);
    else if (
      user &&
      org.roles
        .map(
          (role) =>
            role.skills.every((skill) => user.skills.includes(skill)) &&
            user.interests.includes(
              role.interest ? role.interest : org.interest
            )
        )
        .some((n: boolean) => n)
    )
      recommended_list.push(org);
    else unsaved_list.push(org);
  });

  return (
    <div className="page">
      <TopNavBar title="Volunteer App"></TopNavBar>
      <div className="orgs_list">
        {saved_list.length != 0 && <h2>Saved</h2>}
        <div className="orgs_list">
          {saved_list.map((org) => (
            <OrgListing
              org={org}
              saved
              save_callback={toggle_save}
            ></OrgListing>
          ))}
        </div>
        {recommended_list.length != 0 && <h2>Recommended</h2>}
        <div className="orgs_list">
          {recommended_list.map((org) => (
            <OrgListing
              org={org}
              saved={false}
              save_callback={toggle_save}
            ></OrgListing>
          ))}
        </div>
        {unsaved_list.length != 0 && <h2>All Organizations</h2>}
        <div className="orgs_list">
          {unsaved_list.map((org) => (
            <OrgListing
              org={org}
              saved={false}
              save_callback={toggle_save}
            ></OrgListing>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Home;
