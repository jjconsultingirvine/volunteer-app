import "../style/home.css"
import React, { useEffect, useState } from "react"
import supabase from "../supabase";
import { SignInButton, SignedIn, SignedOut, UserButton, useSession } from "@clerk/clerk-react";
import TopNavBar from "../components/top_nav_bar";


const Home: React.FC<{}> = () => {
    const clerk_session = useSession().session;
    const [orgs, setOrgs] = useState([] as any[]);
    useEffect(() => {
        supabase(clerk_session).then(sup=>sup.from("organizations").select().then(data=>{
            console.log(data);
            setOrgs(data.data!)
    }));
    },[clerk_session]);

    return <div className="page">
        <TopNavBar title="Volunteer App"></TopNavBar>
        <div className="orgs_list">
        
        {orgs.map(org=>
            <div key={org.id} className="org_listing">
                <div>
                    {org.pfp && <img src={org.pfp} className="org_pfp"/>}
                    <div className="org_name">{org.name}</div>
                </div>
                <div>
                    <div className="org_short_desc">
                        {org.short_desc}
                    </div>
                    <button className="explore_button" onClick={()=>window.location.href="/org/"+org.pretty_name}>Explore</button>
                </div>
            </div>

        )}    
    </div>
    </div>;
}
export default Home;