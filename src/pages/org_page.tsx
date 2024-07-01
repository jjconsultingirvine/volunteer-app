import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import supabase from "../supabase";
import "../style/org_page.css"

const OrgPage: React.FC<{}> = () => {
    const navigate = useNavigate();
    const org_id = useParams().org_id;
    const [org, setOrg] = useState(null) as any;
    async function get_org() {
        const {data} = await supabase.from("organizations").select().eq('pretty_name',org_id);
        setOrg(data![0]);
        console.log(data![0]);
    }
    useEffect(()=>{
        get_org()
    },[]);
    return org && <div className="org_page_outer">
        <div className="org_page">
            <div className="page_header">
                <button className="back_button" onClick={() => navigate(-1)}><svg height="24px" id="Layer_1" version="1.1" viewBox="0 0 512 512" width="24px" xmlns="http://www.w3.org/2000/svg"><polygon points="352,128.4 319.7,96 160,256 160,256 160,256 319.7,416 352,383.6 224.7,256 "/></svg></button>
                <div>{org.name}</div>
            </div>
            
            <div className="horizontal">
            {org.pfp && <img src={org.pfp} className="org_pfp"/>}
            <div className="org_page_short_desc">{org.short_desc}</div>
            </div>
            <div className="org_desc">{org.long_desc}</div>
            {org.volunteer_requirements && 
                <div><div className="org_page_header">Requirements</div>
                    <ul>
                    {org.volunteer_requirements.split(",").map((req: string) => (<li key={req}>{req}</li>))}
                    </ul>
                </div>
            }
            {(org.phone || org.email) && <div className="org_page_header">Contact</div>}
            {org.phone && <div>Phone: <a href={"tel:"+org.phone}>{org.phone}</a></div>}
            {org.email && <div>Email: <a href={"mailto:"+org.email}>{org.email}</a></div>}
            {org.address && <div>Address: <a href={"https://www.google.com/maps/search/"+encodeURIComponent(org.address)}>{org.address}</a></div>}
            <div className="org_buttons">
                {org.website && <button onClick={()=>window.location.href=org.website}>Visit Website</button>}
                {org.sign_up && <button onClick={()=>window.location.href=org.sign_up}>Sign Up</button>}
            </div>
        </div>
    </div>;
}

export default OrgPage;