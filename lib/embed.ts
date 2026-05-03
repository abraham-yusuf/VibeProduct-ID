export type EmbedType = "youtube" | "tiktok" | "facebook" | "instagram" | "none"

export interface EmbedInfo {
  type:     EmbedType
  embedUrl: string
  videoId:  string
}

// Detect embed type from raw URL
export function detectEmbedType(url: string): EmbedType {
  if (!url) return "none"
  if (/youtube\.com|youtu\.be/.test(url))    return "youtube"
  if (/tiktok\.com/.test(url))               return "tiktok"
  if (/facebook\.com|fb\.watch/.test(url))   return "facebook"
  if (/instagram\.com/.test(url))            return "instagram"
  return "none"
}

// Build embeddable URL from raw URL
export function buildEmbedUrl(url: string, type: EmbedType): string {
  try {
    switch (type) {
      case "youtube": {
        // Handle: youtu.be/ID  or  youtube.com/watch?v=ID  or  youtube.com/shorts/ID
        const parsed = new URL(url)
        let videoId  = ""
        if (parsed.hostname === "youtu.be") {
          videoId = parsed.pathname.slice(1)
        } else {
          videoId = parsed.searchParams.get("v")
            ?? parsed.pathname.split("/").pop()
            ?? ""
        }
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`
      }

      case "tiktok": {
        // TikTok embed: https://www.tiktok.com/embed/v2/VIDEO_ID
        const match = url.match(/video\/(\d+)/)
        const id    = match?.[1] ?? ""
        return `https://www.tiktok.com/embed/v2/${id}`
      }

      case "facebook": {
        // Facebook video embed
        const encoded = encodeURIComponent(url)
        return `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=false&width=560`
      }

      case "instagram": {
        // Instagram reel/post embed: append /embed to post URL
        const clean = url.replace(/\?.*$/, "").replace(/\/$/, "")
        return `${clean}/embed`
      }

      default:
        return url
    }
  } catch {
    return url
  }
}

// Sanitize: only allow https
export function safeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    return parsed.protocol === "https:" ? url : null
  } catch {
    return null
  }
}