import React from "react";

interface Props {
  // Time worked (hours)
  time: number;
  // Time goal (hours)
  time_goal: number;
  // Number of separate months worked
  months: number;
  // Number of separate months goal (or undefined if no goal)
  month_goal?: number;
  // Name of award
  name: string;
  // Hex color of award
  color: string;
  // Alt color
  alt_color: string;
}

const AwardProgress: React.FC<Props> = (props: Props) => {
  let time_angle = (props.time / props.time_goal) * 360;
  if (time_angle > 360) time_angle = 359.99;
  let time_end_x = 50 + Math.sin((time_angle * 2 * Math.PI) / 360) * 40;
  let time_end_y = 50 - Math.cos((time_angle * 2 * Math.PI) / 360) * 40;
  let month_angle = props.month_goal
    ? (props.months / props.month_goal) * 360
    : 0;
  if (month_angle > 360) month_angle = 359.99;
  let month_end_x = 50 + Math.sin((month_angle * 2 * Math.PI) / 360) * 30;
  let month_end_y = 50 - Math.cos((month_angle * 2 * Math.PI) / 360) * 30;
  let large_arc = time_angle > 180 ? 1 : 0;
  let month_large_arc = month_angle > 180 ? 1 : 0;
  return (
    <div className="award_progress">
      <div className="award_name">{props.name}</div>
      <svg
        className="award_symbol"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={"M 50 10 A 40 40 0 0 0 50 90"}
          strokeWidth={10}
          strokeLinecap={"round"}
          stroke={"#ddd"}
        ></path>
        <path
          d={"M 50 90 A 40 40 0 0 0 50 10"}
          strokeWidth={10}
          strokeLinecap={"round"}
          stroke={"#ddd"}
        ></path>
        <path
          d={
            "M 50 10 A 40 40 0 " +
            large_arc +
            " 1 " +
            time_end_x +
            " " +
            time_end_y +
            " M 50 50"
          }
          strokeWidth={10}
          strokeLinecap={"round"}
          stroke={props.color}
        ></path>

        {props.month_goal && (
          <>
            <path
              d={"M 50 20 A 30 30 0 0 0 50 80"}
              strokeWidth={5}
              strokeLinecap={"round"}
              stroke={"#ddd"}
            ></path>
            <path
              d={"M 50 80 A 30 30 0 0 0 50 20"}
              strokeWidth={5}
              strokeLinecap={"round"}
              stroke={"#ddd"}
            ></path>
            <path
              d={
                "M 50 20 A 30 30 1 " +
                month_large_arc +
                " 1 " +
                month_end_x +
                " " +
                month_end_y +
                " M 50 50"
              }
              strokeWidth={5}
              strokeLinecap={"round"}
              stroke={props.alt_color}
            ></path>
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              fill={props.color}
              fontSize="8"
              x="50"
              y="48"
            >
              Hr: {props.time.toFixed(1).replace(".0", "")}/{props.time_goal}
            </text>
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              fill={props.alt_color}
              fontSize="7"
              x="50"
              y="60"
            >
              Month: {props.months.toFixed(1).replace(".0", "")}/{props.month_goal}
            </text>
          </>
        )}
        {!props.month_goal && (
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              fill={props.color}
              fontSize="8"
              color={props.color}
              x="50"
              y="50"
            >
              Hr: {props.time.toFixed(1).replace(".0", "")}/{props.time_goal}
            </text>
        )}
      </svg>
    </div>
  );
};

export default AwardProgress;
