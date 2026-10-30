import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const token = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['"Noto Sans SC"', 'system-ui', '-apple-system', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
				display: ['"ZCOOL KuaiLe"', '"Noto Sans SC"', '"PingFang SC"', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: token('border'),
				input: token('input'),
				ring: token('ring'),
				background: token('background'),
				foreground: token('foreground'),
				ink: token('ink'),
				paper: token('paper'),
				primary: {
					DEFAULT: token('primary'),
					foreground: token('primary-foreground'),
					soft: token('primary-soft'),
					ink: token('primary-ink')
				},
				secondary: {
					DEFAULT: token('secondary'),
					foreground: token('secondary-foreground')
				},
				destructive: {
					DEFAULT: token('destructive'),
					foreground: token('destructive-foreground'),
					soft: token('destructive-soft')
				},
				success: {
					DEFAULT: token('success'),
					foreground: token('success-foreground'),
					soft: token('success-soft')
				},
				muted: {
					DEFAULT: token('muted'),
					foreground: token('muted-foreground')
				},
				accent: {
					DEFAULT: token('accent'),
					foreground: token('accent-foreground'),
					soft: token('accent-soft')
				},
				popover: {
					DEFAULT: token('popover'),
					foreground: token('popover-foreground')
				},
				card: {
					DEFAULT: token('card'),
					foreground: token('card-foreground')
				},
				chapter: {
					1: token('chapter-1'),
					2: token('chapter-2'),
					3: token('chapter-3'),
					4: token('chapter-4'),
					5: token('chapter-5')
				},
				plan: {
					floor: token('plan-floor'),
					wall: token('plan-wall'),
					furniture: token('plan-furniture'),
					line: token('plan-line'),
					rug: token('plan-rug'),
					window: token('plan-window'),
					good: token('plan-flow-good'),
					bad: token('plan-flow-bad'),
					highlight: token('plan-highlight'),
					zone: token('plan-zone')
				},
				mat: {
					paper: token('mat-paper'),
					white: token('mat-white'),
					oak: token('mat-oak'),
					walnut: token('mat-walnut'),
					concrete: token('mat-concrete'),
					terrazzo: token('mat-terrazzo'),
					sage: token('mat-sage'),
					terracotta: token('mat-terracotta'),
					navy: token('mat-navy'),
					mustard: token('mat-mustard'),
					linen: token('mat-linen'),
					stone: token('mat-stone'),
					tile: token('mat-tile'),
					pink: token('mat-pink'),
					charcoal: token('mat-charcoal'),
					mirror: token('mat-mirror')
				},
				light: {
					warm: token('light-warm'),
					neutral: token('light-neutral'),
					cool: token('light-cool')
				},
				shade: token('shade'),
				skin: {
					1: token('skin-1'),
					2: token('skin-2'),
					3: token('skin-3')
				},
				hair: {
					1: token('hair-1'),
					2: token('hair-2'),
					3: token('hair-3'),
					4: token('hair-4')
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 4px)',
				sm: 'calc(var(--radius) - 6px)'
			},
			boxShadow: {
				comic: 'var(--shadow-comic)',
				'comic-lg': 'var(--shadow-comic-lg)',
				sticker: 'var(--shadow-sticker)',
				soft: 'var(--shadow-soft)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				shake: {
					'0%, 100%': { transform: 'translateX(0)' },
					'20%, 60%': { transform: 'translateX(-5px)' },
					'40%, 80%': { transform: 'translateX(5px)' }
				},
				'pulse-ring': {
					'0%': { transform: 'scale(0.9)', opacity: '0.9' },
					'100%': { transform: 'scale(1.6)', opacity: '0' }
				},
				'dash-flow': {
					to: { strokeDashoffset: '-40' }
				},
				wiggle: {
					'0%, 100%': { transform: 'rotate(0deg)' },
					'35%': { transform: 'rotate(-1.6deg)' },
					'70%': { transform: 'rotate(1.4deg)' }
				},
				float: {
					'0%, 100%': { transform: 'translateY(0) rotate(-2deg)' },
					'50%': { transform: 'translateY(-6px) rotate(1deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				shake: 'shake 0.45s ease-in-out',
				'pulse-ring': 'pulse-ring 1.4s ease-out infinite',
				'dash-flow': 'dash-flow 1.6s linear infinite',
				wiggle: 'wiggle 0.5s ease-in-out',
				float: 'float 4s ease-in-out infinite'
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
