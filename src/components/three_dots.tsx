import React, { useState } from "react";

interface Props {
  actions: [string, () => void][];
  size: string
  style?: React.CSSProperties
}

const ThreeDots: React.FC<Props> = (props: Props) => {
  const [unique_id, _] = useState(Math.random().toString().replace(".", ""));
  return (
    <div style={{width: props.size, height: props.size, position: "relative", ...props.style}}>
      <select
        id={unique_id}
        style={{opacity: 0.001, width: props.size, height: props.size, cursor: "pointer", lineHeight: props.size}}
        value="no_action"
        onChange={(e) => {
          props.actions
            .filter((action) => action[0] == e.target.value)
            .forEach((action) => action[1]());
        }}
      >
        <option value="no_action">Do nothing</option>
        {props.actions.map((action) => (
          <option key={action[0]} value={action[0]}>
            {action[0]}
          </option>
        ))}
      </select>
      <span style={{position: "absolute", left: 0, top: 0, width: props.size, height: props.size, pointerEvents: "none", cursor: "pointer"}} onClick={_=>{document.getElementById(unique_id)?.dispatchEvent(new Event("mousedown"));console.log("try")}}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="#000000"
          width={props.size}
          height={props.size}
        >
          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
        </svg>
      </span>
    </div>
  );
};

export default ThreeDots;
