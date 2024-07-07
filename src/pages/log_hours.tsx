import { useNavigate, useParams } from "react-router";
import TopNavBar from "../components/top_nav_bar";
import { useState } from "react";

import "../style/log_hours.css";
import { Organization, User } from "../schema";
import { SupabaseClient } from "@supabase/supabase-js";

interface Props {
  supabase: SupabaseClient<any, "public", any>;
  clerk_session: any;
  user: User | null;
  orgs: Organization[];
  setUser: (usr: User) => void;
}

const LogHours: React.FC<Props> = (props: Props) => {
  const navigate = useNavigate();
  const { organization_name } = useParams();
  const [date, setDate] = useState(
    `${new Date().getMonth() + 1}/${new Date().getDate()}/${
      new Date().getFullYear() - 2000
    }`
  );
  const [selected_role, setRole] = useState("Other");
  const org: Organization | null = props.orgs.filter((org) => org.url_name == organization_name)[0];
  const [other_role, setOtherRole] = useState("");
  const [custom_org_name, setCustomOrgName] = useState("");
  const [duration, setDuration] = useState("");
  const validDate =
    date.match(
      /^([01]{0,1})([0123456789]{1})\/([0123]{0,1})([0123456789]{1})(\/[0123456789]{2,4}){0,1}$/
    ) != null;
  const validDuration = !isNaN(Number(duration));
  const submit = () => {
    if (!validDate) return;
    if (!validDuration) return;
    if (!props.user) return alert("User is not signed in");
    const timestamp = new Date();
    const date_nums = date.split("/").map((num) => Number(num));
    timestamp.setMonth(date_nums[0] - 1, date_nums[1]);
    // Assume middle of the day so no funky timezone stuff happens
    timestamp.setHours(12);
    if (date.split("/")[2]) {
      if (date.split("/")[2].length == 2)
        timestamp.setFullYear(2000 + date_nums[2]);
      else timestamp.setFullYear(date_nums[2]);
    }
    const object = {
      duration: Number(duration) || 60,
      role:
        selected_role == "Other" || organization_name == "custom"
          ? other_role
          : selected_role,
      random_user_id: props.user!.random_id,
      org_name: organization_name == "custom" ? custom_org_name : org?.name,
      time: timestamp,
    };
    props.supabase
      .from("experiences")
      .insert(object)
      .then((val) => {
        if (val.status != 201) return alert("Database could not be updated");
        else navigate(-1);
      });
  };
  return (
    <>
      <TopNavBar user={props.user} title="Log Hours"></TopNavBar>
      <div className="page narrow-page" id="log_hours">
        {org && org.name && <div>Log for {org.name}</div>}
        {((!org) || organization_name == "custom") && (
          <input
            value={custom_org_name}
            onChange={(e) => setCustomOrgName(e.target.value)}
            placeholder={"Name of Organization"}
            type="text"
          ></input>
        )}
        <h2>Enter date</h2>
        <input
          type="text"
          className={
            validDate ? "log_hours_date" : "log_hours_date input_invalid"
          }
          value={date}
          placeholder="Enter date"
          onChange={(e) => setDate(e.target.value)}
        ></input>
        <h2>Select your role</h2>
        <div className="roles_list">
          {org && org.roles.map((role: any) => {
            return (
              <div key={role.name}>
                <input
                  type="radio"
                  id={role.name.replace(/ /g, "")}
                  checked={selected_role == role.name}
                  onChange={() => setRole(role.name)}
                ></input>
                <label htmlFor={role.name.replace(/ /g, "")}>{role.name}</label>
              </div>
            );
          })}
          {organization_name != "custom" && (
            <div>
              <input
                type="radio"
                id="other"
                checked={selected_role == "Other"}
                onChange={() => setRole("Other")}
              ></input>
              <label htmlFor="other">Other</label>
            </div>
          )}
          {(selected_role == "Other" || organization_name == "custom") && (
            <input
              type="text"
              value={other_role}
              onChange={(e) => setOtherRole(e.target.value)}
              placeholder="Worker"
            ></input>
          )}
        </div>
        <h2>How long did you work for?</h2>
        <div className="duration_holder">
          <input
            type="text"
            className={
              validDuration ? "log_duration" : "log_duration input_invalid"
            }
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder={"60"}
          ></input>
          <span>minutes</span>
        </div>
        <button
          onClick={submit}
          className={validDate && validDuration ? "" : "input_invalid"}
        >
          Submit
        </button>
        {(!validDate && (
          <div className="error_message">
            Error: date must be in format "mm/dd/yy"
          </div>
        )) ||
          (!validDuration && (
            <div className="error_message">
              Error: duration must be a number
            </div>
          ))}
      </div>
    </>
  );
};

export default LogHours;
