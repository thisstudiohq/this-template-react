import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { siteConfig } from "@/lib/config/site";

export const Route = createFileRoute("/")({ component: HomePage });

interface CodeSnippetProps {
	code: string;
}

function CodeSnippet({ code }: CodeSnippetProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = useCallback(() => {
		navigator.clipboard.writeText(code).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	}, [code]);

	return (
		<div className="satus-code">
			<pre className="satus-code__pre">
				<code>{code}</code>
			</pre>
			<button
				type="button"
				onClick={handleCopy}
				className={`satus-code__btn ${copied ? "satus-code__btn--copied" : ""}`}
				aria-label={copied ? "Code copied to clipboard" : "Copy code to clipboard"}
			>
				{copied ? "copied ✓" : "copy"}
			</button>
		</div>
	);
}

function HomePage() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = useCallback(() => {
		setIsMenuOpen((prev) => !prev);
	}, []);

	return (
		<div className="satus-page">
			<header className="satus-header">
				<div className="satus-container">
					<a href="/" className="satus-header__brand">
						<img
							src="/shared/assets/logo-brandmark.svg"
							alt=""
							aria-hidden="true"
							className="satus-header__logo"
						/>
						<span>{siteConfig.name}</span>
					</a>

					<button
						type="button"
						className="satus-header__menu-toggle"
						onClick={toggleMenu}
						aria-expanded={isMenuOpen}
						aria-controls="header-nav"
						aria-label={isMenuOpen ? "Close menu" : "Open menu"}
					>
						{isMenuOpen ? "✕ close" : "≡ menu"}
					</button>

					<nav
						id="header-nav"
						className={`satus-header__nav ${isMenuOpen ? "satus-header__nav--open" : ""}`}
					>
						{siteConfig.github && (
							<div className="satus-header__nav-item">
								<span className="satus-header__chevron">›</span>
								<a
									href={siteConfig.github}
									target="_blank"
									rel="noopener noreferrer"
									className="satus-header__nav-link"
								>
									use this template
								</a>
							</div>
						)}
					</nav>
				</div>
			</header>

			<main className="satus-main">
				<section className="satus-hero">
					<div className="satus-container">
						<p className="satus-hero__kicker">Start here</p>
						<h1 className="satus-hero__title">{siteConfig.name}</h1>
						<p className="satus-hero__lede">
							A starter, not a product. The steps below take you from a fresh clone to something you
							can ship. When you're ready, replace this page with your own.
						</p>
					</div>
				</section>

				<section className="satus-guide">
					<div className="satus-container">
						<ol className="satus-steps">
							<li className="satus-step">
								<span className="satus-step__index">01</span>
								<div className="satus-step__content">
									<h2 className="satus-step__title">Run it</h2>
									<p className="satus-step__desc">
										Install dependencies, then start the dev server. It runs on{" "}
										<code className="satus-step__inline">localhost:3000</code>.
									</p>
									<CodeSnippet code="bun install&#10;bun dev" />
								</div>
							</li>

							<li className="satus-step">
								<span className="satus-step__index">02</span>
								<div className="satus-step__content">
									<h2 className="satus-step__title">Make it yours</h2>
									<p className="satus-step__desc">
										Point the site at your domain: copy{" "}
										<code className="satus-step__inline">.env.example</code> to{" "}
										<code className="satus-step__inline">.env</code> and configure your Sanity and
										Cloudinary credentials.
									</p>
									<p className="satus-step__desc">
										The site title, SEO, and favicons live in{" "}
										<code className="satus-step__inline">src/lib/config/site.ts</code>. Fonts are in{" "}
										<code className="satus-step__inline">src/scss/base/fonts.scss</code>, colors and
										theme tokens in{" "}
										<code className="satus-step__inline">src/scss/utils/variables.scss</code>.
									</p>
									<p className="satus-step__desc">
										Swap in your own favicons in <code className="satus-step__inline">public/</code>{" "}
										and <code className="satus-step__inline">public/opengraph-image.png</code>.
									</p>
									<CodeSnippet code="cp .env.example .env" />
								</div>
							</li>

							<li className="satus-step">
								<span className="satus-step__index">03</span>
								<div className="satus-step__content">
									<h2 className="satus-step__title">Launch Sanity Studio</h2>
									<p className="satus-step__desc">
										Manage content, creative projects, and site settings with the embedded Sanity
										Studio v3. Run the studio server on{" "}
										<code className="satus-step__inline">localhost:3333</code> or access the
										rewritten proxy at{" "}
										<code className="satus-step__inline">localhost:3000/studio</code>.
									</p>
									<CodeSnippet code="bun run studio:dev" />
								</div>
							</li>

							<li className="satus-step">
								<span className="satus-step__index">04</span>
								<div className="satus-step__content">
									<h2 className="satus-step__title">Motion &amp; 3D ready</h2>
									<p className="satus-step__desc">
										Equipped with GSAP timelines, Lenis smooth scrolling, and Three.js / OGL for
										creative WebGL shader canvases. The canvas styling lives in{" "}
										<code className="satus-step__inline">src/scss/components/_scene.scss</code>.
									</p>
									<div className="satus-step__tags">
										<span className="satus-step__tag">gsap</span>
										<span className="satus-step__tag">lenis</span>
										<span className="satus-step__tag">three</span>
										<span className="satus-step__tag">ogl</span>
										<span className="satus-step__tag">sass</span>
									</div>
								</div>
							</li>

							<li className="satus-step">
								<span className="satus-step__index">05</span>
								<div className="satus-step__content">
									<h2 className="satus-step__title">Check &amp; format</h2>
									<p className="satus-step__desc">
										Maintain high code quality with blazing-fast Biome linting, formatting, and
										strict TypeScript checks.
									</p>
									<CodeSnippet code="bun run check&#10;bun run format" />
								</div>
							</li>

							<li className="satus-step">
								<span className="satus-step__index">06</span>
								<div className="satus-step__content">
									<h2 className="satus-step__title">Ship</h2>
									<p className="satus-step__desc">
										Run the checks and build both the frontend and studio bundles, then test the
										production preview.
									</p>
									<CodeSnippet code="bun run build&#10;bun run preview" />
									<p className="satus-step__desc">
										Ready for continuous deployment to Netlify via the configured{" "}
										<code className="satus-step__inline">netlify.toml</code>.
									</p>
								</div>
							</li>
						</ol>

						<div className="satus-outro">
							<p className="satus-outro__text">
								Done here? Replace src/routes/index.tsx with your homepage and update
								src/scss/pages/home.scss. That's the only cleanup.
							</p>
						</div>
					</div>
				</section>
			</main>

			<footer className="satus-footer">
				<div className="satus-container">
					<a
						href={siteConfig.authorUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="satus-footer__brand"
						aria-label={siteConfig.author}
					>
						<img
							src="/shared/assets/logo-wordmark.svg"
							alt={siteConfig.name}
							className="satus-footer__logo"
						/>
					</a>

					<div className="satus-footer__links">
						<a
							href={siteConfig.github ?? siteConfig.authorUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="satus-footer__link"
						>
							use this template
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
}
