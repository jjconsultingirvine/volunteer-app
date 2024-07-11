import React from "react";
import { Experience } from "../schema";
import AwardProgress from "./award_progress";

interface Props {
  exps: Experience[];
}
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const VolunteerTable: React.FC<Props> = (props: Props) => {
  // Sort experiences by year and month
  let binned: { [id: string]: number[] } = {};
  props.exps.forEach((exp) => {
    const year = (exp.time as any as string).split("-")[0];
    const month = Number((exp.time as any as string).split("-")[1]) - 1;
    if (!binned[year]) binned[year] = new Array(12).fill(0);
    binned[year][month] += exp.duration;
  });
  const volunteer_time =
    props.exps
      .map((val) => val.duration || 0)
      .concat(0)
      .reduce((l, r) => l + r) / 60;
  let years = [];
  for (let year in binned) {
    years.push(year);
  }
  years.sort();
  while (years.length < 5) {
    years.push((Number(years[years.length - 1]) + 1).toString());
  }
  // Cast each element to a string
  let times: { [id: string]: string[] } = {};
  years.forEach((year) => (times[year] = Array(12).fill(0)));
  let months_worked = 0;
  for (let year in binned) {
    months_worked += binned[year].filter((x) => x != 0).length;
    times[year] = binned[year].map((time) =>
      (time / 60).toFixed(1).replace(".0", "")
    );
  }

  let cells = MONTH_NAMES.map((month) =>
    [
      <div className="table_month" key={month}>
        {month}
      </div>,
    ].concat(
      Array(years.length)
        .fill(0)
        .map((_, idx) => <div className="table_cell" key={month + idx}></div>)
    )
  );
  cells.unshift(
    years.map((year) => (
      <div className="table_year" key={year}>
        {year}
      </div>
    ))
  );
  cells[0].unshift(<div key={"hours"}>Hours</div>);
  for (let year in times) {
    const year_idx = years.indexOf(year);
    times[year].forEach((duration, idx) => {
      cells[idx + 1][year_idx + 1] = (
        <div
          className={
            duration == "0" ? "table_cell" : "table_cell table_cell_filled"
          }
          key={year_idx * 20 + idx}
        >
          {duration == "0" ? "" : duration}
        </div>
      );
    });
  }
  return (
    <div className="volunteer_summary">
      <div className="hours_summary">
        Has spent{" "}
        <strong>
          {volunteer_time.toFixed(1)} hour
          {volunteer_time == 1 ? "" : "s"}
        </strong>{" "}
        volunteering!
      </div>
      <div className="months_summary">
        Has across <strong>{months_worked}</strong> different months
      </div>
      <AwardProgress color="#CD7F32" alt_color="#BC7F62" months={months_worked} month_goal={4} time={volunteer_time} time_goal={5} name="Bronze Certificate"></AwardProgress>
      <div
        className="profile_table"
        style={{ gridTemplateColumns: "repeat(" + cells[0].length + ",1fr" }}
      >
        {cells.flat()}
      </div>
    </div>
  );
};

export default VolunteerTable;
