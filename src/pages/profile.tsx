import React, { useEffect, useState } from "react";
import supabase from "../supabase";
import { useSession } from "@clerk/clerk-react";
import { useNavigate, useParams } from "react-router";

interface Props {}

const Profile: React.FC<Props> = (props: Props) => {
  const params = useParams();
  const [data, setData] = useState(null as any);
  const navigate = useNavigate();
  const session = useSession().session;
  useEffect(() => {
    supabase(session).then(sup=>sup
      .from("profiles")
      .select()
      .eq("Name", params.profile_id)
      .then((data) => {
        console.log(data);
        setData(data.data![0]);
      }));
  }, [session]);
  console.log(data);
  return (
    <div className="org_page_outer">
        <div className="org_page">
      <div className="page_header">
        <button className="back_button" onClick={() => navigate(-1)}>
          <svg
            height="24px"
            id="Layer_1"
            version="1.1"
            viewBox="0 0 512 512"
            width="24px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="352,128.4 319.7,96 160,256 160,256 160,256 319.7,416 352,383.6 224.7,256 " />
          </svg>
        </button>
        {data && <div>{data.name}</div>}
      </div>
      {data && (
          <div>
          <img
            className="org_pfp"
            src={
              data.pfp ||
              "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
            }
          ></img>
          <div>{data.Name}</div>
          </div>
      )}
      </div>
    </div>
  );
};
export default Profile;
