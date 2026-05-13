<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
								xmlns:html="http://www.w3.org/TR/REC-html40"
								xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
								xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
								xmlns:xhtml="http://www.w3.org/1999/xhtml"
								xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
								xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<title>lihbr - sitemap</title>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
				<meta name="viewport" content="width=device-width, initial-scale=1"/>
				<style type="text/css">
					@font-face {
						font-family: "Redaction 20";
						font-weight: 400;
						font-style: normal;
						font-display: swap;
						src: url("/assets/fonts/redaction-20-normal.woff2") format("woff2");
					}

					@font-face {
						font-family: "Redaction 20";
						font-weight: 400;
						font-style: italic;
						font-display: swap;
						src: url("/assets/fonts/redaction-20-italic.woff2") format("woff2");
					}

					@font-face {
						font-family: "Redaction 50";
						font-weight: 400;
						font-style: normal;
						font-display: swap;
						src: url("/assets/fonts/redaction-35-normal.woff2") format("woff2");
					}

					* { box-sizing: border-box; }
					html {
						font-family: "Redaction 50", serif;
						font-size: 16px;
						color: #000000;
						background: #ffffff;
						-webkit-font-smoothing: antialiased;
						text-transform: lowercase;
						scrollbar-width: none;
					}

					body {
						margin: 0;
						padding: 1.25rem;
					}

					::selection {
						background: #e84311;
					}

					:focus-visible {
						outline: none;
						background: #000000;
						color: #ffffff;
					}

					:focus:not(:focus-visible) {
						outline: none;
					}

					a {
						text-decoration: underline;
						word-break: break-all;
						color: #000000;
					}

					h1, .header-meta {
						display: inline;
						font-size: 1.125rem;
						line-height: 1.25;
						font-weight: 400;
						margin: 0;
					}

					.header-meta::before, .lastmod::before {
						content: " ";
					}

					table, tbody {
						display: contents;
					}

					tr {
						display: block;
						line-height: 1.25;
						font-family: "Redaction 20", serif;
						font-size: 4.875rem;
						font-weight: 400;
					}

					td {
						display: inline;
					}

					.lastmod {
						font-style: italic;
					}

					.inline-warning::before {
						content: "! ";
					}

					.sr-only {
						position: absolute;
						width: 1px;
						height: 1px;
						padding: 0;
						margin: -1px;
						overflow: hidden;
						clip-path: inset(50%);
						white-space: nowrap;
						border-width: 0;
					}
				</style>
			</head>
			<body>
				<div class="header">
					<h1><a href="/">lihbr.com</a></h1>
					<div class="header-meta">
						<xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &gt; 0">
							<xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/> sitemaps
						</xsl:if>
						<xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &lt; 1">
							<xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs
						</xsl:if>
					</div>
				</div>
				<xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &gt; 0">
					<table>
						<thead class="sr-only">
							<tr>
								<th>Sitemap</th>
								<th>Last Modified</th>
							</tr>
						</thead>
						<tbody>
							<xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
								<xsl:variable name="sitemapURL">
									<xsl:value-of select="sitemap:loc"/>
								</xsl:variable>
								<tr>
									<td>
										<a href="{$sitemapURL}">
											<xsl:value-of select="sitemap:loc"/>
										</a>
									</td>
									<td>
										<xsl:value-of
											select="concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)),concat(' ', substring(sitemap:lastmod,20,6)))"/>
									</td>
								</tr>
							</xsl:for-each>
						</tbody>
					</table>
				</xsl:if>
				<xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &lt; 1">
					<table>
						<thead class="sr-only">
							<tr>
								<th>URL</th>
								<th>Last Updated</th>
							</tr>
						</thead>
						<tbody>
							<xsl:for-each select="sitemap:urlset/sitemap:url">
								<tr>
									<td>
										<xsl:variable name="itemURL">
											<xsl:value-of select="sitemap:loc"/>
										</xsl:variable>
										<a href="{$itemURL}">
											<xsl:choose>
												<xsl:when test="starts-with(sitemap:loc, 'https://lihbr.com')">
													<xsl:value-of select="substring-after(sitemap:loc, 'https://lihbr.com')"/>
												</xsl:when>
												<xsl:otherwise>
													<xsl:value-of select="sitemap:loc"/>
												</xsl:otherwise>
											</xsl:choose>
										</a>
										<xsl:for-each select="comment()[starts-with(normalize-space(.), 'WARN:')]">
											<div class="inline-warning">
												<xsl:value-of select="substring-after(normalize-space(.), 'WARN:')"/>
											</div>
										</xsl:for-each>
									</td>
									<td class="lastmod">
										<xsl:value-of select="concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)),concat(' ', substring(sitemap:lastmod,20,6)))"/>
									</td>
								</tr>
							</xsl:for-each>
						</tbody>
					</table>
				</xsl:if>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
