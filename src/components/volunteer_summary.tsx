import React from "react";
import { Experience } from "../schema";
import AwardProgress from "./award_progress";

interface Props {
  exps: Experience[];
  award_id?: number;
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

const VolunteerSummary: React.FC<Props> = (props: Props) => {
  // Sort experiences by year and month
  let binned: { [id: string]: number[] } = {};
  props.exps.filter(exp=>exp.count_towards_award).forEach((exp) => {
    const year = (exp.time as any as string).split("-")[0];
    const month = Number((exp.time as any as string).split("-")[1]) - 1;
    if (!binned[year]) binned[year] = new Array(12).fill(0);
    binned[year][month] += exp.duration;
  });
  const volunteer_time =
    props.exps
      .filter(exp=>exp.count_towards_award)
      .map((val) => val.duration || 0)
      .concat(0)
      .reduce((l, r) => l + r) / 60;
  let years = [];
  for (let year in binned) {
    years.push(year);
  }
  years.sort();
  while (years.length < 4) {
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
    <div className="volunteer_summary horizontal-maybe" style={{alignItems: "center"}}>
      {props.award_id != null && 
      <AwardProgress award_id={props.award_id} months={months_worked} time={volunteer_time}></AwardProgress>}
      <div
        className="profile_table"
        style={{ gridTemplateColumns: "repeat(" + cells[0].length + ",1fr" }}
      >
        {cells.flat()}
      </div>
    </div>
  );
};

export default VolunteerSummary;
