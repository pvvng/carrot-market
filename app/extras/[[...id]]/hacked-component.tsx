"use client";

import { fetchData } from "./actions";

export default function Hacked(props: any) {
  console.log(props.data);
  // error
  // fetchData();
  return <h1>hacked</h1>;
}
