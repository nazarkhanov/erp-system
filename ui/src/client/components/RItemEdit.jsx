import "./RItemEdit.css";

import * as React from "react";
import * as ReactRouter from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import * as utils from "@/shared/utils";
import * as uikit from "@/shared/uikit";
import * as projects from "@/external/projects";

const cn = utils.useClassName("Cabinet-ItemEdit");

const STATES_CONST = {
	DEFAULT: "default",
	LOADING: "loading",
	LOADED: "loaded",
};

function ItemEdit() {
	const data = ReactRouter.useOutletContext();
	const query = projects.useUpdate({ id: data.id });
	const [state, setState] = React.useState(STATES_CONST.DEFAULT);

	const handleSubmit = async (data) => {
		if (state !== STATES_CONST.DEFAULT) return;

		setState(STATES_CONST.LOADING);

		await query.mutateAsync(data);

		setState(STATES_CONST.LOADED);

		setTimeout(() => {
			setState(STATES_CONST.DEFAULT);
		}, 1000);
	};

	return (
		<div className={cn()}>
			<Formik
				initialValues={{ title: data?.title || "", status: data?.status || "" }}
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

export { ItemEdit };
