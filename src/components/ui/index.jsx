import {
	createContext,
	forwardRef,
	useContext,
	useEffect,
	useState,
} from "react";

const SelectContext = createContext(null);

export const resolveSx = (sx) => {
	if (!sx) return {};
	if (typeof sx === "function") return sx(THEME_OBJECT);
	const s = {};
	for (const [k, v] of Object.entries(sx)) {
		const val =
			typeof v === "object" && v !== null ? (v.md ?? v.sm ?? v.xs) : v;
		if (val === undefined || val === null) continue;
		if (k === "mb")
			s.marginBottom = typeof val === "number" ? `${val * 8}px` : val;
		else if (k === "mt")
			s.marginTop = typeof val === "number" ? `${val * 8}px` : val;
		else if (k === "my") {
			s.marginTop = s.marginBottom =
				typeof val === "number" ? `${val * 8}px` : val;
		} else if (k === "mx") {
			s.marginLeft = s.marginRight =
				typeof val === "number" ? `${val * 8}px` : val;
		} else if (k === "m")
			s.margin = typeof val === "number" ? `${val * 8}px` : val;
		else if (k === "p")
			s.padding = typeof val === "number" ? `${val * 8}px` : val;
		else if (k === "px") {
			s.paddingLeft = s.paddingRight =
				typeof val === "number" ? `${val * 8}px` : val;
		} else if (k === "py") {
			s.paddingTop = s.paddingBottom =
				typeof val === "number" ? `${val * 8}px` : val;
		} else if (k === "gap")
			s.gap = typeof val === "number" ? `${val * 8}px` : val;
		else if (k === "display") s.display = val;
		else if (k === "flexDirection") s.flexDirection = val;
		else if (k === "alignItems") s.alignItems = val;
		else if (k === "justifyContent") s.justifyContent = val;
		else if (k === "flexWrap") s.flexWrap = val;
		else if (k === "flex") s.flex = val;
		else if (k === "width") s.width = val;
		else if (k === "maxWidth") s.maxWidth = val;
		else if (k === "color")
			s.color =
				val === "text.secondary" ? "var(--color-text-secondary, #7d5d53)" : val;
		else if (k === "bgcolor")
			s.backgroundColor =
				val === "background.paper"
					? "var(--color-background-surface, #fdffda)"
					: val;
		else if (!k.startsWith("&") && !k.startsWith("@")) s[k] = val;
	}
	return s;
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
			hover: "rgba(56, 57, 46, 0.05)",
			selected: "rgba(56, 57, 46, 0.10)",
		},
	},
	breakpoints: { down: (key) => key },
	spacing: (n) => `${n * 8}px`,
};

export const useTheme = () => THEME_OBJECT;
export const useMediaQuery = () => {
	const [matches, setMatches] = useState(
		typeof window !== "undefined" ? window.innerWidth < 900 : false,
	);
	useEffect(() => {
		const h = () => setMatches(window.innerWidth < 900);
		window.addEventListener("resize", h);
		return () => window.removeEventListener("resize", h);
	}, []);
	return matches;
};
export const alpha = (color, opacity) =>
	color?.startsWith("#")
		? `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacity})`
		: `rgba(56, 57, 46, ${opacity})`;
export const createTheme = () => THEME_OBJECT;
export const ThemeProvider = ({ children }) => <>{children}</>;
export const CssBaseline = () => null;

export const Box = forwardRef(
	(
		{
			component: Component = "div",
			sx,
			style,
			className = "",
			children,
			...props
		},
		ref,
	) => (
		<Component
			ref={ref}
			className={className}
			style={{ ...resolveSx(sx), ...style }}
			{...props}
		>
			{children}
		</Component>
	),
);
Box.displayName = "Box";

