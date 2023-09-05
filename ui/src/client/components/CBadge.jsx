import * as uikit from "@/shared/uikit";

const LABEL_CONST = {
	DONE: "Выполнено",
	IN_PROGRESS: "В работе",
	IN_WAITING: "В ожидании",
	DRAFT: "Черновик",
};

const STATUS_CONST = {
	DONE: "success",
	IN_PROGRESS: "normal",
	IN_WAITING: "warning",
	DRAFT: "system",
};

function Badge({ status }) {
	console.log(status);

	return (
		<uikit.Badge
			view="stroked"
			size="s"
			label={LABEL_CONST[status] || LABEL_CONST.DRAFT}
			status={STATUS_CONST[status] || STATUS_CONST.DRAFT}
		/>
	);
}

export { Badge };
