export default function Logo({ collapsed = false }) {
  return (
    <div className="flex items-center gap-2 px-4 h-16">
      <img src="/logo-mark.svg" alt="FlickZone" className="w-8 h-8 shrink-0" />
      {!collapsed && (
        <span className="font-heading font-bold text-xl whitespace-nowrap">
          FlickZone
        </span>
      )}
    </div>
  );
}