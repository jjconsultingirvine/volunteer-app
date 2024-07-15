import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import TopNavBar from "../components/top_nav_bar";
import { Link } from "react-router-dom";
import { Experience, Organization, User } from "../schema";
import { SupabaseClient } from "@supabase/supabase-js";

import "../style/profile.css";
import VolunteerSummary from "../components/volunteer_summary";
import ThreeDots from "../components/three_dots";
import { get_exp_date, hours_text } from "../helpers";

interface Props {
  supabase: SupabaseClient<any, "public", any>;
  clerk_session: any;
  orgs: Organization[];
  user: User | null;
}

const Profile: React.FC<Props> = (props: Props) => {
  const params = useParams();
  const [data, setData] = useState(null as any);
  const [experiences, setExperiences] = useState([] as Experience[]);
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
  return (
    <>
      <TopNavBar user={props.user} title={data ? data.name : ""}></TopNavBar>
      <div id="profile" className="page">
        {data && (
          <>
            <div className="user_info">
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
                <div>
                  <strong>Interests:</strong> {data.interests.join(", ")}
                </div>
                <div>
                  <strong>Skills:</strong> {data.skills.join(", ")}
                </div>
              </div>
            </div>
            {experiences.length != 0 && (
              <VolunteerSummary
                exps={experiences}
                award_id={props.user?.award_id}
              ></VolunteerSummary>
            )}
            <h2>Volunteer History</h2>
            <div className="experiences_list">
              {experiences
                .sort((a, b) => (b.time < a.time ? -1 : 1))
                .map((exp, id) => {
                  let matches = orgs.filter((n) => n.name == exp.org_name);
                  let org_link =
                    matches.length == 0 ? (
                      <>{exp.org_name}</>
                    ) : (
                      <Link to={"/org/" + matches[0].url_name}>
                        {exp.org_name}
                      </Link>
                    );
                  const date = get_exp_date(exp);
                  return (
                    <div className="experience" key={(exp as any).id}>
                      {is_me && (
                        <ThreeDots
                          style={{ width: "1rem", height: "1rem" }}
                          actions={[
                            [
                              "Toggle in totals",
                              () => {
                                let new_experiences = experiences.slice();
                                let old = experiences[id].count_towards_award;
                                new_experiences[id].count_towards_award = !old;
                                props.supabase
                                  .from("experiences")
                                  .update({ count_towards_award: !old })
                                  .eq("id", (experiences[id] as any).id)
                                  .then((val) => console.log(val));
                              },
                            ],
                            [
                              "Delete",
                              () => {
                                props.supabase
                                  .from("experiences")
                                  .delete()
                                  .eq("id", (experiences[id] as any).id)
                                  .then(console.log);
                              },
                            ],
                          ]}
                        ></ThreeDots>
                      )}
                      <div className="experience_org_name">{org_link}</div>
                      <div className="experience_role">{exp.role}</div>
                      <div className="exp_date">On {date}</div>
                      <div className="exp_dur">
                        For {hours_text(exp.duration)}
                      </div>
                      {!exp.count_towards_award && (
                        <div className="cong_award_count">
                          Not included in totals
                        </div>
                      )}
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