export const Container = ({
	maxWidth = "lg",
	sx,
	style,
	className = "",
	children,
	...props
}) => {
	const cls =
		maxWidth === "sm"
			? "container-sm"
			: maxWidth === "md"
				? "container-md"
				: "container";
	return (
		<div
			className={`${cls} ${className}`.trim()}
			style={{ ...resolveSx(sx), ...style }}
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
			className = "",
			children,
			...props
		},
		ref,
	) => {
		let Tag = component;
		let cls = className;
		if (variant === "h1") {
			Tag = Tag || "h1";
		} else if (variant === "h2") {
			Tag = Tag || "h2";
		} else if (variant === "h3") {
			Tag = Tag || "h3";
		} else if (variant === "h4") {
			Tag = Tag || "h4";
		} else if (variant === "h5") {
			Tag = Tag || "h5";
		} else if (variant === "h6") {
			Tag = Tag || "h6";
		} else if (variant === "overline") {
			Tag = Tag || "span";
			cls = `${cls} overline`;
		} else if (variant === "caption") {
			Tag = Tag || "span";
			cls = `${cls} caption`;
		} else if (variant === "body2") {
			Tag = Tag || "p";
			cls = `${cls} font-body`;
		} else {
			Tag = Tag || "p";
		}

		if (color === "text.secondary") cls = `${cls} text-secondary`;
		else if (color === "error") cls = `${cls} text-error`;
		if (gutterBottom) cls = `${cls} mb-3`;

		return (
			<Tag
				ref={ref}
				className={cls.trim()}
				style={{ ...resolveSx(sx), ...style }}
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
			variant = "contained",
			size,
			color: _color,
			startIcon,
			endIcon,
			sx,
			style,
			className = "",
			children,
			disabled,
			...props
		},
		ref,
	) => {
		const variantCls =
			variant === "contained"
				? "btn-primary"
				: variant === "outlined"
					? "btn-outline"
					: "btn-ghost";
		const sizeCls = size === "small" ? "btn-sm" : "";
		return (
			<button
				ref={ref}
				disabled={disabled}
				className={`btn ${variantCls} ${sizeCls} ${className}`.trim()}
				style={{ ...resolveSx(sx), ...style }}
				{...props}
			>
				{startIcon && <span className="btn-icon-start">{startIcon}</span>}
				{children}
				{endIcon && <span className="btn-icon-end">{endIcon}</span>}
			</button>
		);
	},
);
Button.displayName = "Button";

export const IconButton = forwardRef(
	({ sx, style, className = "", children, ...props }, ref) => (
		<button
			ref={ref}
			className={`btn btn-icon btn-ghost ${className}`.trim()}
			style={{ ...resolveSx(sx), ...style }}
			{...props}
		>
			{children}
		</button>
	),
);
IconButton.displayName = "IconButton";

export const Chip = forwardRef(
	(
		{
			label,
			variant = "outlined",
			color: _color,
			size,
			onClick,
			clickable: _cl,
			sx,
			style,
			className = "",
			...props
		},
		ref,
	) => {
		const Component = onClick ? "button" : "span";
		const activeCls = variant === "filled" ? "chip-active" : "";
		const sizeCls = size === "small" ? "btn-sm" : "";
		return (
			<Component
				ref={ref}
				onClick={onClick}
				className={`chip ${activeCls} ${sizeCls} ${className}`.trim()}
				style={{ ...resolveSx(sx), ...style }}
				{...props}
			>
				{label}
			</Component>
		);
	},
);
Chip.displayName = "Chip";

export const Divider = ({ sx, style, className = "", ...props }) => (
	<hr
		className={`divider ${className}`.trim()}
		style={{ ...resolveSx(sx), ...style }}
		{...props}
	/>
);

