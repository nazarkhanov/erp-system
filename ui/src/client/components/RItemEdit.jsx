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

const FORM_STATES_CONST = {
	DEFAULT: "default",
	LOADING: "loading",
	LOADED: "loaded",
};

function ItemEdit() {
	const project = ReactRouter.useOutletContext();
	const update = projects.useUpdate({ id: project.id });
	const groups = expenses.useGroups({ id: project.id });

	const [formState, setFormState] = React.useState(FORM_STATES_CONST.DEFAULT);

	const handleSubmit = async (data) => {
		if (formState !== FORM_STATES_CONST.DEFAULT) return;

		setFormState(FORM_STATES_CONST.LOADING);

		await update.mutateAsync(data);

		setFormState(FORM_STATES_CONST.LOADED);

		setTimeout(() => {
			setFormState(FORM_STATES_CONST.DEFAULT);
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
									{
										[FORM_STATES_CONST.LOADED]: "Сохранено",
										[FORM_STATES_CONST.LOADING]: "Сохраняется",
									}?.[formState] || "Сохранить"
								}
								size="l"
								type="submit"
								disabled={formState !== FORM_STATES_CONST.DEFAULT}
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
			{...props}
		/>
	);
}

const MODAL_STATES_CONST = {
	CREATE: "create",
	UPDATE: "update",
	DELETE: "delete",
};

function ProductsTable({ project }) {
	const { isSmart } = utils.useMediaQuery();

	const list = products.useList({ project_id: project.id });
	const createOne = products.useCreate({ project_id: project.id });
	const updateOne = products.useUpdate({ project_id: project.id });
	const deleteOne = products.useDelete({ project_id: project.id });

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

	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const [modalState, setModalState] = React.useState(null);

	const handleOpen = (action) => {
		setModalState(action);
		setIsModalOpen(true);
	};

	const handleClose = () => {
		setIsModalOpen(false);
	};

	const [formState, setFormState] = React.useState(FORM_STATES_CONST.DEFAULT);
	const [productData, setProductData] = React.useState(null);

	const handleSubmit = async (data) => {
		if (formState !== FORM_STATES_CONST.DEFAULT) return;

		setFormState(FORM_STATES_CONST.LOADING);

		switch (modalState) {
			case MODAL_STATES_CONST.CREATE:
				await createOne.mutateAsync({ data });
				break;
			case MODAL_STATES_CONST.UPDATE:
				await updateOne.mutateAsync({ product_id: productData.id, data });
				break;
			case MODAL_STATES_CONST.DELETE:
				await deleteOne.mutateAsync({ product_id: productData.id, data });
				break;

			default:
				break;
		}

		setFormState(FORM_STATES_CONST.LOADED);

		setTimeout(() => {
			setFormState(FORM_STATES_CONST.DEFAULT);
			handleClose();
		}, 320);
	};

	cols.push({
		type: "toolbar",
		title: "Действия",
		accessor: "actions",
		renderCell: (row) => {
			return (
				<>
					<ActionButton
						className={cn("Button-One")}
						size="xs"
						text="Редактировать"
						icon={uikit.Icons.Edit}
						onClick={() =>
							setProductData(row) | handleOpen(MODAL_STATES_CONST.UPDATE)
						}
					/>

					<ActionButton
						className={cn("Button-One")}
						size="xs"
						text="Удалить"
						icon={uikit.Icons.Trash}
						onClick={() =>
							setProductData(row) | handleOpen(MODAL_STATES_CONST.DELETE)
						}
					/>
				</>
			);
		},
	});

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
				className={cn("Button-Add")}
				icon={uikit.Icons.Add}
				text="Добавить"
				onClick={() =>
					setProductData(null) | handleOpen(MODAL_STATES_CONST.CREATE)
				}
			/>
			<uikit.Modal
				className="Modal-Portal"
				hasOverlay
				isOpen={isModalOpen}
				onClickOutside={() => handleClose()}
				onEsc={() => handleClose()}
				style={{ maxWidth: isSmart ? "640px" : "90%" }}
			>
				<Formik
					initialValues={{
						name: productData?.name || "",
						quantity: productData?.quantity || "",
						margin: productData?.margin || "",
						unitPrice: productData?.unitPrice || "",
						totalPrice: productData?.totalPrice || "",
					}}
					validationSchema={Yup.object({
						name: Yup.string().trim().required("Это обязательное поле"),
						quantity: Yup.string().trim().required("Это обязательное поле"),
						margin: Yup.string().trim().required("Это обязательное поле"),
						unitPrice: Yup.string().trim().required("Это обязательное поле"),
						totalPrice: Yup.string().trim().required("Это обязательное поле"),
					})}
					onSubmit={handleSubmit}
				>
					{(form) => (
						<form className="Modal-Portal-Form" onSubmit={form.handleSubmit}>
							<uikit.Text
								className="Modal-Portal-Header"
								as="p"
								size="l"
								view="secondary"
							>
								{{
									[MODAL_STATES_CONST.CREATE]: "Создание",
									[MODAL_STATES_CONST.UPDATE]: "Редактирование",
									[MODAL_STATES_CONST.DELETE]: "Удаление",
								}?.[modalState] || "Действие"}
							</uikit.Text>

							<div className="Modal-Portal-Body">
								{cols
									.filter((v) => !v.type)
									.map((v) => (
										<TextField
											className="Modal-Portal-TextField"
											type="text"
											width="full"
											label={v.title}
											name={v.accessor}
											key={v.accessor}
											form={form}
											disabled={modalState === MODAL_STATES_CONST.DELETE}
										/>
									))}
							</div>

							<div className="Modal-Portal-Footer">
								<uikit.Button
									size="m"
									view="primary"
									label={
										{
											[MODAL_STATES_CONST.CREATE]: "Создать",
											[MODAL_STATES_CONST.UPDATE]: "Сохранить",
											[MODAL_STATES_CONST.DELETE]: "Удалить",
										}?.[modalState] || "Выполнить"
									}
									width="default"
									type="submit"
									disabled={formState !== FORM_STATES_CONST.DEFAULT}
								/>
							</div>
						</form>
					)}
				</Formik>
			</uikit.Modal>
		</div>
	);
}

