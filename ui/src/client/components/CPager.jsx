import "./CPager.css";

import * as utils from "@/shared/utils";

const cn = utils.useClassName("Pager");

function Pager(props) {
	return (
		<div className={cn()}>
			{props.rowTop && <div className={cn("Top")}>{props.rowTop}</div>}

			<div className={cn("Center")}>
				<div className={cn("Left")}>{props.rowCenter.left}</div>
				<div className={cn("Right")}>{props.rowCenter.right}</div>
			</div>

			{props.rowBottom && <div className={cn("Bottom")}>{props.rowBottom}</div>}
		</div>
	);
}

export { Pager };
