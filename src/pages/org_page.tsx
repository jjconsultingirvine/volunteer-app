import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import supabase from "../supabase";
import "../style/org_page.css";
import { useSession } from "@clerk/clerk-react";
import TopNavBar from "../components/top_nav_bar";
import { Link } from "react-router-dom";

const OrgPage: React.FC<{}> = () => {
  const clerk_session = useSession().session;
  console.log(clerk_session);
  const org_id = useParams().org_id;
  const [org, setOrg] = useState(null) as any;
  async function get_org() {
    const { data } = await supabase(clerk_session).then((sup) =>
      sup.from("organizations").select().eq("pretty_name", org_id)
    );
    console.log(data);
    setOrg(data![0]);
    console.log(data![0]);
  }
  useEffect(() => {
    get_org();
  }, [clerk_session]);
  return (
    org && (
      <div className="outer_page">
        <TopNavBar title={org.name}></TopNavBar>
        <div className="page narrow-page">
          <div className="horizontal">
            {org.pfp && <img src={org.pfp} className="org_pfp" />}
            <div className="org_page_short_desc">{org.short_desc}</div>
          </div>
          <div className="org_interest">
            Organization Interest:{" "}
            <Link to={"/search/" + encodeURIComponent(org.interest)}>
              {org.interest}
            </Link>
          </div>
          <div className="org_desc">{org.long_desc}</div>
          {org.roles.length > 0 && (
            <>
              <h2>Volunteer Roles</h2>
              {org.roles.map((role: any) => (
                <div key={role.name} className="role">
                  <div className="role_name">{role.name}</div>
                  <div className="role_skills">
                    {role.skills.length
                      ? role.skills.join(", ")
                      : "No skills required"}
                  </div>
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
                <button>Visit Website</button>
              </a>
            )}
            {org.sign_up && (
              <a href={org.sign_up}>
                <button>Sign Up</button>
              </a>
            )}
          </div>
          <div className="org_log_hours">
            <a href={"/log/"+org.pretty_name}><button>Log Hours</button></a>
          </div>
        </div>
      </div>
    )
  );
};

export default OrgPage;