export const TextField = forwardRef(
	(
		{
			label,
			value,
			onChange,
			placeholder,
			required,
			multiline,
			rows = 3,
			error: _err,
			helperText: _ht,
			fullWidth: _fw,
			variant: _v,
			InputProps,
			slotProps,
			inputProps,
			id,
			sx,
			style,
			className = "",
			...props
		},
		ref,
	) => {
		const fieldId =
			id ||
			(label
				? `field-${label.toLowerCase().replace(/[^a-z0-9]/g, "-")}`
				: undefined);
		const startAdornment =
			InputProps?.startAdornment || slotProps?.input?.startAdornment;
		const isStandard = _v === "standard";
		const inputClass = isStandard ? "input-standard" : "input";
		return (
			<div
				className={`form-group ${className}`.trim()}
				style={{ ...resolveSx(sx), ...style }}
			>
				{label && (
					<label htmlFor={fieldId} className="form-label">
						{label}
					</label>
				)}
				<div
					style={{
						position: "relative",
						display: "flex",
						alignItems: "center",
						width: "100%",
					}}
				>
					{startAdornment && (
						<div
							style={{
								position: "absolute",
								left: 10,
								display: "flex",
								alignItems: "center",
								pointerEvents: "none",
								color: "var(--color-text-secondary, #7d5d53)",
							}}
						>
							{startAdornment}
						</div>
					)}
					{multiline ? (
						<textarea
							ref={ref}
							id={fieldId}
							rows={rows}
							value={value}
							onChange={onChange}
							placeholder={placeholder}
							required={required}
							className={inputClass}
							{...inputProps}
							{...props}
						/>
					) : (
						<input
							ref={ref}
							id={fieldId}
							value={value}
							onChange={onChange}
							placeholder={placeholder}
							required={required}
							className={inputClass}
							style={startAdornment ? { paddingLeft: "2.2rem" } : undefined}
							{...inputProps}
							{...props}
						/>
					)}
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
			children,
			id,
			labelId,
			"aria-label": ariaLabel,
			"aria-labelledby": ariaLabelledby,
			sx,
			style,
			className = "",
			...props
		},
		ref,
	) => {
		const onSelect = (val) => onChange?.({ target: { value: val } });
		return (
			<SelectContext.Provider value={{ selectedValue: value, onSelect }}>
				<select
					ref={ref}
					id={id}
					value={value}
					onChange={onChange}
					aria-label={ariaLabel}
					aria-labelledby={ariaLabelledby || labelId}
					className={`select ${className}`.trim()}
					style={{ ...resolveSx(sx), ...style }}
					{...props}
				>
					{children}
				</select>
			</SelectContext.Provider>
		);
	},
);
Select.displayName = "Select";

export const MenuItem = forwardRef(
	({ value, children, onClick, ...props }, ref) => {
		const ctx = useContext(SelectContext);
		const handleClick = (e) => {
			onClick?.(e);
			ctx?.onSelect?.(value);
		};
		return (
			<option ref={ref} value={value} onClick={handleClick} {...props}>
				{children}
			</option>
		);
	},
);
MenuItem.displayName = "MenuItem";

export const FormControl = ({
	children,
	sx,
	style,
	className = "",
	...props
}) => (
	<div
		className={`form-group ${className}`.trim()}
		style={{ ...resolveSx(sx), ...style }}
		{...props}
	>
		{children}
	</div>
);

export const InputLabel = ({
	id,
	htmlFor,
	children,
	sx,
	style,
	className = "",
	...props
}) => (
	<label
		id={id}
		htmlFor={htmlFor || id}
		className={`form-label ${className}`.trim()}
		style={{ ...resolveSx(sx), ...style }}
		{...props}
	>
		{children}
	</label>
);

export const InputAdornment = ({ position: _pos, children }) => <>{children}</>;

export const Dialog = ({ open, onClose, children }) => {
	if (!open) return null;
	return (
		<div
			className="dialog-backdrop"
			role="dialog"
			aria-modal="true"
			tabIndex={-1}
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose?.();
			}}
			onKeyDown={(e) => {
				if (e.key === "Escape") onClose?.();
			}}
		>
			<div className="dialog-panel">{children}</div>
		</div>
	);
};

export const DialogTitle = ({ children, sx, style, className = "" }) => (
	<div
		className={`dialog-header ${className}`.trim()}
		style={{ ...resolveSx(sx), ...style }}
	>
		<h4 style={{ margin: 0 }}>{children}</h4>
	</div>
);

