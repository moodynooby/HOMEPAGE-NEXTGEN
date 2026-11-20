import React, {
	createContext,
	forwardRef,
	useContext,
	useEffect,
	useState,
} from "react";

const SelectContext = createContext(null);

// --- Design Token & SX Resolver ---

const SPACING_MAP = {
	0: "0px",
	0.5: "4px",
	1: "8px",
	1.5: "12px",
	2: "16px",
	2.5: "20px",
	3: "24px",
	3.5: "28px",
	4: "32px",
	5: "40px",
	6: "48px",
	7: "56px",
	8: "64px",
	10: "80px",
	12: "96px",
};

const resolveVal = (val, isSpace = false) => {
	if (val === undefined || val === null) return undefined;
	if (typeof val === "object") {
		return resolveVal(val.md ?? val.sm ?? val.xs, isSpace);
	}
	if (isSpace && SPACING_MAP[val] !== undefined) return SPACING_MAP[val];
	if (isSpace && typeof val === "number") return `${val * 8}px`;

	if (val === "text.primary") return "var(--color-text-primary, #38392e)";
	if (val === "text.secondary") return "var(--color-text-secondary, #7d5d53)";
	if (val === "secondary.main" || val === "secondary")
		return "var(--color-accent, #7d5d53)";
	if (val === "primary.main" || val === "primary")
		return "var(--color-text-primary, #38392e)";
	if (val === "background.default")
		return "var(--color-background-body, #fdffda)";
	if (val === "background.paper")
		return "var(--color-background-surface, #fdffda)";
	if (val === "divider") return "var(--color-border, rgba(56, 57, 46, 0.10))";
	if (val === "action.hover")
		return "var(--color-overlay-hover, rgba(56, 57, 46, 0.05))";
	if (val === "action.selected")
		return "var(--color-overlay-pressed, rgba(56, 57, 46, 0.10))";

	return val;
};

const THEME_OBJECT = {
	palette: {
		mode: "light",
		text: {
			primary: "var(--color-text-primary, #38392e)",
			secondary: "var(--color-text-secondary, #7d5d53)",
		},
		primary: {
			main: "var(--color-text-primary, #38392e)",
			contrastText: "var(--color-background-body, #fdffda)",
		},
		secondary: {
			main: "var(--color-accent, #7d5d53)",
			contrastText: "#ffffff",
		},
		background: {
			default: "var(--color-background-body, #fdffda)",
			paper: "var(--color-background-surface, #fdffda)",
		},
		divider: "var(--color-border, rgba(56, 57, 46, 0.10))",
		action: {
			hover: "var(--color-overlay-hover, rgba(56, 57, 46, 0.05))",
			selected: "var(--color-overlay-pressed, rgba(56, 57, 46, 0.10))",
		},
	},
	breakpoints: {
		down: (key) => key,
	},
	spacing: (n) => `${n * 8}px`,
};

export const resolveSx = (sx) => {
	if (!sx) return {};
	if (typeof sx === "function") return sx(THEME_OBJECT);

	const style = {};
	for (const [key, val] of Object.entries(sx)) {
		if (key === "p") style.padding = resolveVal(val, true);
		else if (key === "px") {
			style.paddingLeft = resolveVal(val, true);
			style.paddingRight = resolveVal(val, true);
		} else if (key === "py") {
			style.paddingTop = resolveVal(val, true);
			style.paddingBottom = resolveVal(val, true);
		} else if (key === "pt") style.paddingTop = resolveVal(val, true);
		else if (key === "pb") style.paddingBottom = resolveVal(val, true);
		else if (key === "pl") style.paddingLeft = resolveVal(val, true);
		else if (key === "pr") style.paddingRight = resolveVal(val, true);
		else if (key === "m") style.margin = resolveVal(val, true);
		else if (key === "mx") {
			style.marginLeft = resolveVal(val, true);
			style.marginRight = resolveVal(val, true);
		} else if (key === "my") {
			style.marginTop = resolveVal(val, true);
			style.marginBottom = resolveVal(val, true);
		} else if (key === "mt") style.marginTop = resolveVal(val, true);
		else if (key === "mb") style.marginBottom = resolveVal(val, true);
		else if (key === "ml") style.marginLeft = resolveVal(val, true);
		else if (key === "mr") style.marginRight = resolveVal(val, true);
		else if (key === "gap") style.gap = resolveVal(val, true);
		else if (key === "rowGap") style.rowGap = resolveVal(val, true);
		else if (key === "columnGap") style.columnGap = resolveVal(val, true);
		else if (key === "bgcolor") style.backgroundColor = resolveVal(val);
		else if (key === "color") style.color = resolveVal(val);
		else if (key === "borderColor") style.borderColor = resolveVal(val);
		else if (key === "borderRadius") style.borderRadius = resolveVal(val);
		else if (!key.startsWith("&") && !key.startsWith("@")) {
			style[key] = resolveVal(val);
		}
	}
	return style;
};

