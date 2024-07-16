import "../style/home.css";
import React from "react";
import TopNavBar from "../components/top_nav_bar";
import OrgListing from "../components/org_listing";
import { Experience, Organization, User } from "../schema";
import { SupabaseClient } from "@supabase/supabase-js";
import { Link } from "react-router-dom";
import { hours_text } from "../helpers";

interface Props {
  supabase: SupabaseClient<any, "public", any>;
  clerk_session: any;
  user: User | null;
  orgs: Organization[];
  experiences: Experience[];
  setUser: (usr: User) => void;
}

const Home: React.FC<Props> = (props: Props) => {
  const toggle_save = (name: string) => {
    if (!props.user) return;
    let new_saved = props.user.saved.slice();
    if (new_saved.includes(name)) {
      new_saved.splice(new_saved.indexOf(name), 1);
    } else {
      new_saved.push(name);
    }
    props.setUser({ ...props.user, saved: new_saved });
  };
  let saved_list = [] as Organization[];
  let recommended_list = [] as Organization[];
  let unsaved_list = [] as Organization[];
  (props.orgs || []).forEach((org) => {
    if (props.user && props.user.saved.includes(org.url_name))
      saved_list.push(org);
    else if (
      props.user &&
      org.roles
        .map(
          (role) =>
            role.skills.every((skill) => props.user!.skills.includes(skill)) &&
            props.user!.interests.includes(
              role.interest ? role.interest : org.interest
            )
        )
        .some((n: boolean) => n)
    )
      recommended_list.push(org);
    else unsaved_list.push(org);
  });
  const volunteer_time = hours_text(
    props.experiences
      .filter((exp) => exp.count_towards_award)
      .map((val) => val.duration || 0)
      .concat(0)
      .reduce((l, r) => l + r)
  );

  return (
    <>
      <TopNavBar is_home user={props.user} title="Volunteer App"></TopNavBar>
      <div className="page" id="home">
        <div className="horizontal-wrap panel">
          <div className="profile_info">
            <h2>
              Welcome{props.user ? ", " + props.user.name.split(" ")[0] : ""}!
            </h2>
            {props.user && (
              <p>
                You have spent <strong>{volunteer_time}</strong> volunteering
              </p>
            )}
          </div>
          <div className="home_buttons">
            <div className="horizontal">
              <Link to="/volunteer-app/search">
                <button>Search</button>
              </Link>
              {props.user && (
                <Link to={"/volunteer-app/profile/" + props.user?.random_id}>
                  <button>My Profile</button>
                </Link>
              )}
            </div>
            {props.user && props.user.award_id != undefined && 
            <Link to="/volunteer-app/congressional_award">
              <button>Congressional Award</button>
            </Link>}
            <Link to="/volunteer-app/log/custom">
              <button className="external_log">
                Log with external organization
              </button>
            </Link>
          </div>
        </div>
        <div className="orgs_list">
          {saved_list.length != 0 && <h2>Saved</h2>}
          <div className="orgs_list">
            {saved_list.map((org) => (
              <OrgListing
                org={org}
                saved
                save_callback={toggle_save}
                key={org.url_name}
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
                key={org.url_name}
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
                key={org.url_name}
              ></OrgListing>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
