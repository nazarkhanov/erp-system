import "./main.css";

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import * as ReactRouter from "react-router-dom";
import * as ReactQuery from "@/shared/ProviderReactQuery";
import * as ConstaTheme from "@/shared/ProviderConstaTheme";
import * as AuthProtection from "@/shared/MiddlewareAuthProtection";
import { Layout, Login, List, Item, ItemEdit, ItemView } from "@/components";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<ConstaTheme.Provider>
			<ReactQuery.Provider>
				<ReactRouter.BrowserRouter>
					<AuthProtection.Middleware>
						<ReactRouter.Routes>
							<ReactRouter.Route index element={<Login />} />

							<ReactRouter.Route path="cabinet" element={<Layout />}>
								<ReactRouter.Route path="projects" element={<List />} />

								<ReactRouter.Route path="projects/:id" element={<Item />}>
									<ReactRouter.Route path="edit" element={<ItemEdit />} />
									<ReactRouter.Route path="view" element={<ItemView />} />

									<ReactRouter.Route
										index
										path="*"
										element={<ReactRouter.Navigate to="edit" replace />}
									/>
								</ReactRouter.Route>

								<ReactRouter.Route
									index
									path="*"
									element={<ReactRouter.Navigate to="projects" replace />}
								/>
							</ReactRouter.Route>

							<ReactRouter.Route
								path="*"
								element={<ReactRouter.Navigate to="" replace />}
							/>
						</ReactRouter.Routes>
					</AuthProtection.Middleware>
				</ReactRouter.BrowserRouter>
			</ReactQuery.Provider>
		</ConstaTheme.Provider>
	</React.StrictMode>
);
