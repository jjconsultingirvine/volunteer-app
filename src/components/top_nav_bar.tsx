import React from "react"
import { useNavigate } from "react-router";


interface Props {
    title: string
}

const TopNavBar: React.FC<Props> = (props: Props) => {
    const navigate = useNavigate();
    return <div className="page_header">
                <button className="back_button" onClick={() => navigate(-1)}><svg height="24px" id="Layer_1" version="1.1" viewBox="0 0 512 512" width="24px" xmlns="http://www.w3.org/2000/svg"><polygon points="352,128.4 319.7,96 160,256 160,256 160,256 319.7,416 352,383.6 224.7,256 "/></svg></button>
                <div>{props.title}</div>
            </div>;
}

export default TopNavBar;