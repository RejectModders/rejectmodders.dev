"use client"

import { Shield, Code2, Terminal, MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"
import { SKILLS } from "@/data/skills"

const stats = [
	{ label: "Public Repos", value: "9+" },
	{ label: "Languages", value: "6+" },
	{ label: "Focus", value: "Security" },
	{ label: "Location", value: "Missouri" },
]

export function AboutSection() {
	return (
		<section id="about" className="relative py-24 md:py-32" style={{ overflow: "clip" }}>
			<div
				className="pointer-events-none absolute right-0 top-1/2 -z-10 h-80 w-80 -translate-y-1/2 rounded-full"
				style={{ background: "radial-gradient(circle, oklch(0.45 0.18 15 / 0.06) 0%, transparent 70%)" }}
			/>

			<div className="mx-auto max-w-6xl px-4">
				{/* Header */}
				<div className="mb-12">
					<span className="font-mono text-sm text-primary">{'// about'}</span>
					<h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">Who I Am</h2>
					<div className="mt-2 h-1 w-16 rounded-full bg-primary" />
				</div>

				<div className="grid items-stretch gap-8 lg:grid-cols-5">
					{/* Bio card */}
					<div className="flex flex-col lg:col-span-3">
						<div className="card-hover flex flex-1 flex-col rounded-xl border border-border bg-card p-6 md:p-8">
							<div className="mb-6 flex items-center gap-2">
								{[["bg-[#ff5f57]","border-[#e0443e]"], ["bg-[#febc2e]","border-[#d4a012]"], ["bg-[#28c840]","border-[#1aab29]"]].map(([bg, border], i) => (
									<div key={i} className={`h-3 w-3 rounded-full border ${bg} ${border}`} />
								))}
								<span className="ml-2 font-mono text-xs text-muted-foreground">about.md</span>
							</div>

							<div className="flex flex-1 flex-col space-y-4 leading-relaxed text-muted-foreground">
								{[
									{ icon: Shield, text: (<>{"Hey, I'm "}<strong className="text-foreground">RejectModders</strong>{" and I do cybersecurity stuff out of "}<span className="inline-flex items-center gap-1 text-foreground"><MapPin className="h-3.5 w-3.5 text-primary" /> Missouri</span>{". Mostly I just love finding ways to break things so I can make them harder to break."}</>) },
									{ icon: Code2, text: (<>I mostly write <strong className="text-foreground">Python, C, C++, and C#</strong>. Security scanners, Discord bots, games, whatever sounds interesting. I just like building stuff.</>) },
									{ icon: Terminal, text: (<>I used to run <strong className="text-foreground">Disutils Team</strong> which was a Discord dev tools org, but I wrapped that up to focus on <strong className="text-foreground">VulnRadar</strong>. Always down to work on something cool together.</>) },
								].map(({ icon: Icon, text }, i) => (
									<p key={i} className="flex items-start gap-3">
										<Icon className="mt-1 h-5 w-5 shrink-0 text-primary" />
										<span>{text}</span>
									</p>
								))}
							</div>

							<div className="mt-6">
								<Link href="/about" className="group inline-flex items-center gap-2 font-mono text-sm text-primary hover:text-foreground">
									Read more about me
									<ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1" />
								</Link>
							</div>
						</div>

						{/* Stats */}
						<div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
							{stats.map((stat) => (
								<div
									key={stat.label}
									className="card-hover rounded-lg border border-border bg-card p-4 text-center cursor-default"
								>
									<div className="text-xl font-bold text-primary">{stat.value}</div>
									<div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
								</div>
							))}
						</div>
					</div>

					{/* Skills card */}
					<div className="flex flex-col lg:col-span-2">
						<div className="card-hover flex flex-1 flex-col rounded-xl border border-border bg-card p-6 md:p-8">
							<div className="mb-6 flex items-center gap-2">
								{[["bg-[#ff5f57]","border-[#e0443e]"], ["bg-[#febc2e]","border-[#d4a012]"], ["bg-[#28c840]","border-[#1aab29]"]].map(([bg, border], i) => (
									<div key={i} className={`h-3 w-3 rounded-full border ${bg} ${border}`} />
								))}
								<span className="ml-2 font-mono text-xs text-muted-foreground">skills.json</span>
							</div>

							<div className="flex-1 overflow-y-auto space-y-4 pr-1" style={{ scrollbarWidth: "none" }}>
								{SKILLS.slice(0, 6).map((skill) => (
									<div key={skill.name}>
										<div className="mb-1.5 flex items-center justify-between">
											<span className="text-sm font-medium text-foreground">{skill.name}</span>
											<span className="font-mono text-xs text-muted-foreground">{skill.level}%</span>
										</div>
										<div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
											<div
												className="h-full rounded-full bg-primary"
												style={{ 
													width: `${Math.min(skill.level, 100)}%`,
													boxShadow: "0 0 8px color-mix(in oklch, var(--primary) 40%, transparent)" 
												}}
											/>
										</div>
									</div>
								))}
							</div>

							<div className="mt-6">
								<Link href="/about" className="group inline-flex items-center gap-2 font-mono text-sm text-primary hover:text-foreground">
									Full tech stack
									<ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1" />
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
