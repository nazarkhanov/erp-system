import "./RItemView.css";

import * as utils from "@/shared/utils";

const cn = utils.useClassName("Cabinet-ItemView");

function ItemView() {
	return <div className={cn()}>Аналитика</div>;
}

export { ItemView };
