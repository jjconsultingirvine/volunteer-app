import { Experience } from "./schema";

const get_exp_date = (exp: Experience) => {
  const [year, month, day] = (exp.time as any as string)
    .split("T")[0]
    .split("-");
  return `${month}/${day}/${year}`;
};

const get_exp_duration_pretty = (exp: Experience) => {
  return (
    (exp.duration / 60).toFixed(1).replace(".0", "") +
    " hour" +
    (exp.duration == 60 ? "" : "s")
  );
};

const hours_text = (minutes: number) => {
  return (
    (minutes / 60).toFixed(1).replace(".0", "") +
    " hour" +
    (minutes == 60 ? "" : "s")
  );
};

export { hours_text, get_exp_date, get_exp_duration_pretty };
