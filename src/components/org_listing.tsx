import React from "react";
import { Organization } from "../schema";

interface Props {
  org: Organization
  saved: boolean;
  save_callback: (name: string) => void;
}

const OrgListing: React.FC<Props> = (props: Props) => {
  return (
    <div className="org_listing">
      <div>
        {props.org.pfp && <img src={props.org.pfp} className="org_pfp" />}
        <div><div className="org_name">{props.org.name}</div><div className="org_short_desc">{props.org.short_desc}</div></div>
      </div>
      <div>
        <div>
        <button className="toggle_save" onClick={()=>props.save_callback(props.org.url_name)}>{props.saved ? "Unsave" : "Save"}</button>
        {props.saved && <button className="log_hours_btn" onClick={()=>(window.location.href="/log/" + props.org.url_name)}>Log Hours</button>}
        </div>
        
        <button
          className="explore_button"
          onClick={() => (window.location.href = "/org/" + props.org.url_name)}
        >
          {props.saved ? "View" : "Explore"}
        </button>
      </div>
    </div>
  );
};

export default OrgListing;
