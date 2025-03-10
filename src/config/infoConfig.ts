export * from './projects'
export * from './friends'


// personal info
export const name = 'RejectModders'
export const headline = 'Python Developer, Web Developer, and Chill Dude. 😎'
export const introduction = 'I’m RejectModders, I like coding and learning new things everyday!'
export const email = 'rejectmodders@disutils.com'
export const githubUsername = 'RejectModders'

// about page
export const aboutMeHeadline = "I'm RejectModdders, a Python Developer based in Missouri, United States."
export const aboutParagraphs = [
  "I love coding. I learned programming when I was around 14-15. My first project was in Python, and I've been hooked ever since.",
  "I have a variety of hobbies, watching movies, listening to music, and just exploring new things.",
  "Currently, I'm working on Disutils Team and helping out in Ignited Hosting."
];



// social links
export type SocialLinkType = {
  name: string,
  ariaLabel?: string,
  icon: string,
  href: string
}

export const socialLinks: Array<SocialLinkType> = [
  {
    name: 'Github',
    icon: 'github',
    href: 'https://github.com/RejectModders'
  },
  {
    name: 'Discord',
    icon: 'discord',
    href: 'https://discord.gg/28RuT8WsKT'
  },
]

// https://simpleicons.org/
export const techIcons = [
  "typescript",
  "javascript",
  "supabase",
  "cloudflare",
  "java",
  "oracle",
  "mysql",
  "react",
  "nodedotjs",
  "nextdotjs",
  "prisma",
  "postgresql",
  "nginx",
  "vercel",
  "docker",
  "git",
  "github",
  "visualstudiocode",
  "androidstudio",
  "ios",
  "apple",
  "wechat"
];


