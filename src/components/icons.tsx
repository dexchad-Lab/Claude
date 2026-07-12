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
