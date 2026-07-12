function Icon({
  children,
  className = "h-4 w-4",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function TrashIcon(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </Icon>
  );
}

export function EditIcon(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="M15 5l4 4" />
    </Icon>
  );
}

export function ExternalLinkIcon(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </Icon>
  );
}

export function BriefcaseIcon(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M9 3h6a2 2 0 0 1 2 2v1H7V5a2 2 0 0 1 2-2Z" />
      <rect x="4" y="6" width="16" height="15" rx="2" />
      <path d="M9 12h6M9 16h6" />
    </Icon>
  );
}

export function FlameIcon(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M12 2c1 3-2 4-2 7a3 3 0 0 0 6 0c0-1-.5-2-1-3 2 1 4 4 4 7a7 7 0 1 1-14 0c0-4 3-6 4-9 .5 1 1 2 3 2 0-2-1-3 0-4Z" />
    </Icon>
  );
}

export function TrophyIcon(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M8 21h8M12 17v4" />
      <path d="M7 4h10v5a5 5 0 0 1-10 0Z" />
      <path d="M7 5H4a3 3 0 0 0 3 5M17 5h3a3 3 0 0 1-3 5" />
    </Icon>
  );
}

export function ChartBarIcon(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M4 20V10M12 20V4M20 20v-7" />
    </Icon>
  );
}

export function FunnelIcon(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M4 5h16l-6 8v6l-4 2v-8L4 5Z" />
    </Icon>
  );
}

export function ActivityIcon(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </Icon>
  );
}

export function EyeIcon(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  );
}

export function DocumentIcon(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6M9 17h6" />
    </Icon>
  );
}

export function PaperclipIcon(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M21.44 11.05 12.25 20.24a5.5 5.5 0 0 1-7.78-7.78l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95L9.41 17.41a1.5 1.5 0 0 1-2.12-2.12l8.49-8.49" />
    </Icon>
  );
}

export function DownloadIcon(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </Icon>
  );
}

export function ChatBubbleIcon(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
    </Icon>
  );
}

export function SunIcon(props: { className?: string }) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </Icon>
  );
}

export function MoonIcon(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </Icon>
  );
}

export function LayoutDashboardIcon(props: { className?: string }) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </Icon>
  );
}

export function ListIcon(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <path d="M3 6h.01M3 12h.01M3 18h.01" />
    </Icon>
  );
}

export function TemplateIcon(props: { className?: string }) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </Icon>
  );
}

export function GlobeIcon(props: { className?: string }) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z" />
    </Icon>
  );
}

export function CompassIcon(props: { className?: string }) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="m16 8-4 8-4-4 8-4Z" />
    </Icon>
  );
}

export function UserIcon(props: { className?: string }) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </Icon>
  );
}

export function MenuIcon(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </Icon>
  );
}

export function CloseIcon(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </Icon>
  );
}
