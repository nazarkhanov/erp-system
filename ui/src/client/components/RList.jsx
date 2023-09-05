import "./RList.css";

import * as React from "react";
import * as utils from "@/shared/utils";
import * as uikit from "@/shared/uikit";
import * as components from "@/components";
import * as projects from "@/external/projects";

const cn = utils.useClassName("Cabinet-List");

function List() {
	const queryAll = projects.useList();
	const createOne = projects.useCreate();
	const deleteOne = projects.useDelete();

	const data = React.useMemo(() => {
		return queryAll.data;
	}, [queryAll.data]);

	const { isDesktop, isTablet, isSmart } = utils.useMediaQuery();

	const PagerLeft = () => (
		<uikit.Text view="primary" size="2xl" weight="bold">
			Все работы
		</uikit.Text>
	);

	const PagerRight = () => (
		<uikit.Button
			label="Добавить работу"
			iconRight={uikit.Icons.Add}
			size="m"
			onClick={() => createOne.mutate()}
			disabled={createOne.isLoading}
		/>
	);

	const DataList = () => (
		<uikit.Grid.Main
			gap="xl"
			cols={isDesktop ? 4 : isTablet ? 3 : isSmart ? 2 : 1}
		>
			{data.map((item) => (
				<uikit.Grid.Item key={item.id}>
					<components.Card
						to={`/cabinet/projects/${item.id}`}
						status={item.status}
						onClickDelete={() => deleteOne.mutate(item.id)}
					>
						{item.title}
					</components.Card>
				</uikit.Grid.Item>
			))}
		</uikit.Grid.Main>
	);

	const SkeletonList = () => (
		<uikit.Grid.Main
			gap="xl"
			cols={isDesktop ? 4 : isTablet ? 3 : isSmart ? 2 : 1}
		>
			{Array.from(Array(10).keys()).map((item) => (
				<uikit.Grid.Item key={item}>
					<div key={item} className={cn("Skeleton")}>
						<uikit.Skeleton.Brick key={item} height={148} />
					</div>
				</uikit.Grid.Item>
			))}
		</uikit.Grid.Main>
	);

	const EmptyList = () => (
		<uikit.Text className={cn("EmptyList")}>Пусто</uikit.Text>
	);

	return (
		<div className={cn()}>
			<components.Pager
				rowCenter={{
					left: <PagerLeft />,
					right: <PagerRight />,
				}}
			/>

			<div className={cn("All")}>
				{data ? data.length ? <DataList /> : <EmptyList /> : <SkeletonList />}
			</div>
		</div>
	);
}

export { List };