// --- Theme Hooks & Helpers ---

export const useTheme = () => THEME_OBJECT;

export const useMediaQuery = () => {
	const [matches, setMatches] = useState(
		typeof window !== "undefined" ? window.innerWidth < 900 : false,
	);
	useEffect(() => {
		const handler = () => setMatches(window.innerWidth < 900);
		window.addEventListener("resize", handler);
		return () => window.removeEventListener("resize", handler);
	}, []);
	return matches;
};

export const alpha = (color, opacity) => {
	if (!color) return `rgba(56, 57, 46, ${opacity})`;
	if (color.startsWith("#")) {
		const r = Number.parseInt(color.slice(1, 3), 16) || 56;
		const g = Number.parseInt(color.slice(3, 5), 16) || 57;
		const b = Number.parseInt(color.slice(5, 7), 16) || 46;
		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	}
	return color;
};

export const createTheme = () => THEME_OBJECT;

export const ThemeProvider = ({ children }) => <>{children}</>;
export const CssBaseline = () => null;

// --- Core Layout & Typography Components ---

export const Box = forwardRef(
	({ component: Component = "div", sx, style, children, ...props }, ref) => {
		const resolvedStyle = { ...resolveSx(sx), ...style };
		return (
			<Component ref={ref} style={resolvedStyle} {...props}>
				{children}
			</Component>
		);
	},
);
Box.displayName = "Box";

export const Container = ({
	maxWidth = "lg",
	sx,
	style,
	children,
	...props
}) => {
	const maxW =
		maxWidth === "xs"
			? "440px"
			: maxWidth === "sm"
				? "640px"
				: maxWidth === "md"
					? "900px"
					: maxWidth === "lg"
						? "1200px"
						: "100%";
	return (
		<div
			style={{
				maxWidth: maxW,
				margin: "0 auto",
				paddingLeft: "1.5rem",
				paddingRight: "1.5rem",
				boxSizing: "border-box",
				...resolveSx(sx),
				...style,
			}}
			{...props}
		>
			{children}
		</div>
	);
};