export const DialogContent = ({ children, sx, style, className = "" }) => (
	<div className={className} style={{ ...resolveSx(sx), ...style }}>
		{children}
	</div>
);

export const DialogActions = ({ children, sx, style, className = "" }) => (
	<div
		className={`dialog-footer ${className}`.trim()}
		style={{ ...resolveSx(sx), ...style }}
	>
		{children}
	</div>
);

export const TableContainer = ({
	children,
	sx,
	style,
	className = "",
	...props
}) => (
	<div
		className={`table-container ${className}`.trim()}
		style={{ ...resolveSx(sx), ...style }}
		{...props}
	>
		{children}
	</div>
);
export const Table = ({ children, sx, style, className = "", ...props }) => (
	<table
		className={`table ${className}`.trim()}
		style={{ ...resolveSx(sx), ...style }}
		{...props}
	>
		{children}
	</table>
);
export const TableHead = ({ children, ...props }) => (
	<thead {...props}>{children}</thead>
);
export const TableBody = ({ children, ...props }) => (
	<tbody {...props}>{children}</tbody>
);
export const TableRow = ({ children, ...props }) => (
	<tr {...props}>{children}</tr>
);
export const TableCell = ({
	children,
	component: Comp,
	sx,
	style,
	...props
}) => {
	const Tag = Comp || "td";
	return (
		<Tag style={{ ...resolveSx(sx), ...style }} {...props}>
			{children}
		</Tag>
	);
};

export const Card = forwardRef(
	({ sx, style, className = "", children, ...props }, ref) => (
		<div
			ref={ref}
			className={`card ${className}`.trim()}
			style={{ ...resolveSx(sx), ...style }}
			{...props}
		>
			{children}
		</div>
	),
);
Card.displayName = "Card";
export const CardContent = ({
	children,
	sx,
	style,
	className = "",
	...props
}) => (
	<div className={className} style={{ ...resolveSx(sx), ...style }} {...props}>
		{children}
	</div>
);
export const CardMedia = ({ component: Comp = "img", ...props }) => (
	<Comp {...props} />
);
export const CardActionArea = ({ sx, style, children, ...props }) => (
	<button
		type="button"
		style={{
			display: "block",
			width: "100%",
			textAlign: "inherit",
			background: "none",
			border: "none",
			padding: 0,
			cursor: "pointer",
			font: "inherit",
			color: "inherit",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{children}
	</button>
);
export const Paper = forwardRef(
	({ sx, style, className = "", children, ...props }, ref) => (
		<div
			ref={ref}
			className={`surface-card ${className}`.trim()}
			style={{ ...resolveSx(sx), ...style }}
			{...props}
		>
			{children}
		</div>
	),
);
Paper.displayName = "Paper";

export const Drawer = ({
	open,
	onClose,
	anchor: _a,
	slotProps: _sp,
	children,
	className = "",
	...props
}) => {
	if (!open) return null;
	return (
		<div
			className="dialog-backdrop"
			role="dialog"
			aria-modal="true"
			tabIndex={-1}
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose?.();
			}}
			onKeyDown={(e) => {
				if (e.key === "Escape") onClose?.();
			}}
			style={{ justifyContent: "flex-end", padding: 0 }}
			{...props}
		>
			<div
				className={`surface-card ${className}`.trim()}
				style={{
					width: "min(540px, 100vw)",
					height: "100vh",
					overflowY: "auto",
					padding: "1.5rem",
				}}
			>
				{children}
			</div>
		</div>
	);
};

export const CircularProgress = ({ size = 20 }) => (
	<span className="spinner" style={{ width: size, height: size }} />
);
export const Skeleton = ({ variant: _v, width, height, sx, style }) => (
	<div
		style={{
			width: width || "100%",
			height: height || 20,
			backgroundColor: "var(--color-border, rgba(56, 57, 46, 0.1))",
			...resolveSx(sx),
			...style,
		}}
	/>
);

