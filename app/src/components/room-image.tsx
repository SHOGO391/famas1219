type RoomImageProps = Readonly<{
  emoji: string
  name: string
  size?: "sm" | "md" | "lg"
}>

const sizeMap = {
  sm: "w-6 h-6",
  md: "w-10 h-10",
  lg: "w-12 h-12",
} as const

export function RoomImage({ emoji, name, size = "md" }: RoomImageProps) {
  const box = sizeMap[size]
  const isImage = emoji.startsWith("/")

  if (isImage) {
    /* eslint-disable @next/next/no-img-element */
    return (
      <img
        src={emoji}
        alt={name}
        className={`${box} rounded-lg object-cover shrink-0`}
      />
    )
  }

  return (
    <span className={`${box} flex items-center justify-center text-2xl shrink-0`}>
      {emoji}
    </span>
  )
}
