const escapeHTML = require("escape-html");
const { asText } = require("@prismicio/helpers");

const logErrors = require("../_assets/js/logErrors");
const globalComputed = require("../_data/eleventyComputed");

module.exports = {
	eleventyComputed: {
		...globalComputed,
		metaaa: logErrors((data) => {
			const meta = globalComputed.meta(data);
			const { document } = data;

			meta.structuredData = JSON.stringify([
				...JSON.parse(meta.structuredData || "[]"),
				{
					"@context": "http://schema.org",
					"@type": "BlogPosting",

					mainEntityOfPage: {
						"@type": "WebSite",
						"@id": escapeHTML(meta.site.url),
					},

					url: escapeHTML(meta.url),
					name: escapeHTML(asText(document.data.title)),
					alternateName: escapeHTML(meta.site.name),
					headline: escapeHTML(asText(document.data.title)),
					image: escapeHTML(meta.image.openGraph),
					description: escapeHTML(document.data.lead_text),
					datePublished: escapeHTML(document.data.published_date),
					dateModified: escapeHTML(document.data.published_date),

					author: {
						"@type": "Person",
						name: escapeHTML(meta.site.mainAuthor),
					},

					publisher: {
						"@type": "Organization",
						url: escapeHTML(meta.site.url),
						logo: {
							"@type": "ImageObject",
							url: escapeHTML(meta.site.image.openGraph),
						},
						name: escapeHTML(meta.site.name),
					},
				},
			]);

			return meta;
		}),
	},
};
