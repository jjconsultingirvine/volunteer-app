import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import supabase from "../supabase";
import "../style/org_page.css";
import { useSession } from "@clerk/clerk-react";
import TopNavBar from "../components/top_nav_bar";

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
      <div className="org_page_outer">
        <div className="page">
          <TopNavBar title={org.name}></TopNavBar>
          <div className="horizontal-maybe">
            <div>
              <div className="horizontal">
                {org.pfp && <img src={org.pfp} className="org_pfp" />}
                <div className="org_page_short_desc">{org.short_desc}</div>
              </div>
              <div className="org_desc">{org.long_desc}</div>
              {org.volunteer_requirements && (
                <div>
                  <div className="org_page_header">Requirements</div>
                  <ul>
                    {org.volunteer_requirements
                      .split(",")
                      .map((req: string) => (
                        <li key={req}>{req}</li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
            <div>
              {(org.phone || org.email) && (
                <div className="org_page_header">Contact</div>
              )}
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
                  <button onClick={() => (window.location.href = org.website)}>
                    Visit Website
                  </button>
                )}
                {org.sign_up && (
                  <button onClick={() => (window.location.href = org.sign_up)}>
                    Sign Up
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default OrgPage;
