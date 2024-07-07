import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import TopNavBar from "../components/top_nav_bar";
import { Link } from "react-router-dom";
import { Organization, User } from "../schema";
import { SupabaseClient } from "@supabase/supabase-js";

interface Props {
  supabase: SupabaseClient<any, "public", any>;
  clerk_session: any;
  orgs: Organization[];
  user: User | null;
}

const Profile: React.FC<Props> = (props: Props) => {
  const params = useParams();
  const [data, setData] = useState(null as any);
  const [experiences, setExperiences] = useState([] as any[]);
  const orgs = props.orgs;
  const is_me = params.profile_id == props.user?.random_id;
  useEffect(() => {
    props.supabase
      .from("profiles")
      .select()
      .eq("random_id", params.profile_id)
      .then((data) => {
        setData(data.data![0]);
      });
    props.supabase
      .from("experiences")
      .select()
      .eq("random_user_id", params.profile_id)
      .then((exps) => setExperiences(exps.data!));
  }, [props.supabase]);
  const volunteer_time =
    experiences
      .map((val) => val.duration || 0)
      .concat(0)
      .reduce((l, r) => l + r) / 60;
  return (
    <>
      <TopNavBar user={props.user} title={data ? data.name : ""}></TopNavBar>
      <div className="page">
        {data && (
          <>
            <div className="horizontal">
              <img
                className="org_pfp"
                src={
                  data.pfp ||
                  "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
                }
              ></img>
              <div className="org_page_short_desc">
                {data.description || "User on {app name}"}
              </div>
            </div>
            {is_me ? <Link to="/onboard">Edit profile</Link> : ""}
            <div className="profile_summary">
              <p>
                {data ? data.Name : ""} has spent{" "}
                <strong>
                  {volunteer_time.toFixed(1)} hour
                  {volunteer_time == 1 ? "" : "s"}
                </strong>{" "}
                volunteering!
              </p>
              <div>Interests: {data.interests.join(", ")}</div>
              <div>Skills: {data.skills.join(", ")}</div>
            </div>
            <h2>Volunteer History</h2>
            <div className="experiences_list">
              {experiences
                .sort((a, b) => (b.time < a.time ? -1 : 1))
                .map((exp) => {
                  let dur = exp.duration / 60;
                  let matches = orgs.filter((n) => n.name == exp.org_name);
                  let org_link =
                    matches.length == 0 ? (
                      <>{exp.org_name}</>
                    ) : (
                      <Link to={"/org/" + matches[0].url_name}>
                        {exp.org_name}
                      </Link>
                    );
                  return (
                    <div className="experience" key={exp.id}>
                      <div className="experience_org_name">
                        {org_link}
                        {exp.role ? " - " : ""}
                        {exp.role}
                      </div>
                      <div className="experience_role">{exp.role}</div>
                      <div className="exp_date">
                        On {exp.time.split("T")[0]}
                      </div>
                      <div className="exp_dur">
                        For {dur.toFixed(1)} hour{dur == 1 ? "" : "s"}
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default Profile;
