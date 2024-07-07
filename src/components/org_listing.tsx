import React from "react";
import { Organization } from "../schema";
import { Link } from "react-router-dom";

interface Props {
  org: Organization;
  saved: boolean;
  save_callback: (name: string) => void;
}

const OrgListing: React.FC<Props> = (props: Props) => {
  return (
    <div className="org_listing">
      <div>
        {props.org.pfp && <img src={props.org.pfp} className="org_pfp" />}
        <div>
          <div className="org_name">{props.org.name}</div>
          <div className="org_short_desc">{props.org.short_desc}</div>
        </div>
      </div>
      <div>
        <div>
          <button
            className="toggle_save"
            onClick={() => props.save_callback(props.org.url_name)}
          >
            {props.saved ? "Unsave" : "Save"}
          </button>
          {props.saved && (
            <Link to={"/log/" + props.org.url_name}>
              <button className="log_hours_btn">Log Hours</button>
            </Link>
          )}
        </div>

        <Link to={"/org/" + props.org.url_name}>
          <button className="explore_button">
            {props.saved ? "View" : "Explore"}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default OrgListing;
