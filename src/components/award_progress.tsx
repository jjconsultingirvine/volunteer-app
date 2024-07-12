import React from "react";

interface Props {
  // Time worked (hours)
  time: number;
  // Number of separate months worked
  months: number;
  award_id: number;
}

const CONG_AWARD_NAMES = ["Bronze Certificate", "Silver Certificate", "Gold Certificate", "Bronze Medal", "Silver Medal", "Gold Medal"];
const CONG_AWARD_HOURS = [30,60,90,100,200,400];
const CONG_AWARD_MONTHS = [undefined, undefined, 6, 7, 12, 24];
const CONG_AWARD_COLORS = ["#CD7F32","#6e6e6e","#c29d2f","#CD7F32","#6e6e6e","#c29d2f"];
const CONG_AWARD_ALT_COLORS = ["#BC7F62","#757c80","#ad8a23","#BC7F62","#757c80","#ad8a23"];

const AwardProgress: React.FC<Props> = (props: Props) => {
  const month_goal = CONG_AWARD_MONTHS[props.award_id];
  const color = CONG_AWARD_COLORS[props.award_id];
  const alt_color = CONG_AWARD_ALT_COLORS[props.award_id];
  const time_goal = CONG_AWARD_HOURS[props.award_id];
  const name = CONG_AWARD_NAMES[props.award_id];
  let time_angle = (props.time / time_goal) * 360;
  if (time_angle > 360) time_angle = 359.99;
  let time_end_x = 50 + Math.sin((time_angle * 2 * Math.PI) / 360) * 40;
  let time_end_y = 50 - Math.cos((time_angle * 2 * Math.PI) / 360) * 40;
  let month_angle = month_goal
    ? (props.months / month_goal) * 360
    : 0;
  if (month_angle > 360) month_angle = 359.99;
  let month_end_x = 50 + Math.sin((month_angle * 2 * Math.PI) / 360) * 30;
  let month_end_y = 50 - Math.cos((month_angle * 2 * Math.PI) / 360) * 30;
  let large_arc = time_angle > 180 ? 1 : 0;
  let month_large_arc = month_angle > 180 ? 1 : 0;
  return (
    <div className="award_progress">
      <div>Progress towards the Congressional Award's</div>
      <div className="award_name" style={{color: color, fontSize: "2rem"}}>{name}</div>
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
          stroke={color}
        ></path>

        {month_goal && (
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
              stroke={alt_color}
            ></path>
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              fill={color}
              fontSize="8"
              x="50"
              y="48"
            >
              Hr: {props.time.toFixed(1).replace(".0", "")}/{time_goal}
            </text>
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              fill={alt_color}
              fontSize="7"
              x="50"
              y="60"
            >
              Month: {props.months.toFixed(1).replace(".0", "")}/{month_goal}
            </text>
          </>
        )}
        {!month_goal && (
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              fill={color}
              fontSize="8"
              color={color}
              x="50"
              y="50"
            >
              Hr: {props.time.toFixed(1).replace(".0", "")}/{time_goal}
            </text>
        )}
      </svg>
      <div className="award_progress_text">
        {Math.round(time_angle / 360 * 100).toString()}% done with volunteer hours</div>
        <div className="award_progress_text">
        {Math.round(month_angle / 360 * 100).toString()}% done with volunteer months
      </div>
    </div>
  );
};
export {CONG_AWARD_NAMES, CONG_AWARD_HOURS, CONG_AWARD_MONTHS};
export default AwardProgress;