function ExpensesTable({ project, group }) {
	const { isSmart } = utils.useMediaQuery();

	const list = expenses.useList({ project_id: project.id, group_id: group.id });
	const createOne = expenses.useCreate({
		project_id: project.id,
		group_id: group.id,
	});
	const updateOne = expenses.useUpdate({
		project_id: project.id,
		group_id: group.id,
	});
	const deleteOne = expenses.useDelete({
		project_id: project.id,
		group_id: group.id,
	});

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

	const rows = list.data || [];

	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const [modalState, setModalState] = React.useState(null);

	const handleOpen = (action) => {
		setModalState(action);
		setIsModalOpen(true);
	};

	const handleClose = () => {
		setIsModalOpen(false);
	};

	const [formState, setFormState] = React.useState(FORM_STATES_CONST.DEFAULT);
	const [expenseData, setExpenseData] = React.useState(null);

	const handleSubmit = async (data) => {
		if (formState !== FORM_STATES_CONST.DEFAULT) return;
		data.group_id = group.id;

		setFormState(FORM_STATES_CONST.LOADING);

		switch (modalState) {
			case MODAL_STATES_CONST.CREATE:
				await createOne.mutateAsync({ data });
				break;
			case MODAL_STATES_CONST.UPDATE:
				await updateOne.mutateAsync({ product_id: expenseData.id, data });
				break;
			case MODAL_STATES_CONST.DELETE:
				await deleteOne.mutateAsync({ product_id: expenseData.id, data });
				break;

			default:
				break;
		}

		setFormState(FORM_STATES_CONST.LOADED);

		setTimeout(() => {
			setFormState(FORM_STATES_CONST.DEFAULT);
			handleClose();
		}, 320);
	};

	cols.push({
		type: "toolbar",
		title: "Действия",
		accessor: "actions",
		renderCell: (row) => {
			return (
				<>
					<ActionButton
						className={cn("Button-One")}
						size="xs"
						text="Редактировать"
						icon={uikit.Icons.Edit}
						onClick={() =>
							setExpenseData(row) | handleOpen(MODAL_STATES_CONST.UPDATE)
						}
					/>

					<ActionButton
						className={cn("Button-One")}
						size="xs"
						text="Удалить"
						icon={uikit.Icons.Trash}
						onClick={() =>
							setExpenseData(row) | handleOpen(MODAL_STATES_CONST.DELETE)
						}
					/>
				</>
			);
		},
	});

	return (
		<div className={cn("Group")}>
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
				className={cn("Button-Add")}
				icon={uikit.Icons.Add}
				text="Добавить"
				onClick={() =>
					setExpenseData(null) | handleOpen(MODAL_STATES_CONST.CREATE)
				}
			/>
			<uikit.Modal
				className="Modal-Portal"
				hasOverlay
				isOpen={isModalOpen}
				onClickOutside={() => handleClose()}
				onEsc={() => handleClose()}
				style={{ maxWidth: isSmart ? "640px" : "90%" }}
			>
				<Formik
					initialValues={{
						name: expenseData?.name || "",
						quantity: expenseData?.quantity || "",
						total: expenseData?.total || "",
					}}
					validationSchema={Yup.object({
						name: Yup.string().trim().required("Это обязательное поле"),
						quantity: Yup.string().trim().required("Это обязательное поле"),
						total: Yup.string().trim().required("Это обязательное поле"),
					})}
					onSubmit={handleSubmit}
				>
					{(form) => (
						<form className="Modal-Portal-Form" onSubmit={form.handleSubmit}>
							<uikit.Text
								className="Modal-Portal-Header"
								as="p"
								size="l"
								view="secondary"
							>
								{{
									[MODAL_STATES_CONST.CREATE]: "Создание",
									[MODAL_STATES_CONST.UPDATE]: "Редактирование",
									[MODAL_STATES_CONST.DELETE]: "Удаление",
								}?.[modalState] || "Действие"}
							</uikit.Text>

							<div className="Modal-Portal-Body">
								{cols
									.filter((v) => !v.type)
									.map((v) => (
										<TextField
											className="Modal-Portal-TextField"
											type="text"
											width="full"
											label={v.title}
											name={v.accessor}
											key={v.accessor}
											form={form}
											disabled={modalState === MODAL_STATES_CONST.DELETE}
										/>
									))}
							</div>

							<div className="Modal-Portal-Footer">
								<uikit.Button
									size="m"
									view="primary"
									label={
										{
											[MODAL_STATES_CONST.CREATE]: "Создать",
											[MODAL_STATES_CONST.UPDATE]: "Сохранить",
											[MODAL_STATES_CONST.DELETE]: "Удалить",
										}?.[modalState] || "Выполнить"
									}
									width="default"
									type="submit"
									disabled={formState !== FORM_STATES_CONST.DEFAULT}
								/>
							</div>
						</form>
					)}
				</Formik>
			</uikit.Modal>
		</div>
	);
}

function ActionButton({ className, icon, text, onClick, ...props }) {
	const { isTablet } = utils.useMediaQuery();
	const [isVisible, setVisibility] = React.useState(false);
	const ref = React.useRef(null);

	return (
		<>
			<uikit.Button
				className={className}
				type="button"
				size="s"
				view="ghost"
				onlyIcon
				iconLeft={icon}
				onClick={onClick}
				onMouseEnter={() => isTablet && setVisibility(true)}
				onMouseLeave={() => setVisibility(false)}
				ref={ref}
				{...props}
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
