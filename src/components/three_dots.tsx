import React from "react"

interface Props {
    style: React.CSSProperties
    actions: [string, ()=>void][]
}

const ThreeDots: React.FC<Props> = (props: Props) => {
    return <svg xmlns="http://www.w3.org/2000/svg" style={props.style} viewBox="0 0 16 16" fill="#000000">
    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
  </svg>
}

export default ThreeDots;