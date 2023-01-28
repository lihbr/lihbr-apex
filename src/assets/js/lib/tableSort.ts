const SortDirection = {
	Ascending: "ascending",
	Descending: "descending",
} as const;
type SortDirections = (typeof SortDirection)[keyof typeof SortDirection];

const SortType = {
	"ABC": "abc",
	"123": "123",
} as const;
type SortTypes = (typeof SortType)[keyof typeof SortType];

const sortBaseAlgorythm = <T extends string | number | null>(
	a: T,
	b: T,
): number => (a === b ? 0 : (a ?? -Infinity) > (b ?? -Infinity) ? 1 : -1);

const SortAlgorythm: Record<
	SortTypes,
	(a: HTMLTableCellElement, b: HTMLTableCellElement) => number
> = {
	"abc": (a, b) => {
		return sortBaseAlgorythm(a.textContent, b.textContent);
	},
	"123": (a, b) => {
		const [_a, _b] = [
			parseFloat(a.textContent ?? ""),
			parseFloat(b.textContent ?? ""),
		];

		return sortBaseAlgorythm(
			isNaN(_a) ? -Infinity : _a,
			isNaN(_b) ? -Infinity : _b,
		);
	},
};

export const tableSort = ($table: HTMLTableElement): void => {
	const $thead = $table.querySelector("thead") as HTMLTableSectionElement;
	const $tbody = $table.querySelector("tbody") as HTMLTableSectionElement;
	const $ths = $thead.querySelectorAll("th");

	$ths.forEach(($th, index) => {
		if (typeof $th.dataset.sortable === "string") {
			const $button = $th.querySelector("button") as HTMLButtonElement;

			$button.addEventListener("click", () => {
				// Define direction
				const sortDirection: SortDirections =
					!$th.ariaSort || $th.ariaSort === SortDirection.Ascending
						? SortDirection.Descending
						: SortDirection.Ascending;

				// Define sort type
				const sortType: SortTypes = Object.values(SortType).includes(
					$th.dataset.sortable as SortTypes,
				)
					? ($th.dataset.sortable as SortTypes)
					: SortType.ABC;

				// Sort rows
				Array.from($tbody.rows)
					.sort(
						(a, b) =>
							SortAlgorythm[sortType](a.cells[index], b.cells[index]) *
							(sortDirection === SortDirection.Ascending ? 1 : -1),
					)
					.forEach(($tr) => $tbody.appendChild($tr));

				// Update `aria-sort` attributes
				$ths.forEach(($th, index2) => {
					if (index === index2) {
						$th.ariaSort = sortDirection;
					} else {
						$th.ariaSort = null;
					}
				});
			});
		}
	});
};
