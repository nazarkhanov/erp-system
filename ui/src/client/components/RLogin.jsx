import "./RLogin.css";

import { Formik } from "formik";
import * as Yup from "yup";
import * as utils from "@/shared/utils";
import * as uikit from "@/shared/uikit";
import * as auth from "@/external/auth";

const cn = utils.useClassName("Login");

function Login() {
	const query = auth.useLogin();

	const handleSubmit = async (credentials) => {
		await query.mutateAsync(credentials);
		window.location = "/";
	};

	return (
		<div className={cn()}>
			<Formik
				initialValues={{ email: "", password: "" }}
				validationSchema={Yup.object({
					email: Yup.string()
						.trim()
						.email("Неверный формат адреса почты")
						.required("Это обязательное поле"),
					password: Yup.string().trim().required("Это обязательное поле"),
				})}
				onSubmit={handleSubmit}
			>
				{(form) => (
					<form className={cn("Form")} onSubmit={form.handleSubmit}>
						<uikit.Text
							className={cn("Title")}
							size="2xl"
							weight="semibold"
							align="center"
						>
							Вход в ERP SYSTEM
						</uikit.Text>

						<TextField
							className={cn("TextField")}
							placeholder="user@gmail.com"
							label="Имя пользователя"
							name="email"
							type="text"
							form={form}
						/>

						<TextField
							className={cn("TextField")}
							placeholder="••••••••••••"
							label="Пароль"
							type="password"
							name="password"
							form={form}
						/>

						{query.isError && (
							<uikit.Text className={cn("Error")} view="alert">
								Неверные данные аккаунта
							</uikit.Text>
						)}

						<uikit.Button
							className={cn("Button")}
							label="Войти"
							size="l"
							width="full"
							type="submit"
							disabled={query.isLoading}
						/>
					</form>
				)}
			</Formik>

			<uikit.Text className={cn("Caption")} align="center">
				Если возникли проблемы со входом на платформу, напишите&nbsp;
				<uikit.Text
					className={cn("Link")}
					as="a"
					href="mailto:test@example.com"
				>
					нам
				</uikit.Text>
				.
			</uikit.Text>
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

export { Login };