export const Typography = forwardRef(
	(
		{
			variant = "body1",
			component,
			color,
			gutterBottom,
			sx,
			style,
			children,
			...props
		},
		ref,
	) => {
		let Tag = component;
		const typStyle = {
			margin: 0,
			...(gutterBottom ? { marginBottom: "0.75rem" } : {}),
		};

		if (color === "text.secondary") {
			typStyle.color = "var(--color-text-secondary, #7d5d53)";
		} else if (color === "secondary.main") {
			typStyle.color = "var(--color-accent, #7d5d53)";
		} else if (color === "text.primary") {
			typStyle.color = "var(--color-text-primary, #38392e)";
		}

		switch (variant) {
			case "h1":
				Tag = Tag || "h1";
				typStyle.fontFamily = "var(--font-family-heading, 'Newsreader', serif)";
				typStyle.fontSize = "3.5rem";
				typStyle.fontWeight = 800;
				typStyle.lineHeight = 1.1;
				break;
			case "h2":
				Tag = Tag || "h2";
				typStyle.fontFamily = "var(--font-family-heading, 'Newsreader', serif)";
				typStyle.fontSize = "2.5rem";
				typStyle.fontWeight = 700;
				break;
			case "h3":
				Tag = Tag || "h3";
				typStyle.fontFamily = "var(--font-family-heading, 'Newsreader', serif)";
				typStyle.fontSize = "1.75rem";
				typStyle.fontWeight = 700;
				break;
			case "h4":
				Tag = Tag || "h4";
				typStyle.fontFamily = "var(--font-family-heading, 'Newsreader', serif)";
				typStyle.fontSize = "1.4rem";
				typStyle.fontWeight = 600;
				break;
			case "h5":
				Tag = Tag || "h5";
				typStyle.fontFamily = "var(--font-family-heading, 'Newsreader', serif)";
				typStyle.fontSize = "1.2rem";
				typStyle.fontWeight = 600;
				break;
			case "h6":
				Tag = Tag || "h6";
				typStyle.fontFamily = "var(--font-family-heading, 'Newsreader', serif)";
				typStyle.fontSize = "1.05rem";
				typStyle.fontWeight = 600;
				break;
			case "overline":
				Tag = Tag || "span";
				typStyle.fontFamily =
					"var(--font-family-code, 'Work Sans', sans-serif)";
				typStyle.fontSize = "0.72rem";
				typStyle.letterSpacing = "0.12em";
				typStyle.textTransform = "uppercase";
				typStyle.fontWeight = 600;
				break;
			case "caption":
				Tag = Tag || "span";
				typStyle.fontFamily =
					"var(--font-family-code, 'Work Sans', sans-serif)";
				typStyle.fontSize = "0.75rem";
				break;
			case "body2":
				Tag = Tag || "p";
				typStyle.fontFamily = "var(--font-family-body, 'Noto Serif', serif)";
				typStyle.fontSize = "0.875rem";
				typStyle.lineHeight = 1.6;
				break;
			default:
				Tag = Tag || "p";
				typStyle.fontFamily = "var(--font-family-body, 'Noto Serif', serif)";
				typStyle.fontSize = "1rem";
				typStyle.lineHeight = 1.7;
				break;
		}

		return (
			<Tag
				ref={ref}
				style={{ ...typStyle, ...resolveSx(sx), ...style }}
				{...props}
			>
				{children}
			</Tag>
		);
	},
);
Typography.displayName = "Typography";

export const Button = forwardRef(
	(
		{
			variant = "text",
			component: Component = "button",
			startIcon,
			endIcon,
			size = "medium",
			sx,
			style,
			children,
			...props
		},
		ref,
	) => {
		const btnStyle = {
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			gap: "6px",
			fontFamily: "var(--font-family-code, 'Work Sans', sans-serif)",
			fontSize: size === "small" ? "0.75rem" : "0.85rem",
			letterSpacing: "0.08em",
			textTransform: "uppercase",
			fontWeight: 600,
			padding: size === "small" ? "4px 10px" : "8px 16px",
			borderRadius: 0,
			cursor: "pointer",
			textDecoration: "none",
			transition: "all 0.2s ease",
			border: "none",
			background: "transparent",
			color: "var(--color-text-primary, #38392e)",
		};

		if (variant === "contained") {
			btnStyle.background = "var(--color-text-primary, #38392e)";
			btnStyle.color = "var(--color-background-body, #fdffda)";
		} else if (variant === "outlined") {
			btnStyle.border = "1px solid var(--color-border, rgba(56, 57, 46, 0.2))";
			btnStyle.background = "transparent";
		}

		return (
			<Component
				ref={ref}
				style={{ ...btnStyle, ...resolveSx(sx), ...style }}
				{...props}
			>
				{startIcon && (
					<span style={{ display: "inline-flex" }}>{startIcon}</span>
				)}
				{children}
				{endIcon && <span style={{ display: "inline-flex" }}>{endIcon}</span>}
			</Component>
		);
	},
);
Button.displayName = "Button";

export const IconButton = forwardRef(
	(
		{
			component: Component = "button",
			size = "medium",
			sx,
			style,
			children,
			...props
		},
		ref,
	) => {
		const iconBtnStyle = {
			background: "transparent",
			border: "none",
			borderRadius: 0,
			cursor: "pointer",
			padding: size === "small" ? "4px" : "8px",
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			color: "var(--color-text-primary, #38392e)",
			...resolveSx(sx),
			...style,
		};
		return (
			<Component ref={ref} style={iconBtnStyle} {...props}>
				{children}
			</Component>
		);
	},
);
IconButton.displayName = "IconButton";

