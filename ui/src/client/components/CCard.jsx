import "./CCard.css";

import * as React from "react";
import * as ReactRouter from "react-router-dom";
import * as utils from "@/shared/utils";
import * as uikit from "@/shared/uikit";
import * as components from "@/components";

const cn = utils.useClassName("Card");

function Card(props) {
	const [isOpen, setIsOpen] = React.useState(false);
	const ref = React.useRef(null);

	const items = [
		{
			label: "Удалить",
			imageLeft: uikit.Icons.Trash,
		},
	];

	const handleOptions = (e) => {
		switch (e.item.label) {
			case items[0].label:
				setIsOpen((value) => !value);
				props.onClickDelete();
				break;

			default:
				break;
		}
	};

	return (
		<div className={cn()}>
			<div className={cn("Status")}>
				<components.Badge status={props.status} />
			</div>

			<ReactRouter.Link to={props.to}>
				<uikit.Text className={cn("Title")} weight="semibold" size="xl">
					{props.children}
				</uikit.Text>
			</ReactRouter.Link>

			<div className={cn("Actions")}>
				<uikit.Button
					label="Действия"
					view="ghost"
					size="s"
					onlyIcon
					iconLeft={uikit.Icons.Meatball}
					ref={ref}
					onClick={() => setIsOpen((value) => !value)}
				/>
			</div>

			<uikit.ContextMenu
				direction="downStartRight"
				isOpen={isOpen}
				items={items}
				anchorRef={ref}
				getItemLabel={(item) => item.label}
				getItemLeftIcon={(item) => item.imageLeft}
				getItemOnClick={() => handleOptions}
				onClickOutside={() => setIsOpen(false)}
			/>
		</div>
	);
}

export { Card };
