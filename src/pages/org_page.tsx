import React from "react";
import { useParams } from "react-router";
import "../style/org_page.css";
import { useSession } from "@clerk/clerk-react";
import TopNavBar from "../components/top_nav_bar";
import { Link } from "react-router-dom";
import { Organization, Role, User } from "../schema";
import { SupabaseClient } from "@supabase/supabase-js";

interface Props {
  supabase: SupabaseClient<any, "public", any>;
  clerk_session: any;
  user: User | null;
  orgs: Organization[];
}

const OrgPage: React.FC<Props> = (props: Props) => {
  const clerk_session = useSession().session;
  console.log(clerk_session);
  const org_id = useParams().org_id;
  const org = props.orgs.filter(org=>org.url_name == org_id)[0] || null;
  return (
    org && (
      <div className="outer_page">
        <TopNavBar user={props.user} title={org.name}></TopNavBar>
        <div className="page narrow-page">
          <div className="horizontal">
            {org.pfp && <img src={org.pfp} className="org_pfp" />}
            <div className="org_page_short_desc">{org.short_desc}</div>
          </div>
          <div className="org_interest">
            Organization Interest:{" "}
            <Link to={"/volunteer-app/search/?query=" + encodeURIComponent(org.interest)}>
              {org.interest}
            </Link>
          </div>
          <div className="org_desc">{org.long_desc}</div>
          {org.general_requirements.length > 0 && <><h2>General Requirements</h2><ul>{org.general_requirements.map(req=>(<li key={req}>{req}</li>))}</ul></>}
          {org.roles.length > 0 && (
            <>
              <h2>Volunteer Roles</h2>
              {org.roles.map((role: Role) => (
                <div key={role.name} className="role">
                  {role.link ? (
                    <a href={role.link}>
                      <div className="role_name">{role.name}</div>
                    </a>
                  ) : (
                    <div className="role_name">{role.name}</div>
                  )}
                  <div className="role_skills">
                    {role.skills.length
                      ? role.skills.join(", ")
                      : "No skills required"}
                  </div>
                  {role.interest && (
                    <div className="role_interest">{role.interest}</div>
                  )}
                  {role.requirements && <div className="role_requirements">Requirements:<ul>{role.requirements.map(req=>(<li key={req}>{req}</li>))}</ul></div>}
                  <div className="role_details">{role.details}</div>
                </div>
              ))}
            </>
          )}
          {(org.phone || org.email) && <h2>Contact</h2>}
          {org.phone && (
            <div>
              Phone: <a href={"tel:" + org.phone}>{org.phone}</a>
            </div>
          )}
          {org.email && (
            <div>
              Email: <a href={"mailto:" + org.email}>{org.email}</a>
            </div>
          )}
          {org.address && (
            <div>
              Address:{" "}
              <a
                href={
                  "https://www.google.com/maps/search/" +
                  encodeURIComponent(org.address)
                }
              >
                {org.address}
              </a>
            </div>
          )}
          <div className="org_buttons">
            {org.website && (
              <a href={org.website}>
                <button>Website</button>
              </a>
            )}
            {org.sign_up && (
              <a href={org.sign_up}>
                <button>Sign Up</button>
              </a>
            )}
          </div>
          <div className="org_log_hours">
            <Link to={"/volunteer-app/log/" + org.url_name}>
              <button>Log Hours</button>
            </Link>
          </div>
        </div>
      </div>
    )
  );
};

export default OrgPage;
