type HeaderProps = {
  readonly title: string
  readonly subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-blue-600 text-white px-4 py-5">
      <h1 className="text-xl font-bold">{title}</h1>
      {subtitle && <p className="text-blue-100 text-sm mt-1">{subtitle}</p>}
    </header>
  )
}