export const Switch = ({ checked, onChange, name, id }) => (
	<input
		type="checkbox"
		id={id}
		name={name}
		checked={checked}
		onChange={onChange}
		style={{ width: "auto", cursor: "pointer" }}
	/>
);
export const FormControlLabel = ({ control, label }) => (
	<label
		htmlFor={control?.props?.id}
		style={{
			display: "inline-flex",
			alignItems: "center",
			gap: "0.5rem",
			cursor: "pointer",
			fontSize: "0.85rem",
		}}
	>
		{control}
		<span>{label}</span>
	</label>
);

export const Tooltip = ({ title: _t, children }) => <>{children}</>;
export const Snackbar = ({ open, children }) =>
	open ? (
		<div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1100 }}>
			{children}
		</div>
	) : null;
export const Alert = ({
	severity: _s,
	children,
	sx,
	style,
	className = "",
	...props
}) => (
	<div
		className={`surface-card ${className}`.trim()}
		style={{
			borderLeft: "4px solid var(--color-accent, #7d5d53)",
			...resolveSx(sx),
			...style,
		}}
		{...props}
	>
		{children}
	</div>
);

export const Tabs = ({ value: _v, onChange: _oc, children }) => (
	<div className="flex gap-2 mb-4">{children}</div>
);
export const Tab = ({ label, onClick, ...props }) => (
	<button type="button" onClick={onClick} className="chip" {...props}>
		{label}
	</button>
);
export const Badge = ({ badgeContent: _bc, children, sx: _sx }) => (
	<span className="badge">{children}</span>
);
export const Avatar = ({ children, sx, style, className = "", ...props }) => (
	<span
		className={`avatar ${className}`.trim()}
		style={{ ...resolveSx(sx), ...style }}
		{...props}
	>
		{children}
	</span>
);

export const List = ({ children, sx, style, className = "", ...props }) => (
	<ul
		className={`list-unstyled ${className}`.trim()}
		style={{ ...resolveSx(sx), ...style }}
		{...props}
	>
		{children}
	</ul>
);
export const ListItem = ({
	children,
	alignItems: _ai,
	sx,
	style,
	className = "",
	...props
}) => (
	<li
		className={`flex gap-3 items-center py-2 ${className}`.trim()}
		style={{ ...resolveSx(sx), ...style }}
		{...props}
	>
		{children}
	</li>
);
export const ListItemAvatar = ({ children }) => (
	<div style={{ flexShrink: 0 }}>{children}</div>
);
export const ListItemIcon = ({ children }) => (
	<div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
		{children}
	</div>
);
export const ListItemText = ({ primary, secondary }) => (
	<div className="flex-1">
		{primary && <div>{primary}</div>}
		{secondary && (
			<div className="text-secondary" style={{ fontSize: "0.85rem" }}>
				{secondary}
			</div>
		)}
	</div>
);
export const ListItemSecondaryAction = ({ children }) => (
	<div style={{ marginLeft: "auto" }}>{children}</div>
);

export const Stack = ({
	spacing = 2,
	direction = "column",
	children,
	sx,
	style,
	className = "",
	...props
}) => (
	<div
		className={`flex ${direction === "column" ? "flex-col" : "flex-row"} gap-${spacing} ${className}`.trim()}
		style={{ ...resolveSx(sx), ...style }}
		{...props}
	>
		{children}
	</div>
);
export const Grid = ({
	container: _c,
	item: _i,
	xs: _xs,
	md: _md,
	children,
	sx,
	style,
	className = "",
	...props
}) => (
	<div className={className} style={{ ...resolveSx(sx), ...style }} {...props}>
		{children}
	</div>
);
export const Breadcrumbs = ({ children }) => (
	<nav className="flex gap-2 items-center caption">{children}</nav>
);
export const Link = ({ children, href, to, ...props }) => (
	<a href={href || to} {...props}>
		{children}
	</a>
);
