import "./RLayout.css";

import * as React from "react";
import * as ReactRouter from "react-router-dom";
import * as utils from "@/shared/utils";
import * as uikit from "@/shared/uikit";
import * as auth from "@/external/auth";
import * as projects from "@/external/projects";

function Layout() {
	const cn = utils.useClassName("Layout");
	const navigate = ReactRouter.useNavigate();
	const location = ReactRouter.useLocation();

	const { isDesktop } = utils.useMediaQuery();
	const [isVisible, setVisibility] = React.useState(isDesktop);
	const [searchString, setSearchString] = React.useState("");

	React.useEffect(() => {
		const isCurrentListRoute = location.pathname === "/cabinet/projects";
		if (isCurrentListRoute) return;
		navigate("/cabinet/projects");
	}, [searchString]);

	return (
		<div className={cn()}>
			<div className={cn("Header")}>
				<Header
					navigationState={[isVisible, setVisibility]}
					searchState={[searchString, setSearchString]}
				/>
			</div>
			<div className={cn("Main", { only_content: !isVisible })}>
				<div className={cn("Navigation", { visible: isVisible })}>
					<Navigation navigationState={[isVisible, setVisibility]} />
				</div>

				<div className={cn("Inner")}>
					<div className={cn("Content")}>
						<ReactRouter.Outlet context={{ searchString }} />
					</div>

					<div className={cn("Footer")}>
						<Footer />
					</div>
				</div>
			</div>
		</div>
	);
}

function Header({ navigationState, searchState }) {
	const cn = utils.useClassName("Header");

	return (
		<div className={cn()}>
			<uikit.Layout
				rowCenter={{
					left: (
						<HeaderLeft
							cn={cn}
							navigationState={navigationState}
							searchState={searchState}
						/>
					),
					right: <HeaderRight cn={cn} />,
				}}
			/>
		</div>
	);
}

function HeaderLeft({ cn, navigationState, searchState }) {
	const { isTablet } = utils.useMediaQuery();
	const [isVisible, setVisibility] = navigationState;
	const [searchString, setSearchString] = searchState;

	const navigate = ReactRouter.useNavigate();

	const handleClick = (e) => {
		e.preventDefault();
		navigate("/cabinet");

		if (isTablet) return;
		setVisibility(false);
	};

	return (
		<div className={cn("Left")}>
			<uikit.Button
				className={cn("Navigation-Button")}
				label="Открытие/закрытие навигации"
				view="clear"
				onlyIcon
				iconLeft={uikit.Icons.Hamburger}
				onClick={() => setVisibility((isVisible) => !isVisible)}
			/>

			<ReactRouter.Link
				className={cn("Logo-Link")}
				to="/cabinet"
				onClick={handleClick}
			>
				<uikit.Text weight="bold" size="xl" view="primary">
					ERP
				</uikit.Text>
				<uikit.Text weight="medium" size="xl" view="ghost">
					SYSTEM
				</uikit.Text>
			</ReactRouter.Link>

			{isTablet && (
				<div className={cn("Search-Field")}>
					<uikit.TextField
						placeholder="Искать работу..."
						leftSide={uikit.Icons.Search}
						value={searchString}
						onChange={(v) => setSearchString(v.e.target.value)}
					/>
				</div>
			)}
		</div>
	);
}

function HeaderRight({ cn }) {
	const { isTablet } = utils.useMediaQuery();

	const profile = auth.useProfile();
	const logout = auth.useLogout();

	const data = React.useMemo(() => {
		return profile.data;
	}, [profile.data]);

	const [isOpened, setIsOpened] = React.useState(false);
	const ref = React.useRef(null);

	const items = [
		{
			label: "Выйти",
			imageLeft: uikit.Icons.Logout,
		},
	];

	const handleClick = async (e) => {
		await logout.mutate();
		window.location = "/";
	};

	return (
		<div className={cn("User-Context-Menu")}>
			{data ? (
				<div className={cn("User-Main")}>
					<uikit.User
						size="l"
						withArrow
						onlyAvatar={!isTablet}
						view={isTablet ? "clear" : "ghost"}
						ref={ref}
						info={data.position}
						name={`${data.first_name} ${data.last_name}`}
						onClick={() => setIsOpened((value) => !value)}
					/>
				</div>
			) : (
				<div className={cn("User-Skeleton")}>
					<uikit.Skeleton.Circle
						className={cn("User-Skeleton-Avatar")}
						size={40}
					/>
					<uikit.Skeleton.Text
						className={cn("User-Skeleton-Text")}
						fontSize="xs"
						lineHeight="s"
						rows={2}
					/>
				</div>
			)}
			<uikit.ContextMenu
				direction="downStartRight"
				anchorRef={ref}
				isOpen={isOpened}
				items={items}
				getItemLabel={(item) => item.label}
				getItemLeftIcon={(item) => item.imageLeft}
				getItemOnClick={() => handleClick}
				onClickOutside={() => setIsOpened(false)}
			/>
		</div>
	);
}

function Navigation({ navigationState }) {
	const { isTablet } = utils.useMediaQuery();
	const [isVisible, setVisibility] = navigationState;

	const cn = utils.useClassName("Navigation");
	const cnStatus = utils.useClassName("Navigation-Status");

	const queryAll = projects.useList();
	const createOne = projects.useCreate();

	const data = React.useMemo(() => {
		return queryAll.data;
	}, [queryAll.data]);

	const handleClick = () => {
		if (isTablet) return;
		setVisibility(false);
	};

	const NavigationList = () =>
		data.map((item) => (
			<ReactRouter.NavLink
				className={({ isActive }) => cn("Item", { active: isActive })}
				to={`/cabinet/projects/${item.id}`}
				key={item.id}
				onClick={handleClick}
			>
				<uikit.Text view="primary" truncate>
					{item.title}
				</uikit.Text>

				<div
					className={[
						cnStatus({
							done: item.status === "DONE",
							"in-progress": item.status === "IN_PROGRESS",
							"in-waiting": item.status === "IN_WAITING",
							draft: item.status === "DRAFT",
						}),
					]}
				/>
			</ReactRouter.NavLink>
		));

	const SkeletonList = () =>
		Array.from(Array(10).keys()).map((item) => (
			<div key={item} className={cn("Skeleton")}>
				<uikit.Skeleton.Brick key={item} height={52} />
			</div>
		));

	const EmptyList = () => (
		<uikit.Text className={cn("EmptyList")}>Пусто</uikit.Text>
	);

	return (
		<div className={cn()}>
			<div className={cn("Action")}>
				<uikit.Button
					label="Добавить работу"
					width="full"
					iconRight={uikit.Icons.Add}
					onClick={() => createOne.mutate() | handleClick()}
				/>
			</div>

			<div className={cn("Label")}>
				<ReactRouter.Link to="/cabinet" onClick={handleClick}>
					<uikit.Text view="secondary">Мои работы</uikit.Text>
				</ReactRouter.Link>
			</div>

			<div className={cn("List")}>
				{data ? (
					data.length ? (
						<NavigationList />
					) : (
						<EmptyList />
					)
				) : (
					<SkeletonList />
				)}
			</div>
		</div>
	);
}

function Footer() {
	//
}

export { Layout };
