import "./RItemEdit.css";

import * as React from "react";
import * as ReactRouter from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import * as utils from "@/shared/utils";
import * as uikit from "@/shared/uikit";
import * as projects from "@/external/projects";
import * as products from "@/external/products";
import * as expenses from "@/external/expenses";

const cn = utils.useClassName("Cabinet-ItemEdit");

const STATES_CONST = {
	DEFAULT: "default",
	LOADING: "loading",
	LOADED: "loaded",
};

function ItemEdit() {
	const project = ReactRouter.useOutletContext();
	const update = projects.useUpdate({ id: project.id });
	const groups = expenses.useGroups({ id: project.id });
	const [state, setState] = React.useState(STATES_CONST.DEFAULT);

	const handleSubmit = async (data) => {
		if (state !== STATES_CONST.DEFAULT) return;

		setState(STATES_CONST.LOADING);

		await update.mutateAsync(data);

		setState(STATES_CONST.LOADED);

		setTimeout(() => {
			setState(STATES_CONST.DEFAULT);
		}, 1000);
	};

	return (
		<div className={cn()}>
			<Formik
				initialValues={{
					title: project?.title || "",
					status: project?.status || "",
				}}
				validationSchema={Yup.object({
					title: Yup.string().trim().required("Это обязательное поле"),
					status: Yup.mixed()
						.oneOf(["DONE", "IN_PROGRESS", "IN_WAITING", "DRAFT"])
						.required("Это обязательное поле"),
				})}
				onSubmit={handleSubmit}
			>
				{(form) => (
					<form className={cn("Form")} onSubmit={form.handleSubmit}>
						<TextField
							className={cn("TextField")}
							placeholder="Без названия"
							label="Название работы"
							name="title"
							type="text"
							form={form}
							width="full"
						/>

						<Select
							className={cn("Select")}
							placeholder="Черновик"
							label="Статус работы"
							name="status"
							type="text"
							form={form}
							width="full"
						/>

						<div className={cn("Actions")}>
							<uikit.Button
								className={cn("Button")}
								label={
									state === STATES_CONST.LOADED
										? "Сохранено"
										: state === STATES_CONST.LOADING
										? "Сохраняется"
										: "Сохранить"
								}
								size="l"
								type="submit"
								disabled={state !== STATES_CONST.DEFAULT}
							/>
						</div>

						<ProductsTable project={project} />

						{groups.data?.map((group) => (
							<ExpensesTable key={group.id} group={group} project={project} />
						))}
					</form>
				)}
			</Formik>
		</div>
	);
}

function TextField({ form, ...props }) {
	return (
		<uikit.TextField
			id={props.name}
			size="m"
			labelPosition="top"
			status={form.errors[props.name] && form.touched[props.name] && "alert"}
			caption={
				form.errors[props.name] &&
				form.touched[props.name] &&
				form.errors[props.name]
			}
			value={form.values[props.name]}
			onChange={(v) => form.handleChange(v.e)}
			onBlur={(v) => form.handleBlur(v)}
			{...props}
		/>
	);
}

const STATUS_CONST = [
	{
		label: "Выполнено",
		value: "DONE",
	},
	{
		label: "В работе",
		value: "IN_PROGRESS",
	},
	{
		label: "В ожидании",
		value: "IN_WAITING",
	},
	{
		label: "Черновик",
		value: "DRAFT",
	},
];

function Select({ form, ...props }) {
	const ref = React.useRef(null);

	return (
		<uikit.Select
			{...props}
			id={props.name}
			size="m"
			labelPosition="top"
			status={form.errors[props.name] && form.touched[props.name] && "alert"}
			caption={
				form.errors[props.name] &&
				form.touched[props.name] &&
				form.errors[props.name]
			}
			items={STATUS_CONST}
			value={STATUS_CONST.find(
				(item) => item.value === form.values[props.name]
			)}
			onChange={(v) => form.setFieldValue(props.name, v.value.value)}
			onBlur={(v) => form.handleBlur(v)}
			getItemKey={(item) => item.label}
			getItemLabel={(item) => item.label}
			ref={ref}
		/>
	);
}

function ProductsTable({ project }) {
	const list = projects.useList({ id: project.id });

	const cols = [
		{
			title: "Название",
			accessor: "name",
		},
		{
			title: "Количество",
			accessor: "quantity",
		},
		{
			title: "Маржа (%)",
			accessor: "margin",
		},
		{
			title: "Цена за единицу (тг)",
			accessor: "unitPrice",
		},
		{
			title: "Итоговая цена (тг)",
			accessor: "totalPrice",
		},
	];

	const rows = list.data || [];

	console.log(list.data);

	return (
		<div className={cn("Group")}>
			<uikit.Text className={cn("Group-Title")} view="secondary">
				Информация о продуктах
			</uikit.Text>

			<uikit.Table
				className={cn("Table")}
				columns={cols}
				rows={rows}
				borderBetweenColumns
				borderBetweenRows
			/>

			<ActionButton
				icon={uikit.Icons.Add}
				text="Добавить"
				onClick={() => console.log("clicked add")}
			/>
		</div>
	);
}

function ExpensesTable({ group }) {
	const cols = [
		{
			title: "Название",
			accessor: "name",
		},
		{
			title: "Количество",
			accessor: "quantity",
		},
		{
			title: "Итоговые затраты (тг)",
			accessor: "total",
		},
	];

	const rows = [];

	return (
		<div className={cn("Group")} key={group.id}>
			<uikit.Text className={cn("Group-Title")} view="secondary">
				{group.value}
			</uikit.Text>

			<uikit.Table
				className={cn("Table")}
				columns={cols}
				rows={rows}
				borderBetweenColumns
				borderBetweenRows
			/>

			<ActionButton
				icon={uikit.Icons.Add}
				text="Добавить"
				onClick={() => console.log("clicked add")}
			/>
		</div>
	);
}

function ActionButton({ icon, text, onClick }) {
	const [isVisible, setVisibility] = React.useState(false);
	const ref = React.useRef(null);

	return (
		<>
			<uikit.Button
				className={cn("Button-Add")}
				type="button"
				size="s"
				view="ghost"
				onlyIcon
				iconLeft={icon}
				onClick={onClick}
				onMouseEnter={() => setVisibility(true)}
				onMouseLeave={() => setVisibility(false)}
				ref={ref}
			/>

			{isVisible && (
				<uikit.Tooltip
					direction="upCenter"
					isInteractive={false}
					anchorRef={ref}
				>
					<uikit.Text size="xs">{text}</uikit.Text>
				</uikit.Tooltip>
			)}
		</>
	);
}

export { ItemEdit };
