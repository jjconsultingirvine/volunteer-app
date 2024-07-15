import React, { useEffect, useState } from "react";
import TopNavBar from "../components/top_nav_bar";
import { Experience, User } from "../schema";
import { SupabaseClient } from "@supabase/supabase-js";
import VolunteerSummary from "../components/volunteer_summary";

import "../style/congressional_award.css";
import { get_exp_date, get_exp_duration_pretty, hours_text } from "../helpers";

interface Props {
  supabase: SupabaseClient<any, "public", any>;
  clerk_session: any;
  user: User | null;
  experiences: Experience[];
  setMyExperiences: (data: Experience[]) => void;
}

const unique = (val: any, idx: number, arr: any[]) => arr.indexOf(val) == idx;

const CongressionalAward: React.FC<Props> = (props: Props) => {
  const [my_contacts, setMyContacts] = useState([] as string[]);
  const [new_contact, setNewContact] = useState("");
  useEffect(() => {
    setMyContacts(
      props.experiences
        .map((exp) => exp.contact)
        .filter((val) => val != undefined)
        .filter(unique)
    );
  }, [props.experiences.length]);
  let contact_orgs = Array(my_contacts.length)
    .fill(0)
    .map((_) => [] as string[]);
  my_contacts.forEach((cont, ind) => {
    props.experiences.forEach((exp) => {
      if (exp.contact == cont && !contact_orgs[ind].includes(exp.org_name))
        contact_orgs[ind].push(exp.org_name);
    });
  });
  const my_orgs = props.experiences
    .map((exp) => exp.org_name)
    .filter(unique)
    .sort();

  const email_options = my_contacts.map((email) => (
    <option key={email} value={email}>
      {email}
    </option>
  ));
  const email_options_for_exp = email_options.concat([
    <option key="none" value="none">
      Exclude
    </option>,
  ]);
  const email_options_for_group = email_options.concat([
    <option key="none" value="none">
      Exclude
    </option>,
    <option key="varied" value="varied">
      Varied
    </option>,
  ]);

  const email_regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const add_contact = () => {
    if (!email_regex.test(new_contact)) return;
    setNewContact("");
    if (my_contacts.includes(new_contact)) return;
    setMyContacts(my_contacts.concat([new_contact]));
  };
  return (
    <>
      <TopNavBar user={props.user} title="Congressional Award"></TopNavBar>
      <div className="page" id="cong_award">
        {props.experiences.length != 0 && (
          <VolunteerSummary
            exps={props.experiences}
            award_id={props.user?.award_id}
          ></VolunteerSummary>
        )}
        <h2>Your contacts</h2>
        {my_contacts.map((cont, ind) => (
          <div key={cont}>
            {cont} -{" "}
            {contact_orgs[ind].length
              ? contact_orgs[ind].join(", ")
              : "Not assigned"}
          </div>
        ))}
        <div className="new_contact_div">
          <input
            type="text"
            className="my_input"
            value={new_contact}
            onChange={(e) => setNewContact(e.target.value)}
            placeholder="newcontact@gmail.com"
            onKeyUp={(e) => {
              if (e.key == "Enter") add_contact();
            }}
          ></input>
          <button
            className={
              email_regex.test(new_contact)
                ? "email_add_btn"
                : "email_add_btn invalid"
            }
            onClick={add_contact}
          >
            Add
          </button>
        </div>
        <div className="panel">
          <h2 style={{ marginTop: "0" }}>Quick set</h2>
          {my_orgs.map((org_name) => {
            let val = props.experiences
              .filter((exp) => exp.org_name == org_name)
              .map((exp) => exp.contact)
              .filter(unique)
              .filter((name) => name != "none")
              .filter((name) => name != undefined);
            let value = "varied";
            if (val.length == 1) value = val[0];
            if (val.length == 0) value = "none";
            return (
              <div key={org_name} className="quick_set">
                <span>{org_name}</span>
                <select
                  value={value}
                  onChange={(e) => {
                    let new_val: string | undefined = e.target.value;
                    if (new_val == "varied") return;
                    if (new_val == "none") new_val = undefined;
                    console.log(new_val);
                    props.experiences.forEach((exp) => {
                      if (exp.org_name == org_name)
                        props.supabase
                          .from("experiences")
                          .update({
                            contact: new_val == undefined ? null : new_val,
                          })
                          .eq("id", (exp as any).id)
                          .select()
                          .then(console.log);
                    });
                    props.setMyExperiences(
                      props.experiences.map((val) => {
                        if (val.org_name == org_name)
                          return { ...val, contact: new_val };
                        return val;
                      })
                    );
                  }}
                >
                  {email_options_for_group}
                </select>
              </div>
            );
          })}
        </div>
        <h2>Your experiences</h2>
        <div className="cong_award_exp_list">
          {props.experiences.map((exp, id) => {
            return (
              <div
                key={(exp as any).id}
                className={
                  exp.contact == undefined
                    ? "cong_award_exp panel unset"
                    : "panel cong_award_exp"
                }
              >
                <div className="ca_exp_name">{exp.org_name}</div>
                <div className="ca_exp_role">{exp.role}</div>
                <div className="ca_exp_duration">
                  For {hours_text(exp.duration)}
                </div>
                <div className="ca_exp_date">On {get_exp_date(exp)}</div>
                <select
                  value={exp.contact || "none"}
                  className={exp.contact == undefined ? "unset" : ""}
                  onChange={(e) => {
                    let new_contact =
                      e.target.value == "none" ? null : e.target.value;
                    let new_exps = props.experiences.slice();
                    new_exps[id].contact =
                      new_contact == null ? undefined : new_contact;
                    props.setMyExperiences(new_exps);
                    props.supabase
                      .from("experiences")
                      .update({ contact: new_contact })
                      .eq("id", (exp as any).id)
                      .then(console.log);
                  }}
                >
                  {email_options_for_exp}
                </select>
              </div>
            );
          })}
        </div>
        <div className="emails panel">
          <h2>Emails to send</h2>
          <div className="email_list">
            {my_contacts.map((email) => {
              if (!props.experiences.some((exp) => exp.contact == email)) {
                return (
                  <p key={email}>
                    To: <a href={"mailto:" + email}>{email}</a>
                    <br />
                    {email} has no hours to verify.
                  </p>
                );
              }
              return (
                <div key={email} className="email_template">
                  <p>
                    To: <a href={"mailto:" + email}>{email}</a>
                  </p>
                  <p>Subject: Congressional Award Volunteer Verification</p>
                  <div className="template_text" id={email.replace("@","2").replace(/\./g,"")}>
                  <p>Hello!</p>
                  <p>
                    I am doing a project called the Congressional Award that is
                    given to students who complete life building activities like
                    volunteering and self improvement. As a part of that, I need
                    my volunteer coordinators to verify my service hours. It is
                    as easy as just clicking a button to verify the hours!{" "}
                    <b>
                      If you are willing to click this button for me, send a
                      confirmation message so I can put you as my reference :)
                    </b>
                  </p>
                  <p>
                    If you want more details, here are the specific events I
                    need you to verify, but the email will just contain a table
                    of how many hours in each month.
                  </p>
                  <div className="email_experiences">
                    {props.experiences
                      .filter((exp) => exp.contact == email)
                      .sort((a, b) => (a.time < b.time ? -1 : 1))
                      .map((exp) => {
                        return (
                          <div key={(exp as any).id}>
                            {get_exp_date(exp)}: {exp.org_name} - {exp.role} for{" "}
                            <b>{get_exp_duration_pretty(exp)}</b>
                          </div>
                        );
                      })}
                  </div>
                  </div>
                  <button onClick={_=>window.navigator.clipboard.writeText((document.getElementById(email.replace("@","2").replace(/\./g,"")) as HTMLElement).innerText)}>Copy</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default CongressionalAward;
