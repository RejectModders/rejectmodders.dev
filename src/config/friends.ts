// friends
export const friendsHeadLine = "My closest friends!"
export const friendsIntro = "Meet some interesting friends."


// friends
export type FriendItemType = {
  name: string
  description?: string
  link: { href: string, label?: string }
  logo?: string
}

export const friends: Array<FriendItemType> = [
  {
    name: 'Corey Chiu',
    link: { href: 'https://coreychiu.com' },
    logo: 'https://coreychiu.com/path/to/logo.png' // You can provide the logo URL here
  },
  {
    name: 'John Doe',
    link: { href: 'https://johndoe.com' },
    // No logo here, it will fallback to the favicon
  }
]


