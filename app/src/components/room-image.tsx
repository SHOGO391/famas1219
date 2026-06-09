import Image from "next/image"

type RoomImageProps = Readonly<{
  emoji: string
  name: string
  size?: "sm" | "md" | "lg"
}>

const sizeMap = {
  sm: { container: "w-6 h-6", image: 24 },
  md: { container: "w-10 h-10", image: 40 },
  lg: { container: "w-12 h-12", image: 48 },
} as const

export function RoomImage({ emoji, name, size = "md" }: RoomImageProps) {
  const { container, image } = sizeMap[size]
  const isImage = emoji.startsWith("/")

  if (isImage) {
    return (
      <Image
        src={emoji}
        alt={name}
        width={image}
        height={image}
        className={`${container} rounded-lg object-cover shrink-0`}
      />
    )
  }

  return (
    <span className={`${container} flex items-center justify-center text-2xl shrink-0`}>
      {emoji}
    </span>
  )
}
