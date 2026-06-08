type PageHeaderProps = {
  readonly title: string
  readonly description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="bg-primary px-4 py-5">
      <h1 className="text-xl font-bold text-primary-foreground">{title}</h1>
      {description && (
        <p className="text-sm text-primary-foreground/70 mt-1">
          {description}
        </p>
      )}
    </div>
  )
}
