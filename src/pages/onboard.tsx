import { useSession } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import supabase from "../supabase";
import { Link } from "react-router-dom";
import { User, interests, skill_sets } from "../schema";
import TopNavBar from "../components/top_nav_bar";
import "../style/onboard.css";

const Onboard: React.FC<{}> = () => {
  const clerk_session = useSession().session;
  const [my_interests, setMyInterests] = useState([] as string[]);
  const [my_skills, setMySkills] = useState([] as string[]);
  const [my_name, setMyName] = useState("");
  const [my_bio, setMyBio] = useState("");
  const [is_update, setIsUpdate] = useState(false);
  let profile = {
    Name: my_name,
    interests: my_interests.join(","),
    pfp: clerk_session?.user.hasImage ? clerk_session.user.imageUrl : null,
    skills: my_skills.join(","),
    user_id: clerk_session?.user.id,
    description: my_bio,
  };
  useEffect(() => {
    if (clerk_session) {
      supabase(clerk_session).then((sup) =>
        sup
          .from("profiles")
          .select()
          .eq("user_id", clerk_session.user.id)
          .then((data) => {
            if (!data.data || data.data.length == 0) {
              if (clerk_session.user.fullName) {
                console.log("setting your name");
                setMyName(clerk_session.user.fullName);
              }
              sup
                .from("profiles")
                .insert(profile)
                .then((val) => {
                  console.log("Inserted new user");
                  console.log(val);
                });
            } else if (data.data) {
              console.log(data.data[0]);
              setMyInterests(
                data.data[0].interests
                  .split(",")
                  .filter((int: string) => int.length != 0)
              );
              setMySkills(
                data.data[0].skills
                  .split(",")
                  .filter((sk: string) => sk.length != 0)
              );
              setMyName(data.data[0].Name);
              setMyBio(data.data[0].description);
            }
          })
      );
    }
  }, [clerk_session]);
  useEffect(() => {
    if (is_update) {
      setIsUpdate(false);
      post_update();
    }
  }, [is_update]);
  const post_update = async () => {
    if (clerk_session) {
      console.log("updating to");
      console.log(profile);
      let sup = await supabase(clerk_session);
      await sup
        .from("profiles")
        .update(profile)
        .eq("user_id", clerk_session.user.id);
    }
  };
  return (
    <>
      <TopNavBar title="Edit profile"></TopNavBar>
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
          <Link to="/home">
            <button>Start Exploring!</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Onboard;
