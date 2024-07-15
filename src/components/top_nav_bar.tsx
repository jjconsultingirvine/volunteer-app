import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import React from "react";
import { useNavigate } from "react-router";
import "../style/components.css";
import { User } from "../schema";

interface Props {
  title: string;
  user: User | null;
  is_home?: boolean;
}

const TopNavBar: React.FC<Props> = (props: Props) => {
  const navigate = useNavigate();
  return (
    <div className="page_header">
      {!props.is_home && (
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
      )}
      <div>{props.title}</div>
      <SignedOut>
        <SignInButton signUpForceRedirectUrl="/onboard"/>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/">
          <UserButton.UserProfileLink
            label="My Profile"
            url={"/profile/" + props.user?.random_id}
            labelIcon={"U"}
          ></UserButton.UserProfileLink>
        </UserButton>
      </SignedIn>
    </div>
  );
};

export default TopNavBar;
