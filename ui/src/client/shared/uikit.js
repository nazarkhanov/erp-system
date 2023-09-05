export * as ThemeKit from "@consta/uikit/Theme";

export { Text } from "@consta/uikit/Text";
export { TextField } from "@consta/uikit/TextField";
export { Select } from "@consta/uikit/Select";
export { Button } from "@consta/uikit/Button";
export { Layout } from "@consta/header/Layout";
export { User } from "@consta/uikit/User";
export { ContextMenu } from "@consta/uikit/ContextMenu";
export { Badge } from "@consta/uikit/Badge";
export { Breadcrumbs } from "@consta/uikit/Breadcrumbs";
export { Tabs } from "@consta/uikit/Tabs";
export { Modal } from "@consta/uikit/Modal";
export { ChoiceGroup } from "@consta/uikit/ChoiceGroup";
export { Table } from "@consta/uikit/Table";
export { Tooltip } from "@consta/uikit/Tooltip";

import { IconHamburger } from "@consta/icons/IconHamburger";
import { IconSearchStroked } from "@consta/icons/IconSearchStroked";
import { IconAdd } from "@consta/icons/IconAdd";
import { IconEdit } from "@consta/icons/IconEdit";
import { IconTrash } from "@consta/icons/IconTrash";
import { IconExit } from "@consta/icons/IconExit";
import { IconMeatball } from "@consta/icons/IconMeatball";
import { IconDownload } from "@consta/icons/IconDownload";
import { IconUpload } from "@consta/icons/IconUpload";

export const Icons = {
	Hamburger: IconHamburger,
	SearchStroked: IconSearchStroked,
	Add: IconAdd,
	Trash: IconTrash,
	Edit: IconEdit,
	Exit: IconExit,
	Meatball: IconMeatball,
	Download: IconDownload,
	Upload: IconUpload,
};

import * as SkeletonKit from "@consta/uikit/Skeleton";

export const Skeleton = {
	Brick: SkeletonKit.SkeletonBrick,
	Circle: SkeletonKit.SkeletonCircle,
	Text: SkeletonKit.SkeletonText,
};

import * as GridKit from "@consta/uikit/Grid";

export const Grid = {
	Main: GridKit.Grid,
	Item: GridKit.GridItem,
};
