import "./RItem.css";

import * as React from "react";
import * as ReactRouter from "react-router-dom";
import * as utils from "@/shared/utils";
import * as uikit from "@/shared/uikit";
import * as components from "@/components";
import * as projects from "@/external/projects";

const cn = utils.useClassName("Cabinet-Item");

function Item() {
	const { id } = ReactRouter.useParams();
	const item = projects.useItem({ id });

	const data = React.useMemo(() => {
		return item.data;
	}, [item.data]);

	const PagerLeft = () => (
		<>
			{data ? (
				<>
					<uikit.Text
						className={cn("Title")}
						view="primary"
						size="2xl"
						weight="bold"
					>
						{data.title}
					</uikit.Text>

					<components.Badge status={data.status} />
				</>
			) : (
				<uikit.Skeleton.Brick
					className={cn("Skeleton")}
					width="220px"
					height="44px"
				/>
			)}
		</>
	);

	return (
		<div className={cn()}>
			<components.Pager
				rowTop={<PagerTop item={item} />}
				rowCenter={{
					left: <PagerLeft />,
				}}
				rowBottom={<PagerBottom item={item} />}
			/>

			{item.isSuccess && <ReactRouter.Outlet context={data} />}
		</div>
	);
}

const BREADCRUMBS_ITEMS_CONST = [
	{
		label: "Все работы",
		href: "/cabinet/works",
	},
];

function PagerTop({ item }) {
	const navigate = ReactRouter.useNavigate();

	const [breadcrumbsPages, setBreadcrumbsPages] = React.useState(
		BREADCRUMBS_ITEMS_CONST
	);

	React.useEffect(() => {
		if (!item.isLoading && !item.isError) {
			setBreadcrumbsPages([
				...BREADCRUMBS_ITEMS_CONST,
				{
					label: item.data?.title || "Заголовок",
					href: `/cabinet/works/${item.data?.id}`,
				},
			]);
		}
	}, [item.isLoading, item.data]);

	const handleNavigate = ({ e, item }) => {
		e.preventDefault();
		navigate(item.href);
	};

	return (
		<uikit.Breadcrumbs
			size="s"
			items={breadcrumbsPages}
			getItemLabel={(item) => item.label}
			getItemHref={(item) => item.href}
			onItemClick={handleNavigate}
		/>
	);
}

const TABS_ITEMS_CONST = [
	{
		label: "Аналитика",
		href: "view",
	},
	{
		label: "Редактирование",
		href: "edit",
	},
];

function PagerBottom({ item }) {
	const navigate = ReactRouter.useNavigate();

	const [tabItem, setTabItem] = React.useState(TABS_ITEMS_CONST[1]);

	React.useEffect(() => {
		navigate(tabItem.href);
	}, [tabItem.href]);

	return (
		<uikit.Tabs
			value={tabItem}
			items={TABS_ITEMS_CONST}
			getItemLabel={(item) => item.label}
			onChange={({ value }) => setTabItem(value)}
		/>
	);
}

export { Item };
