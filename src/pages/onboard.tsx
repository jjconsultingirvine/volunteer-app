import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User, interests, skill_sets } from "../schema";
import TopNavBar from "../components/top_nav_bar";
import "../style/onboard.css";
import { SupabaseClient } from "@supabase/supabase-js";

interface Props {
  supabase: SupabaseClient<any, "public", any>;
  clerk_session: any;
  user: User | null;
  setUser: (usr: User) => void;
}

const Onboard: React.FC<Props> = (props: Props) => {
  const [my_interests, setMyInterests] = useState([] as string[]);
  const [my_skills, setMySkills] = useState([] as string[]);
  const [my_name, setMyName] = useState("");
  const [my_bio, setMyBio] = useState("");
  const [is_update, setIsUpdate] = useState(false);
  let profile: User = {
    name: my_name,
    random_id: props.user?.random_id || Math.floor(Math.random() * 100000000),
    saved: props.user?.saved || [],
    interests: my_interests,
    pfp: props.clerk_session?.user.hasImage
      ? props.clerk_session.user.imageUrl
      : undefined,
    skills: my_skills,
    user_id: props.clerk_session?.user.id || "",
    description: my_bio,
  };
  useEffect(() => {
    if (props.clerk_session) {
      props.supabase
        .from("profiles")
        .select()
        .eq("user_id", props.clerk_session.user.id)
        .then((data: { data: User[] | null }) => {
          if (!data.data || data.data.length == 0) {
            if (props.clerk_session.user.fullName) {
              setMyName(props.clerk_session.user.fullName);
            }
            props.supabase
              .from("profiles")
              .insert(profile)
              .then((val) => {
                console.log(val);
                console.log("Inserted new user");
              });
          } else if (data.data) {
            setMyInterests(data.data[0].interests);
            setMySkills(data.data[0].skills);
            setMyName(data.data[0].name);
            setMyBio(data.data[0].description || "");
          }
        });
    }
  }, [props.clerk_session, props.supabase]);
  useEffect(() => {
    if (is_update) {
      setIsUpdate(false);
      props.setUser(profile);
    }
  }, [is_update]);
  return (
    <>
      <TopNavBar user={props.user} title="Edit profile"></TopNavBar>
      <div className="page">
        <div className="onboard-centered">
          <h2>Welcome!</h2>
          <input
            type="text"
            id="name_entry"
            value={my_name}
            placeholder="Name"
            onChange={(e) => {
              setMyName(e.target.value);
              setIsUpdate(true);
            }}
          ></input>
          <p>Short biography:</p>
          <input
            type="text"
            id="bio_entry"
            placeholder="Bio"
            value={my_bio}
            onChange={(e) => {
              setMyBio(e.target.value);
              setIsUpdate(true);
            }}
          ></input>
        </div>
        <div className="horizontal-maybe">
          <div>
            <p>Select areas of interest</p>
            {interests.map((interest) => {
              return (
                <div key={interest.replace(/ /g, "")}>
                  <input
                    type="checkbox"
                    id={interest}
                    onChange={(e) => {
                      let is_in = (e.target as any).checked;
                      if (!is_in)
                        setMyInterests(
                          my_interests.filter((int) => int != interest)
                        );
                      else if (!my_interests.includes(interest)) {
                        let newe = my_interests.slice();
                        newe.push(interest);
                        setMyInterests(newe);
                      } else return;
                      setIsUpdate(true);
                    }}
                    checked={my_interests.includes(interest)}
                  ></input>
                  <label htmlFor={interest}>{interest}</label>
                </div>
              );
            })}
          </div>
          <div>
            <p>Now select your skills</p>
            {skill_sets.map((skill) => {
              return (
                <div key={skill.replace(/ /g, "")}>
                  <input
                    type="checkbox"
                    id={skill}
                    onChange={(e) => {
                      let is_in = (e.target as any).checked;
                      if (!is_in)
                        setMySkills(my_skills.filter((int) => int != skill));
                      else if (!my_skills.includes(skill)) {
                        let newe = my_skills.slice();
                        newe.push(skill);
                        setMySkills(newe);
                      } else return;
                      setIsUpdate(true);
                    }}
                    checked={my_skills.includes(skill)}
                  ></input>
                  <label htmlFor={skill}>{skill}</label>
                </div>
              );
            })}
          </div>
        </div>
        <div className="onboard-centered">
          <Link to="/">
            <button>Start Exploring!</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Onboard;