export const Divider = ({ sx, style, ...props }) => (
	<hr
		style={{
			border: "none",
			borderTop: "1px solid var(--color-border, rgba(56, 57, 46, 0.10))",
			margin: 0,
			width: "100%",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	/>
);

export const Chip = ({
	label,
	variant = "filled",
	size = "medium",
	clickable,
	onDelete,
	deleteIcon,
	icon,
	sx,
	style,
	...props
}) => (
	<span
		style={{
			display: "inline-flex",
			alignItems: "center",
			cursor: clickable ? "pointer" : "default",
			padding: size === "small" ? "2px 6px" : "4px 10px",
			fontFamily: "var(--font-family-code, 'Work Sans', sans-serif)",
			fontSize: "0.72rem",
			letterSpacing: "0.08em",
			textTransform: "uppercase",
			fontWeight: 600,
			borderRadius: 0,
			border: "1px solid var(--color-border, rgba(56, 57, 46, 0.15))",
			background:
				variant === "filled"
					? "var(--color-overlay-hover, rgba(56, 57, 46, 0.05))"
					: "transparent",
			color: "var(--color-text-primary, #38392e)",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{icon && (
			<span style={{ marginRight: 4, display: "inline-flex" }}>{icon}</span>
		)}
		{label}
	</span>
);

export const Alert = ({ severity = "info", sx, style, children, ...props }) => (
	<div
		role="alert"
		style={{
			padding: "0.75rem 1rem",
			border: "1px solid var(--color-border, rgba(56, 57, 46, 0.2))",
			background:
				severity === "error"
					? "rgba(220, 38, 38, 0.08)"
					: "var(--color-overlay-hover, rgba(56, 57, 46, 0.05))",
			color: "var(--color-text-primary, #38392e)",
			fontFamily: "var(--font-family-body, serif)",
			fontSize: "0.9rem",
			borderRadius: 0,
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{children}
	</div>
);

export const Skeleton = ({
	variant = "text",
	width,
	height,
	sx,
	style,
	...props
}) => (
	<div
		style={{
			width: width || "100%",
			height: height || (variant === "circular" ? "40px" : "20px"),
			borderRadius: variant === "circular" ? "50%" : 0,
			background: "var(--color-border, rgba(56, 57, 46, 0.10))",
			opacity: 0.6,
			...resolveSx(sx),
			...style,
		}}
		{...props}
	/>
);

export const Badge = ({ badgeContent, children, sx, style, ...props }) => (
	<div
		style={{
			position: "relative",
			display: "inline-flex",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{children}
		{badgeContent !== undefined && (
			<span
				style={{
					position: "absolute",
					top: 0,
					right: 0,
					transform: "translate(50%, -50%)",
					padding: "2px 5px",
					fontSize: "0.65rem",
					background: "var(--color-accent, #7d5d53)",
					color: "#ffffff",
					fontWeight: 700,
					borderRadius: 0,
				}}
			>
				{badgeContent}
			</span>
		)}
	</div>
);

export const Switch = ({ checked, onChange, inputProps, ...props }) => (
	<input
		type="checkbox"
		checked={checked}
		onChange={onChange}
		style={{ cursor: "pointer", accentColor: "var(--color-accent)" }}
		{...inputProps}
		{...props}
	/>
);

export const LinearProgress = ({ sx, style, ...props }) => (
	<div
		style={{
			width: "100%",
			height: "2px",
			background: "var(--color-border, rgba(56, 57, 46, 0.15))",
			overflow: "hidden",
			position: "relative",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		<div
			style={{
				width: "50%",
				height: "100%",
				background: "var(--color-accent, #7d5d53)",
				position: "absolute",
			}}
		/>
	</div>
);

export const CircularProgress = ({ size = 24, sx, style, ...props }) => (
	<div
		style={{
			width: size,
			height: size,
			border: "2px solid var(--color-border)",
			borderTopColor: "var(--color-accent, #7d5d53)",
			borderRadius: "50%",
			animation: "spin 0.8s linear infinite",
			display: "inline-block",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	/>
);

export const Drawer = ({
	open,
	onClose,
	anchor = "right",
	children,
	slotProps,
	PaperProps,
	...props
}) => {
	if (!open) return null;
	const isRight = anchor === "right";
	return (
		<div
			role="dialog"
			aria-modal="true"
			tabIndex={-1}
			onKeyDown={(e) => {
				if (e.key === "Escape" && onClose) onClose();
			}}
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 9999,
				background: "rgba(0, 0, 0, 0.4)",
				backdropFilter: "blur(2px)",
				display: "flex",
				justifyContent: isRight ? "flex-end" : "flex-start",
			}}
			onClick={(e) => {
				if (e.target === e.currentTarget && onClose) onClose();
			}}
			{...props}
		>
			<aside
				style={{
					width: "100%",
					maxWidth: "500px",
					height: "100%",
					background: "var(--color-background-surface, #fdffda)",
					borderLeft: "1px solid var(--color-border)",
					overflowY: "auto",
					boxSizing: "border-box",
					padding: "1.5rem",
					...resolveSx(PaperProps?.sx || slotProps?.paper?.sx),
				}}
			>
				{children}
			</aside>
		</div>
	);
};

export const Dialog = ({ open, onClose, children, ...props }) => {
	if (!open) return null;
	return (
		<div
			role="dialog"
			aria-modal="true"
			tabIndex={-1}
			onKeyDown={(e) => {
				if (e.key === "Escape" && onClose) onClose();
			}}
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 9999,
				background: "rgba(0, 0, 0, 0.4)",
				backdropFilter: "blur(2px)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: "1rem",
			}}
			onClick={(e) => {
				if (e.target === e.currentTarget && onClose) onClose();
			}}
			{...props}
		>
			<div
				style={{
					background: "var(--color-background-surface, #fdffda)",
					border: "1px solid var(--color-border)",
					maxWidth: "550px",
					width: "100%",
					padding: "1.5rem",
					boxSizing: "border-box",
					borderRadius: 0,
				}}
			>
				{children}
			</div>
		</div>
	);
};

export const DialogTitle = ({ children, sx, style, ...props }) => (
	<h2
		style={{
			margin: "0 0 1rem",
			fontFamily: "var(--font-family-heading, 'Newsreader', serif)",
			fontSize: "1.5rem",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{children}
	</h2>
);

export const DialogContent = ({ children, sx, style, ...props }) => (
	<div
		style={{
			marginBottom: "1.5rem",
			fontFamily: "var(--font-family-body, 'Noto Serif', serif)",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{children}
	</div>
);

export const DialogActions = ({ children, sx, style, ...props }) => (
	<div
		style={{
			display: "flex",
			justifyContent: "flex-end",
			gap: "0.75rem",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{children}
	</div>
);

export const Modal = ({ open, onClose, children, ...props }) => {
	if (!open) return null;
	return (
		<div
			role="dialog"
			aria-modal="true"
			tabIndex={-1}
			onKeyDown={(e) => {
				if (e.key === "Escape" && onClose) onClose();
			}}
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 9999,
				background: "rgba(0, 0, 0, 0.4)",
				backdropFilter: "blur(4px)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
			onClick={(e) => {
				if (e.target === e.currentTarget && onClose) onClose();
			}}
			{...props}
		>
			{children}
		</div>
	);
};

export const Fade = ({ in: inProp = true, children }) =>
	inProp ? children : null;

export const Menu = ({ open, children, ...props }) => {
	if (!open) return null;
	return (
		<div
			style={{
				position: "absolute",
				zIndex: 9999,
				background: "var(--color-background-surface, #fdffda)",
				border: "1px solid var(--color-border)",
				padding: "4px 0",
				borderRadius: 0,
				boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
			}}
			{...props}
		>
			{children}
		</div>
	);
};

export const MenuItem = forwardRef(
	(
		{
			component: Component,
			value,
			selected,
			onClick,
			children,
			sx,
			style,
			...props
		},
		ref,
	) => {
		const selectCtx = useContext(SelectContext);
		if (selectCtx) {
			return (
				<option
					ref={ref}
					value={value}
					onClick={(e) => {
						if (onClick) onClick(e);
						if (selectCtx.onSelect) {
							selectCtx.onSelect(value);
						}
					}}
					{...props}
				>
					{children}
				</option>
			);
		}
		const Tag = Component || "div";
		return (
			<Tag
				ref={ref}
				role="menuitem"
				onClick={onClick}
				style={{
					padding: "8px 16px",
					cursor: "pointer",
					fontFamily: "var(--font-family-code, 'Work Sans', sans-serif)",
					fontSize: "0.85rem",
					background: selected
						? "var(--color-overlay-pressed, rgba(56, 57, 46, 0.10))"
						: "transparent",
					color: "var(--color-text-primary, #38392e)",
					textDecoration: "none",
					display: "block",
					...resolveSx(sx),
					...style,
				}}
				{...props}
			>
				{children}
			</Tag>
		);
	},
);
MenuItem.displayName = "MenuItem";

export const TextField = forwardRef(
	(
		{
			label,
			value,
			onChange,
			placeholder,
			type = "text",
			multiline,
			rows = 3,
			fullWidth,
			variant,
			InputProps,
			inputProps,
			slotProps,
			id,
			sx,
			style,
			...props
		},
		ref,
	) => {
		const startAdornment =
			InputProps?.startAdornment || slotProps?.input?.startAdornment;
		const inputId = id || `tf-${Math.random().toString(36).substring(2, 7)}`;
		const Element = multiline ? "textarea" : "input";
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "4px",
					width: fullWidth ? "100%" : "auto",
					...resolveSx(sx),
					...style,
				}}
			>
				{label && (
					<label
						htmlFor={inputId}
						style={{
							fontFamily: "var(--font-family-code, 'Work Sans', sans-serif)",
							fontSize: "0.75rem",
							letterSpacing: "0.08em",
							textTransform: "uppercase",
							color: "var(--color-text-secondary, #7d5d53)",
						}}
					>
						{label}
					</label>
				)}
				<div
					style={{
						display: "flex",
						alignItems: multiline ? "flex-start" : "center",
						border: "1px solid var(--color-border, rgba(56, 57, 46, 0.2))",
						background: "transparent",
						padding: "4px 8px",
					}}
				>
					{startAdornment}
					<Element
						ref={ref}
						id={inputId}
						type={multiline ? undefined : type}
						rows={multiline ? rows : undefined}
						value={value}
						onChange={onChange}
						placeholder={placeholder}
						style={{
							width: "100%",
							border: "none",
							outline: "none",
							background: "transparent",
							color: "var(--color-text-primary, #38392e)",
							fontFamily: "var(--font-family-code, 'Work Sans', sans-serif)",
							fontSize: "0.875rem",
							resize: multiline ? "vertical" : "none",
						}}
						{...inputProps}
						{...props}
					/>
				</div>
			</div>
		);
	},
);
TextField.displayName = "TextField";

export const Select = forwardRef(
	(
		{
			value,
			onChange,
			label,
			labelId,
			"aria-labelledby": ariaLabelledby,
			children,
			sx,
			style,
			...props
		},
		ref,
	) => {
		const contextVal = {
			inSelect: true,
			onSelect: (val) => {
				if (onChange) {
					onChange({ target: { value: val, name: props.name } });
				}
			},
		};

		return (
			<SelectContext.Provider value={contextVal}>
				<select
					ref={ref}
					value={value}
					onChange={onChange}
					aria-label={label}
					aria-labelledby={labelId || ariaLabelledby}
					style={{
						padding: "8px 12px",
						border: "1px solid var(--color-border, rgba(56, 57, 46, 0.2))",
						background: "transparent",
						color: "var(--color-text-primary, #38392e)",
						fontFamily: "var(--font-family-code, 'Work Sans', sans-serif)",
						fontSize: "0.85rem",
						borderRadius: 0,
						outline: "none",
						...resolveSx(sx),
						...style,
					}}
					{...props}
				>
					{children}
				</select>
			</SelectContext.Provider>
		);
	},
);
Select.displayName = "Select";

export const FormControl = ({ children, sx, style, ...props }) => (
	<div
		style={{
			display: "flex",
			flexDirection: "column",
			gap: "4px",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{children}
	</div>
);

export const InputLabel = ({ children, id, htmlFor, sx, style, ...props }) => (
	<label
		id={id}
		htmlFor={htmlFor}
		style={{
			fontFamily: "var(--font-family-code, 'Work Sans', sans-serif)",
			fontSize: "0.75rem",
			letterSpacing: "0.08em",
			textTransform: "uppercase",
			color: "var(--color-text-secondary, #7d5d53)",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{children}
	</label>
);

export const InputAdornment = ({ children, position, sx, style }) => (
	<span
		style={{
			display: "inline-flex",
			alignItems: "center",
			marginRight: position === "start" ? "6px" : 0,
			marginLeft: position === "end" ? "6px" : 0,
			color: "var(--color-text-secondary)",
			...resolveSx(sx),
			...style,
		}}
	>
		{children}
	</span>
);

export const Snackbar = ({ open, message, children }) =>
	open ? (
		<div
			style={{
				position: "fixed",
				bottom: "20px",
				left: "50%",
				transform: "translateX(-50%)",
				padding: "10px 20px",
				background: "var(--color-text-primary, #38392e)",
				color: "var(--color-background-body, #fdffda)",
				borderRadius: 0,
				zIndex: 10000,
				fontSize: "0.875rem",
			}}
		>
			{message || children}
		</div>
	) : null;

export const Tooltip = ({ title, children }) =>
	React.cloneElement(children, { title });

export const Grid = ({
	container,
	item,
	xs,
	md,
	spacing,
	sx,
	style,
	children,
	...props
}) => {
	const gridStyle = { boxSizing: "border-box" };
	if (container) {
		gridStyle.display = "grid";
		gridStyle.gridTemplateColumns = "repeat(auto-fit, minmax(280px, 1fr))";
		gridStyle.gap = spacing ? `${spacing * 8}px` : "1.5rem";
	}
	return (
		<div style={{ ...gridStyle, ...resolveSx(sx), ...style }} {...props}>
			{children}
		</div>
	);
};

export const Card = ({ sx, style, children, ...props }) => (
	<article
		style={{
			background: "var(--color-background-surface, #fdffda)",
			border: "1px solid var(--color-border, rgba(56, 57, 46, 0.10))",
			borderRadius: 0,
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{children}
	</article>
);
export const CardContent = ({ sx, style, children, ...props }) => (
	<div style={{ padding: "1.5rem", ...resolveSx(sx), ...style }} {...props}>
		{children}
	</div>
);
export const CardMedia = ({
	component: Component = "img",
	sx,
	style,
	...props
}) => (
	<Component
		style={{ width: "100%", display: "block", ...resolveSx(sx), ...style }}
		{...props}
	/>
);
export const CardActions = ({ sx, style, children, ...props }) => (
	<div
		style={{
			padding: "0.75rem 1.5rem",
			display: "flex",
			alignItems: "center",
			gap: "0.5rem",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{children}
	</div>
);
export const CardActionArea = ({
	component: Component = "button",
	sx,
	style,
	children,
	...props
}) => (
	<Component
		style={{
			display: "block",
			textAlign: "inherit",
			width: "100%",
			background: "none",
			border: "none",
			padding: 0,
			cursor: "pointer",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{children}
	</Component>
);

export const AppBar = ({ children, sx, style, ...props }) => (
	<header style={{ width: "100%", ...resolveSx(sx), ...style }} {...props}>
		{children}
	</header>
);
export const Toolbar = ({ children, sx, style, ...props }) => (
	<div
		style={{
			display: "flex",
			alignItems: "center",
			minHeight: "52px",
			padding: "0 1rem",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{children}
	</div>
);

export const ToggleButtonGroup = ({
	value,
	onChange,
	children,
	sx,
	style,
	...props
}) => (
	<div
		role="group"
		style={{
			display: "inline-flex",
			border: "1px solid var(--color-border, rgba(56, 57, 46, 0.10))",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{React.Children.map(children, (child) =>
			React.cloneElement(child, {
				selected: child.props.value === value,
				onClick: () => onChange?.(null, child.props.value),
			}),
		)}
	</div>
);

export const ToggleButton = ({
	selected,
	onClick,
	children,
	sx,
	style,
	...props
}) => (
	<button
		type="button"
		onClick={onClick}
		style={{
			background: selected
				? "var(--color-overlay-pressed, rgba(56, 57, 46, 0.10))"
				: "transparent",
			border: "none",
			borderRight: "1px solid var(--color-border, rgba(56, 57, 46, 0.10))",
			color: selected
				? "var(--color-text-primary, #38392e)"
				: "var(--color-text-secondary, #7d5d53)",
			padding: "4px 8px",
			cursor: "pointer",
			display: "inline-flex",
			alignItems: "center",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{children}
	</button>
);

export const Paper = Box;

export const Stack = ({
	direction = "column",
	spacing = 0,
	children,
	sx,
	style,
	...props
}) => (
	<div
		style={{
			display: "flex",
			flexDirection: direction,
			gap: typeof spacing === "number" ? `${spacing * 8}px` : spacing,
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{children}
	</div>
);

export const FormControlLabel = ({ control, label, sx, style, ...props }) => (
	<span
		style={{
			display: "inline-flex",
			alignItems: "center",
			gap: "8px",
			cursor: "pointer",
			fontFamily: "var(--font-family-body, 'Noto Serif', serif)",
			fontSize: "0.875rem",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{control}
		<span>{label}</span>
	</span>
);

export const Avatar = ({ children, src, alt, sx, style, ...props }) => (
	<div
		style={{
			width: 40,
			height: 40,
			borderRadius: "50%",
			background: "var(--color-border, rgba(56, 57, 46, 0.10))",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			overflow: "hidden",
			flexShrink: 0,
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{src ? (
			<img
				src={src}
				alt={alt || ""}
				style={{ width: "100%", height: "100%", objectFit: "cover" }}
			/>
		) : (
			children
		)}
	</div>
);

export const List = ({
	children,
	disablePadding,
	dense,
	sx,
	style,
	...props
}) => (
	<ul
		style={{
			listStyle: "none",
			margin: 0,
			padding: disablePadding ? 0 : dense ? "4px 0" : "8px 0",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{children}
	</ul>
);

export const ListItem = ({
	children,
	disablePadding,
	dense,
	alignItems,
	sx,
	style,
	...props
}) => (
	<li
		style={{
			display: "flex",
			alignItems: alignItems === "flex-start" ? "flex-start" : "center",
			padding: disablePadding ? 0 : dense ? "4px 0" : "8px 0",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{children}
	</li>
);

export const ListItemText = ({
	primary,
	secondary,
	children,
	sx,
	style,
	...props
}) => (
	<div
		style={{
			display: "flex",
			flexDirection: "column",
			gap: "2px",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{primary && (
			<span
				style={{
					fontFamily: "var(--font-family-heading, 'Newsreader', serif)",
					fontWeight: 600,
					fontSize: "1rem",
					color: "var(--color-text-primary, #38392e)",
				}}
			>
				{primary}
			</span>
		)}
		{secondary && (
			<span
				style={{
					fontFamily: "var(--font-family-body, 'Noto Serif', serif)",
					fontSize: "0.875rem",
					color: "var(--color-text-secondary, #7d5d53)",
				}}
			>
				{secondary}
			</span>
		)}
		{children}
	</div>
);

export const ListItemAvatar = ({ children, sx, style, ...props }) => (
	<div
		style={{
			marginRight: "12px",
			display: "flex",
			alignItems: "center",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{children}
	</div>
);

export const Table = ({ children, sx, style, ...props }) => (
	<table
		style={{
			width: "100%",
			borderCollapse: "collapse",
			fontFamily: "var(--font-family-body, 'Noto Serif', serif)",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{children}
	</table>
);

export const TableHead = ({ children, sx, style, ...props }) => (
	<thead
		style={{
			borderBottom: "2px solid var(--color-border, rgba(56, 57, 46, 0.20))",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{children}
	</thead>
);

export const TableBody = ({ children, sx, style, ...props }) => (
	<tbody style={{ ...resolveSx(sx), ...style }} {...props}>
		{children}
	</tbody>
);

export const TableRow = ({ children, sx, style, hover, ...props }) => (
	<tr
		style={{
			borderBottom: "1px solid var(--color-border, rgba(56, 57, 46, 0.10))",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{children}
	</tr>
);

export const TableCell = ({
	children,
	align = "left",
	sx,
	style,
	...props
}) => (
	<td
		style={{
			padding: "10px 14px",
			textAlign: align,
			fontSize: "0.875rem",
			color: "var(--color-text-primary, #38392e)",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{children}
	</td>
);

export const TableContainer = ({ children, sx, style, ...props }) => (
	<div
		style={{
			width: "100%",
			overflowX: "auto",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{children}
	</div>
);
