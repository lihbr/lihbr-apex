import { tableSort } from "./lib/tableSort";
import "./_base";

const $table = document.querySelector("table.sort") as HTMLTableElement;
tableSort($table);
